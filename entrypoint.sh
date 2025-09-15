#!/bin/bash
set -e

# Remove a potentially pre-existing server.pid for Rails
rm -f /app/tmp/pids/server.pid

# Wait for PostgreSQL to be ready
until pg_isready -h "$POSTGRES_HOST" -p 5432 -U "$POSTGRES_USER"
do
  echo "Waiting for PostgreSQL to be ready..."
  sleep 2
done

echo "PostgreSQL is ready! Running migrations..."

# Run database migrations
bundle exec rails db:migrate RAILS_ENV=production

# Run the main process
exec "$@"