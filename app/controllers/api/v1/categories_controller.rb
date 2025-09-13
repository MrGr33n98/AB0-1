class Api::V1::CategoriesController < ApplicationController
  before_action :set_category, only: [:show, :update, :destroy]

  # GET /api/v1/categorys
  def index
    categories = Category.all
    render json: categories, status: :ok
  end

  # GET /api/v1/categorys/:id
  def show
    render json: @category, status: :ok
  end

  # POST /api/v1/categorys
  def create
    category = Category.new(category_params)
    if category.save
      render json: category, status: :created
    else
      render json: { errors: category.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PUT/PATCH /api/v1/categorys/:id
  def update
    if @category.update(category_params)
      render json: @category, status: :ok
    else
      render json: { errors: @category.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/categorys/:id
  def destroy
    @category.destroy
    head :no_content
  end

  private

  def set_category
    @category = Category.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Category not found" }, status: :not_found
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
