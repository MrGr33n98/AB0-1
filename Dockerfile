FROM ruby:3.2.2

# Instala dependências do sistema
RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends \
      build-essential \
      libpq-dev \
      postgresql-client \
      nodejs \
      yarn && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Define diretório de trabalho
WORKDIR /app

# Copia dependências Ruby primeiro (cache eficiente)
COPY Gemfile Gemfile.lock ./
RUN bundle config set --local deployment 'true' && \
    bundle config set --local without 'development test' && \
    bundle install --jobs 4 --retry 3

# Copia o restante da aplicação
COPY . .

# Script de inicialização
COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh

# Variáveis padrão (somente build)
ENV RAILS_ENV=production \
    NODE_ENV=production \
    BUNDLE_WITHOUT="development:test"

# Garante que o binário Rails e Bundler estejam no PATH
ENV PATH="/usr/local/bundle/bin:${PATH}"

# Cria diretórios necessários
RUN mkdir -p tmp/pids tmp/storage public/assets log

# Limpa caches do bundle (reduz tamanho da imagem)
RUN rm -rf tmp/cache vendor/bundle/ruby/*/cache

ENTRYPOINT ["entrypoint.sh"]

# Expõe a porta do Rails
EXPOSE 3001

# Usa bundle exec rails para garantir que Rails seja encontrado
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0", "-p", "3001"]
