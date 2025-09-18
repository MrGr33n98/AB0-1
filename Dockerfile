FROM ruby:3.2.2

# Instala dependências do sistema
RUN apt-get update -qq && \
    apt-get install -y build-essential libpq-dev postgresql-client nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Define diretório de trabalho
WORKDIR /app

# Copia dependências Ruby
COPY Gemfile Gemfile.lock ./
RUN bundle config set --local deployment 'true' && \
    bundle config set --local without 'development test' && \
    bundle install --jobs 4 --retry 3

# Copia o restante da aplicação
COPY . .

# Script de inicialização
COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh

# Prepara assets
# Set up environment variables
# Set Rails environment
ENV RAILS_ENV=production
ENV NODE_ENV=production
ENV BUNDLE_WITHOUT="development:test"
ENV SECRET_KEY_BASE=temporary_key_for_precompile

# Create storage directory for Active Storage
RUN mkdir -p tmp/storage

# Clear and precompile assets
RUN bundle exec rake assets:clobber || true && \
    bundle exec rake assets:precompile

ENTRYPOINT ["entrypoint.sh"]

# Expõe a porta do Rails
EXPOSE 3001

# Força o servidor Rails a rodar no 0.0.0.0
CMD ["rails", "server", "-b", "0.0.0.0", "-p", "3001"]
