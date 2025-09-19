class Api::V1::ProductsController < Api::V1::BaseController
  before_action :set_product, only: [:show, :update, :destroy]

  def index
    @products = Product.all
    render json: @products
  rescue => e
    Rails.logger.error("Products error: #{e.message}")
    render json: { error: "Erro interno no servidor" }, status: :internal_server_error
  end

  def show
    render json: @product
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Produto não encontrado" }, status: :not_found
  rescue => e
    Rails.logger.error("Products error: #{e.message}")
    render json: { error: "Erro interno no servidor" }, status: :internal_server_error
  end

  def create
    @product = Product.new(product_params)

    if @product.save
      render json: @product, status: :created
    else
      render json: { errors: @product.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @product.update(product_params)
      render json: @product
    else
      render json: { errors: @product.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @product.destroy
    render json: { message: "Produto excluído" }, status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Produto não encontrado" }, status: :not_found
  end

  private

  def set_product
    @product = Product.find(params[:id])
  end

  def product_params
    params.require(:product).permit(
      :name, :description, :short_description, :price, 
      :company_id, :sku, :stock, :status, :featured, 
      :seo_title, :seo_description, :image,
      category_ids: []
    )
  end
end
