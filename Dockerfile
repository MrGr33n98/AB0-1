# Etapa 1: Build da aplicação
FROM node:18-alpine AS builder

# Define diretório de trabalho
WORKDIR /app

# Copia arquivos de dependências
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o resto do código
COPY . .

# Gera build otimizado do Next.js
RUN npm run build

# Etapa 2: Runtime (imagem mais leve)
FROM node:18-alpine

WORKDIR /app

# Copia arquivos buildados da etapa anterior
COPY --from=builder /app ./

# Expõe a porta padrão do Next.js
EXPOSE 3000

# Inicia o servidor em modo produção
CMD ["npm", "start"]
