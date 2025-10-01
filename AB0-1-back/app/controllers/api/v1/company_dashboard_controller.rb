# app/controllers/api/v1/company_dashboard_controller.rb
module Api
  module V1
    class CompanyDashboardController < BaseController
      before_action :authenticate_company_user!
      before_action :set_company

      # GET /api/v1/company_dashboard/stats
      def stats
        render json: {
          stats: {
            profile_views: @company.profile_views_count || 0,
            cta_clicks: @company.cta_clicks_count || 0,
            whatsapp_clicks: @company.whatsapp_clicks_count || 0,
            leads_received: @company.leads.count,
            reviews_count: @company.reviews_count,
            average_rating: @company.rating_avg,
            pending_approvals: @company.pending_changes.pending.count,
            active_campaigns: @company.campaigns.active.count,
            conversion_rate: calculate_conversion_rate
          }
        }
      end

      # POST /api/v1/company_dashboard/update_info
      def update_info
        pending_change = @company.pending_changes.create!(
          change_type: 'company_info',
          data: {
            attributes: company_params,
            previous_values: @company.attributes.slice(*company_params.keys)
          },
          user_id: current_user&.id,
          status: 'pending'
        )

        render json: {
          message: 'Alterações enviadas para aprovação',
          pending_change: pending_change
        }, status: :created
      end

      # POST /api/v1/company_dashboard/add_categories
      def add_categories
        pending_change = @company.pending_changes.create!(
          change_type: 'categories',
          data: {
            action: 'add',
            category_ids: params[:category_ids]
          },
          user_id: current_user&.id,
          status: 'pending'
        )

        render json: {
          message: 'Solicitação de categorias enviada para aprovação',
          pending_change: pending_change
        }, status: :created
      end

      # POST /api/v1/company_dashboard/remove_category
      def remove_category
        pending_change = @company.pending_changes.create!(
          change_type: 'categories',
          data: {
            action: 'remove',
            category_ids: [params[:category_id]]
          },
          user_id: current_user&.id,
          status: 'pending'
        )

        render json: {
          message: 'Solicitação de remoção enviada para aprovação',
          pending_change: pending_change
        }, status: :created
      end

      # POST /api/v1/company_dashboard/update_ctas
      def update_ctas
        pending_change = @company.pending_changes.create!(
          change_type: 'cta_config',
          data: cta_params,
          user_id: current_user&.id,
          status: 'pending'
        )

        render json: {
          message: 'Configurações de CTAs enviadas para aprovação',
          pending_change: pending_change
        }, status: :created
      end

      # GET /api/v1/company_dashboard/pending_changes
      def pending_changes
        changes = @company.pending_changes.pending.order(created_at: :desc)
        render json: {
          pending_changes: changes.as_json(
            include: { user: { only: [:id, :name, :email] } }
          )
        }
      end

      # GET /api/v1/company_dashboard/notifications
      def notifications
        # Fetch notifications for the company
        notifications = []

        # Approved changes
        @company.pending_changes.approved.where('approved_at > ?', 7.days.ago).each do |change|
          notifications << {
            type: 'approval',
            title: 'Alteração Aprovada',
            message: "Sua alteração de #{change.change_type.humanize} foi aprovada",
            timestamp: change.approved_at,
            read: false
          }
        end

        # New reviews
        @company.reviews.where('created_at > ?', 7.days.ago).each do |review|
          notifications << {
            type: 'review',
            title: 'Nova Avaliação',
            message: "Nova avaliação de #{review.rating} estrelas recebida",
            timestamp: review.created_at,
            read: false
          }
        end

        # New leads
        @company.leads.where('created_at > ?', 7.days.ago).each do |lead|
          notifications << {
            type: 'lead',
            title: 'Novo Lead',
            message: "Novo contato de #{lead.name}",
            timestamp: lead.created_at,
            read: false
          }
        end

        render json: {
          notifications: notifications.sort_by { |n| n[:timestamp] }.reverse.first(20)
        }
      end

      private

      def set_company
        @company = current_user.company # Adjust based on your auth setup
        unless @company
          render json: { error: 'Company not found' }, status: :not_found
        end
      end

      def authenticate_company_user!
        # Implement your authentication logic
        # For now, this is a placeholder
        unless current_user
          render json: { error: 'Unauthorized' }, status: :unauthorized
        end
      end

      def company_params
        params.require(:company).permit(
          :name, :description, :website, :phone, :phone_alt, :whatsapp,
          :email_public, :address, :state, :city, :cnpj,
          :instagram, :facebook, :linkedin, :working_hours,
          :payment_methods, :certifications, :awards,
          :founded_year, :employees_count, :latitude, :longitude,
          :minimum_ticket, :maximum_ticket, :financing_options,
          :response_time_sla, :languages
        )
      end

      def cta_params
        params.permit(
          :cta_primary_label, :cta_primary_url,
          :cta_secondary_label, :cta_secondary_url,
          :cta_whatsapp_template,
          :cta_utm_source, :cta_utm_medium, :cta_utm_campaign
        )
      end

      def calculate_conversion_rate
        total_views = @company.profile_views_count || 0
        return 0 if total_views.zero?

        conversions = @company.leads.count
        ((conversions.to_f / total_views) * 100).round(2)
      end
    end
  end
end
