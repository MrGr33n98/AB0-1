# app/controllers/api/v1/authentication_controller.rb
class Api::V1::AuthenticationController < Api::V1::BaseController
  skip_before_action :authenticate_api_user, only: [:login, :register]


  def login
    # Extract email and password from params or nested user params
    email = params[:email] || params.dig(:user, :email)
    password = params[:password] || params.dig(:user, :password)

    unless email.present? && password.present?
      return render json: { error: 'Email and password are required' }, status: :unprocessable_entity
    end

    begin
      @user = User.find_by(email: email.downcase.strip)
      
      if @user.nil?
        return render json: { error: 'Invalid email or password' }, status: :unauthorized
      end

      unless @user.valid_password?(password)
        return render json: { error: 'Invalid email or password' }, status: :unauthorized
      end

      token = jwt_encode(user_id: @user.id)
      render json: { token: token, user: @user }, status: :ok
    rescue => e
      Rails.logger.error("Login error: #{e.message}\n#{e.backtrace.join("\n")}")
      render json: { error: 'An error occurred during login. Please try again later.' }, status: :internal_server_error
    end
  end

  def register
    @user = User.new(user_params)
    if @user.save
      render json: @user, status: :created
    else
      render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end

  def jwt_encode(payload, exp = 24.hours.from_now)
    payload[:exp] = exp.to_i
    JWT.encode(payload, Rails.application.secret_key_base)
  end
end
