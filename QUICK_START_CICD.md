# 🚀 Quick Start - CI/CD Setup

## ✅ O Que Já Está Pronto

Todos os workflows e configurações estão prontos para uso! Basta fazer push/PR para ativar.

## 📋 Checklist de Ativação (5 minutos)

### 1. ✅ Verificar GitHub Actions Habilitado

No seu repositório GitHub:
1. Vá em **Settings** → **Actions** → **General**
2. Certifique-se que está em **"Allow all actions and reusable workflows"**
3. Salvar

### 2. 🔐 Configurar Secrets (Opcional)

Vá em **Settings** → **Secrets and variables** → **Actions** e adicione:

#### Para SonarCloud (Opcional):
```
SONAR_TOKEN=your_sonar_token_here
```
[Como obter: https://sonarcloud.io/account/security]

#### Para Codecov (Opcional):
```
CODECOV_TOKEN=your_codecov_token_here
```
[Como obter: https://codecov.io/gh/mrgr33n98/AB0-1/settings]

**Nota:** Ambos têm planos gratuitos para projetos open source!

### 3. 🛡️ Branch Protection Rules

Vá em **Settings** → **Branches** → **Add rule**:

**Branch name pattern:** `main`

Marque:
- ✅ Require a pull request before merging
- ✅ Require approvals (1)
- ✅ Require status checks to pass before merging
  - `backend-tests`
  - `frontend-tests`
  - `rubocop`
  - `eslint`
- ✅ Require branches to be up to date before merging
- ✅ Do not allow bypassing the above settings

Salvar!

### 4. 📊 Adicionar Badges ao README

Adicione no topo do seu `README.md`:

```markdown
# AB0-1

![CI](https://github.com/mrgr33n98/AB0-1/workflows/CI/badge.svg)
![Security Scan](https://github.com/mrgr33n98/AB0-1/workflows/Security%20Scan/badge.svg)
![Lint](https://github.com/mrgr33n98/AB0-1/workflows/Lint/badge.svg)
![Performance Tests](https://github.com/mrgr33n98/AB0-1/workflows/Performance%20Tests/badge.svg)

<!-- resto do README -->
```

### 5. 🧪 Testar o Pipeline

Crie um branch de teste:

```bash
git checkout -b test/ci-cd-pipeline
echo "# Testing CI/CD" >> TEST.md
git add TEST.md
git commit -m "test: verificar pipeline CI/CD"
git push origin test/ci-cd-pipeline
```

Depois crie um Pull Request e veja os workflows rodando! 🎉

### 6. 🔔 Notificações (Opcional)

#### Slack:
1. Adicione o app GitHub ao seu Slack workspace
2. Configure notificações: `/github subscribe owner/repo`

#### Discord:
1. Crie um webhook no seu servidor Discord
2. Adicione como secret: `DISCORD_WEBHOOK`
3. Adicione step nos workflows:
```yaml
- name: Discord notification
  if: always()
  uses: sarisia/actions-status-discord@v1
  with:
    webhook: ${{ secrets.DISCORD_WEBHOOK }}
```

## 📊 O Que os Workflows Fazem

### ⚡ Automaticamente em CADA Push/PR:

1. **CI Workflow** → Testa backend e frontend
2. **Lint Workflow** → Verifica code style
3. **Security Workflow** → Scanneia vulnerabilidades (apenas em PRs para main)

### 🔒 Diariamente (3h da manhã):

1. **Security Scan** → Verifica novas vulnerabilidades

### 📈 Semanalmente (Segunda às 4h):

1. **Performance Tests** → Testa performance

### 🤖 Automaticamente pelo Dependabot:

1. **Segundas** → Cria PRs para atualizar gems/npm packages/actions
2. **Terças** → Cria PRs para atualizar imagens Docker

### 🚀 Quando Push para Main:

1. **Docker Build** → Cria e publica imagens no GHCR
2. **Deploy** → Faz deploy na VPS (se configurado)

## 🎯 Como Usar no Dia a Dia

### Fazendo um Pull Request:

1. Crie sua branch:
   ```bash
   git checkout -b feature/minha-feature
   ```

2. Faça suas mudanças e commit

3. Push e crie PR:
   ```bash
   git push origin feature/minha-feature
   ```

4. No GitHub, clique em **"New Pull Request"**

5. Preencha o template do PR (automático)

6. Aguarde os checks passarem ✅

7. Solicite review

8. Merge! 🎉

### Reportando um Bug:

1. Vá em **Issues** → **New Issue**
2. Selecione **"Bug Report"**
3. Preencha o formulário
4. Submit!

### Sugerindo uma Feature:

1. Vá em **Issues** → **New Issue**
2. Selecione **"Feature Request"**
3. Preencha o formulário
4. Submit!

## 🔍 Monitoramento

### Onde Ver os Resultados:

1. **Actions Tab** → Ver todos os workflow runs
2. **Security Tab** → Ver alertas de segurança
3. **Pull Requests** → Ver checks diretamente no PR
4. **Commits** → Ver status badge em cada commit

### Dashboards Externos (se configurado):

- **SonarCloud:** https://sonarcloud.io/project/overview?id=AB0-1
- **Codecov:** https://codecov.io/gh/mrgr33n98/AB0-1

## ⚠️ Troubleshooting

### Workflow Falhando?

1. Clique no workflow que falhou
2. Clique no job que falhou
3. Expanda o step que falhou
4. Leia o erro
5. Corrija localmente
6. Push novamente

### Build Lento?

- Workflows usam cache para dependências
- Primeira execução é mais lenta
- Execuções seguintes são rápidas

### Dependabot PRs Demais?

Ajuste em `.github/dependabot.yml`:
```yaml
open-pull-requests-limit: 3  # Reduzir de 5 para 3
```

## 📚 Documentação Completa

Para detalhes técnicos completos, veja:
- [CICD_IMPLEMENTATION.md](./CICD_IMPLEMENTATION.md) - Guia técnico completo
- [tasks/TASK-10.md](./tasks/TASK-10.md) - Detalhes da implementação

## 🆘 Precisa de Ajuda?

1. Verifique a documentação acima
2. Procure em **Issues** existentes
3. Crie uma nova **Issue** com sua dúvida
4. Entre em contato com o time DevOps

---

## ✨ Pronto!

Seu CI/CD está configurado e rodando! 🎉

Qualquer push ou PR agora será automaticamente:
- ✅ Testado
- ✅ Lintado
- ✅ Escaneado por vulnerabilidades
- ✅ Analisado por qualidade de código

**Happy Coding!** 🚀
