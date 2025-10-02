class Api::V1::ArticlesController < Api::V1::BaseController
  before_action :set_article, only: %i[show update destroy]

  def index
    scope = Article.includes(:category, :company, :product).order(created_at: :desc)
    scope = scope.where(company_id: params[:company_id]) if params[:company_id].present?
    scope = scope.where(category_id: params[:category_id]) if params[:category_id].present?
    scope = scope.where(product_id: params[:product_id]) if params[:product_id].present?
    scope = scope.where(sponsored: true) if boolean_param(:sponsored)
    render json: scope, each_serializer: ArticleSerializer
  rescue StandardError => e
    Rails.logger.error("Articles#index error: #{e.message}")
    render json: { error: 'Erro interno no servidor' }, status: :internal_server_error
  end

  def show
    render json: @article, serializer: ArticleSerializer
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Artigo não encontrado' }, status: :not_found
  end

  def create
    @article = Article.new(article_params)
    if @article.save
      render json: @article, serializer: ArticleSerializer, status: :created
    else
      render json: { errors: @article.errors.full_messages }, status: :unprocessable_entity
    end
  rescue StandardError => e
    Rails.logger.error("Articles#create error: #{e.message}")
    render json: { error: 'Erro interno no servidor' }, status: :internal_server_error
  end

  def update
    if @article.update(article_params)
      render json: @article, serializer: ArticleSerializer
    else
      render json: { errors: @article.errors.full_messages }, status: :unprocessable_entity
    end
  rescue StandardError => e
    Rails.logger.error("Articles#update error: #{e.message}")
    render json: { error: 'Erro interno no servidor' }, status: :internal_server_error
  end

  def destroy
    @article.destroy
    head :no_content
  rescue StandardError => e
    Rails.logger.error("Articles#destroy error: #{e.message}")
    render json: { error: 'Erro interno no servidor' }, status: :internal_server_error
  end

  private

  def set_article
    @article = Article.find(params[:id])
  end

  def article_params
    params.require(:article).permit(:title, :content, :category_id, :product_id, :company_id, :sponsored, :sponsored_label)
  end

  def boolean_param(name)
    return false unless params.key?(name)
    ActiveModel::Type::Boolean.new.cast(params[name])
  end
end
