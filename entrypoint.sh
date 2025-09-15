#!/bin/bash
set -e

# Espera o Postgres subir (ajuste host e porta se necessário)
until pg_isready -h "$POSTGRES_HOST" -p 5432 -U "$POSTGRES_USER"; do
  echo "Aguardando Postgres em $POSTGRES_HOST:5432..."
  sleep 2
done

rm -f /app/tmp/pids/server.pid

bundle exec rails db:migrate

exec "$@"
