# app/controllers/api/v1/companies_controller.rb
module Api
  module V1
    class CompaniesController < BaseController
      before_action :set_company, only: %i[show update destroy analytics_historical analytics_reviews analytics_competitors analytics_traffic]

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

        companies_json = @companies.map do |company|
          {
            id: company.id,
            name: company.name,
            description: company.description,
            website: company.website,
            phone: company.phone,
            address: company.address,
            state: company.state,
            city: company.city,
            created_at: company.created_at,
            updated_at: company.updated_at,
            banner_url: company.banner_url,
            logo_url: company.logo_url,
            rating_avg: company.rating_avg,
            rating_count: company.rating_count,
            status: company.status,
            featured: company.featured,
            verified: company.verified,
            founded_year: company.founded_year,
            employees_count: company.employees_count,
            certifications: company.certifications,
            email_public: company.email_public,
            instagram: company.instagram,
            facebook: company.facebook,
            linkedin: company.linkedin,
            working_hours: company.working_hours,
            payment_methods: company.payment_methods
          }
        end

        render json: companies_json, status: :ok
      end

      # GET /api/v1/companies/:id
      def show
        company_json = {
          id: @company.id,
          name: @company.name,
          description: @company.description,
          website: @company.website,
          phone: @company.phone,
          address: @company.address,
          state: @company.state,
          city: @company.city,
          created_at: @company.created_at,
          updated_at: @company.updated_at,
          banner_url: @company.banner_url,
          logo_url: @company.logo_url,
          rating_avg: @company.rating_avg,
          rating_count: @company.rating_count,
          status: @company.status,
          featured: @company.featured,
          verified: @company.verified,
          founded_year: @company.founded_year,
          employees_count: @company.employees_count,
          certifications: @company.certifications,
          email_public: @company.email_public,
          instagram: @company.instagram,
          facebook: @company.facebook,
          linkedin: @company.linkedin,
          working_hours: @company.working_hours,
          payment_methods: @company.payment_methods,
          ctas: []
        }
        render json: { company: company_json }, status: :ok
      end

      # POST /api/v1/companies
      def create
        @company = Company.new(company_params)
        if @company.save
          company_json = {
            id: @company.id,
            name: @company.name,
            description: @company.description,
            website: @company.website,
            phone: @company.phone,
            address: @company.address,
            state: @company.state,
            city: @company.city,
            status: @company.status,
            featured: @company.featured,
            verified: @company.verified
          }
          render json: { company: company_json }, status: :created
        else
          render json: { errors: @company.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /api/v1/companies/:id
      def update
        if @company.update(company_params)
          company_json = {
            id: @company.id,
            name: @company.name,
            description: @company.description,
            website: @company.website,
            phone: @company.phone,
            address: @company.address,
            state: @company.state,
            city: @company.city,
            status: @company.status,
            featured: @company.featured,
            verified: @company.verified
          }
          render json: { company: company_json }, status: :ok
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
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Company not found' }, status: :not_found
        nil
      end

      def company_params
        params.require(:company).permit(
          :name, :description, :website, :phone, :address, :state, :city,
          :featured, :status, :verified, :founded_year, :employees_count,
          :cnpj, :email_public, :instagram, :facebook, :linkedin,
          :working_hours, :payment_methods, :certifications
        )
      end

      def analytics_historical
        render json: historical_data
      end

      def analytics_reviews
        render json: reviews_data
      end

      def analytics_competitors
        render json: competitors_data
      end

      def analytics_traffic
        render json: traffic_data
      end

      private

       def historical_data
         company = Company.find(params[:id])
         days = params[:days]&.to_i || 30
         data = generate_historical_data(company, days)
         { data: data }
       rescue ActiveRecord::RecordNotFound
         { error: 'Company not found' }
       end

       def reviews_data
         company = Company.find(params[:id])
         reviews = company.reviews.includes(:user)
         distribution = reviews.group(:rating).count
         {
           total_reviews: reviews.count,
           average_rating: company.rating_avg || 0,
           rating_distribution: {
             5 => distribution[5.0] || 0,
             4 => distribution[4.0] || 0,
             3 => distribution[3.0] || 0,
             2 => distribution[2.0] || 0,
             1 => distribution[1.0] || 0
           },
           recent_reviews: reviews.order(created_at: :desc).limit(10).map do |review|
             {
               id: review.id,
               rating: review.rating,
               comment: review.comment,
               user_name: review.user&.name || 'Anônimo',
               created_at: review.created_at,
               verified: review.verified
             }
           end,
           sentiment_analysis: calculate_sentiment(reviews)
         }
       rescue ActiveRecord::RecordNotFound
         { error: 'Company not found' }
       end

       def competitors_data
         company = Company.find(params[:id])
         category_id = params[:category_id]
         competitors = Company
           .joins(:categories)
           .where(categories: { id: category_id })
           .where.not(id: company.id)
           .where(status: 'active')
           .order(rating_avg: :desc)
           .limit(10)
         total_companies = competitors.count
         company_position = competitors.index { |c| c.rating_avg <= company.rating_avg } || total_companies
         {
           competitors: competitors.map.with_index(1) do |competitor, index|
             {
               company_id: competitor.id,
               company_name: competitor.name,
               rating: competitor.rating_avg || 0,
               reviews_count: competitor.reviews_count || 0,
               market_position: index,
               category_share: calculate_market_share(competitor, category_id)
             }
           end,
           company_position: company_position + 1,
           total_competitors: total_companies
         }
       rescue ActiveRecord::RecordNotFound
         { error: 'Company not found' }
       end

       def traffic_data
         company = Company.find(params[:id])
         days = params[:days]&.to_i || 30
         sources = generate_traffic_sources(company, days)
         { sources: sources }
       rescue ActiveRecord::RecordNotFound
         { error: 'Company not found' }
       end

       def calculate_sentiment(reviews)
         positive = reviews.where('rating >= ?', 4).count
         negative = reviews.where('rating <= ?', 2).count
         total = reviews.count
         {
           positive_percentage: total > 0 ? (positive.to_f / total * 100).round(2) : 0,
           negative_percentage: total > 0 ? (negative.to_f / total * 100).round(2) : 0
         }
       end

       def calculate_market_share(company, category_id)
         total_reviews = Company.joins(:categories).where(categories: { id: category_id }).sum(:reviews_count)
         company_reviews = company.reviews_count || 0
         total_reviews > 0 ? (company_reviews.to_f / total_reviews * 100).round(2) : 0
       end

       def generate_traffic_sources(company, days)
         [
           { source: 'Direct', percentage: 40 },
           { source: 'Referral', percentage: 25 },
           { source: 'Social Media', percentage: 20 },
           { source: 'Organic Search', percentage: 15 }
         ]
       end

       def generate_historical_data(company, days)
         (0...days).map do |day|
           {
             date: (Date.today - day).to_s,
             visits: rand(50..200),
             conversions: rand(5..50)
           }
         end.reverse
       end
    end
  end
end
