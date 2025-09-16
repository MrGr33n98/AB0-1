Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'http://64.225.59.107:3000',
            'http://localhost:3000',
            'http://64.225.59.107:3001',
            'http://localhost:3001',
            'http://www.avaliasolar.com.br',
            'https://www.avaliasolar.com.br'

    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true
  end
end
