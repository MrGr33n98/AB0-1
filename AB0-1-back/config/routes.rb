Rails.application.routes.draw do
  # ActiveAdmin routes
  ActiveAdmin.routes(self)
  devise_for :admin_users, ActiveAdmin::Devise.config

  # Health check endpoint
  get '/health', to: proc { [200, {}, ['OK']] }

  # API routes
  namespace :api do
    namespace :v1 do
      # Companies routes
      resources :companies do
        collection do
          get :states
          get :cities
          get :locations
        end
        member do
          get 'analytics/historical', to: 'companies#analytics_historical'
          get 'analytics/reviews', to: 'companies#analytics_reviews'
          get 'analytics/competitors', to: 'companies#analytics_competitors'
          get 'analytics/traffic', to: 'companies#analytics_traffic'
        end
      end

      # Analytics routes
      post 'analytics/track', to: 'analytics#track'
      
      # Dashboard routes
      get 'dashboard/stats', to: 'dashboard#stats'
      
      # Categories routes
      resources :categories, only: [:index, :show] do
        member do
          get :companies
          get :products
        end
        collection do
          get :featured
        end
      end

      # Products routes
      resources :products, only: [:index, :show] do
        member do
          get :reviews
        end
      end

      # Reviews routes
      resources :reviews, only: [:index, :show, :create, :update, :destroy]

      # Leads routes
      resources :leads, only: [:create, :index, :show]

      # Users routes
      resources :users, only: [:show, :update]

      # Search routes
      get 'search', to: 'search#index'
      get 'search/all', to: 'search#all'
      get 'search/suggest', to: 'search#suggest'

      # Authentication routes
      namespace :auth do
        post :login
        post :register
        post :logout
        get :me
        post :forgot_password
        post :reset_password
      end
    end
  end

  # Root route
  root 'rails/welcome#index'
end
