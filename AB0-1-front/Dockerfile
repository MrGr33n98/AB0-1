# =========================
# 1. Build stage
# =========================
FROM node:18-alpine AS builder

# Definir diretório de trabalho
WORKDIR /app

# Instalar dependências primeiro (cache otimizado)
COPY package*.json ./
RUN npm install -g npm@10.2.4 && npm ci --legacy-peer-deps

# Copiar o restante do código
COPY . .

# Variáveis do build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Compilar o Next.js
RUN npm run build

# =========================
# 2. Production stage
# =========================
FROM node:18-alpine

WORKDIR /app

# Copiar apenas o necessário do build
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js

# Variáveis de ambiente
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Porta do Next.js
EXPOSE 3000

# Subir em modo produção
CMD ["npm", "run", "start"]
