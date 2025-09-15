#!/bin/bash
set -e

# Remove a potentially pre-existing server.pid
rm -f /app/tmp/pids/server.pid

# Wait for PostgreSQL
until PGPASSWORD="${POSTGRES_PASSWORD}" psql -h "${POSTGRES_HOST}" -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" -c '\q'; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done

echo "PostgreSQL is up - executing command"

# Run migrations
bundle exec rails db:migrate

# Start the server
exec "$@"