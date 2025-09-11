Rails.application.routes.draw do
  # =============================================
  # Authentication & Admin Routes
  # =============================================
  # ActiveAdmin and its authentication
  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)

  # User authentication and profile routes
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
  # API Routes
  # =============================================
  # In your routes.rb file, make sure you have:
  namespace :api do
    namespace :v1 do
      # This will route both /api/v1/categorys and /api/v1/categories
      # to the same CategoriesController
      resources :categorys, controller: 'categories'
      resources :categories
      
      # Other API resources
      resources :companies
      resources :products
      resources :leads
    end
  end
end
