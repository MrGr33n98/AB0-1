if ENV['SKIP_DB_CHECK'].present? && Rails.env.production?
  Rails.application.config.middleware.delete(ActiveRecord::Migration::CheckPending)
  ActiveRecord::Base.establish_connection(Rails.application.config.database_configuration[Rails.env])
end