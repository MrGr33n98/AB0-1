# app/controllers/api/v1/base_controller.rb
module Api
  module V1
    class BaseController < ApplicationController
      # Common API behavior like authentication, error handling, etc.
      skip_before_action :verify_authenticity_token
      before_action :authenticate_api_user
      
      # Error handling
      rescue_from ActiveRecord::RecordNotFound, with: :not_found
      rescue_from StandardError, with: :internal_server_error
      
      private
      
      def not_found
        render json: { error: 'Recurso não encontrado' }, status: :not_found
      end
      
      def internal_server_error(exception)
        Rails.logger.error "#{controller_name} error: #{exception.message}\n#{exception.backtrace.join('\n')}"
        render json: { error: 'Erro interno no servidor' }, status: :internal_server_error
      end
      
      def authenticate_api_user
        # Your API authentication logic here
      end
    end
  end
end