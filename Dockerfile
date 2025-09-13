# Etapa 1: Build das dependências
FROM ruby:3.2 AS builder

WORKDIR /app

# Instalar dependências do sistema
RUN apt-get update -qq && apt-get install -y nodejs postgresql-client build-essential libpq-dev

# Copiar Gemfile e instalar gems
COPY Gemfile* ./
RUN bundle install

# Copiar o restante do código
COPY . .

# Etapa 2: Runtime
FROM ruby:3.2

WORKDIR /app

RUN apt-get update -qq && apt-get install -y nodejs postgresql-client

COPY --from=builder /app /app

# Expor a porta da aplicação Rails
EXPOSE 3001

# Rodar servidor Rails
CMD ["bash", "-c", "bundle exec rails db:migrate && bundle exec rails s -b 0.0.0.0 -p 3001"]
