#!/bin/bash
set -e

# Remove any existing pid file
rm -f tmp/pids/server.pid
rm -f tmp/pids/*.pid

# Espera o Postgres ficar pronto
echo "⏳ Aguardando o Postgres em $POSTGRES_DB..."
until PGPASSWORD=$POSTGRES_PASSWORD psql -h "db" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c '\q'; do
  echo "Postgres não disponível ainda - tentando novamente..."
  sleep 2
done
echo "✅ Postgres disponível!"

# Cria ou migra o banco de dados
echo "🔄 Rodando migrations..."
bundle exec rails db:prepare

# Executa o processo principal do container (ex.: puma, sidekiq, etc.)
exec "$@"
