# frozen_string_literal: true

# Update Rack::Attack to use Redis - TASK-014
# This should be loaded after rack_attack.rb and redis.rb

if defined?(Rack::Attack) && defined?(REDIS)
  begin
    # Use Redis for Rack::Attack cache
    Rack::Attack.cache.store = ActiveSupport::Cache::RedisCacheStore.new(
      url: ENV.fetch('REDIS_URL', 'redis://localhost:6379/0'),
      namespace: 'rack_attack',
      expires_in: 1.hour,
      error_handler: -> (method:, returning:, exception:) {
        Rails.logger.error "Rack::Attack Redis error: #{exception.message}"
      }
    )

    Rails.logger.info '✅ Rack::Attack using Redis cache store'
  rescue Redis::CannotConnectError, Redis::TimeoutError => e
    Rails.logger.warn "⚠️  Rack::Attack falling back to MemoryStore: #{e.message}"
    Rack::Attack.cache.store = ActiveSupport::Cache::MemoryStore.new
  end
end
