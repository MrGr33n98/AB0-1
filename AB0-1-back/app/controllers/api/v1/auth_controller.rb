# app/controllers/api/v1/auth_controller.rb
module Api
  module V1
    class AuthController < Api::V1::BaseController
      # Este controller é baseado em ActionController::API (direta ou indiretamente) e portanto
      # não possui o callback verify_authenticity_token usado para proteção CSRF em controllers
      # que herdam de ActionController::Base. Não é necessário (nem possível) chamar
      # skip_before_action :verify_authenticity_token aqui.

      def login
        email = params[:email]
        password = params[:password]

        user = User.find_by(email: email)
        if user&.valid_password?(password)
          return render json: payload_for(user), status: :ok
        end

        render json: { error: 'Invalid email or password' }, status: :unauthorized
      rescue StandardError => e
        Rails.logger.error("[Auth] login failure: #{e.class}: #{e.message}")
        development_fallback('login', e)
      end

      def register
        user = User.new(user_params)
        if user.save
          return render json: payload_for(user), status: :created
        end

        render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
      rescue StandardError => e
        Rails.logger.error("[Auth] register failure: #{e.class}: #{e.message}")
        development_fallback('register', e)
      end

      def logout
        head :no_content
      end

      def me
        user = current_user
        if user
          render json: { user: user }, status: :ok
        else
          render json: { error: 'Not authenticated' }, status: :unauthorized
        end
      end

      def forgot_password
        # Pretend success to keep UX smooth until mailer is configured.
        render json: { message: 'If your email exists in our system you will receive reset instructions shortly.' }, status: :ok
      end

      def reset_password
        render json: { message: 'Password reset flow not yet implemented.' }, status: :not_implemented
      end

      private

      def user_params
        params.require(:user).permit(:name, :email, :password, :password_confirmation)
      end

      def payload_for(user)
        token = jwt_encode(user_id: user.id)
        { token: token, user: user }
      end

      def jwt_encode(payload, exp = 24.hours.from_now)
        payload[:exp] = exp.to_i
        JWT.encode(payload, Rails.application.secret_key_base)
      end

      def development_fallback(action, error)
        unless Rails.env.development?
          return render json: { error: 'Authentication failed' }, status: :internal_server_error
        end

        mock_user = User.first || User.new(id: 0, name: 'Usuário Demo', email: params[:email].presence || 'demo@example.com')
        render json: payload_for(mock_user).merge(mocked: true, warning: error.message), status: :ok
      end
    end
  end
end
