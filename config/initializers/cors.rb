# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin AJAX requests.

# Read more: https://github.com/cyu/rack-cors

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # WARNING: Allowing all origins is not secure for production.
    # Please restrict this to your frontend domain in production.
    # Example: origins 'https://www.yourfrontend.com'
    origins '*'

    resource '/api/v1/*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: false # Credentials should be false if origins is '*'
  end
end