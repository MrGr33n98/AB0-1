# app/controllers/api/v1/categories_api_controller.rb
module Api
  module V1
    class CategoriesApiController < Api::V1::BaseController
      before_action :set_category, only: [:show, :update, :destroy]

      def index
        begin
          query = Category.all

          # Filtrar por status
          if params[:status].present?
            query = query.where(status: params[:status])
          end

          # Filtrar por featured
          if params[:featured].present?
            featured = ActiveModel::Type::Boolean.new.cast(params[:featured])
            query = query.where(featured: featured)
          end

          # Aplicar limite
          if params[:limit].present?
            query = query.limit(params[:limit].to_i)
          end

          @categories = query.includes(:companies)
          render json: @categories, include: {
            companies: { only: [:id, :name] }
          }, except: [:created_at, :updated_at]
        rescue ActiveRecord::RecordNotFound => e
          Rails.logger.error("Categories not found: #{e.message}")
          render json: { error: "Categorias não encontradas" }, status: :not_found
        rescue StandardError => e
          Rails.logger.error("Categories error: #{e.message}\n#{e.backtrace.join('\n')}")
          render json: { error: "Erro interno no servidor" }, status: :internal_server_error
        end
      end

      def show
        render json: @category
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Categoria não encontrada" }, status: :not_found
      rescue => e
        Rails.logger.error("Categories error: #{e.message}")
        render json: { error: "Erro interno no servidor" }, status: :internal_server_error
      end

      def create
        @category = Category.new(category_params)

        if @category.save
          render json: @category, status: :created
        else
          render json: { errors: @category.errors.full_messages }, status: :unprocessable_entity
        end
      rescue => e
        Rails.logger.error("Categories error: #{e.message}")
        render json: { error: "Erro interno no servidor" }, status: :internal_server_error
      end

      def update
        if @category.update(category_params)
          render json: @category
        else
          render json: { errors: @category.errors.full_messages }, status: :unprocessable_entity
        end
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Categoria não encontrada" }, status: :not_found
      rescue => e
        Rails.logger.error("Categories error: #{e.message}")
        render json: { error: "Erro interno no servidor" }, status: :internal_server_error
      end

      def destroy
        @category.destroy
        render json: { message: "Categoria excluída" }, status: :ok
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Categoria não encontrada" }, status: :not_found
      rescue => e
        Rails.logger.error("Categories error: #{e.message}")
        render json: { error: "Erro interno no servidor" }, status: :internal_server_error
      end

      private

      def set_category
        @category = Category.find(params[:id])
      end

      def category_params
        params.require(:category).permit(:name, :seo_url, :seo_title, :short_description, :description, :parent_id, :kind, :status, :featured)
      end
    end
  end
end