Rails.application.routes.draw do
  # Definir a página institucional como raiz
  # root 'corporate#index'
  
  # Manter as rotas existentes para o admin
  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)
  
  # =============================================
  # API Routes
  # =============================================
  namespace :api do
    namespace :v1 do
      # Authentication
      post 'auth/login', to: 'authentication#login'
      post 'auth/register', to: 'authentication#register'
      
      # Dashboard
      get 'dashboard/stats', to: 'dashboard#stats'
      
      # Resources
      resources :categories, controller: 'categories_api'
      resources :companies
      resources :products
      resources :leads
      resources :reviews
      resources :badges
      resources :articles
      resources :plans
      resources :users, only: [:show, :update]
      
      # Search
      get 'search/companies'
      get 'search/products'
      get 'search/articles'
    end
  end

  devise_for :users, controllers: {
    sessions: 'users/sessions',
    registrations: 'users/registrations'
  }
  get 'users/profile'
  get 'u/:id', to: 'users#profile', as: 'user'

  # =============================================
  # Static Pages
  # =============================================
  root 'corporate#index'
  get 'corporate', to: 'corporate#index', as: 'corporate'
  get 'corporate/login', to: 'corporate#login', as: 'corporate_login'
  # root 'pages#home'
  get 'home', to: 'pages#home'
  get 'about', to: 'pages#about'
  
  # =============================================
  # Blog Posts
  # =============================================
  resources :posts
end
