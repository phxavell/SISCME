# Guia de Instalação

Este documento fornece instruções detalhadas para instalar e configurar o SISCME, um sistema de gerenciamento para Central de Material e Esterilização (CME), utilizando Django/DRF para o backend e React.js para o frontend.

## 📋 Pré-requisitos

Antes de iniciar a instalação, certifique-se de ter os seguintes pré-requisitos configurados em seu sistema:

### Para instação sem Docker:

- Python 3.10 ou superior
- Node.js 18 ou superior
- PostgreSQL 12 ou superior

### Para instalação com Docker:

- Docker 20.10 ou superior
- Docker Compose 1.29 ou superior

# 📦 Implantação do projeto para desenvolvimento em Windows ou Linux com Docker (**recomendado**)

Para rodar um ambiente em Windows sem container, utilize:

> 1. Acesse o [**Azure DevOps**](https://dev.azure.com/gbringel) do Grupo Bringel

> 2. Clone o repositório do projeto:

```bash
git clone https://gbringel@dev.azure.com/gbringel/SISCME/_git/SISCME siscme
```

> 3. Acesse a pasta do projeto:

```bash
cd siscme
```

> 4. Crie um arquivo `.env` para o frontend e um para o backend, com base nos arquivos `.env.example`:

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

> 5. Crie um volume para o banco de dados:

```bash
docker volume create siscme_dbdata
```

> 6. Inicie o projeto com o Docker Compose:

```bash
docker-compose up -d --build
```

> 7. Execute as migrações do banco de dados:

```bash
docker compose run --rm backend python manage.py migrate --fake-initial
```

Automaticamente, é criado um usuário administrador com as seguintes credenciais:

- **Usuário**: administrador
- **Senha**: siscme@2024 (ano corrente, altera-se a cada ano)

Agora, você pode acessar o sistema nos seguintes endereços:

- **Frontend**: http://localhost:8081
- **Backend**: http://localhost:8000/admin
- **API**: http://localhost:8000/api/
- **Documentação da API**: http://localhost:8000/api/swagger/

# 📦 Implantação do projeto em Windows ou Linux sem Docker

// TODO: Adicionar instruções para instalação sem Docker
