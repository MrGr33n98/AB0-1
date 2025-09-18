# config/initializers/cors.rb
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'http://localhost:3000',
            'http://localhost:3001',
            'https://www.avaliasolar.com.br',
            'https://avaliasolar.com.br',
            'https://api.avaliasolar.com.br'

    resource '/api/v1/*',
      headers: :any,
      methods: %i[get post put patch delete options head],
      credentials: true
  end
end
