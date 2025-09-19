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
# Set Rails environment
ENV RAILS_ENV=production
ENV NODE_ENV=production
ENV BUNDLE_WITHOUT="development:test"

# Install dependencies
RUN bundle config set --local deployment 'true' && \
    bundle config set --local without 'development test' && \
    bundle install --jobs 4 --retry 3

# Create required directories
RUN mkdir -p tmp/pids && \
    mkdir -p tmp/storage && \
    mkdir -p public/assets

# Precompile assets with a temporary key
ARG TEMP_KEY=temp_key_for_asset_precompile
RUN RAILS_ENV=production \
    NODE_ENV=production \
    SECRET_KEY_BASE=${TEMP_KEY} \
    bundle exec rake assets:precompile

# Remove temporary build artifacts
RUN rm -rf tmp/cache vendor/bundle/ruby/*/cache

ENTRYPOINT ["entrypoint.sh"]

# Expõe a porta do Rails
EXPOSE 3001

# Comando padrão do container
CMD ["rails", "server", "-b", "0.0.0.0", "-p", "3001"]
