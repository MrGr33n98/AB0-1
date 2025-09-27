Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins(
      # Produção
      'https://www.avaliasolar.com.br',
      'https://avaliasolar.com.br',
      'https://api.avaliasolar.com.br',
      # Desenvolvimento local
      'http://localhost:3000',
      'http://localhost:3001'
    )

    # API resources
    resource '*',
      headers: :any,
      expose: ['access-token', 'expiry', 'token-type', 'uid', 'client'],
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true
  end

  # Active Storage configuration
  allow do
    origins '*'
    resource '/rails/active_storage/*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: false
  end
end
