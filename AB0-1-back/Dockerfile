# Dockerfile for AB0-1-back (Rails)

# --- Builder Stage ---
# This stage installs dependencies and builds the application assets.
FROM ruby:3.2.2 as builder

# Install essential build-time system dependencies
RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends \
      build-essential \
      libpq-dev \
      postgresql-client \
      nodejs \
      yarn && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Install the exact bundler version from Gemfile.lock for reproducibility
COPY Gemfile.lock .
RUN gem install bundler -v $(grep -A 1 "BUNDLED WITH" Gemfile.lock | tail -n 1 | tr -d " ")

# Copy Gemfile and install gems
# This is done in a separate step to leverage Docker layer caching.
# Gem installation will only be re-run if Gemfile or Gemfile.lock changes.
COPY Gemfile .
RUN bundle install --jobs $(nproc) --retry 3

# Copy the rest of the application code
COPY . .

# Precompile assets for production
# A dummy secret key is provided here just for the asset compilation step.
# The real secret key will be provided by the environment in the runner stage.
# Skip database check during asset precompilation
RUN SECRET_KEY_BASE=dummy RAILS_ENV=production SKIP_DB_CHECK=1 bundle exec rails assets:precompile

# --- Runner Stage ---
# This stage creates the final, smaller, and more secure image.
FROM ruby:3.2.2 as runner

# Install only essential runtime system dependencies
RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends \
      postgresql-client \
      # Add any other runtime-specific packages here (e.g., for image processing)
      imagemagick && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Create a non-root user to run the application for better security
RUN useradd --create-home --shell /bin/bash appuser
WORKDIR /home/appuser/app

# Copy installed gems from the builder stage
COPY --from=builder /usr/local/bundle/ /usr/local/bundle/

# Copy the precompiled assets and application code from the builder stage
COPY --from=builder --chown=appuser:appuser /app .

# Grant ownership to the app user
USER appuser

# Expose the port the app runs on
EXPOSE 3001

# Copy and set up the entrypoint
COPY --from=builder --chown=appuser:appuser /app/entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["/usr/bin/entrypoint.sh"]

# Set the default command to start the Rails server
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0", "-p", "3001"]