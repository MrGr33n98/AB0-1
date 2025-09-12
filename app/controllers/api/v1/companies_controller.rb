class Api::V1::CompaniesController < Api::V1::BaseController
  include Rails.application.routes.url_helpers  # necessário para url_for

  before_action :set_company, only: [:show, :update, :destroy]

  def index
    @companies = Company.all
    render json: @companies.map { |company| company_json(company) }
  rescue => e
    Rails.logger.error("Companies error: #{e.message}")
    render json: { error: "Erro interno no servidor" }, status: :internal_server_error
  end

  def show
    render json: company_json(@company)
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Empresa não encontrada" }, status: :not_found
  rescue => e
    Rails.logger.error("Companies error: #{e.message}")
    render json: { error: "Erro interno no servidor" }, status: :internal_server_error
  end

  def create
    @company = Company.new(company_params)

    if @company.save
      render json: company_json(@company), status: :created
    else
      render json: { errors: @company.errors.full_messages }, status: :unprocessable_entity
    end
  rescue => e
    Rails.logger.error("Companies error: #{e.message}")
    render json: { error: "Erro interno no servidor" }, status: :internal_server_error
  end

  def update
    if @company.update(company_params)
      render json: company_json(@company)
    else
      render json: { errors: @company.errors.full_messages }, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Empresa não encontrada" }, status: :not_found
  rescue => e
    Rails.logger.error("Companies error: #{e.message}")
    render json: { error: "Erro interno no servidor" }, status: :internal_server_error
  end

  def destroy
    @company.destroy
    render json: { message: "Empresa excluída" }, status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Empresa não encontrada" }, status: :not_found
  rescue => e
    Rails.logger.error("Companies error: #{e.message}")
    render json: { error: "Erro interno no servidor" }, status: :internal_server_error
  end

  private

  def set_company
    @company = Company.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Company not found" }, status: :not_found
  end

  def company_params
    params.require(:company).permit(:name, :description, :website, :phone, :address, :banner, :logo, category_ids: [])
  end

  # 🔧 Helper para montar JSON customizado
  def company_json(company)
    company.as_json.merge(
      banner_url: company.banner.attached? ? url_for(company.banner) : nil,
      logo_url: company.logo.attached? ? url_for(company.logo) : nil
    )
  end
end
