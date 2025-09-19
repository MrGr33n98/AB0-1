#!/bin/bash
set -e

echo "🚀 Corrigindo ambiente do frontend (AB-1-front)..."

# 1. Remover node_modules e lockfile para evitar conflitos
echo "🧹 Limpando dependências antigas..."
rm -rf node_modules package-lock.json

# 2. Instalar Next.js + React
echo "📦 Instalando Next.js e React..."
npm install next@13.5.1 react react-dom

# 3. Instalar framer-motion
echo "🎬 Instalando framer-motion..."
npm install framer-motion

# 4. Instalar ESLint compatível com Next 13.5.1
echo "🔧 Corrigindo ESLint..."
npm install --save-dev eslint@8.57.1 eslint-config-next@13.5.1

# 5. Instalar TypeScript e tipos (caso use TS)
echo "📘 Instalando TypeScript e tipos..."
npm install --save-dev typescript @types/react @types/node

# 6. Atualizar browserslist
echo "🌍 Atualizando browserslist..."
npx update-browserslist-db@latest || true

# 7. Rodar auditoria de pacotes
echo "🔍 Rodando auditoria de segurança..."
npm audit fix || true

echo "✅ Ambiente corrigido!"
echo "👉 Agora rode: npm run dev"
