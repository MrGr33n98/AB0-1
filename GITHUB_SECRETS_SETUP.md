# GitHub Secrets Configuration Guide

## ⚠️ PROBLEMA IDENTIFICADO

O erro no workflow indica que o usuário PostgreSQL não existe:
```
FATAL: password authentication failed for user "***"
DETAIL: Role "***" does not exist.
```

Isso acontece porque os GitHub Secrets não estão configurados corretamente ou estão usando valores diferentes dos esperados pelo PostgreSQL.

## 📋 Secrets Necessários no GitHub

Acesse: **Settings → Secrets and variables → Actions → New repository secret**

### 1. Database Secrets

| Secret Name | Valor Recomendado | Descrição |
|------------|-------------------|-----------|
| `POSTGRES_USER` | `ab0` | Usuário do banco de dados |
| `POSTGRES_PASSWORD` | `ZAbgbZeVAK!5!` | Senha do banco (use a do .env atual) |
| `POSTGRES_DB` | `ab0_production` | Nome do banco de dados |

⚠️ **IMPORTANTE**: Esses valores devem ser **exatamente iguais** aos usados no `.env` local!

### 2. Rails Secrets

| Secret Name | Valor | Descrição |
|------------|-------|-----------|
| `RAILS_MASTER_KEY` | _[do arquivo master.key]_ | Chave mestra do Rails |
| `SECRET_KEY_BASE` | _[gerado]_ | Base secret key do Rails |
| `JWT_SECRET` | _[gerado]_ | Secret para tokens JWT |

**Para gerar `SECRET_KEY_BASE` e `JWT_SECRET`:**
```bash
cd AB0-1-back
bundle exec rails secret
```

**Para obter `RAILS_MASTER_KEY`:**
```bash
cat AB0-1-back/config/master.key
```

### 3. Deployment Secrets

| Secret Name | Valor | Descrição |
|------------|-------|-----------|
| `VM_HOST` | IP ou hostname da VM | Endereço do servidor |
| `VM_USER` | username | Usuário SSH da VM |
| `SSH_PRIVATE_KEY` | _[chave privada SSH]_ | Chave para acesso SSH |

### 4. GitHub Container Registry

| Secret Name | Valor | Descrição |
|------------|-------|-----------|
| `GHCR_PAT` | _[token do GitHub]_ | Personal Access Token |

**Para criar GHCR_PAT:**
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token
3. Selecione: `write:packages`, `read:packages`, `delete:packages`
4. Copie o token gerado

## 🔧 Como Configurar os Secrets

### Passo 1: Listar Secrets Atuais

Vá para: `https://github.com/MrGr33n98/AB0-1/settings/secrets/actions`

### Passo 2: Verificar Valores Corretos

No servidor/VM, verifique o arquivo `.env`:
```bash
cat ~/.env
# ou
cat $HOME/ab0-app/.env
```

### Passo 3: Atualizar/Criar Secrets

Para cada secret listado acima:
1. Clique em **"New repository secret"** (ou **"Update"** se já existir)
2. Nome: Exatamente como listado (case-sensitive)
3. Valor: Cole o valor correto
4. Clique em **"Add secret"** ou **"Update secret"**

## 🐘 Solução Específica para PostgreSQL

Se você já tem um banco de dados rodando na VM com credenciais diferentes:

### Opção A: Atualizar GitHub Secrets (Recomendado)

Atualize os secrets do GitHub para corresponder às credenciais do PostgreSQL que já está rodando:

```bash
# Na VM, verifique as credenciais atuais
docker exec ab0-postgres psql -U postgres -c "\du"
```

### Opção B: Recriar o Banco de Dados

Se preferir usar as credenciais do GitHub Secrets, recrie o banco:

```bash
# Na VM
cd $HOME/ab0-app

# Parar e remover containers
docker-compose down -v

# Recriar com novas credenciais
docker-compose up -d db

# Verificar se o usuário foi criado
docker exec ab0-postgres psql -U ab0 -d ab0_production -c "SELECT version();"
```

## ✅ Verificação Final

Depois de configurar os secrets, teste o workflow:

1. Faça um pequeno commit:
```bash
git commit --allow-empty -m "test: trigger workflow with correct secrets"
git push origin main
```

2. Monitore em: `https://github.com/MrGr33n98/AB0-1/actions`

3. Se o erro persistir, verifique os logs do container:
```bash
# Na VM
docker logs ab0-postgres
docker logs ab0-backend
```

## 🔐 Segurança

- ✅ Nunca commite arquivos `.env` ou `master.key` no repositório
- ✅ Use senhas fortes para produção
- ✅ Rotacione secrets periodicamente
- ✅ Limite o acesso aos secrets apenas para quem precisa

## 📞 Troubleshooting

Se o erro continuar:

1. **Verifique se o usuário existe:**
```bash
docker exec ab0-postgres psql -U postgres -c "\du"
```

2. **Crie o usuário manualmente se necessário:**
```bash
docker exec ab0-postgres psql -U postgres -c "CREATE USER ab0 WITH PASSWORD 'ZAbgbZeVAK!5!' CREATEDB;"
docker exec ab0-postgres psql -U postgres -c "CREATE DATABASE ab0_production OWNER ab0;"
```

3. **Verifique a conexão:**
```bash
docker exec ab0-backend rails db:version
```

## 📝 Checklist

- [ ] Todos os secrets do GitHub configurados
- [ ] Valores correspondem ao arquivo `.env`
- [ ] `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` estão corretos
- [ ] `RAILS_MASTER_KEY` está correto
- [ ] Workflow testado e funcionando
- [ ] Banco de dados acessível
- [ ] Backend conecta ao banco sem erros
