class SessionsController < ApplicationController
  def new
    # Renderiza o formulário de login
    redirect_to employee_dashboard_path if current_user
  end

  def create
    # Lógica de autenticação
    user = User.find_by(email: params[:email])
    if user && user.authenticate(params[:password])
      session[:user_id] = user.id
      # Store last login timestamp
      user.update_column(:last_login_at, Time.current)
      redirect_to employee_dashboard_path, notice: 'Login realizado com sucesso!'
    else
      flash.now[:alert] = 'Email ou senha inválidos'
      render :new, status: :unprocessable_entity
    end
  end

  def destroy
    session[:user_id] = nil
    redirect_to root_path, notice: 'Logout realizado com sucesso!'
  end
  
  private
  
  def current_user
    @current_user ||= User.find_by(id: session[:user_id]) if session[:user_id]
  end
  helper_method :current_user
end