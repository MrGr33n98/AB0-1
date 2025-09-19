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

    resource '/api/v1/*',
      headers: :any,
      expose: ['access-token', 'expiry', 'token-type', 'uid', 'client'],
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true
  end
end
