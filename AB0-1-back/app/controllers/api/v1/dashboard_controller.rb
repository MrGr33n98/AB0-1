# app/controllers/api/v1/dashboard_controller.rb
module Api
  module V1
    class DashboardController < BaseController
      def stats
        companies_count = Company.count
        products_count = Product.count
        leads_count = Lead.count
        reviews_count = Review.count
        active_campaigns = defined?(Campaign) ? Campaign.where('start_date <= ? AND end_date >= ?', Date.today, Date.today).count : 0
        monthly_revenue = 0 # Ajuste conforme sua lógica de faturamento

        render json: {
          companies_count: companies_count,
          products_count: products_count,
          leads_count: leads_count,
          reviews_count: reviews_count,
          active_campaigns: active_campaigns,
          monthly_revenue: monthly_revenue
        }
      rescue => e
        Rails.logger.error("Dashboard stats error: #{e.message}")
        render json: { error: 'Erro interno no servidor' }, status: :internal_server_error
      end
    end
  end
end