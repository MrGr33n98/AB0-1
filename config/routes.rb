Rails.application.routes.draw do
  # =============================================
  # Authentication & Admin Routes
  # =============================================
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
      resources :categories
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
  root 'pages#home'
  get 'home', to: 'pages#home'
  get 'about', to: 'pages#about'
  
  # =============================================
  # Blog Posts
  # =============================================
  resources :posts
end
