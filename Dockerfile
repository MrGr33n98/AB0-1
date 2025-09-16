FROM ruby:3.2.2

# Instala dependências do sistema
RUN apt-get update -qq && apt-get install -y \
    build-essential \
    libpq-dev \
    postgresql-client \
    nodejs

# Define diretório de trabalho
WORKDIR /app

# Copia dependências Ruby
COPY Gemfile Gemfile.lock ./
RUN bundle install

# Copia o restante da aplicação
COPY . .

# Script de inicialização
COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh

# Prepara assets
RUN bundle exec rake assets:precompile

ENTRYPOINT ["entrypoint.sh"]

# Expõe a porta do Rails
EXPOSE 3001

# Força o servidor Rails a rodar no 0.0.0.0
CMD ["rails", "server", "-b", "0.0.0.0", "-p", "3001"]
