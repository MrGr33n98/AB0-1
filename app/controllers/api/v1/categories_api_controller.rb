# app/controllers/api/v1/categories_api_controller.rb
module Api
  module V1
    class CategoriesApiController < Api::V1::BaseController
      before_action :set_category, only: [:show, :update, :destroy]

      def index
        @categories = Category.order(name: :asc)

        # Filtrar por status (somente se a coluna existir)
        if params[:status].present? && Category.column_names.include?("status")
          @categories = @categories.where(status: params[:status])
        end

        # Filtrar por featured (safe cast para boolean)
        if params[:featured].present? && Category.column_names.include?("featured")
          value = ActiveModel::Type::Boolean.new.cast(params[:featured])
          @categories = @categories.where(featured: value)
        end

        # Limite de registros
        if params[:limit].present?
          limit_value = params[:limit].to_i
          @categories = @categories.limit(limit_value) if limit_value > 0
        end

        render json: @categories
      rescue => e
        Rails.logger.error("Categories error: #{e.message}")
        Rails.logger.error(e.backtrace.join("\n")) # Mostra o backtrace completo
        render json: { error: "Erro interno no servidor" }, status: :internal_server_error
      end

      def show
        render json: @category
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Categoria não encontrada" }, status: :not_found
      end

      def create
        @category = Category.new(category_params)
        if @category.save
          render json: @category, status: :created
        else
          render json: { errors: @category.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @category.update(category_params)
          render json: @category
        else
          render json: { errors: @category.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @category.destroy
        head :no_content
      end

      private

      def set_category
        @category = Category.find(params[:id])
      end

      def category_params
        params.require(:category).permit(
          :name,
          :seo_url,
          :seo_title,
          :short_description,
          :description,
          :parent_id,
          :kind,
          :status,
          :featured
        )
      end
    end
  end
end
