#!/bin/bash
set -e

# Remove any existing pid file
rm -f tmp/pids/server.pid
rm -f tmp/pids/*.pid

# Wait for database
until PGPASSWORD=$POSTGRES_PASSWORD psql -h "db" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c '\q'; do
  echo "Postgres is unavailable - sleeping"
  sleep 1
done

# Setup database if needed
bundle exec rails db:migrate:status || bundle exec rails db:setup
bundle exec rails db:migrate

# Then exec the container's main process
exec "$@"
