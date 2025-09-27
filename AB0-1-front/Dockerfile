# Dockerfile for AB0-1-front (Next.js)

# --- Builder Stage ---
# This stage installs dependencies and builds the Next.js application.
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package manager files
COPY package*.json ./

# Install dependencies
# Using --legacy-peer-deps as it was in the original file.
# Consider resolving peer dependency conflicts for a cleaner build.
RUN npm install --legacy-peer-deps

# Copy the rest of the application source code
COPY . .

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Build the Next.js application
RUN npm run build

# --- Runner Stage ---
# This stage creates the final, minimal image for production.
FROM node:18-alpine AS runner

WORKDIR /app

# Create a non-root user for security
RUN addgroup --system --gid 1001 nextjs
RUN adduser --system --uid 1001 nextjs

# Set production environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy the standalone output from the builder stage.
# This includes the server, node_modules, and other necessary files.
COPY --from=builder --chown=nextjs:nextjs /app/.next/standalone ./

# Copy the public assets and static files
COPY --from=builder --chown=nextjs:nextjs /app/public ./public
COPY --from=builder --chown=nextjs:nextjs /app/.next/static ./.next/static

# Set the user to the non-root user
USER nextjs

# Expose the port the app will run on
EXPOSE 3000

# The command to start the Next.js server
CMD ["node", "server.js"]