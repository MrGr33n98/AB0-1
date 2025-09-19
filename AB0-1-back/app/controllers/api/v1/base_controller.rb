# app/controllers/api/v1/base_controller.rb
module Api
  module V1
    class BaseController < ApplicationController
      skip_before_action :verify_authenticity_token
      before_action :set_default_format
      before_action :authenticate_api_user, except: [:index, :show]
      
      private
      
      def set_default_format
        request.format = :json
      end
      
      def authenticate_api_user
        # Add your authentication logic here
        # For example:
        # authenticate_user! if action_requires_authentication?
      end
      
      def render_error(message, status = :unprocessable_entity)
        render json: { error: message }, status: status
      end
    end
  end
end