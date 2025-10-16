# frozen_string_literal: true

# Redis configuration - TASK-014
# https://github.com/redis/redis-rb

# Redis connection URL from ENV or default
redis_url = ENV.fetch('REDIS_URL', 'redis://localhost:6379/0')

# Determine driver (Ruby driver is the only one guaranteed in this environment)
requested_driver = ENV.fetch('REDIS_DRIVER', 'ruby').to_sym
supported_drivers = [:ruby]

unless supported_drivers.include?(requested_driver)
  Rails.logger.warn "⚠️  Unsupported Redis driver '#{requested_driver}', falling back to :ruby" rescue nil
  requested_driver = :ruby
end

# Configure Redis with connection pooling
REDIS = Redis.new(
  url: redis_url,
  reconnect_attempts: 3,
  timeout: 1, # Connection timeout
  connect_timeout: 2,
  read_timeout: 1,
  write_timeout: 1,
  driver: requested_driver
)

# Test connection on startup
begin
  REDIS.ping
  Rails.logger.info "✅ Redis connected: #{redis_url}"
rescue Redis::CannotConnectError => e
  Rails.logger.error "❌ Redis connection failed: #{e.message}"
  Rails.logger.warn "⚠️  Caching and sessions will fall back to memory store"
rescue ArgumentError => e
  Rails.logger.error "❌ Redis configuration error: #{e.message}"
  Rails.logger.warn '⚠️  Falling back to in-memory stores due to Redis misconfiguration'
end

# Configure different Redis namespaces for different purposes
module RedisNamespaces
  def self.cache
    Redis::Namespace.new('cache', redis: REDIS)
  end

  def self.session
    Redis::Namespace.new('session', redis: REDIS)
  end

  def self.sidekiq
    Redis::Namespace.new('sidekiq', redis: REDIS)
  end

  def self.cable
    Redis::Namespace.new('cable', redis: REDIS)
  end

  def self.rack_attack
    Redis::Namespace.new('rack_attack', redis: REDIS)
  end
end

# Helper method for Redis operations with error handling
module RedisHelper
  def self.with_redis(&block)
    yield REDIS
  rescue Redis::BaseError => e
    Rails.logger.error "Redis error: #{e.message}"
    nil
  end
end
