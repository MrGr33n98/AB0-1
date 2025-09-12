class Api::V1::CompaniesController < Api::V1::BaseController
  before_action :set_company, only: [:show, :update, :destroy]

  def index
    @companies = Company.all
    render json: @companies
  rescue => e
    Rails.logger.error("Companies error: #{e.message}")
    render json: { error: "Erro interno no servidor" }, status: :internal_server_error
  end

  def show
    render json: @company
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Empresa não encontrada" }, status: :not_found
  rescue => e
    Rails.logger.error("Companies error: #{e.message}")
    render json: { error: "Erro interno no servidor" }, status: :internal_server_error
  end

  def create
    @company = Company.new(company_params)

    if @company.save
      render json: @company, status: :created
    else
      render json: { errors: @company.errors.full_messages }, status: :unprocessable_entity
    end
  rescue => e
    Rails.logger.error("Companies error: #{e.message}")
    render json: { error: "Erro interno no servidor" }, status: :internal_server_error
  end

  def update
    if @company.update(company_params)
      render json: @company
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
    params.require(:company).permit(:name, :description, :website, :phone, :address)
  end
end