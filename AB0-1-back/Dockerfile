FROM ruby:3.2.2

# Install system dependencies
RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends \
      build-essential \
      libpq-dev \
      postgresql-client \
      nodejs \
      yarn && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Install specific bundler version
RUN gem install bundler:2.4.22

# Copy Gemfile and install dependencies
COPY Gemfile Gemfile.lock ./
RUN bundle install --jobs 4 --retry 3

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p tmp/pids tmp/storage public/assets log

# Set environment variables
ENV RAILS_ENV=production \
    PATH="/app/bin:${PATH}"

# Create database.yml
RUN echo "production:\n\
  adapter: postgresql\n\
  encoding: unicode\n\
  pool: 5\n\
  url: <%= ENV['DATABASE_URL'] %>" > config/database.yml

EXPOSE 3001

# Start the server
# Add entrypoint script
COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh

ENTRYPOINT ["/usr/bin/entrypoint.sh"]
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0", "-p", "3001"]
