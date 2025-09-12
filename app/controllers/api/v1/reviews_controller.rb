class Api::V1::ReviewsController < Api::V1::BaseController
  before_action :set_review, only: [:show, :update, :destroy]

  def index
    @reviews = Review.all
    render json: @reviews
  rescue => e
    Rails.logger.error("Reviews error: #{e.message}")
    render json: { error: "Erro interno no servidor" }, status: :internal_server_error
  end

  def show
    render json: @review
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Avaliação não encontrada" }, status: :not_found
  rescue => e
    Rails.logger.error("Reviews error: #{e.message}")
    render json: { error: "Erro interno no servidor" }, status: :internal_server_error
  end

  def create
    @review = Review.new(review_params)

    if @review.save
      render json: @review, status: :created
    else
      render json: { errors: @review.errors.full_messages }, status: :unprocessable_entity
    end
  rescue => e
    Rails.logger.error("Reviews error: #{e.message}")
    render json: { error: "Erro interno no servidor" }, status: :internal_server_error
  end

  def update
    if @review.update(review_params)
      render json: @review
    else
      render json: { errors: @review.errors.full_messages }, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Avaliação não encontrada" }, status: :not_found
  rescue => e
    Rails.logger.error("Reviews error: #{e.message}")
    render json: { error: "Erro interno no servidor" }, status: :internal_server_error
  end

  def destroy
    @review.destroy
    render json: { message: "Avaliação excluída" }, status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Avaliação não encontrada" }, status: :not_found
  rescue => e
    Rails.logger.error("Reviews error: #{e.message}")
    render json: { error: "Erro interno no servidor" }, status: :internal_server_error
  end

  private

  def set_review
    @review = Review.find(params[:id])
  end

  def review_params
    params.require(:review).permit(:rating, :comment, :user_id, :product_id)
  end
end
