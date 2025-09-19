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

# Set environment variables for asset precompilation
ENV RAILS_ENV=production
ENV NODE_ENV=production
ENV SECRET_KEY_BASE=dummy_key_for_precompile
ENV BUNDLE_WITHOUT="development:test"

# Install dependencies
RUN bundle config set --local deployment 'true' && \
    bundle config set --local without 'development test' && \
    bundle install --jobs 4 --retry 3

# Create required directories
RUN mkdir -p tmp/pids && \
    mkdir -p tmp/storage && \
    mkdir -p public/assets

# Clear and precompile assets with proper environment
RUN RAILS_ENV=production \
    SECRET_KEY_BASE=dummy_key_for_precompile \
    bundle exec rake assets:clobber && \
    bundle exec rake assets:precompile

ENTRYPOINT ["entrypoint.sh"]

# Expõe a porta do Rails
EXPOSE 3001

# Comando padrão do container
CMD ["rails", "server", "-b", "0.0.0.0", "-p", "3001"]
