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

# Variáveis de ambiente padrão
ENV RAILS_ENV=production \
    NODE_ENV=production \
    BUNDLE_WITHOUT="development:test"

# Cria diretório temporário para Active Storage
RUN mkdir -p tmp/storage

# ⚡ Precompile assets usando chave dummy só no build
RUN SECRET_KEY_BASE=dummy_key bundle exec rake assets:clobber assets:precompile

ENTRYPOINT ["entrypoint.sh"]

# Expõe a porta do Rails
EXPOSE 3001

# Comando padrão do container
CMD ["rails", "server", "-b", "0.0.0.0", "-p", "3001"]
