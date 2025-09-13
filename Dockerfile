# Etapa 1: Build da aplicação
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Instala dependências de forma reprodutível
RUN npm ci --legacy-peer-deps

COPY . .

# Build sem ESLint e TypeScript (produção não precisa disso)
RUN NEXT_DISABLE_ESLINT=1 NEXT_DISABLE_TYPECHECK=1 npm run build

# Etapa 2: Runtime
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 3000

CMD ["npm", "start"]
o
