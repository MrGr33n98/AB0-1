# app/controllers/api/v1/companies_controller.rb
module Api
  module V1
    class CompaniesController < BaseController
      before_action :set_company, only: [:show, :update, :destroy]

      # GET /api/v1/companies
      def index
        begin
          Rails.logger.info("Starting companies#index with params: #{params.inspect}")
          
          @companies = Company.includes(:categories, :reviews)
                             .order(created_at: :desc)
          
          # Filtering with logging
          if params[:status].present?
            Rails.logger.info("Filtering by status: #{params[:status]}")
            @companies = @companies.where(status: params[:status])
          end

          if params[:featured].present?
            featured_value = ActiveModel::Type::Boolean.new.cast(params[:featured])
            Rails.logger.info("Filtering by featured: #{featured_value}")
            @companies = @companies.where(featured: featured_value)
          end

          if params[:category_id].present?
            Rails.logger.info("Filtering by category_id: #{params[:category_id]}")
            @companies = @companies.where(category_id: params[:category_id])
          end

          # Limiting
          if params[:limit].present?
            limit = params[:limit].to_i
            Rails.logger.info("Limiting results to: #{limit}")
            @companies = @companies.limit(limit)
          end

          Rails.logger.info("Found #{@companies.size} companies")

          render json: { 
            companies: @companies.as_json(
              include: { 
                categories: { 
                  only: [:id, :name, :description],
                  methods: [:companies_count]
                }
              },
              methods: [:average_rating, :reviews_count, :social_links],
              except: [:created_at, :updated_at]
            )
          }
        rescue ActiveRecord::RecordNotFound => e
          Rails.logger.error("Companies not found: #{e.message}")
          render json: { error: "Empresas não encontradas" }, status: :not_found
        rescue StandardError => e
          Rails.logger.error("Error in companies#index: #{e.message}\n#{e.backtrace.join("\n")}")
          render json: { error: "Ocorreu um erro ao processar sua requisição" }, status: :internal_server_error
        end
      end

      # GET /api/v1/companies/:id
      def show
        render json: { company: @company }
      end

      # POST /api/v1/companies
      def create
        @company = Company.new(company_params)
        if @company.save
          render json: { company: @company }, status: :created
        else
          render json: { errors: @company.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /api/v1/companies/:id
      def update
        if @company.update(company_params)
          render json: { company: @company }
        else
          render json: { errors: @company.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/companies/:id
      def destroy
        @company.destroy
        head :no_content
      end

      # GET /api/v1/companies/states
      def states
        states = Company.distinct.pluck(:state).compact.sort
        render json: { states: states }
      end

      # GET /api/v1/companies/cities
      def cities
        cities = if params[:state].present?
          Company.where(state: params[:state]).distinct.pluck(:city).compact.sort
        else
          Company.distinct.pluck(:city).compact.sort
        end
        render json: { cities: cities }
      end

      # GET /api/v1/companies/locations
      def locations
        locations = Company.distinct.pluck(:state, :city).compact
          .map { |state, city| { state: state, city: city } }
          .sort_by { |loc| [loc[:state], loc[:city]] }
        render json: { locations: locations }
      end

      private

      def set_company
        @company = Company.find(params[:id])
      end

      def company_params
        params.require(:company).permit(
          :name, :description, :website, :phone, :address, :state, :city,
          :logo_url, :banner_url, :featured, :status, :category_id
          # Add other permitted params as needed
        )
      end
    end
  end
end
