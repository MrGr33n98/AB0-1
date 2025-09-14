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
      namespace :admin do
        resources :categories
      end
      resources :categories
      resources :companies
      resources :products
      resources :leads
      resources :reviews
      resources :badges
      resources :articles
      resources :plans
      
      # Search endpoints
      get 'search/companies', to: 'search#companies'
      get 'search/products', to: 'search#products'
      get 'search/articles', to: 'search#articles'
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
