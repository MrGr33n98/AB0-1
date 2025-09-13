# Etapa 1: Build da aplicação
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Instala dependências ignorando conflitos
RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

# Etapa 2: Runtime
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 3000

CMD ["npm", "start"]
