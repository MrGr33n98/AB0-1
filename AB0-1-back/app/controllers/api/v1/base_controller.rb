# frozen_string_literal: true

module Api
  module V1
    class BaseController < ApplicationController
      # TASK-021: Include pagination
      include Paginatable
      
      # Skip CSRF for API requests
      skip_before_action :verify_authenticity_token
      
      # JSON responses by default
      respond_to :json
      
      # Error handling
      rescue_from ActiveRecord::RecordNotFound, with: :not_found
      rescue_from ActiveRecord::RecordInvalid, with: :unprocessable_entity
      rescue_from ActionController::ParameterMissing, with: :bad_request
      
      private
      
      def not_found(exception)
        render json: {
          error: 'Not Found',
          message: exception.message
        }, status: :not_found
      end
      
      def unprocessable_entity(exception)
        render json: {
          error: 'Unprocessable Entity',
          message: exception.message,
          details: exception.record&.errors&.full_messages
        }, status: :unprocessable_entity
      end
      
      def bad_request(exception)
        render json: {
          error: 'Bad Request',
          message: exception.message
        }, status: :bad_request
      end
    end
  end
end
