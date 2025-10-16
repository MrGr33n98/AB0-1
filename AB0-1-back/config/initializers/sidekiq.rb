# frozen_string_literal: true

# Sidekiq configuration - TASK-017 & TASK-018
# https://github.com/sidekiq/sidekiq

redis_url = ENV.fetch('REDIS_URL', 'redis://localhost:6379/0')
redis_driver = ENV.fetch('REDIS_DRIVER', 'ruby').to_sym
supported_drivers = [:ruby]
unless supported_drivers.include?(redis_driver)
  Rails.logger.warn "⚠️  Unsupported Redis driver '#{redis_driver}', falling back to :ruby" rescue nil
  redis_driver = :ruby
end

# Queue priorities (higher number = higher priority)
# Format: [queue_name, weight]
SIDEKIQ_QUEUES = [
  ['critical', 10],    # Admin alerts, system critical jobs
  ['mailers', 7],      # Email sending
  ['default', 5],      # Standard jobs
  ['notifications', 3], # Push notifications
  ['low', 1]           # Cleanup, analytics, non-urgent tasks
].freeze

Sidekiq.configure_server do |config|
  config.redis = {
    url: redis_url,
    namespace: 'sidekiq',
    driver: redis_driver,
    network_timeout: 5,
    pool_timeout: 5
  }

  # Server-specific settings
  config.logger.level = Rails.env.production? ? Logger::INFO : Logger::DEBUG
  
  # Configure queue weights
  config.queues = SIDEKIQ_QUEUES.flat_map { |name, weight| [name] * weight }
  
  # Death handler - log when job fails permanently
  config.death_handlers << lambda { |job, ex|
    Rails.logger.error "☠️ Job #{job['class']} died after all retries: #{ex.message}"
    Rails.logger.error "Job args: #{job['args']}"
    
    # Send to Sentry if available
    if defined?(Sentry)
      Sentry.capture_exception(ex, extra: { 
        job_class: job['class'],
        job_args: job['args'],
        queue: job['queue'],
        retry_count: job['retry_count']
      })
    end
  }
  
  # Error handler - called on each retry
  config.error_handlers << lambda { |ex, ctx_hash|
    Rails.logger.error "❌ Sidekiq error in #{ctx_hash[:job]['class']}: #{ex.message}"
    Rails.logger.error "Retry: #{ctx_hash[:job]['retry_count']}/#{ctx_hash[:job]['retry']}"
    
    # Track failed job metrics
    if defined?(Yabeda)
      Yabeda.sidekiq.job_errors.increment(
        { queue: ctx_hash[:job]['queue'], class: ctx_hash[:job]['class'] },
        by: 1
      )
    end
  }

  # Lifecycle callbacks
  config.on(:startup) do
    Rails.logger.info "🚀 Sidekiq server started"
  end

  config.on(:quiet) do
    Rails.logger.info "🔕 Sidekiq entering quiet mode (no new jobs)"
  end

  config.on(:shutdown) do
    Rails.logger.info "🛑 Sidekiq server shutting down"
  end
end

Sidekiq.configure_client do |config|
  config.redis = {
    url: redis_url,
    namespace: 'sidekiq',
    driver: redis_driver,
    network_timeout: 5,
    pool_timeout: 5,
    # Connection pool for Rails threads
    size: ENV.fetch('RAILS_MAX_THREADS', 5).to_i
  }
end

# Sidekiq Scheduler configuration
if defined?(Sidekiq::Scheduler)
  require 'sidekiq-scheduler'
  
  Sidekiq.configure_server do |config|
    config.on(:startup) do
      # Load schedule from config file
      schedule_file = Rails.root.join('config', 'sidekiq_schedule.yml')
      if File.exist?(schedule_file)
        Sidekiq.schedule = YAML.load_file(schedule_file)
        Sidekiq::Scheduler.reload_schedule!
        Rails.logger.info '✅ Sidekiq Scheduler loaded'
      end
    end
  end
end

Rails.logger.info "✅ Sidekiq configured: #{redis_url}"
