module Api
  module V1
    class CompaniesController < BaseController
      def states
        states = Company.distinct.pluck(:state).compact.sort
        render json: { states: states }
      end

      def cities
        cities = if params[:state].present?
          Company.where(state: params[:state]).distinct.pluck(:city).compact.sort
        else
          Company.distinct.pluck(:city).compact.sort
        end
        render json: { cities: cities }
      end

      def locations
        locations = Company.distinct.pluck(:state, :city).compact
          .map { |state, city| { state: state, city: city } }
          .sort_by { |loc| [loc[:state], loc[:city]] }
        render json: { locations: locations }
      end
    end
  end
end
