# Usa exatamente a versão que você tem localmente
FROM ruby:3.2.2

# Instalar dependências necessárias
RUN apt-get update -qq && apt-get install -y \
  nodejs \
  postgresql-client \
  build-essential

# Define o diretório de trabalho
WORKDIR /app

# Copia Gemfile e Gemfile.lock antes (para aproveitar cache)
COPY Gemfile* ./

# Instala bundler compatível
RUN gem install bundler -v 2.4.16

# Instala gems
RUN bundle install

# Copia o restante do projeto
COPY . .

# Expõe a porta (ajuste se usar outra)
EXPOSE 3001

# Comando padrão (migrate + server)
CMD ["bash", "-c", "bundle exec rails db:migrate && bundle exec rails s -b 0.0.0.0 -p 3001"]
