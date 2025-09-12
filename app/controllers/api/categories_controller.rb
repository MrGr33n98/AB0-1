module Api
  class CategoriesController < ApplicationController
    def index
      @categories = Category.all
      render json: @categories.as_json(
        include: {
          companies: { only: [:id, :name, :description, :website, :phone, :address] },
          products: { only: [:id, :name, :description, :price, :image_url] }
        },
        methods: [:banner_url]
      )
    end

    def show
      @category = Category.find(params[:id])
      render json: @category.as_json(
        include: {
          companies: { only: [:id, :name, :description, :website, :phone, :address] },
          products: { only: [:id, :name, :description, :price, :image_url] }
        },
        methods: [:banner_url]
      )
    end
  end
end