2025-09-29T05:06:24.7738978Z Current runner version: '2.328.0'
2025-09-29T05:06:24.7782785Z Runner name: 'ubuntu-s-1vcpu-2gb-70gb-intel-nyc3-01'
2025-09-29T05:06:24.7816209Z Runner group name: 'Default'
2025-09-29T05:06:24.7818771Z Machine name: 'ubuntu-s-1vcpu-2gb-70gb-intel-nyc3-01'
2025-09-29T05:06:24.7861025Z ##[group]GITHUB_TOKEN Permissions
2025-09-29T05:06:24.7898654Z Actions: write
2025-09-29T05:06:24.7899627Z Attestations: write
2025-09-29T05:06:24.7900416Z Checks: write
2025-09-29T05:06:24.7901216Z Contents: write
2025-09-29T05:06:24.7901992Z Deployments: write
2025-09-29T05:06:24.7902754Z Discussions: write
2025-09-29T05:06:24.7903587Z Issues: write
2025-09-29T05:06:24.7936311Z Metadata: read
2025-09-29T05:06:24.7938029Z Models: read
2025-09-29T05:06:24.7939280Z Packages: write
2025-09-29T05:06:24.7940377Z Pages: write
2025-09-29T05:06:24.7941794Z PullRequests: write
2025-09-29T05:06:24.7943012Z RepositoryProjects: write
2025-09-29T05:06:24.7970127Z SecurityEvents: write
2025-09-29T05:06:24.7971956Z Statuses: write
2025-09-29T05:06:24.7972974Z ##[endgroup]
2025-09-29T05:06:24.7989282Z Secret source: Actions
2025-09-29T05:06:24.7990664Z Prepare workflow directory
2025-09-29T05:06:25.7383593Z Prepare all required actions
2025-09-29T05:06:25.8463777Z Complete job name: deploy
2025-09-29T05:06:26.6947452Z ##[group]Run set -e
2025-09-29T05:06:26.6948591Z [36;1mset -e[0m
2025-09-29T05:06:26.6949254Z [36;1mecho "🔍 Verificando dependências..."[0m
2025-09-29T05:06:26.6950095Z [36;1mif ! command -v docker &> /dev/null; then[0m
2025-09-29T05:06:26.6950949Z [36;1m  echo "ℹ️ Docker não encontrado. Instalando..."[0m
2025-09-29T05:06:26.6951943Z [36;1m  sudo apt-get update[0m
2025-09-29T05:06:26.6952653Z [36;1m  sudo apt-get install -y docker.io[0m
2025-09-29T05:06:26.6953396Z [36;1mfi[0m
2025-09-29T05:06:26.6984938Z [36;1m[0m
2025-09-29T05:06:26.6986112Z [36;1mif ! docker info > /dev/null 2>&1; then[0m
2025-09-29T05:06:26.6987050Z [36;1m  echo "ℹ️ Docker não está rodando. Tentando iniciar..."[0m
2025-09-29T05:06:26.6988046Z [36;1m  sudo systemctl start docker[0m
2025-09-29T05:06:26.6988915Z [36;1m  sleep 5[0m
2025-09-29T05:06:26.6989577Z [36;1m  if ! docker info > /dev/null 2>&1; then[0m
2025-09-29T05:06:26.6990502Z [36;1m    echo "❌ Erro: Falha ao iniciar o Docker."[0m
2025-09-29T05:06:26.6991333Z [36;1m    exit 1[0m
2025-09-29T05:06:26.6991992Z [36;1m  fi[0m
2025-09-29T05:06:26.6992604Z [36;1m  echo "✅ Docker iniciado com sucesso."[0m
2025-09-29T05:06:26.6993349Z [36;1melse[0m
2025-09-29T05:06:26.7024612Z [36;1m  echo "✅ Docker já está rodando."[0m
2025-09-29T05:06:26.7025929Z [36;1mfi[0m
2025-09-29T05:06:26.7026452Z [36;1m[0m
2025-09-29T05:06:26.7027074Z [36;1mif ! docker compose version &> /dev/null; then[0m
2025-09-29T05:06:26.7027948Z [36;1m  echo "📦 Instalando Docker Compose Plugin..."[0m
2025-09-29T05:06:26.7029217Z [36;1m  sudo apt-get update && sudo apt-get install -y docker-compose-plugin[0m
2025-09-29T05:06:26.7030119Z [36;1mfi[0m
2025-09-29T05:06:26.7030693Z [36;1mecho "✅ Dependências verificadas."[0m
2025-09-29T05:06:26.7239344Z shell: /usr/bin/bash -e {0}
2025-09-29T05:06:26.7240945Z env:
2025-09-29T05:06:26.7281920Z   DOCKER_COMPOSE_CONTENT: services:
  db:
    image: postgres:14
    restart: always
    environment:
      POSTGRES_USER: ***
      POSTGRES_PASSWORD: ***
      POSTGRES_DB: ***
    volumes:
      - db_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 5s
      retries: 10

  backend:
    image: ghcr.io/mrgr33n98/***-1-backend:latest
    depends_on:
      db:
        condition: service_healthy
    environment:
      RAILS_ENV: production
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}
      RAILS_MASTER_KEY: ${RAILS_MASTER_KEY}
      SECRET_KEY_BASE: ${SECRET_KEY_BASE}
      JWT_SECRET: ${JWT_SECRET}
      # CORS_ORIGINS também pode usar VM_HOST se for o caso
      CORS_ORIGINS: http://${VM_HOST}:3000 # Exemplo: se o frontend estiver em 3000
    ports:
      - "3001:3001"

  frontend:
    image: ghcr.io/mrgr33n98/***-1-frontend:latest
    depends_on:
      - backend
    environment:
      NODE_ENV: production
      # Construindo os URLs a partir de VM_HOST
      NEXT_PUBLIC_API_URL: http://${VM_HOST}:3001
      NEXT_PUBLIC_SITE_URL: http://${VM_HOST}:3000
    ports:
      - "3000:3000"

volumes:
  db_data: {}

2025-09-29T05:06:26.7323076Z   POSTGRES_USER: ***
2025-09-29T05:06:26.7355177Z   POSTGRES_PASSWORD: ***
2025-09-29T05:06:26.7356943Z   POSTGRES_DB: ***
2025-09-29T05:06:26.7357911Z   RAILS_MASTER_KEY: ***
2025-09-29T05:06:26.7359776Z   SECRET_KEY_BASE: ***
2025-09-29T05:06:26.7360632Z   JWT_SECRET: ***
2025-09-29T05:06:26.7396461Z   CORS_ORIGINS: ***
2025-09-29T05:06:26.7397341Z   VM_HOST: ***
2025-09-29T05:06:26.7398022Z ##[endgroup]
2025-09-29T05:06:27.9554990Z 🔍 Verificando dependências...
2025-09-29T05:06:27.9557371Z ✅ Docker já está rodando.
2025-09-29T05:06:27.9558326Z ✅ Dependências verificadas.
2025-09-29T05:06:28.0752456Z ##[group]Run echo "🔐 Autenticando no GitHub Container Registry..."
2025-09-29T05:06:28.0805995Z [36;1mecho "🔐 Autenticando no GitHub Container Registry..."[0m
2025-09-29T05:06:28.0807855Z [36;1m# É crucial que o GHCR_PAT seja gerado pela conta 'mrgr33n98'[0m
2025-09-29T05:06:28.0809770Z [36;1m# e que o username usado no login seja 'mrgr33n98' para acessar os pacotes.[0m
2025-09-29T05:06:28.0812622Z [36;1mecho "***" | docker login ghcr.io -u mrgr33n98 --password-stdin[0m
2025-09-29T05:06:28.0992059Z shell: /usr/bin/bash -e {0}
2025-09-29T05:06:28.0993152Z env:
2025-09-29T05:06:28.1068753Z   DOCKER_COMPOSE_CONTENT: services:
  db:
    image: postgres:14
    restart: always
    environment:
      POSTGRES_USER: ***
      POSTGRES_PASSWORD: ***
      POSTGRES_DB: ***
    volumes:
      - db_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 5s
      retries: 10

  backend:
    image: ghcr.io/mrgr33n98/***-1-backend:latest
    depends_on:
      db:
        condition: service_healthy
    environment:
      RAILS_ENV: production
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}
      RAILS_MASTER_KEY: ${RAILS_MASTER_KEY}
      SECRET_KEY_BASE: ${SECRET_KEY_BASE}
      JWT_SECRET: ${JWT_SECRET}
      # CORS_ORIGINS também pode usar VM_HOST se for o caso
      CORS_ORIGINS: http://${VM_HOST}:3000 # Exemplo: se o frontend estiver em 3000
    ports:
      - "3001:3001"

  frontend:
    image: ghcr.io/mrgr33n98/***-1-frontend:latest
    depends_on:
      - backend
    environment:
      NODE_ENV: production
      # Construindo os URLs a partir de VM_HOST
      NEXT_PUBLIC_API_URL: http://${VM_HOST}:3001
      NEXT_PUBLIC_SITE_URL: http://${VM_HOST}:3000
    ports:
      - "3000:3000"

volumes:
  db_data: {}

2025-09-29T05:06:28.1164345Z   POSTGRES_USER: ***
2025-09-29T05:06:28.1166609Z   POSTGRES_PASSWORD: ***
2025-09-29T05:06:28.1167894Z   POSTGRES_DB: ***
2025-09-29T05:06:28.1169087Z   RAILS_MASTER_KEY: ***
2025-09-29T05:06:28.1171892Z   SECRET_KEY_BASE: ***
2025-09-29T05:06:28.1173068Z   JWT_SECRET: ***
2025-09-29T05:06:28.1255247Z   CORS_ORIGINS: ***
2025-09-29T05:06:28.1256811Z   VM_HOST: ***
2025-09-29T05:06:28.1257680Z ##[endgroup]
2025-09-29T05:06:28.5730444Z 🔐 Autenticando no GitHub Container Registry...
2025-09-29T05:06:28.5731841Z Login Succeeded
2025-09-29T05:06:28.6022534Z ##[group]Run set -e
2025-09-29T05:06:28.6023906Z [36;1mset -e[0m
2025-09-29T05:06:28.6057563Z [36;1mecho "🚀 Iniciando deploy na VPS..."[0m
2025-09-29T05:06:28.6059434Z [36;1mcd ~/***-app || mkdir -p ~/***-app && cd ~/***-app[0m
2025-09-29T05:06:28.6060826Z [36;1m[0m
2025-09-29T05:06:28.6061811Z [36;1mecho "📝 Criando docker-compose.yml..."[0m
2025-09-29T05:06:28.6063649Z [36;1m# Desabilita a expansão de histórico para evitar problemas com '!' na senha[0m
2025-09-29T05:06:28.6076449Z [36;1mset +H[0m
2025-09-29T05:06:28.6077733Z [36;1mecho "$DOCKER_COMPOSE_CONTENT" > docker-compose.yml[0m
2025-09-29T05:06:28.6080528Z [36;1m# Reabilita a expansão de histórico (opcional, mas boa prática)[0m
2025-09-29T05:06:28.6082609Z [36;1mset -H[0m
2025-09-29T05:06:28.6083835Z [36;1m[0m
2025-09-29T05:06:28.6095527Z [36;1mecho "🐳 Atualizando containers..."[0m
2025-09-29T05:06:28.6096824Z [36;1mtimeout 180s docker compose pull[0m
2025-09-29T05:06:28.6098270Z [36;1mtimeout 90s docker compose down --remove-orphans[0m
2025-09-29T05:06:28.6099655Z [36;1mtimeout 180s docker compose up -d[0m
2025-09-29T05:06:28.6100795Z [36;1m[0m
2025-09-29T05:06:28.6101664Z [36;1mecho "✨ Rodando migrações..."[0m
2025-09-29T05:06:28.6110183Z [36;1m# PASSO DE DEPURACAO: Verifique as variaveis de ambiente do banco de dados dentro do container backend[0m
2025-09-29T05:06:28.6114610Z [36;1mdocker compose run --rm backend bash -c "echo '--- Debugging DB connection in backend container ---' && env | grep -E 'DATABASE_URL|POSTGRES_USER|POSTGRES_PASSWORD|POSTGRES_DB' && echo '---------------------------------------------------'"[0m
2025-09-29T05:06:28.6126029Z [36;1mdocker compose run --rm backend bundle exec rails db:migrate || {[0m
2025-09-29T05:06:28.6127700Z [36;1m  echo "❌ Erro ao rodar migrações"[0m
2025-09-29T05:06:28.6129000Z [36;1m  docker compose logs db backend[0m
2025-09-29T05:06:28.6130164Z [36;1m  exit 1[0m
2025-09-29T05:06:28.6131058Z [36;1m}[0m
2025-09-29T05:06:28.6131886Z [36;1m[0m
2025-09-29T05:06:28.6132823Z [36;1mecho "✅ Deploy finalizado com sucesso!"[0m
2025-09-29T05:06:28.6145126Z [36;1mecho "🌐 Frontend: ***"[0m
2025-09-29T05:06:28.6146753Z [36;1mecho "🌐 Backend: http://***:3001"[0m
2025-09-29T05:06:28.6205014Z shell: /usr/bin/bash -e {0}
2025-09-29T05:06:28.6206478Z env:
2025-09-29T05:06:28.6232324Z   DOCKER_COMPOSE_CONTENT: services:
  db:
    image: postgres:14
    restart: always
    environment:
      POSTGRES_USER: ***
      POSTGRES_PASSWORD: ***
      POSTGRES_DB: ***
    volumes:
      - db_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 5s
      retries: 10

  backend:
    image: ghcr.io/mrgr33n98/***-1-backend:latest
    depends_on:
      db:
        condition: service_healthy
    environment:
      RAILS_ENV: production
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}
      RAILS_MASTER_KEY: ${RAILS_MASTER_KEY}
      SECRET_KEY_BASE: ${SECRET_KEY_BASE}
      JWT_SECRET: ${JWT_SECRET}
      # CORS_ORIGINS também pode usar VM_HOST se for o caso
      CORS_ORIGINS: http://${VM_HOST}:3000 # Exemplo: se o frontend estiver em 3000
    ports:
      - "3001:3001"

  frontend:
    image: ghcr.io/mrgr33n98/***-1-frontend:latest
    depends_on:
      - backend
    environment:
      NODE_ENV: production
      # Construindo os URLs a partir de VM_HOST
      NEXT_PUBLIC_API_URL: http://${VM_HOST}:3001
      NEXT_PUBLIC_SITE_URL: http://${VM_HOST}:3000
    ports:
      - "3000:3000"

volumes:
  db_data: {}

2025-09-29T05:06:28.6268236Z   POSTGRES_USER: ***
2025-09-29T05:06:28.6269396Z   POSTGRES_PASSWORD: ***
2025-09-29T05:06:28.6270560Z   POSTGRES_DB: ***
2025-09-29T05:06:28.6271721Z   RAILS_MASTER_KEY: ***
2025-09-29T05:06:28.6285468Z   SECRET_KEY_BASE: ***
2025-09-29T05:06:28.6287045Z   JWT_SECRET: ***
2025-09-29T05:06:28.6288063Z   CORS_ORIGINS: ***
2025-09-29T05:06:28.6289020Z   VM_HOST: ***
2025-09-29T05:06:28.6290852Z ##[endgroup]
2025-09-29T05:06:28.6530331Z 🚀 Iniciando deploy na VPS...
2025-09-29T05:06:28.6582332Z 📝 Criando docker-compose.yml...
2025-09-29T05:06:28.6589501Z 🐳 Atualizando containers...
2025-09-29T05:06:29.4870865Z  db Pulling 
2025-09-29T05:06:29.4871943Z  backend Pulling 
2025-09-29T05:06:29.4872924Z  frontend Pulling 
2025-09-29T05:06:29.4884639Z  db Pulled 
2025-09-29T05:06:29.6472013Z  backend Pulled 
2025-09-29T05:06:29.6700559Z  frontend Pulled 
2025-09-29T05:06:30.0117362Z  Container ***-app-frontend-1  Stopping
2025-09-29T05:06:30.4118320Z  Container ***-app-frontend-1  Stopped
2025-09-29T05:06:30.4144199Z  Container ***-app-frontend-1  Removing
2025-09-29T05:06:30.4282297Z  Container ***-app-frontend-1  Removed
2025-09-29T05:06:30.4378048Z  Container ***-app-backend-1  Stopping
2025-09-29T05:06:30.4379303Z  Container ***-app-backend-run-f843b25a25d0  Stopping
2025-09-29T05:06:40.9730501Z  Container ***-app-backend-run-f843b25a25d0  Stopped
2025-09-29T05:06:40.9788471Z  Container ***-app-backend-run-f843b25a25d0  Removing
2025-09-29T05:06:40.9889319Z  Container ***-app-backend-run-f843b25a25d0  Removed
2025-09-29T05:06:41.0533751Z  Container ***-app-backend-1  Stopped
2025-09-29T05:06:41.0572780Z  Container ***-app-backend-1  Removing
2025-09-29T05:06:41.0722533Z  Container ***-app-backend-1  Removed
2025-09-29T05:06:41.0768015Z  Container ***-app-db-1  Stopping
2025-09-29T05:06:41.4456091Z  Container ***-app-db-1  Stopped
2025-09-29T05:06:41.4479159Z  Container ***-app-db-1  Removing
2025-09-29T05:06:41.4597685Z  Container ***-app-db-1  Removed
2025-09-29T05:06:41.4630158Z  Network ***-app_default  Removing
2025-09-29T05:06:41.6018264Z  Network ***-app_default  Removed
2025-09-29T05:06:41.9397852Z  Network ***-app_default  Creating
2025-09-29T05:06:42.0942266Z  Network ***-app_default  Created
2025-09-29T05:06:42.0997311Z  Container ***-app-db-1  Creating
2025-09-29T05:06:42.2027693Z  Container ***-app-db-1  Created
2025-09-29T05:06:42.2055128Z  Container ***-app-backend-1  Creating
2025-09-29T05:06:42.2409175Z  Container ***-app-backend-1  Created
2025-09-29T05:06:42.2427528Z  Container ***-app-frontend-1  Creating
2025-09-29T05:06:42.2806211Z  Container ***-app-frontend-1  Created
2025-09-29T05:06:42.2898737Z  Container ***-app-db-1  Starting
2025-09-29T05:06:42.7387345Z  Container ***-app-db-1  Started
2025-09-29T05:06:42.7408296Z  Container ***-app-db-1  Waiting
2025-09-29T05:06:48.2452207Z  Container ***-app-db-1  Healthy
2025-09-29T05:06:48.2455276Z  Container ***-app-backend-1  Starting
2025-09-29T05:06:48.7689893Z  Container ***-app-backend-1  Started
2025-09-29T05:06:48.7721696Z  Container ***-app-frontend-1  Starting
2025-09-29T05:06:49.4561238Z  Container ***-app-frontend-1  Started
2025-09-29T05:06:49.4887159Z ✨ Rodando migrações...
2025-09-29T05:06:49.9851483Z  Container ***-app-db-1  Running
2025-09-29T05:06:51.3890116Z Password for user root: 
2025-09-29T05:06:51.4088241Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:06:51.4158303Z Postgres is unavailable - sleeping
2025-09-29T05:06:52.5537861Z Password for user root: 
2025-09-29T05:06:52.5707169Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:06:52.5746607Z Postgres is unavailable - sleeping
2025-09-29T05:06:53.7034927Z Password for user root: 
2025-09-29T05:06:53.7179439Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:06:53.7303264Z Postgres is unavailable - sleeping
2025-09-29T05:06:54.8186492Z Password for user root: 
2025-09-29T05:06:54.8288286Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:06:54.8330076Z Postgres is unavailable - sleeping
2025-09-29T05:06:55.9492697Z Password for user root: 
2025-09-29T05:06:55.9639859Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:06:55.9738801Z Postgres is unavailable - sleeping
2025-09-29T05:06:57.1745886Z Password for user root: 
2025-09-29T05:06:57.1908741Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:06:57.2007801Z Postgres is unavailable - sleeping
2025-09-29T05:06:58.3819599Z Password for user root: 
2025-09-29T05:06:58.4088012Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:06:58.4145690Z Postgres is unavailable - sleeping
2025-09-29T05:06:59.5508127Z Password for user root: 
2025-09-29T05:06:59.5607778Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:06:59.5637883Z Postgres is unavailable - sleeping
2025-09-29T05:07:00.6890521Z Password for user root: 
2025-09-29T05:07:00.7108561Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:07:00.7158638Z Postgres is unavailable - sleeping
2025-09-29T05:07:01.8580079Z Password for user root: 
2025-09-29T05:07:01.8768691Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:07:01.8800668Z Postgres is unavailable - sleeping
2025-09-29T05:07:03.0176322Z Password for user root: 
2025-09-29T05:07:03.0298622Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:07:03.0437315Z Postgres is unavailable - sleeping
2025-09-29T05:07:04.2018140Z Password for user root: 
2025-09-29T05:07:04.2187709Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:07:04.2276491Z Postgres is unavailable - sleeping
2025-09-29T05:07:05.3486195Z Password for user root: 
2025-09-29T05:07:05.3549759Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:07:05.3607445Z Postgres is unavailable - sleeping
2025-09-29T05:07:06.5156107Z Password for user root: 
2025-09-29T05:07:06.5296011Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:07:06.5326318Z Postgres is unavailable - sleeping
2025-09-29T05:07:07.6440744Z Password for user root: 
2025-09-29T05:07:07.6566599Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:07:07.6603536Z Postgres is unavailable - sleeping
2025-09-29T05:07:08.7496506Z Password for user root: 
2025-09-29T05:07:08.7598993Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:07:08.7607950Z Postgres is unavailable - sleeping
2025-09-29T05:07:09.8875090Z Password for user root: 
2025-09-29T05:07:09.9028184Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:07:09.9088737Z Postgres is unavailable - sleeping
2025-09-29T05:07:11.0362948Z Password for user root: 
2025-09-29T05:07:11.0518732Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:07:11.0546641Z Postgres is unavailable - sleeping
2025-09-29T05:07:12.1868383Z Password for user root: 
2025-09-29T05:07:12.1996702Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:07:12.2023496Z Postgres is unavailable - sleeping
2025-09-29T05:07:13.3118963Z Password for user root: 
2025-09-29T05:07:13.3220529Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:07:13.3265212Z Postgres is unavailable - sleeping
2025-09-29T05:07:14.4180727Z Password for user root: 
2025-09-29T05:07:14.4253702Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:07:14.4317049Z Postgres is unavailable - sleeping
2025-09-29T05:07:15.5261345Z Password for user root: 
2025-09-29T05:07:15.5349464Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:07:15.5382920Z Postgres is unavailable - sleeping
2025-09-29T05:07:16.6346540Z Password for user root: 
2025-09-29T05:07:16.6446610Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:07:16.6475796Z Postgres is unavailable - sleeping
2025-09-29T05:07:17.7349584Z Password for user root: 
2025-09-29T05:07:17.7435234Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:07:17.7493080Z Postgres is unavailable - sleeping
2025-09-29T05:07:18.8388871Z Password for user root: 
2025-09-29T05:07:18.8512627Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:07:18.8542487Z Postgres is unavailable - sleeping
2025-09-29T05:07:19.9387814Z Password for user root: 
2025-09-29T05:07:19.9473893Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:07:19.9519072Z Postgres is unavailable - sleeping
2025-09-29T05:07:21.0369294Z Password for user root: 
2025-09-29T05:07:21.0469804Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:07:21.0480802Z Postgres is unavailable - sleeping
2025-09-29T05:07:22.1493439Z Password for user root: 
2025-09-29T05:07:22.1505509Z Postgres is unavailable - sleeping
2025-09-29T05:07:22.9679169Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:07:23.2432161Z Password for user root: 
2025-09-29T05:07:23.2569571Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:07:23.2575729Z Postgres is unavailable - sleeping
2025-09-29T05:07:24.3531495Z Password for user root: 
2025-09-29T05:07:24.3622927Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:07:24.3691851Z Postgres is unavailable - sleeping
2025-09-29T05:07:25.4685888Z Password for user root: 
2025-09-29T05:07:25.4806656Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:07:25.4854699Z Postgres is unavailable - sleeping
2025-09-29T05:07:26.5696487Z Password for user root: 
2025-09-29T05:07:26.5795025Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:07:26.5828371Z Postgres is unavailable - sleeping
2025-09-29T05:07:27.6805690Z Password for user root: 
2025-09-29T05:07:27.6916153Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:07:27.6978303Z Postgres is unavailable - sleeping
2025-09-29T05:07:28.7933684Z Password for user root: 
2025-09-29T05:07:28.8058132Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:07:28.8064649Z Postgres is unavailable - sleeping
2025-09-29T05:07:29.9795308Z Password for user root: 
2025-09-29T05:07:29.9958521Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:07:30.0018261Z Postgres is unavailable - sleeping
2025-09-29T05:07:31.0906922Z Password for user root: 
2025-09-29T05:07:31.1029104Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:07:31.1037587Z Postgres is unavailable - sleeping
2025-09-29T05:07:32.2688702Z Password for user root: 
2025-09-29T05:07:32.2888856Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:07:32.2939950Z Postgres is unavailable - sleeping
2025-09-29T05:07:33.4067580Z Password for user root: 
2025-09-29T05:07:33.4147802Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:07:33.4217993Z Postgres is unavailable - sleeping
2025-09-29T05:07:34.5116772Z Password for user root: 
2025-09-29T05:07:34.5206479Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:07:34.5229312Z Postgres is unavailable - sleeping
2025-09-29T05:07:35.6258097Z Password for user root: 
2025-09-29T05:07:35.6367708Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:07:35.6434698Z Postgres is unavailable - sleeping
2025-09-29T05:07:36.7359856Z Password for user root: 
2025-09-29T05:07:36.7473595Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:07:36.7481285Z Postgres is unavailable - sleeping
2025-09-29T05:07:37.8429872Z Password for user root: 
2025-09-29T05:07:37.8535865Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:07:37.8578709Z Postgres is unavailable - sleeping
2025-09-29T05:07:38.9397462Z Password for user root: 
2025-09-29T05:07:38.9487740Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:07:38.9528913Z Postgres is unavailable - sleeping
2025-09-29T05:07:40.0369581Z Password for user root: 
2025-09-29T05:07:40.0469721Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:07:40.0501561Z Postgres is unavailable - sleeping
2025-09-29T05:07:41.1680660Z Password for user root: 
2025-09-29T05:07:41.1811043Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:07:41.1847049Z Postgres is unavailable - sleeping
2025-09-29T05:07:42.3058019Z Password for user root: 
2025-09-29T05:07:42.3149555Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:07:42.3197692Z Postgres is unavailable - sleeping
2025-09-29T05:07:43.4087905Z Password for user root: 
2025-09-29T05:07:43.4187975Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:07:43.4196640Z Postgres is unavailable - sleeping
2025-09-29T05:07:44.5052514Z Password for user root: 
2025-09-29T05:07:44.5157699Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:07:44.5199135Z Postgres is unavailable - sleeping
2025-09-29T05:07:45.6713541Z Password for user root: 
2025-09-29T05:07:45.6861126Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:07:45.6909238Z Postgres is unavailable - sleeping
2025-09-29T05:07:46.7757964Z Password for user root: 
2025-09-29T05:07:46.7857409Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:07:46.7875088Z Postgres is unavailable - sleeping
2025-09-29T05:07:47.8918371Z Password for user root: 
2025-09-29T05:07:47.9039156Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:07:47.9078350Z Postgres is unavailable - sleeping
2025-09-29T05:07:48.9980500Z Password for user root: 
2025-09-29T05:07:49.0085955Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:07:49.0108758Z Postgres is unavailable - sleeping
2025-09-29T05:07:50.0978435Z Password for user root: 
2025-09-29T05:07:50.1069665Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:07:50.1119723Z Postgres is unavailable - sleeping
2025-09-29T05:07:51.2065776Z Password for user root: 
2025-09-29T05:07:51.2148905Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:07:51.2164977Z Postgres is unavailable - sleeping
2025-09-29T05:07:52.3040812Z Password for user root: 
2025-09-29T05:07:52.3119852Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:07:52.3153851Z Postgres is unavailable - sleeping
2025-09-29T05:07:53.4045411Z Password for user root: 
2025-09-29T05:07:53.4147417Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:07:53.4228171Z Postgres is unavailable - sleeping
2025-09-29T05:07:54.5081495Z Password for user root: 
2025-09-29T05:07:54.5225959Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:07:54.5270819Z Postgres is unavailable - sleeping
2025-09-29T05:07:55.6185547Z Password for user root: 
2025-09-29T05:07:55.6269177Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:07:55.6305826Z Postgres is unavailable - sleeping
2025-09-29T05:07:56.7446529Z Password for user root: 
2025-09-29T05:07:56.7538993Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:07:56.7565796Z Postgres is unavailable - sleeping
2025-09-29T05:07:57.8665226Z Password for user root: 
2025-09-29T05:07:57.8781107Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:07:57.8828102Z Postgres is unavailable - sleeping
2025-09-29T05:07:58.9865806Z Password for user root: 
2025-09-29T05:07:58.9976336Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:07:59.0046364Z Postgres is unavailable - sleeping
2025-09-29T05:08:00.0948131Z Password for user root: 
2025-09-29T05:08:00.1047327Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:08:00.1055043Z Postgres is unavailable - sleeping
2025-09-29T05:08:01.1955077Z Password for user root: 
2025-09-29T05:08:01.2157647Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:08:01.2158378Z Postgres is unavailable - sleeping
2025-09-29T05:08:02.3145377Z Password for user root: 
2025-09-29T05:08:02.3268818Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:08:02.3298300Z Postgres is unavailable - sleeping
2025-09-29T05:08:03.4722802Z Password for user root: 
2025-09-29T05:08:03.4862053Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:08:03.4930535Z Postgres is unavailable - sleeping
2025-09-29T05:08:04.6255934Z Password for user root: 
2025-09-29T05:08:04.6386917Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:08:04.6403386Z Postgres is unavailable - sleeping
2025-09-29T05:08:05.7693094Z Password for user root: 
2025-09-29T05:08:05.7810197Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:08:05.7849949Z Postgres is unavailable - sleeping
2025-09-29T05:08:06.8868619Z Password for user root: 
2025-09-29T05:08:06.8966924Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:08:06.8981031Z Postgres is unavailable - sleeping
2025-09-29T05:08:08.0065286Z Password for user root: 
2025-09-29T05:08:08.0177156Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:08:08.0227435Z Postgres is unavailable - sleeping
2025-09-29T05:08:09.1106397Z Password for user root: 
2025-09-29T05:08:09.1194592Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:08:09.1267632Z Postgres is unavailable - sleeping
2025-09-29T05:08:10.2128227Z Password for user root: 
2025-09-29T05:08:10.2247864Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:08:10.2278183Z Postgres is unavailable - sleeping
2025-09-29T05:08:11.3202254Z Password for user root: 
2025-09-29T05:08:11.3318172Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:08:11.3357487Z Postgres is unavailable - sleeping
2025-09-29T05:08:12.4273679Z Password for user root: 
2025-09-29T05:08:12.4357529Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:08:12.4398732Z Postgres is unavailable - sleeping
2025-09-29T05:08:13.5269232Z Password for user root: 
2025-09-29T05:08:13.5348444Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:08:13.5380864Z Postgres is unavailable - sleeping
2025-09-29T05:08:14.6624787Z Password for user root: 
2025-09-29T05:08:14.6735982Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:08:14.6778713Z Postgres is unavailable - sleeping
2025-09-29T05:08:15.7834951Z Password for user root: 
2025-09-29T05:08:15.7966614Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:08:15.7989701Z Postgres is unavailable - sleeping
2025-09-29T05:08:16.9168854Z Password for user root: 
2025-09-29T05:08:16.9302163Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:08:16.9351579Z Postgres is unavailable - sleeping
2025-09-29T05:08:18.0396890Z Password for user root: 
2025-09-29T05:08:18.0505712Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:08:18.0547164Z Postgres is unavailable - sleeping
2025-09-29T05:08:19.1645983Z Password for user root: 
2025-09-29T05:08:19.1778389Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:08:19.1790606Z Postgres is unavailable - sleeping
2025-09-29T05:08:20.2933400Z Password for user root: 
2025-09-29T05:08:20.3076219Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:08:20.3086426Z Postgres is unavailable - sleeping
2025-09-29T05:08:21.4151917Z Password for user root: 
2025-09-29T05:08:21.4229883Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:08:21.4278748Z Postgres is unavailable - sleeping
2025-09-29T05:08:22.5221278Z Password for user root: 
2025-09-29T05:08:22.5334902Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:08:22.5376999Z Postgres is unavailable - sleeping
2025-09-29T05:08:23.6257091Z Password for user root: 
2025-09-29T05:08:23.6365038Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:08:23.6366159Z Postgres is unavailable - sleeping
2025-09-29T05:08:24.7215163Z Password for user root: 
2025-09-29T05:08:24.7288978Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:08:24.7312501Z Postgres is unavailable - sleeping
2025-09-29T05:08:25.8349947Z Password for user root: 
2025-09-29T05:08:25.8516064Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:08:25.8549862Z Postgres is unavailable - sleeping
2025-09-29T05:08:26.9517444Z Password for user root: 
2025-09-29T05:08:26.9658977Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:08:26.9666097Z Postgres is unavailable - sleeping
2025-09-29T05:08:28.0547067Z Password for user root: 
2025-09-29T05:08:28.0638091Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:08:28.0655547Z Postgres is unavailable - sleeping
2025-09-29T05:08:29.1696428Z Password for user root: 
2025-09-29T05:08:29.1828065Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:08:29.1849052Z Postgres is unavailable - sleeping
2025-09-29T05:08:30.2824853Z Password for user root: 
2025-09-29T05:08:30.2949212Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:08:30.2959747Z Postgres is unavailable - sleeping
2025-09-29T05:08:31.3875606Z Password for user root: 
2025-09-29T05:08:31.3979449Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:08:31.4018024Z Postgres is unavailable - sleeping
2025-09-29T05:08:32.4898982Z Password for user root: 
2025-09-29T05:08:32.4998662Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:08:32.5039254Z Postgres is unavailable - sleeping
2025-09-29T05:08:33.5948435Z Password for user root: 
2025-09-29T05:08:33.6038333Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:08:33.6087990Z Postgres is unavailable - sleeping
2025-09-29T05:08:34.7090438Z Password for user root: 
2025-09-29T05:08:34.7218483Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:08:34.7263795Z Postgres is unavailable - sleeping
2025-09-29T05:08:35.8148440Z Password for user root: 
2025-09-29T05:08:35.8287272Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:08:35.8328806Z Postgres is unavailable - sleeping
2025-09-29T05:08:36.9186381Z Password for user root: 
2025-09-29T05:08:36.9313912Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:08:36.9367624Z Postgres is unavailable - sleeping
2025-09-29T05:08:38.0794853Z Password for user root: 
2025-09-29T05:08:38.0936049Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:08:38.0968524Z Postgres is unavailable - sleeping
2025-09-29T05:08:39.2062454Z Password for user root: 
2025-09-29T05:08:39.2177875Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:08:39.2228584Z Postgres is unavailable - sleeping
2025-09-29T05:08:40.3118070Z Password for user root: 
2025-09-29T05:08:40.3182057Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:08:40.3229665Z Postgres is unavailable - sleeping
2025-09-29T05:08:41.4119457Z Password for user root: 
2025-09-29T05:08:41.4231190Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:08:41.4248514Z Postgres is unavailable - sleeping
2025-09-29T05:08:42.5151950Z Password for user root: 
2025-09-29T05:08:42.5238057Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:08:42.5279059Z Postgres is unavailable - sleeping
2025-09-29T05:08:43.6141789Z Password for user root: 
2025-09-29T05:08:43.6209949Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:08:43.6248424Z Postgres is unavailable - sleeping
2025-09-29T05:08:44.7438940Z Password for user root: 
2025-09-29T05:08:44.7541987Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:08:44.7580661Z Postgres is unavailable - sleeping
2025-09-29T05:08:45.8502922Z Password for user root: 
2025-09-29T05:08:45.8595171Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:08:45.8627300Z Postgres is unavailable - sleeping
2025-09-29T05:08:46.9528489Z Password for user root: 
2025-09-29T05:08:46.9626142Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:08:46.9667598Z Postgres is unavailable - sleeping
2025-09-29T05:08:48.0792884Z Password for user root: 
2025-09-29T05:08:48.0946665Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:08:48.0976250Z Postgres is unavailable - sleeping
2025-09-29T05:08:49.1935973Z Password for user root: 
2025-09-29T05:08:49.2038903Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:08:49.2085138Z Postgres is unavailable - sleeping
2025-09-29T05:08:50.3139176Z Password for user root: 
2025-09-29T05:08:50.3295879Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:08:50.3316253Z Postgres is unavailable - sleeping
2025-09-29T05:08:51.4336032Z Password for user root: 
2025-09-29T05:08:51.4442339Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:08:51.4485498Z Postgres is unavailable - sleeping
2025-09-29T05:08:52.5405245Z Password for user root: 
2025-09-29T05:08:52.5515238Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:08:52.5536984Z Postgres is unavailable - sleeping
2025-09-29T05:08:53.6412318Z Password for user root: 
2025-09-29T05:08:53.6519325Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:08:53.6538846Z Postgres is unavailable - sleeping
2025-09-29T05:08:54.7396766Z Password for user root: 
2025-09-29T05:08:54.7498328Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:08:54.7529561Z Postgres is unavailable - sleeping
2025-09-29T05:08:55.8552320Z Password for user root: 
2025-09-29T05:08:55.8682845Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:08:55.8722197Z Postgres is unavailable - sleeping
2025-09-29T05:08:56.9786634Z Password for user root: 
2025-09-29T05:08:56.9870249Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:08:56.9919818Z Postgres is unavailable - sleeping
2025-09-29T05:08:58.0873900Z Password for user root: 
2025-09-29T05:08:58.0995160Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:08:58.1004925Z Postgres is unavailable - sleeping
2025-09-29T05:08:59.2106111Z Password for user root: 
2025-09-29T05:08:59.2188344Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:08:59.2224464Z Postgres is unavailable - sleeping
2025-09-29T05:09:00.3316609Z Password for user root: 
2025-09-29T05:09:00.3387576Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:09:00.3430665Z Postgres is unavailable - sleeping
2025-09-29T05:09:01.5013047Z Password for user root: 
2025-09-29T05:09:01.5208309Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:09:01.5237754Z Postgres is unavailable - sleeping
2025-09-29T05:09:02.8568154Z Password for user root: 
2025-09-29T05:09:02.8771469Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:09:02.8812376Z Postgres is unavailable - sleeping
2025-09-29T05:09:04.1257541Z Password for user root: 
2025-09-29T05:09:04.1419062Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:09:04.1470307Z Postgres is unavailable - sleeping
2025-09-29T05:09:05.3061086Z Password for user root: 
2025-09-29T05:09:05.3199028Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:09:05.3256963Z Postgres is unavailable - sleeping
2025-09-29T05:09:06.4676730Z Password for user root: 
2025-09-29T05:09:06.4779482Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:09:06.4839527Z Postgres is unavailable - sleeping
2025-09-29T05:09:07.6438636Z Password for user root: 
2025-09-29T05:09:07.6599254Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:09:07.6666111Z Postgres is unavailable - sleeping
2025-09-29T05:09:08.7997952Z Password for user root: 
2025-09-29T05:09:08.8178238Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:09:08.8271042Z Postgres is unavailable - sleeping
2025-09-29T05:09:09.9610096Z Password for user root: 
2025-09-29T05:09:09.9790269Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:09:09.9837878Z Postgres is unavailable - sleeping
2025-09-29T05:09:11.1140207Z Password for user root: 
2025-09-29T05:09:11.1257112Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:09:11.1297201Z Postgres is unavailable - sleeping
2025-09-29T05:09:12.2397599Z Password for user root: 
2025-09-29T05:09:12.2521979Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:09:12.2556034Z Postgres is unavailable - sleeping
2025-09-29T05:09:13.3615172Z Password for user root: 
2025-09-29T05:09:13.3725706Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:09:13.3746664Z Postgres is unavailable - sleeping
2025-09-29T05:09:14.5313278Z Password for user root: 
2025-09-29T05:09:14.5499511Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:09:14.5555858Z Postgres is unavailable - sleeping
2025-09-29T05:09:15.6685858Z Password for user root: 
2025-09-29T05:09:15.6798667Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:09:15.6832775Z Postgres is unavailable - sleeping
2025-09-29T05:09:16.7935385Z Password for user root: 
2025-09-29T05:09:16.8047516Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:09:16.8105894Z Postgres is unavailable - sleeping
2025-09-29T05:09:17.9026013Z Password for user root: 
2025-09-29T05:09:17.9117181Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:09:17.9135367Z Postgres is unavailable - sleeping
2025-09-29T05:09:19.0055567Z Password for user root: 
2025-09-29T05:09:19.0188054Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:09:19.0231669Z Postgres is unavailable - sleeping
2025-09-29T05:09:20.1312930Z Password for user root: 
2025-09-29T05:09:20.1425478Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:09:20.1470643Z Postgres is unavailable - sleeping
2025-09-29T05:09:21.2445700Z Password for user root: 
2025-09-29T05:09:21.2530175Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:09:21.2585524Z Postgres is unavailable - sleeping
2025-09-29T05:09:22.3549101Z Password for user root: 
2025-09-29T05:09:22.3670092Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:09:22.3696254Z Postgres is unavailable - sleeping
2025-09-29T05:09:23.4747993Z Password for user root: 
2025-09-29T05:09:23.4848625Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:09:23.4888228Z Postgres is unavailable - sleeping
2025-09-29T05:09:24.5930309Z Password for user root: 
2025-09-29T05:09:24.6036457Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:09:24.6088840Z Postgres is unavailable - sleeping
2025-09-29T05:09:25.7423671Z Password for user root: 
2025-09-29T05:09:25.7599242Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:09:25.7615591Z Postgres is unavailable - sleeping
2025-09-29T05:09:26.8786024Z Password for user root: 
2025-09-29T05:09:26.8938235Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:09:26.8960678Z Postgres is unavailable - sleeping
2025-09-29T05:09:28.0605703Z Password for user root: 
2025-09-29T05:09:28.0781634Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:09:28.0816371Z Postgres is unavailable - sleeping
2025-09-29T05:09:29.2085547Z Password for user root: 
2025-09-29T05:09:29.2277004Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:09:29.2311501Z Postgres is unavailable - sleeping
2025-09-29T05:09:30.3998646Z Password for user root: 
2025-09-29T05:09:30.4147140Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:09:30.4207483Z Postgres is unavailable - sleeping
2025-09-29T05:09:31.5161368Z Password for user root: 
2025-09-29T05:09:31.5295792Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:09:31.5338164Z Postgres is unavailable - sleeping
2025-09-29T05:09:32.6408878Z Password for user root: 
2025-09-29T05:09:32.6567590Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:09:32.6586774Z Postgres is unavailable - sleeping
2025-09-29T05:09:33.7774836Z Password for user root: 
2025-09-29T05:09:33.7968261Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:09:33.7997248Z Postgres is unavailable - sleeping
2025-09-29T05:09:34.9323327Z Password for user root: 
2025-09-29T05:09:34.9536991Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:09:34.9590509Z Postgres is unavailable - sleeping
2025-09-29T05:09:36.0481187Z Password for user root: 
2025-09-29T05:09:36.0596966Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:09:36.0616921Z Postgres is unavailable - sleeping
2025-09-29T05:09:37.1636105Z Password for user root: 
2025-09-29T05:09:37.1739786Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:09:37.1762633Z Postgres is unavailable - sleeping
2025-09-29T05:09:38.2848185Z Password for user root: 
2025-09-29T05:09:38.2946890Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:09:38.3006367Z Postgres is unavailable - sleeping
2025-09-29T05:09:39.3983157Z Password for user root: 
2025-09-29T05:09:39.4080051Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:09:39.4119859Z Postgres is unavailable - sleeping
2025-09-29T05:09:40.4997679Z Password for user root: 
2025-09-29T05:09:40.5087970Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:09:40.5100672Z Postgres is unavailable - sleeping
2025-09-29T05:09:41.6435438Z Password for user root: 
2025-09-29T05:09:41.6576710Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:09:41.6596930Z Postgres is unavailable - sleeping
2025-09-29T05:09:42.7480603Z Password for user root: 
2025-09-29T05:09:42.7565120Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:09:42.7625988Z Postgres is unavailable - sleeping
2025-09-29T05:09:43.8526576Z Password for user root: 
2025-09-29T05:09:43.8633490Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:09:43.8670570Z Postgres is unavailable - sleeping
2025-09-29T05:09:44.9517654Z Password for user root: 
2025-09-29T05:09:44.9627228Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:09:44.9682519Z Postgres is unavailable - sleeping
2025-09-29T05:09:46.0750043Z Password for user root: 
2025-09-29T05:09:46.0867543Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:09:46.0895510Z Postgres is unavailable - sleeping
2025-09-29T05:09:47.1830941Z Password for user root: 
2025-09-29T05:09:47.1949924Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:09:47.1985555Z Postgres is unavailable - sleeping
2025-09-29T05:09:48.3038117Z Password for user root: 
2025-09-29T05:09:48.3158627Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:09:48.3171118Z Postgres is unavailable - sleeping
2025-09-29T05:09:49.4380060Z Password for user root: 
2025-09-29T05:09:49.4477402Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:09:49.4551004Z Postgres is unavailable - sleeping
2025-09-29T05:09:50.5515872Z Password for user root: 
2025-09-29T05:09:50.5615904Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:09:50.5655632Z Postgres is unavailable - sleeping
2025-09-29T05:09:51.6818209Z Password for user root: 
2025-09-29T05:09:51.6949912Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:09:51.6980444Z Postgres is unavailable - sleeping
2025-09-29T05:09:52.8197406Z Password for user root: 
2025-09-29T05:09:52.8337403Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:09:52.8427487Z Postgres is unavailable - sleeping
2025-09-29T05:09:53.9622206Z Password for user root: 
2025-09-29T05:09:53.9759609Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:09:53.9799274Z Postgres is unavailable - sleeping
2025-09-29T05:09:55.1005577Z Password for user root: 
2025-09-29T05:09:55.1119880Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:09:55.1152674Z Postgres is unavailable - sleeping
2025-09-29T05:09:56.2233775Z Password for user root: 
2025-09-29T05:09:56.2346464Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:09:56.2396186Z Postgres is unavailable - sleeping
2025-09-29T05:09:57.3410063Z Password for user root: 
2025-09-29T05:09:57.3544746Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:09:57.3552073Z Postgres is unavailable - sleeping
2025-09-29T05:09:58.4568876Z Password for user root: 
2025-09-29T05:09:58.4687164Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:09:58.4715624Z Postgres is unavailable - sleeping
2025-09-29T05:09:59.5636883Z Password for user root: 
2025-09-29T05:09:59.5710618Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:09:59.5769043Z Postgres is unavailable - sleeping
2025-09-29T05:10:00.6708223Z Password for user root: 
2025-09-29T05:10:00.6855256Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:10:00.6875772Z Postgres is unavailable - sleeping
2025-09-29T05:10:02.1581256Z Password for user root: 
2025-09-29T05:10:02.1950787Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:10:02.1979245Z Postgres is unavailable - sleeping
2025-09-29T05:10:03.3937564Z Password for user root: 
2025-09-29T05:10:03.4520109Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:10:03.4539567Z Postgres is unavailable - sleeping
2025-09-29T05:10:04.6748689Z Password for user root: 
2025-09-29T05:10:04.7097108Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:10:04.7101039Z Postgres is unavailable - sleeping
2025-09-29T05:10:05.8779290Z Password for user root: 
2025-09-29T05:10:05.8920485Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:10:05.8960445Z Postgres is unavailable - sleeping
2025-09-29T05:10:07.0939245Z Password for user root: 
2025-09-29T05:10:07.1120161Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:10:07.1176663Z Postgres is unavailable - sleeping
2025-09-29T05:10:08.2581105Z Password for user root: 
2025-09-29T05:10:08.2727435Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:10:08.2777553Z Postgres is unavailable - sleeping
2025-09-29T05:10:09.4205599Z Password for user root: 
2025-09-29T05:10:09.4350641Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:10:09.4379490Z Postgres is unavailable - sleeping
2025-09-29T05:10:10.5590436Z Password for user root: 
2025-09-29T05:10:10.5708783Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:10:10.5756146Z Postgres is unavailable - sleeping
2025-09-29T05:10:11.7070866Z Password for user root: 
2025-09-29T05:10:11.7199088Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:10:11.7236340Z Postgres is unavailable - sleeping
2025-09-29T05:10:12.8577471Z Password for user root: 
2025-09-29T05:10:12.8710305Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:10:12.8748403Z Postgres is unavailable - sleeping
2025-09-29T05:10:13.9997281Z Password for user root: 
2025-09-29T05:10:14.0109096Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:10:14.0157203Z Postgres is unavailable - sleeping
2025-09-29T05:10:15.1575523Z Password for user root: 
2025-09-29T05:10:15.1759965Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:10:15.1800626Z Postgres is unavailable - sleeping
2025-09-29T05:10:16.2998760Z Password for user root: 
2025-09-29T05:10:16.3119854Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:10:16.3128485Z Postgres is unavailable - sleeping
2025-09-29T05:10:17.4151520Z Password for user root: 
2025-09-29T05:10:17.4276106Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:10:17.4346520Z Postgres is unavailable - sleeping
2025-09-29T05:10:18.5637065Z Password for user root: 
2025-09-29T05:10:18.5766170Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:10:18.5780350Z Postgres is unavailable - sleeping
2025-09-29T05:10:19.7135532Z Password for user root: 
2025-09-29T05:10:19.7260193Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:10:19.7296757Z Postgres is unavailable - sleeping
2025-09-29T05:10:20.8216113Z Password for user root: 
2025-09-29T05:10:20.8322010Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:10:20.8358801Z Postgres is unavailable - sleeping
2025-09-29T05:10:21.9249434Z Password for user root: 
2025-09-29T05:10:21.9357532Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:10:21.9365965Z Postgres is unavailable - sleeping
2025-09-29T05:10:23.1175045Z Password for user root: 
2025-09-29T05:10:23.1319888Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:10:23.1368838Z Postgres is unavailable - sleeping
2025-09-29T05:10:24.2544991Z Password for user root: 
2025-09-29T05:10:24.2659349Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:10:24.2726889Z Postgres is unavailable - sleeping
2025-09-29T05:10:25.3747456Z Password for user root: 
2025-09-29T05:10:25.3984508Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:10:25.3985229Z Postgres is unavailable - sleeping
2025-09-29T05:10:26.5239923Z Password for user root: 
2025-09-29T05:10:26.5381292Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:10:26.5422122Z Postgres is unavailable - sleeping
2025-09-29T05:10:27.6462193Z Password for user root: 
2025-09-29T05:10:27.6583070Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:10:27.6598978Z Postgres is unavailable - sleeping
2025-09-29T05:10:28.7575830Z Password for user root: 
2025-09-29T05:10:28.7608735Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:10:28.7667599Z Postgres is unavailable - sleeping
2025-09-29T05:10:29.8807931Z Password for user root: 
2025-09-29T05:10:29.8946558Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:10:29.8988439Z Postgres is unavailable - sleeping
2025-09-29T05:10:31.0025134Z Password for user root: 
2025-09-29T05:10:31.0137581Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:10:31.0158250Z Postgres is unavailable - sleeping
2025-09-29T05:10:32.1226914Z Password for user root: 
2025-09-29T05:10:32.1306983Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:10:32.1349088Z Postgres is unavailable - sleeping
2025-09-29T05:10:33.2440125Z Password for user root: 
2025-09-29T05:10:33.2571318Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:10:33.2608060Z Postgres is unavailable - sleeping
2025-09-29T05:10:34.3579008Z Password for user root: 
2025-09-29T05:10:34.3685438Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:10:34.3708710Z Postgres is unavailable - sleeping
2025-09-29T05:10:35.4891144Z Password for user root: 
2025-09-29T05:10:35.4989621Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:10:35.5026633Z Postgres is unavailable - sleeping
2025-09-29T05:10:36.5978877Z Password for user root: 
2025-09-29T05:10:36.6108151Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:10:36.6126688Z Postgres is unavailable - sleeping
2025-09-29T05:10:37.7092730Z Password for user root: 
2025-09-29T05:10:37.7204726Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:10:37.7247304Z Postgres is unavailable - sleeping
2025-09-29T05:10:38.8532968Z Password for user root: 
2025-09-29T05:10:38.8620404Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:10:38.8658612Z Postgres is unavailable - sleeping
2025-09-29T05:10:39.9560406Z Password for user root: 
2025-09-29T05:10:39.9647758Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:10:39.9660519Z Postgres is unavailable - sleeping
2025-09-29T05:10:41.0586555Z Password for user root: 
2025-09-29T05:10:41.0668008Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:10:41.0692604Z Postgres is unavailable - sleeping
2025-09-29T05:10:42.1695701Z Password for user root: 
2025-09-29T05:10:42.1800036Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:10:42.1857380Z Postgres is unavailable - sleeping
2025-09-29T05:10:43.2839097Z Password for user root: 
2025-09-29T05:10:43.2938581Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:10:43.2975224Z Postgres is unavailable - sleeping
2025-09-29T05:10:44.4036594Z Password for user root: 
2025-09-29T05:10:44.4147141Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:10:44.4206962Z Postgres is unavailable - sleeping
2025-09-29T05:10:45.5443342Z Password for user root: 
2025-09-29T05:10:45.5587424Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:10:45.5619218Z Postgres is unavailable - sleeping
2025-09-29T05:10:46.6577684Z Password for user root: 
2025-09-29T05:10:46.6681803Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:10:46.6706036Z Postgres is unavailable - sleeping
2025-09-29T05:10:47.7593540Z Password for user root: 
2025-09-29T05:10:47.7717290Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:10:47.7722277Z Postgres is unavailable - sleeping
2025-09-29T05:10:48.8843770Z Password for user root: 
2025-09-29T05:10:48.8985338Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:10:48.9017308Z Postgres is unavailable - sleeping
2025-09-29T05:10:49.9923488Z Password for user root: 
2025-09-29T05:10:50.0017106Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:10:50.0067039Z Postgres is unavailable - sleeping
2025-09-29T05:10:51.1108972Z Password for user root: 
2025-09-29T05:10:51.1200767Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:10:51.1215237Z Postgres is unavailable - sleeping
2025-09-29T05:10:52.2499978Z Password for user root: 
2025-09-29T05:10:52.2629389Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:10:52.2641935Z Postgres is unavailable - sleeping
2025-09-29T05:10:53.3597185Z Password for user root: 
2025-09-29T05:10:53.3743744Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:10:53.3779028Z Postgres is unavailable - sleeping
2025-09-29T05:10:54.5009479Z Password for user root: 
2025-09-29T05:10:54.5098319Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:10:54.5138305Z Postgres is unavailable - sleeping
2025-09-29T05:10:55.6163249Z Password for user root: 
2025-09-29T05:10:55.6245963Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:10:55.6295817Z Postgres is unavailable - sleeping
2025-09-29T05:10:56.7572181Z Password for user root: 
2025-09-29T05:10:56.7710365Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:10:56.7749184Z Postgres is unavailable - sleeping
2025-09-29T05:10:57.8683005Z Password for user root: 
2025-09-29T05:10:57.8773239Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:10:57.8793328Z Postgres is unavailable - sleeping
2025-09-29T05:10:58.9738190Z Password for user root: 
2025-09-29T05:10:58.9862661Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:10:58.9898139Z Postgres is unavailable - sleeping
2025-09-29T05:11:00.1256820Z Password for user root: 
2025-09-29T05:11:00.1399016Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:11:00.1424689Z Postgres is unavailable - sleeping
2025-09-29T05:11:01.2825373Z Password for user root: 
2025-09-29T05:11:01.2950760Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:11:01.2987209Z Postgres is unavailable - sleeping
2025-09-29T05:11:02.4426278Z Password for user root: 
2025-09-29T05:11:02.4559102Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:11:02.4592031Z Postgres is unavailable - sleeping
2025-09-29T05:11:03.5895414Z Password for user root: 
2025-09-29T05:11:03.6050190Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:11:03.6118515Z Postgres is unavailable - sleeping
2025-09-29T05:11:04.7357156Z Password for user root: 
2025-09-29T05:11:04.7517940Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:11:04.7530275Z Postgres is unavailable - sleeping
2025-09-29T05:11:05.8482549Z Password for user root: 
2025-09-29T05:11:05.8614730Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:11:05.8631589Z Postgres is unavailable - sleeping
2025-09-29T05:11:06.9669863Z Password for user root: 
2025-09-29T05:11:06.9738123Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:11:06.9797424Z Postgres is unavailable - sleeping
2025-09-29T05:11:08.0912297Z Password for user root: 
2025-09-29T05:11:08.1019998Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:11:08.1036104Z Postgres is unavailable - sleeping
2025-09-29T05:11:09.2305320Z Password for user root: 
2025-09-29T05:11:09.2429994Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:11:09.2457463Z Postgres is unavailable - sleeping
2025-09-29T05:11:10.3364631Z Password for user root: 
2025-09-29T05:11:10.3458381Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:11:10.3493070Z Postgres is unavailable - sleeping
2025-09-29T05:11:11.4462160Z Password for user root: 
2025-09-29T05:11:11.4575242Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:11:11.4576076Z Postgres is unavailable - sleeping
2025-09-29T05:11:12.5792914Z Password for user root: 
2025-09-29T05:11:12.5916161Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:11:12.5997726Z Postgres is unavailable - sleeping
2025-09-29T05:11:13.6910894Z Password for user root: 
2025-09-29T05:11:13.7012550Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:11:13.7038455Z Postgres is unavailable - sleeping
2025-09-29T05:11:14.7992758Z Password for user root: 
2025-09-29T05:11:14.8078981Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:11:14.8128516Z Postgres is unavailable - sleeping
2025-09-29T05:11:15.9042538Z Password for user root: 
2025-09-29T05:11:15.9139679Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:11:15.9151162Z Postgres is unavailable - sleeping
2025-09-29T05:11:17.0280737Z Password for user root: 
2025-09-29T05:11:17.0389510Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:11:17.0438652Z Postgres is unavailable - sleeping
2025-09-29T05:11:18.1512803Z Password for user root: 
2025-09-29T05:11:18.1630922Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:11:18.1703488Z Postgres is unavailable - sleeping
2025-09-29T05:11:19.2617985Z Password for user root: 
2025-09-29T05:11:19.2690896Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:11:19.2727559Z Postgres is unavailable - sleeping
2025-09-29T05:11:20.3907903Z Password for user root: 
2025-09-29T05:11:20.4028561Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:11:20.4066857Z Postgres is unavailable - sleeping
2025-09-29T05:11:21.4962265Z Password for user root: 
2025-09-29T05:11:21.5057048Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:11:21.5105154Z Postgres is unavailable - sleeping
2025-09-29T05:11:22.6197807Z Password for user root: 
2025-09-29T05:11:22.6376353Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:11:22.6381769Z Postgres is unavailable - sleeping
2025-09-29T05:11:23.7259753Z Password for user root: 
2025-09-29T05:11:23.7383698Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:11:23.7406174Z Postgres is unavailable - sleeping
2025-09-29T05:11:24.8247940Z Password for user root: 
2025-09-29T05:11:24.8369024Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:11:24.8406984Z Postgres is unavailable - sleeping
2025-09-29T05:11:25.9293859Z Password for user root: 
2025-09-29T05:11:25.9409531Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:11:25.9458805Z Postgres is unavailable - sleeping
2025-09-29T05:11:27.0565001Z Password for user root: 
2025-09-29T05:11:27.0667583Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:11:27.0696871Z Postgres is unavailable - sleeping
2025-09-29T05:11:28.1822353Z Password for user root: 
2025-09-29T05:11:28.1938409Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:11:28.1978020Z Postgres is unavailable - sleeping
2025-09-29T05:11:29.2976483Z Password for user root: 
2025-09-29T05:11:29.3070113Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:11:29.3118667Z Postgres is unavailable - sleeping
2025-09-29T05:11:30.4042481Z Password for user root: 
2025-09-29T05:11:30.4128756Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:11:30.4179689Z Postgres is unavailable - sleeping
2025-09-29T05:11:31.5191335Z Password for user root: 
2025-09-29T05:11:31.5307962Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:11:31.5330392Z Postgres is unavailable - sleeping
2025-09-29T05:11:32.6480578Z Password for user root: 
2025-09-29T05:11:32.6589802Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:11:32.6666489Z Postgres is unavailable - sleeping
2025-09-29T05:11:33.7897658Z Password for user root: 
2025-09-29T05:11:33.7969944Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:11:33.8029313Z Postgres is unavailable - sleeping
2025-09-29T05:11:34.9025921Z Password for user root: 
2025-09-29T05:11:34.9107451Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:11:34.9154975Z Postgres is unavailable - sleeping
2025-09-29T05:11:36.0112713Z Password for user root: 
2025-09-29T05:11:36.0179619Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:11:36.0236733Z Postgres is unavailable - sleeping
2025-09-29T05:11:37.1206248Z Password for user root: 
2025-09-29T05:11:37.1295180Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:11:37.1320674Z Postgres is unavailable - sleeping
2025-09-29T05:11:38.2616032Z Password for user root: 
2025-09-29T05:11:38.2759196Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:11:38.2811400Z Postgres is unavailable - sleeping
2025-09-29T05:11:39.3845479Z Password for user root: 
2025-09-29T05:11:39.3989919Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:11:39.3991133Z Postgres is unavailable - sleeping
2025-09-29T05:11:40.4965395Z Password for user root: 
2025-09-29T05:11:40.5118657Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:11:40.5188568Z Postgres is unavailable - sleeping
2025-09-29T05:11:41.6141940Z Password for user root: 
2025-09-29T05:11:41.6269394Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:11:41.6316162Z Postgres is unavailable - sleeping
2025-09-29T05:11:42.7389325Z Password for user root: 
2025-09-29T05:11:42.7518574Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:11:42.7532976Z Postgres is unavailable - sleeping
2025-09-29T05:11:43.8496904Z Password for user root: 
2025-09-29T05:11:43.8592906Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:11:43.8628767Z Postgres is unavailable - sleeping
2025-09-29T05:11:44.9715982Z Password for user root: 
2025-09-29T05:11:44.9818771Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:11:44.9866428Z Postgres is unavailable - sleeping
2025-09-29T05:11:46.0994664Z Password for user root: 
2025-09-29T05:11:46.1098760Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:11:46.1138767Z Postgres is unavailable - sleeping
2025-09-29T05:11:47.2049315Z Password for user root: 
2025-09-29T05:11:47.2159948Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:11:47.2199116Z Postgres is unavailable - sleeping
2025-09-29T05:11:48.3079676Z Password for user root: 
2025-09-29T05:11:48.3187321Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:11:48.3205302Z Postgres is unavailable - sleeping
2025-09-29T05:11:49.4069139Z Password for user root: 
2025-09-29T05:11:49.4175729Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:11:49.4207427Z Postgres is unavailable - sleeping
2025-09-29T05:11:50.5157417Z Password for user root: 
2025-09-29T05:11:50.5267160Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:11:50.5324609Z Postgres is unavailable - sleeping
2025-09-29T05:11:51.6538454Z Password for user root: 
2025-09-29T05:11:51.6680076Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:11:51.6700967Z Postgres is unavailable - sleeping
2025-09-29T05:11:52.7615596Z Password for user root: 
2025-09-29T05:11:52.7709433Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:11:52.7767409Z Postgres is unavailable - sleeping
2025-09-29T05:11:53.8646325Z Password for user root: 
2025-09-29T05:11:53.8733124Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:11:53.8768465Z Postgres is unavailable - sleeping
2025-09-29T05:11:54.9808703Z Password for user root: 
2025-09-29T05:11:54.9915806Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:11:54.9946105Z Postgres is unavailable - sleeping
2025-09-29T05:11:56.0953187Z Password for user root: 
2025-09-29T05:11:56.1078212Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:11:56.1109808Z Postgres is unavailable - sleeping
2025-09-29T05:11:57.2245107Z Password for user root: 
2025-09-29T05:11:57.2353423Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:11:57.2376504Z Postgres is unavailable - sleeping
2025-09-29T05:11:58.3626744Z Password for user root: 
2025-09-29T05:11:58.3710592Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:11:58.3780113Z Postgres is unavailable - sleeping
2025-09-29T05:11:59.5053188Z Password for user root: 
2025-09-29T05:11:59.5215948Z Postgres is unavailable - sleeping
2025-09-29T05:11:59.5217416Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:12:00.6437431Z Password for user root: 
2025-09-29T05:12:00.6580020Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:12:00.6619133Z Postgres is unavailable - sleeping
2025-09-29T05:12:01.7793338Z Password for user root: 
2025-09-29T05:12:01.7934588Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:12:01.7971796Z Postgres is unavailable - sleeping
2025-09-29T05:12:02.9035441Z Password for user root: 
2025-09-29T05:12:02.9128291Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:12:02.9178348Z Postgres is unavailable - sleeping
2025-09-29T05:12:04.0347403Z Password for user root: 
2025-09-29T05:12:04.0507671Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:12:04.0508957Z Postgres is unavailable - sleeping
2025-09-29T05:12:05.1469855Z Password for user root: 
2025-09-29T05:12:05.1598871Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:12:05.1605955Z Postgres is unavailable - sleeping
2025-09-29T05:12:06.2543669Z Password for user root: 
2025-09-29T05:12:06.2640252Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:12:06.2671543Z Postgres is unavailable - sleeping
2025-09-29T05:12:07.3658140Z Password for user root: 
2025-09-29T05:12:07.3727905Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:12:07.3777446Z Postgres is unavailable - sleeping
2025-09-29T05:12:08.4712933Z Password for user root: 
2025-09-29T05:12:08.4799860Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:12:08.4858171Z Postgres is unavailable - sleeping
2025-09-29T05:12:09.6145440Z Password for user root: 
2025-09-29T05:12:09.6287951Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:12:09.6336515Z Postgres is unavailable - sleeping
2025-09-29T05:12:10.7270827Z Password for user root: 
2025-09-29T05:12:10.7375530Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:12:10.7395895Z Postgres is unavailable - sleeping
2025-09-29T05:12:11.8405938Z Password for user root: 
2025-09-29T05:12:11.8502579Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:12:11.8531408Z Postgres is unavailable - sleeping
2025-09-29T05:12:12.9603404Z Password for user root: 
2025-09-29T05:12:12.9698480Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:12:12.9746808Z Postgres is unavailable - sleeping
2025-09-29T05:12:14.0791870Z Password for user root: 
2025-09-29T05:12:14.0908419Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:12:14.0941972Z Postgres is unavailable - sleeping
2025-09-29T05:12:15.1884537Z Password for user root: 
2025-09-29T05:12:15.1978504Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:12:15.2017178Z Postgres is unavailable - sleeping
2025-09-29T05:12:16.3041754Z Password for user root: 
2025-09-29T05:12:16.3129264Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:12:16.3195621Z Postgres is unavailable - sleeping
2025-09-29T05:12:17.4220643Z Password for user root: 
2025-09-29T05:12:17.4358557Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:12:17.4397494Z Postgres is unavailable - sleeping
2025-09-29T05:12:18.5378764Z Password for user root: 
2025-09-29T05:12:18.5486210Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:12:18.5527859Z Postgres is unavailable - sleeping
2025-09-29T05:12:19.6420793Z Password for user root: 
2025-09-29T05:12:19.6497617Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:12:19.6527174Z Postgres is unavailable - sleeping
2025-09-29T05:12:20.7565140Z Password for user root: 
2025-09-29T05:12:20.7689462Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:12:20.7735330Z Postgres is unavailable - sleeping
2025-09-29T05:12:21.8989632Z Password for user root: 
2025-09-29T05:12:21.9117954Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:12:21.9159857Z Postgres is unavailable - sleeping
2025-09-29T05:12:23.0239167Z Password for user root: 
2025-09-29T05:12:23.0341320Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:12:23.0382328Z Postgres is unavailable - sleeping
2025-09-29T05:12:24.1442794Z Password for user root: 
2025-09-29T05:12:24.1558003Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:12:24.1585024Z Postgres is unavailable - sleeping
2025-09-29T05:12:25.2532058Z Password for user root: 
2025-09-29T05:12:25.2669038Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:12:25.2689866Z Postgres is unavailable - sleeping
2025-09-29T05:12:26.3736381Z Password for user root: 
2025-09-29T05:12:26.3838886Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:12:26.3877161Z Postgres is unavailable - sleeping
2025-09-29T05:12:27.4888445Z Password for user root: 
2025-09-29T05:12:27.4976319Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:12:27.4996374Z Postgres is unavailable - sleeping
2025-09-29T05:12:28.6878760Z Password for user root: 
2025-09-29T05:12:28.6976445Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:12:28.7012907Z Postgres is unavailable - sleeping
2025-09-29T05:12:29.7957969Z Password for user root: 
2025-09-29T05:12:29.8068339Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:12:29.8079172Z Postgres is unavailable - sleeping
2025-09-29T05:12:30.9023210Z Password for user root: 
2025-09-29T05:12:30.9128488Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:12:30.9145516Z Postgres is unavailable - sleeping
2025-09-29T05:12:32.0076441Z Password for user root: 
2025-09-29T05:12:32.0177626Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:12:32.0185133Z Postgres is unavailable - sleeping
2025-09-29T05:12:33.1162332Z Password for user root: 
2025-09-29T05:12:33.1281343Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:12:33.1326940Z Postgres is unavailable - sleeping
2025-09-29T05:12:34.2381350Z Password for user root: 
2025-09-29T05:12:34.2505936Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:12:34.2529991Z Postgres is unavailable - sleeping
2025-09-29T05:12:35.3610214Z Password for user root: 
2025-09-29T05:12:35.3712527Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:12:35.3749752Z Postgres is unavailable - sleeping
2025-09-29T05:12:36.4677558Z Password for user root: 
2025-09-29T05:12:36.4787786Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:12:36.4820609Z Postgres is unavailable - sleeping
2025-09-29T05:12:37.6060926Z Password for user root: 
2025-09-29T05:12:37.6180047Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:12:37.6256083Z Postgres is unavailable - sleeping
2025-09-29T05:12:38.7209911Z Password for user root: 
2025-09-29T05:12:38.7319720Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:12:38.7347325Z Postgres is unavailable - sleeping
2025-09-29T05:12:39.8283849Z Password for user root: 
2025-09-29T05:12:39.8373249Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:12:39.8427338Z Postgres is unavailable - sleeping
2025-09-29T05:12:40.9322048Z Password for user root: 
2025-09-29T05:12:40.9422684Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:12:40.9433034Z Postgres is unavailable - sleeping
2025-09-29T05:12:42.0475546Z Password for user root: 
2025-09-29T05:12:42.0599199Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:12:42.0641172Z Postgres is unavailable - sleeping
2025-09-29T05:12:43.2029814Z Password for user root: 
2025-09-29T05:12:43.2135471Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:12:43.2207010Z Postgres is unavailable - sleeping
2025-09-29T05:12:44.3435830Z Password for user root: 
2025-09-29T05:12:44.3529609Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:12:44.3570495Z Postgres is unavailable - sleeping
2025-09-29T05:12:45.4539292Z Password for user root: 
2025-09-29T05:12:45.4658246Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:12:45.4667107Z Postgres is unavailable - sleeping
2025-09-29T05:12:46.5609966Z Password for user root: 
2025-09-29T05:12:46.5699287Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:12:46.5748796Z Postgres is unavailable - sleeping
2025-09-29T05:12:47.6973156Z Password for user root: 
2025-09-29T05:12:47.7106307Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:12:47.7148301Z Postgres is unavailable - sleeping
2025-09-29T05:12:48.8181455Z Password for user root: 
2025-09-29T05:12:48.8317571Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:12:48.8337143Z Postgres is unavailable - sleeping
2025-09-29T05:12:49.9349098Z Password for user root: 
2025-09-29T05:12:49.9459342Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:12:49.9497477Z Postgres is unavailable - sleeping
2025-09-29T05:12:51.0630540Z Password for user root: 
2025-09-29T05:12:51.0756225Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:12:51.0777175Z Postgres is unavailable - sleeping
2025-09-29T05:12:52.2108401Z Password for user root: 
2025-09-29T05:12:52.2278971Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:12:52.2377645Z Postgres is unavailable - sleeping
2025-09-29T05:12:53.3546560Z Password for user root: 
2025-09-29T05:12:53.3629454Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:12:53.3671617Z Postgres is unavailable - sleeping
2025-09-29T05:12:54.4546329Z Password for user root: 
2025-09-29T05:12:54.4647572Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:12:54.4664697Z Postgres is unavailable - sleeping
2025-09-29T05:12:55.5576368Z Password for user root: 
2025-09-29T05:12:55.5658333Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:12:55.5701513Z Postgres is unavailable - sleeping
2025-09-29T05:12:56.6619832Z Password for user root: 
2025-09-29T05:12:56.6728107Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:12:56.6775558Z Postgres is unavailable - sleeping
2025-09-29T05:12:57.7850493Z Password for user root: 
2025-09-29T05:12:57.7967195Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:12:57.8006880Z Postgres is unavailable - sleeping
2025-09-29T05:12:58.9220995Z Password for user root: 
2025-09-29T05:12:58.9338153Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:12:58.9355949Z Postgres is unavailable - sleeping
2025-09-29T05:13:00.0389311Z Password for user root: 
2025-09-29T05:13:00.0514653Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:13:00.0536108Z Postgres is unavailable - sleeping
2025-09-29T05:13:01.1438648Z Password for user root: 
2025-09-29T05:13:01.1547563Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:13:01.1566539Z Postgres is unavailable - sleeping
2025-09-29T05:13:02.3565930Z Password for user root: 
2025-09-29T05:13:02.3726875Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:13:02.3773322Z Postgres is unavailable - sleeping
2025-09-29T05:13:03.5191660Z Password for user root: 
2025-09-29T05:13:03.5348371Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:13:03.5386614Z Postgres is unavailable - sleeping
2025-09-29T05:13:04.6742247Z Password for user root: 
2025-09-29T05:13:04.6869400Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:13:04.6897292Z Postgres is unavailable - sleeping
2025-09-29T05:13:05.8235371Z Password for user root: 
2025-09-29T05:13:05.8377308Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:13:05.8400965Z Postgres is unavailable - sleeping
2025-09-29T05:13:06.9764891Z Password for user root: 
2025-09-29T05:13:06.9900022Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:13:06.9951647Z Postgres is unavailable - sleeping
2025-09-29T05:13:08.1021726Z Password for user root: 
2025-09-29T05:13:08.1128341Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:13:08.1143309Z Postgres is unavailable - sleeping
2025-09-29T05:13:09.2406809Z Password for user root: 
2025-09-29T05:13:09.2547805Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:13:09.2597764Z Postgres is unavailable - sleeping
2025-09-29T05:13:10.4382934Z Password for user root: 
2025-09-29T05:13:10.4528947Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:13:10.4562222Z Postgres is unavailable - sleeping
2025-09-29T05:13:11.5824867Z Password for user root: 
2025-09-29T05:13:11.5825625Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:13:11.5826299Z Postgres is unavailable - sleeping
2025-09-29T05:13:12.7132329Z Password for user root: 
2025-09-29T05:13:12.7259435Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:13:12.7298449Z Postgres is unavailable - sleeping
2025-09-29T05:13:13.8280384Z Password for user root: 
2025-09-29T05:13:13.8369012Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:13:13.8399210Z Postgres is unavailable - sleeping
2025-09-29T05:13:14.9450302Z Password for user root: 
2025-09-29T05:13:14.9548975Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:13:14.9588661Z Postgres is unavailable - sleeping
2025-09-29T05:13:16.0500005Z Password for user root: 
2025-09-29T05:13:16.0599198Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:13:16.0646742Z Postgres is unavailable - sleeping
2025-09-29T05:13:17.1678151Z Password for user root: 
2025-09-29T05:13:17.1805142Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:13:17.1847562Z Postgres is unavailable - sleeping
2025-09-29T05:13:18.3159177Z Password for user root: 
2025-09-29T05:13:18.3336283Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:13:18.3406283Z Postgres is unavailable - sleeping
2025-09-29T05:13:19.4715360Z Password for user root: 
2025-09-29T05:13:19.4851070Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:13:19.4896058Z Postgres is unavailable - sleeping
2025-09-29T05:13:20.6011385Z Password for user root: 
2025-09-29T05:13:20.6117244Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:13:20.6128154Z Postgres is unavailable - sleeping
2025-09-29T05:13:21.6997090Z Password for user root: 
2025-09-29T05:13:21.7095628Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:13:21.7127828Z Postgres is unavailable - sleeping
2025-09-29T05:13:22.8328239Z Password for user root: 
2025-09-29T05:13:22.8465602Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:13:22.8526918Z Postgres is unavailable - sleeping
2025-09-29T05:13:23.9816259Z Password for user root: 
2025-09-29T05:13:23.9957508Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:13:23.9978355Z Postgres is unavailable - sleeping
2025-09-29T05:13:25.0880616Z Password for user root: 
2025-09-29T05:13:25.0979250Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:13:25.1018566Z Postgres is unavailable - sleeping
2025-09-29T05:13:26.2621060Z Password for user root: 
2025-09-29T05:13:26.2749109Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:13:27.2628476Z Postgres is unavailable - sleeping
2025-09-29T05:13:27.3853509Z Password for user root: 
2025-09-29T05:13:27.3987662Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:13:27.3996543Z Postgres is unavailable - sleeping
2025-09-29T05:13:28.5160368Z Password for user root: 
2025-09-29T05:13:28.5277925Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:13:28.5317213Z Postgres is unavailable - sleeping
2025-09-29T05:13:29.6278357Z Password for user root: 
2025-09-29T05:13:29.6368443Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:13:29.6405691Z Postgres is unavailable - sleeping
2025-09-29T05:13:30.7379796Z Password for user root: 
2025-09-29T05:13:30.7495963Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:13:30.7515542Z Postgres is unavailable - sleeping
2025-09-29T05:13:31.8559451Z Password for user root: 
2025-09-29T05:13:31.8668658Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:13:31.8709923Z Postgres is unavailable - sleeping
2025-09-29T05:13:32.9637491Z Password for user root: 
2025-09-29T05:13:32.9720326Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:13:32.9787008Z Postgres is unavailable - sleeping
2025-09-29T05:13:34.1010035Z Password for user root: 
2025-09-29T05:13:34.1071679Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:13:34.1127781Z Postgres is unavailable - sleeping
2025-09-29T05:13:35.2512708Z Password for user root: 
2025-09-29T05:13:35.2637322Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:13:35.2662731Z Postgres is unavailable - sleeping
2025-09-29T05:13:36.3950428Z Password for user root: 
2025-09-29T05:13:36.4152094Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:13:36.4233385Z Postgres is unavailable - sleeping
2025-09-29T05:13:37.5304907Z Password for user root: 
2025-09-29T05:13:37.5418377Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:13:37.5459099Z Postgres is unavailable - sleeping
2025-09-29T05:13:38.6692276Z Password for user root: 
2025-09-29T05:13:38.6820873Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:13:38.6848700Z Postgres is unavailable - sleeping
2025-09-29T05:13:39.7913467Z Password for user root: 
2025-09-29T05:13:39.8018498Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:13:39.8035618Z Postgres is unavailable - sleeping
2025-09-29T05:13:40.8975813Z Password for user root: 
2025-09-29T05:13:40.9060879Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:13:40.9118673Z Postgres is unavailable - sleeping
2025-09-29T05:13:42.0307405Z Password for user root: 
2025-09-29T05:13:42.0437509Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:13:42.0490689Z Postgres is unavailable - sleeping
2025-09-29T05:13:43.1808081Z Password for user root: 
2025-09-29T05:13:43.1928841Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:13:43.2005011Z Postgres is unavailable - sleeping
2025-09-29T05:13:44.3239629Z Password for user root: 
2025-09-29T05:13:44.3366967Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:13:44.3397202Z Postgres is unavailable - sleeping
2025-09-29T05:13:45.4646000Z Password for user root: 
2025-09-29T05:13:45.4756002Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:13:45.4822396Z Postgres is unavailable - sleeping
2025-09-29T05:13:46.5929028Z Password for user root: 
2025-09-29T05:13:46.6038851Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:13:46.6081898Z Postgres is unavailable - sleeping
2025-09-29T05:13:47.7203035Z Password for user root: 
2025-09-29T05:13:47.7327884Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:13:47.7367848Z Postgres is unavailable - sleeping
2025-09-29T05:13:48.8399626Z Password for user root: 
2025-09-29T05:13:48.8535269Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:13:48.8536532Z Postgres is unavailable - sleeping
2025-09-29T05:13:49.9924834Z Password for user root: 
2025-09-29T05:13:50.0076274Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:13:50.0099914Z Postgres is unavailable - sleeping
2025-09-29T05:13:51.1361384Z Password for user root: 
2025-09-29T05:13:51.1489829Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:13:51.1534979Z Postgres is unavailable - sleeping
2025-09-29T05:13:52.3463697Z Password for user root: 
2025-09-29T05:13:52.3628001Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:13:52.3665308Z Postgres is unavailable - sleeping
2025-09-29T05:13:53.4762217Z Password for user root: 
2025-09-29T05:13:53.4898486Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:13:53.4910952Z Postgres is unavailable - sleeping
2025-09-29T05:13:54.5926789Z Password for user root: 
2025-09-29T05:13:54.6036296Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:13:54.6074638Z Postgres is unavailable - sleeping
2025-09-29T05:13:55.7368972Z Password for user root: 
2025-09-29T05:13:55.7497890Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:13:55.7538926Z Postgres is unavailable - sleeping
2025-09-29T05:13:56.8499177Z Password for user root: 
2025-09-29T05:13:56.8657399Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:13:56.8668120Z Postgres is unavailable - sleeping
2025-09-29T05:13:57.9615452Z Password for user root: 
2025-09-29T05:13:57.9708057Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:13:57.9748927Z Postgres is unavailable - sleeping
2025-09-29T05:13:59.0920928Z Password for user root: 
2025-09-29T05:13:59.0999133Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:13:59.1029902Z Postgres is unavailable - sleeping
2025-09-29T05:14:00.2169973Z Password for user root: 
2025-09-29T05:14:00.2304646Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:14:00.2321290Z Postgres is unavailable - sleeping
2025-09-29T05:14:01.3820907Z Password for user root: 
2025-09-29T05:14:01.3968891Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:14:01.4005905Z Postgres is unavailable - sleeping
2025-09-29T05:14:02.5336984Z Password for user root: 
2025-09-29T05:14:02.5458583Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:14:02.5509951Z Postgres is unavailable - sleeping
2025-09-29T05:14:03.6851549Z Password for user root: 
2025-09-29T05:14:03.7019903Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:14:03.7058540Z Postgres is unavailable - sleeping
2025-09-29T05:14:04.8286433Z Password for user root: 
2025-09-29T05:14:04.8415650Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:14:04.8441890Z Postgres is unavailable - sleeping
2025-09-29T05:14:05.9751656Z Password for user root: 
2025-09-29T05:14:05.9877263Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:14:05.9897402Z Postgres is unavailable - sleeping
2025-09-29T05:14:07.0919813Z Password for user root: 
2025-09-29T05:14:07.1019133Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:14:07.1066765Z Postgres is unavailable - sleeping
2025-09-29T05:14:08.2941242Z Password for user root: 
2025-09-29T05:14:08.3116831Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:14:08.3148949Z Postgres is unavailable - sleeping
2025-09-29T05:14:09.4501151Z Password for user root: 
2025-09-29T05:14:09.4626058Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:14:09.4696534Z Postgres is unavailable - sleeping
2025-09-29T05:14:10.5606221Z Password for user root: 
2025-09-29T05:14:10.5711378Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:14:10.5738535Z Postgres is unavailable - sleeping
2025-09-29T05:14:11.6734811Z Password for user root: 
2025-09-29T05:14:11.6846227Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:14:11.6867034Z Postgres is unavailable - sleeping
2025-09-29T05:14:12.7897638Z Password for user root: 
2025-09-29T05:14:12.8029929Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:14:12.8076701Z Postgres is unavailable - sleeping
2025-09-29T05:14:13.9330351Z Password for user root: 
2025-09-29T05:14:13.9457326Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:14:13.9516594Z Postgres is unavailable - sleeping
2025-09-29T05:14:15.0849258Z Password for user root: 
2025-09-29T05:14:15.0972687Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:14:15.1007823Z Postgres is unavailable - sleeping
2025-09-29T05:14:16.2454270Z Password for user root: 
2025-09-29T05:14:16.2589261Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:14:16.2659926Z Postgres is unavailable - sleeping
2025-09-29T05:14:17.3822902Z Password for user root: 
2025-09-29T05:14:17.3951042Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:14:17.3966481Z Postgres is unavailable - sleeping
2025-09-29T05:14:18.5110654Z Password for user root: 
2025-09-29T05:14:18.5209902Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:14:18.5260122Z Postgres is unavailable - sleeping
2025-09-29T05:14:19.6412776Z Password for user root: 
2025-09-29T05:14:19.6548307Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:14:19.6580845Z Postgres is unavailable - sleeping
2025-09-29T05:14:20.7922064Z Password for user root: 
2025-09-29T05:14:20.8077723Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:14:20.8117737Z Postgres is unavailable - sleeping
2025-09-29T05:14:21.9521526Z Password for user root: 
2025-09-29T05:14:21.9630208Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:14:21.9687910Z Postgres is unavailable - sleeping
2025-09-29T05:14:23.1082414Z Password for user root: 
2025-09-29T05:14:23.1226126Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:14:23.1268749Z Postgres is unavailable - sleeping
2025-09-29T05:14:24.2732878Z Password for user root: 
2025-09-29T05:14:24.2832069Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:14:24.2910787Z Postgres is unavailable - sleeping
2025-09-29T05:14:25.4497730Z Password for user root: 
2025-09-29T05:14:25.4605475Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:14:25.4647114Z Postgres is unavailable - sleeping
2025-09-29T05:14:26.5915128Z Password for user root: 
2025-09-29T05:14:26.6038047Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:14:26.6060093Z Postgres is unavailable - sleeping
2025-09-29T05:14:27.7399208Z Password for user root: 
2025-09-29T05:14:27.7528041Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:14:27.7564731Z Postgres is unavailable - sleeping
2025-09-29T05:14:28.8936655Z Password for user root: 
2025-09-29T05:14:28.9050484Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:14:28.9104480Z Postgres is unavailable - sleeping
2025-09-29T05:14:30.0382506Z Password for user root: 
2025-09-29T05:14:30.0516570Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:14:30.0546697Z Postgres is unavailable - sleeping
2025-09-29T05:14:31.1917182Z Password for user root: 
2025-09-29T05:14:31.2049988Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:14:31.2109672Z Postgres is unavailable - sleeping
2025-09-29T05:14:32.3032982Z Password for user root: 
2025-09-29T05:14:32.3146573Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:14:32.3176648Z Postgres is unavailable - sleeping
2025-09-29T05:14:33.4270281Z Password for user root: 
2025-09-29T05:14:33.4381923Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:14:33.4456733Z Postgres is unavailable - sleeping
2025-09-29T05:14:34.6384678Z Password for user root: 
2025-09-29T05:14:34.6527812Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:14:34.6577037Z Postgres is unavailable - sleeping
2025-09-29T05:14:35.7896503Z Password for user root: 
2025-09-29T05:14:35.8064655Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:14:35.8111927Z Postgres is unavailable - sleeping
2025-09-29T05:14:36.9215889Z Password for user root: 
2025-09-29T05:14:36.9334745Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:14:36.9353260Z Postgres is unavailable - sleeping
2025-09-29T05:14:38.0609323Z Password for user root: 
2025-09-29T05:14:38.0757023Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:14:38.0801482Z Postgres is unavailable - sleeping
2025-09-29T05:14:39.1757381Z Password for user root: 
2025-09-29T05:14:39.1885321Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:14:39.1908553Z Postgres is unavailable - sleeping
2025-09-29T05:14:40.2902976Z Password for user root: 
2025-09-29T05:14:40.3018099Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:14:40.3060566Z Postgres is unavailable - sleeping
2025-09-29T05:14:41.4037108Z Password for user root: 
2025-09-29T05:14:41.4128541Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:14:41.4169745Z Postgres is unavailable - sleeping
2025-09-29T05:14:42.5486445Z Password for user root: 
2025-09-29T05:14:42.5585761Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:14:42.5586887Z Postgres is unavailable - sleeping
2025-09-29T05:14:43.6585279Z Password for user root: 
2025-09-29T05:14:43.6687848Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:14:43.6716569Z Postgres is unavailable - sleeping
2025-09-29T05:14:44.7635293Z Password for user root: 
2025-09-29T05:14:44.7778437Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:14:44.7800351Z Postgres is unavailable - sleeping
2025-09-29T05:14:45.8906550Z Password for user root: 
2025-09-29T05:14:45.9043302Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:14:45.9080212Z Postgres is unavailable - sleeping
2025-09-29T05:14:47.0093864Z Password for user root: 
2025-09-29T05:14:47.0225889Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:14:47.0259262Z Postgres is unavailable - sleeping
2025-09-29T05:14:48.1354576Z Password for user root: 
2025-09-29T05:14:48.1477817Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:14:48.1487664Z Postgres is unavailable - sleeping
2025-09-29T05:14:49.2725477Z Password for user root: 
2025-09-29T05:14:49.2825532Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:14:49.2853855Z Postgres is unavailable - sleeping
2025-09-29T05:14:50.4121807Z Password for user root: 
2025-09-29T05:14:50.4208688Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:14:50.4265413Z Postgres is unavailable - sleeping
2025-09-29T05:14:51.5513303Z Password for user root: 
2025-09-29T05:14:51.5639050Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:14:51.5649825Z Postgres is unavailable - sleeping
2025-09-29T05:14:52.6858938Z Password for user root: 
2025-09-29T05:14:52.7049571Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:14:52.7121036Z Postgres is unavailable - sleeping
2025-09-29T05:14:53.8069624Z Password for user root: 
2025-09-29T05:14:53.8201335Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:14:53.8226270Z Postgres is unavailable - sleeping
2025-09-29T05:14:54.9528403Z Password for user root: 
2025-09-29T05:14:54.9639710Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:14:54.9685304Z Postgres is unavailable - sleeping
2025-09-29T05:14:56.0860253Z Password for user root: 
2025-09-29T05:14:56.0967281Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:14:56.0978174Z Postgres is unavailable - sleeping
2025-09-29T05:14:57.1883050Z Password for user root: 
2025-09-29T05:14:57.2017265Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:14:57.2058187Z Postgres is unavailable - sleeping
2025-09-29T05:14:58.2947150Z Password for user root: 
2025-09-29T05:14:58.3056430Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:14:58.3088838Z Postgres is unavailable - sleeping
2025-09-29T05:14:59.4227831Z Password for user root: 
2025-09-29T05:14:59.4370054Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:14:59.4407073Z Postgres is unavailable - sleeping
2025-09-29T05:15:00.5607041Z Password for user root: 
2025-09-29T05:15:00.5758947Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:15:00.5797343Z Postgres is unavailable - sleeping
2025-09-29T05:15:01.7437972Z Password for user root: 
2025-09-29T05:15:01.7561592Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:15:01.7638707Z Postgres is unavailable - sleeping
2025-09-29T05:15:02.9840460Z Password for user root: 
2025-09-29T05:15:02.9987897Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:15:03.0032177Z Postgres is unavailable - sleeping
2025-09-29T05:15:04.2712084Z Password for user root: 
2025-09-29T05:15:04.2907775Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:15:04.2991771Z Postgres is unavailable - sleeping
2025-09-29T05:15:05.4980438Z Password for user root: 
2025-09-29T05:15:05.5150659Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:15:05.5203802Z Postgres is unavailable - sleeping
2025-09-29T05:15:06.7365725Z Password for user root: 
2025-09-29T05:15:06.7518142Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:15:06.7567283Z Postgres is unavailable - sleeping
2025-09-29T05:15:07.9294979Z Password for user root: 
2025-09-29T05:15:07.9436876Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:15:07.9477693Z Postgres is unavailable - sleeping
2025-09-29T05:15:09.0751179Z Password for user root: 
2025-09-29T05:15:09.0907161Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:15:09.0925054Z Postgres is unavailable - sleeping
2025-09-29T05:15:10.2270522Z Password for user root: 
2025-09-29T05:15:10.2410190Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:15:10.2456417Z Postgres is unavailable - sleeping
2025-09-29T05:15:11.3850261Z Password for user root: 
2025-09-29T05:15:11.3998520Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:15:11.4048829Z Postgres is unavailable - sleeping
2025-09-29T05:15:12.5175488Z Password for user root: 
2025-09-29T05:15:12.5296476Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:15:12.5375824Z Postgres is unavailable - sleeping
2025-09-29T05:15:13.6607777Z Password for user root: 
2025-09-29T05:15:13.6736265Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:15:13.6789944Z Postgres is unavailable - sleeping
2025-09-29T05:15:14.7870811Z Password for user root: 
2025-09-29T05:15:14.8007415Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:15:14.8019778Z Postgres is unavailable - sleeping
2025-09-29T05:15:15.9307420Z Password for user root: 
2025-09-29T05:15:15.9456706Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:15:15.9535750Z Postgres is unavailable - sleeping
2025-09-29T05:15:17.0728836Z Password for user root: 
2025-09-29T05:15:17.0828425Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:15:17.0838028Z Postgres is unavailable - sleeping
2025-09-29T05:15:18.2225155Z Password for user root: 
2025-09-29T05:15:18.2358142Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:15:18.2401183Z Postgres is unavailable - sleeping
2025-09-29T05:15:19.3413564Z Password for user root: 
2025-09-29T05:15:19.3547043Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:15:19.3576332Z Postgres is unavailable - sleeping
2025-09-29T05:15:20.4638176Z Password for user root: 
2025-09-29T05:15:20.4731392Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:15:20.4767187Z Postgres is unavailable - sleeping
2025-09-29T05:15:21.6146422Z Password for user root: 
2025-09-29T05:15:21.6318308Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:15:21.6330389Z Postgres is unavailable - sleeping
2025-09-29T05:15:22.7716332Z Password for user root: 
2025-09-29T05:15:22.7845151Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:15:22.7881086Z Postgres is unavailable - sleeping
2025-09-29T05:15:23.9087981Z Password for user root: 
2025-09-29T05:15:23.9259094Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:15:23.9299044Z Postgres is unavailable - sleeping
2025-09-29T05:15:25.0305901Z Password for user root: 
2025-09-29T05:15:25.0389517Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:15:25.0406529Z Postgres is unavailable - sleeping
2025-09-29T05:15:26.1611364Z Password for user root: 
2025-09-29T05:15:26.1748411Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:15:26.1807804Z Postgres is unavailable - sleeping
2025-09-29T05:15:27.3734690Z Password for user root: 
2025-09-29T05:15:27.3735454Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:15:27.3736150Z Postgres is unavailable - sleeping
2025-09-29T05:15:28.4692495Z Password for user root: 
2025-09-29T05:15:28.4788654Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:15:28.4826771Z Postgres is unavailable - sleeping
2025-09-29T05:15:29.6111060Z Password for user root: 
2025-09-29T05:15:29.6232292Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:15:29.6251134Z Postgres is unavailable - sleeping
2025-09-29T05:15:30.7390546Z Password for user root: 
2025-09-29T05:15:30.7546525Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:15:30.7567741Z Postgres is unavailable - sleeping
2025-09-29T05:15:31.8618012Z Password for user root: 
2025-09-29T05:15:31.8725164Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:15:31.8736815Z Postgres is unavailable - sleeping
2025-09-29T05:15:33.0073779Z Password for user root: 
2025-09-29T05:15:33.0189819Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:15:33.0223708Z Postgres is unavailable - sleeping
2025-09-29T05:15:34.1384335Z Password for user root: 
2025-09-29T05:15:34.1517772Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:15:34.1537461Z Postgres is unavailable - sleeping
2025-09-29T05:15:35.2976964Z Password for user root: 
2025-09-29T05:15:35.3106858Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:15:35.3157793Z Postgres is unavailable - sleeping
2025-09-29T05:15:36.4494602Z Password for user root: 
2025-09-29T05:15:36.4588268Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:15:36.4629133Z Postgres is unavailable - sleeping
2025-09-29T05:15:37.5846740Z Password for user root: 
2025-09-29T05:15:37.5969344Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:15:37.6039737Z Postgres is unavailable - sleeping
2025-09-29T05:15:38.7166302Z Password for user root: 
2025-09-29T05:15:38.7290368Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:15:38.7328748Z Postgres is unavailable - sleeping
2025-09-29T05:15:39.8553488Z Password for user root: 
2025-09-29T05:15:39.8669951Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:15:39.8724948Z Postgres is unavailable - sleeping
2025-09-29T05:15:40.9994422Z Password for user root: 
2025-09-29T05:15:41.0119728Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:15:41.0158737Z Postgres is unavailable - sleeping
2025-09-29T05:15:42.1631061Z Password for user root: 
2025-09-29T05:15:42.1836643Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:15:42.1837741Z Postgres is unavailable - sleeping
2025-09-29T05:15:43.3198067Z Password for user root: 
2025-09-29T05:15:43.3360240Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:15:43.3396510Z Postgres is unavailable - sleeping
2025-09-29T05:15:44.4531363Z Password for user root: 
2025-09-29T05:15:44.4675386Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:15:44.4702465Z Postgres is unavailable - sleeping
2025-09-29T05:15:45.5743561Z Password for user root: 
2025-09-29T05:15:45.5859249Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:15:45.5880709Z Postgres is unavailable - sleeping
2025-09-29T05:15:46.7077472Z Password for user root: 
2025-09-29T05:15:46.7176402Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:15:46.7220060Z Postgres is unavailable - sleeping
2025-09-29T05:15:47.8562669Z Password for user root: 
2025-09-29T05:15:47.8646698Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:15:47.8688581Z Postgres is unavailable - sleeping
2025-09-29T05:15:48.9868454Z Password for user root: 
2025-09-29T05:15:48.9980389Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:15:48.9997597Z Postgres is unavailable - sleeping
2025-09-29T05:15:50.1387795Z Password for user root: 
2025-09-29T05:15:50.1550260Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:15:50.1583259Z Postgres is unavailable - sleeping
2025-09-29T05:15:51.2751386Z Password for user root: 
2025-09-29T05:15:51.2828807Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:15:51.2873079Z Postgres is unavailable - sleeping
2025-09-29T05:15:52.4197135Z Password for user root: 
2025-09-29T05:15:52.4318148Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:15:52.4359438Z Postgres is unavailable - sleeping
2025-09-29T05:15:53.6284875Z Password for user root: 
2025-09-29T05:15:53.6476104Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:15:53.6495415Z Postgres is unavailable - sleeping
2025-09-29T05:15:54.7575234Z Password for user root: 
2025-09-29T05:15:54.7696997Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:15:54.7749962Z Postgres is unavailable - sleeping
2025-09-29T05:15:55.8826001Z Password for user root: 
2025-09-29T05:15:55.8955273Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:15:55.8983689Z Postgres is unavailable - sleeping
2025-09-29T05:15:57.0058314Z Password for user root: 
2025-09-29T05:15:57.0147759Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:15:57.0184333Z Postgres is unavailable - sleeping
2025-09-29T05:15:58.1308184Z Password for user root: 
2025-09-29T05:15:58.1426173Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:15:58.1466294Z Postgres is unavailable - sleeping
2025-09-29T05:15:59.2898998Z Password for user root: 
2025-09-29T05:15:59.3056190Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:15:59.3085960Z Postgres is unavailable - sleeping
2025-09-29T05:16:00.4140547Z Password for user root: 
2025-09-29T05:16:00.4317011Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:16:00.4370083Z Postgres is unavailable - sleeping
2025-09-29T05:16:01.5632089Z Password for user root: 
2025-09-29T05:16:01.5749689Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:16:01.5785052Z Postgres is unavailable - sleeping
2025-09-29T05:16:02.7119630Z Password for user root: 
2025-09-29T05:16:02.7239392Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:16:02.7286820Z Postgres is unavailable - sleeping
2025-09-29T05:16:03.8587935Z Password for user root: 
2025-09-29T05:16:03.8696732Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:16:03.8748088Z Postgres is unavailable - sleeping
2025-09-29T05:16:04.9881395Z Password for user root: 
2025-09-29T05:16:05.0001272Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:16:05.0046618Z Postgres is unavailable - sleeping
2025-09-29T05:16:06.1151027Z Password for user root: 
2025-09-29T05:16:06.1278004Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:16:06.1305364Z Postgres is unavailable - sleeping
2025-09-29T05:16:07.2589281Z Password for user root: 
2025-09-29T05:16:07.2748855Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:16:07.2803349Z Postgres is unavailable - sleeping
2025-09-29T05:16:08.3873084Z Password for user root: 
2025-09-29T05:16:08.3974178Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:16:08.4010466Z Postgres is unavailable - sleeping
2025-09-29T05:16:09.5476148Z Password for user root: 
2025-09-29T05:16:09.5551202Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:16:09.5583335Z Postgres is unavailable - sleeping
2025-09-29T05:16:10.6692446Z Password for user root: 
2025-09-29T05:16:10.6837703Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:16:10.6847909Z Postgres is unavailable - sleeping
2025-09-29T05:16:11.7821896Z Password for user root: 
2025-09-29T05:16:11.7938915Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:16:11.7955371Z Postgres is unavailable - sleeping
2025-09-29T05:16:12.9210697Z Password for user root: 
2025-09-29T05:16:12.9331833Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:16:12.9370203Z Postgres is unavailable - sleeping
2025-09-29T05:16:14.0878132Z Password for user root: 
2025-09-29T05:16:14.1015783Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:16:14.1049640Z Postgres is unavailable - sleeping
2025-09-29T05:16:15.2062996Z Password for user root: 
2025-09-29T05:16:15.2208766Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:16:15.2225662Z Postgres is unavailable - sleeping
2025-09-29T05:16:16.3451463Z Password for user root: 
2025-09-29T05:16:16.3584631Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:16:16.3611989Z Postgres is unavailable - sleeping
2025-09-29T05:16:17.4797324Z Password for user root: 
2025-09-29T05:16:17.4910891Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:16:17.4948001Z Postgres is unavailable - sleeping
2025-09-29T05:16:18.6000458Z Password for user root: 
2025-09-29T05:16:18.6089409Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:16:18.6115403Z Postgres is unavailable - sleeping
2025-09-29T05:16:19.7390629Z Password for user root: 
2025-09-29T05:16:19.7470966Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:16:19.7525612Z Postgres is unavailable - sleeping
2025-09-29T05:16:20.8636347Z Password for user root: 
2025-09-29T05:16:20.8737660Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:16:20.8832407Z Postgres is unavailable - sleeping
2025-09-29T05:16:21.9951511Z Password for user root: 
2025-09-29T05:16:22.0099254Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:16:22.0120000Z Postgres is unavailable - sleeping
2025-09-29T05:16:23.1396282Z Password for user root: 
2025-09-29T05:16:23.1547687Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:16:23.1596727Z Postgres is unavailable - sleeping
2025-09-29T05:16:24.2704873Z Password for user root: 
2025-09-29T05:16:24.2837936Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:16:24.2848227Z Postgres is unavailable - sleeping
2025-09-29T05:16:25.3911755Z Password for user root: 
2025-09-29T05:16:25.4047687Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:16:25.4080228Z Postgres is unavailable - sleeping
2025-09-29T05:16:26.4951751Z Password for user root: 
2025-09-29T05:16:26.5057810Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:16:26.5076477Z Postgres is unavailable - sleeping
2025-09-29T05:16:27.6345799Z Password for user root: 
2025-09-29T05:16:27.6490519Z psql: error: connection to server at "db" (172.20.0.2), port 5432 failed: fe_sendauth: no password supplied
2025-09-29T05:16:27.6506236Z Postgres is unavailable - sleeping
2025-09-29T05:16:27.9134345Z ##[error]The operation was canceled.
2025-09-29T05:16:27.9420695Z Cleaning up orphan processes
2025-09-29T05:16:28.0922447Z Terminate orphan process: pid (1105612) (docker)
2025-09-29T05:16:28.1130105Z Terminate orphan process: pid (1105635) (docker-compose)
