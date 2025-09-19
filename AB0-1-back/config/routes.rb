Rails.application.routes.draw do
  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)

  namespace :api do
    namespace :v1 do
      # Banners / Auth / Dashboard
      resources :banners, only: [:index]
      post 'auth/login',    to: 'authentication#login'
      post 'auth/register', to: 'authentication#register'
      get  'dashboard/stats', to: 'dashboard#stats'

      # Location data endpoints
      get 'companies/states',    to: 'companies#states'
      get 'companies/cities',    to: 'companies#cities'
      get 'companies/locations', to: 'companies#locations' # Returns combined state/city data

      # CRUDs
      resources :categories   # ✅ Corrigido (antes estava controller: 'categories_api')
      resources :companies
      resources :products
      resources :leads
      resources :reviews
      resources :badges
      resources :articles
      resources :plans
      resources :users, only: [:show, :update]

      # Search endpoints (o front consome estes)
      get 'search/all',       to: 'search#all'
      get 'search/suggest',   to: 'search#suggest'
      get 'search/companies', to: 'search#companies'
      get 'search/products',  to: 'search#products'
      get 'search/articles',  to: 'search#articles'
    end
  end

  devise_for :users, controllers: {
    sessions: 'users/sessions',
    registrations: 'users/registrations'
  }
  get 'users/profile'
  get 'u/:id', to: 'users#profile', as: 'user'

  # Páginas públicas
  root 'corporate#index'
  get 'corporate',        to: 'corporate#index', as: 'corporate'
  get 'corporate/login',  to: 'corporate#login', as: 'corporate_login'
  get 'home',             to: 'pages#home'
  get 'about',            to: 'pages#about'

  resources :posts
end
