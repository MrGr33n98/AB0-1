# app/controllers/api/v1/base_controller.rb
module Api
  module V1
    class BaseController < ApplicationController
      # Common API behavior like authentication, error handling, etc.
      skip_before_action :verify_authenticity_token
      before_action :authenticate_api_user
      
      # Error handling
      rescue_from ActiveRecord::RecordNotFound, with: :not_found
      
      private
      
      def not_found
        render json: { error: 'Resource not found' }, status: :not_found
      end
      
      def authenticate_api_user
        # Your API authentication logic here
      end
    end
  end
end