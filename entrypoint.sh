#!/bin/bash
set -e

# Espera o Postgres subir (ajuste host e porta se necessário)
until pg_isready -h "$POSTGRES_HOST" -p 5432 -U "$POSTGRES_USER"; do
  echo "Aguardando Postgres em $POSTGRES_HOST:5432..."
  sleep 2
done

# Remove PID antigo se existir
rm -f /app/tmp/pids/server.pid

# Executa migrações
echo "==> Rodando migrações do banco..."
bundle exec rails db:migrate

# Precompile assets (agora em runtime, com secrets reais do container)
echo "==> Limpando e precompilando assets..."
bundle exec rake assets:clobber || true
bundle exec rake assets:precompile

# Inicia o comando final (Rails server, Sidekiq, etc.)
echo "==> Iniciando aplicação..."
exec bundle exec "$@"
