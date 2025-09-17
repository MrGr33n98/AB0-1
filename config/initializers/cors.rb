Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'https://www.avaliasolar.com.br',
            'https://avaliasolar.com.br',
            'https://api.avaliasolar.com.br',
            'http://localhost:3000'  # manter para desenvolvimento local

    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true
  end
end
