# app/controllers/api/v1/companies_controller.rb
module Api
  module V1
    class CompaniesController < BaseController
      before_action :set_company, only: [:show, :update, :destroy]

      # GET /api/v1/companies
      def index
        Rails.logger.info("Starting companies#index with params: #{params.inspect}")

        @companies = Company.includes(:categories, :reviews)
                            .order(created_at: :desc)

        # Filtros
        @companies = @companies.where(status: params[:status]) if params[:status].present?

        if params[:featured].present?
          featured_value = ActiveModel::Type::Boolean.new.cast(params[:featured])
          @companies = @companies.where(featured: featured_value)
        end

        if params[:category_id].present?
          @companies = @companies.joins(:categories).where(categories: { id: params[:category_id] })
        end

        @companies = @companies.limit(params[:limit].to_i) if params[:limit].present?

        Rails.logger.info("Found #{@companies.size} companies")

        render json: {
          companies: @companies.map { |c| c.as_json(include_ctas: false) }
        }
      rescue => e
        Rails.logger.error("Error in companies#index: #{e.message}\n#{e.backtrace.join("\n")}")
        render json: { error: "Ocorreu um erro ao processar sua requisição" }, status: :internal_server_error
      end

      # GET /api/v1/companies/:id
      def show
        render json: { company: @company.as_json(include_ctas: true) }
      end

      # POST /api/v1/companies
      def create
        @company = Company.new(company_params)
        attach_files(@company)

        if @company.save
          render json: { company: @company.as_json(include_ctas: true) }, status: :created
        else
          render json: { errors: @company.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /api/v1/companies/:id
      def update
        attach_files(@company)

        if @company.update(company_params)
          render json: { company: @company.as_json(include_ctas: true) }
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
          :featured, :status, :verified, :founded_year, :employees_count,
          :cnpj, :email_public, :instagram, :facebook, :linkedin,
          :working_hours, :payment_methods, :certifications,
          category_ids: [] # permite associar várias categorias (HABTM)
        )
      end

      # Upload de arquivos via multipart/form-data
      def attach_files(company)
        company.logo.attach(params[:logo]) if params[:logo].present?
        company.banner.attach(params[:banner]) if params[:banner].present?
      end
    end
  end
end
