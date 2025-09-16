# Etapa 1: Build da aplicação
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Instala dependências de forma reprodutível
RUN npm ci --legacy-peer-deps

COPY . .

# Build sem ESLint e sem TypeScript
ENV NEXT_DISABLE_ESLINT=1
ENV NEXT_DISABLE_TYPECHECK=1
ENV SKIP_BUILD_VALIDATION=true
ENV NEXT_PUBLIC_API_URL=http://64.225.59.107:3001/api/v1

RUN npm run build

# Etapa 2: Runtime
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app ./

# Expõe a porta do Next.js
EXPOSE 3000

# Força o Next.js a rodar no 0.0.0.0 (necessário para Docker/Nginx acessar)
CMD ["npm", "run", "start", "--", "-p", "3000", "-H", "0.0.0.0"]
