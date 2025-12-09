# AlbiEmprego Backend API

Backend da plataforma AlbiEmprego - API RESTful para emprego regional em Castelo Branco, Portugal.

## 🚀 Stack Tecnológico

- **Node.js** (Latest LTS)
- **TypeScript** (Strict mode)
- **Express** - Framework web
- **Prisma ORM** - ORM para PostgreSQL
- **PostgreSQL** - Base de dados
- **Redis** - Cache e sessões
- **JWT** - Autenticação
- **Jest** - Testes
- **Docker** - Containerização

## 📋 Pré-requisitos

- Node.js >= 18.x
- Docker e Docker Compose
- npm ou yarn

## 🛠️ Instalação

### 1. Clonar o repositório

```bash
cd backend
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env` com as suas configurações:

```env
# Servidor
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/albiemprego?schema=public

# Redis
REDIS_URL=redis://localhost:6379

# JWT (ALTERAR EM PRODUÇÃO!)
JWT_SECRET=seu_jwt_secret_super_secreto_e_seguro_aqui_minimo_32_caracteres
JWT_REFRESH_SECRET=seu_refresh_secret_super_secreto_e_seguro_aqui_minimo_32_caracteres

# Email SMTP (opcional para desenvolvimento)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seu_email@gmail.com
SMTP_PASSWORD=sua_senha_ou_app_password
EMAIL_FROM=noreply@albiemprego.pt
```

### 4. Iniciar Docker (PostgreSQL + Redis)

```bash
npm run docker:up
```

### 5. Executar migrações do Prisma

```bash
npm run prisma:migrate
```

### 6. (Opcional) Popular base de dados com dados de teste

```bash
npm run prisma:seed
```

Credenciais de teste:
- **Admin**: `admin@albiemprego.pt` / `Admin123!`
- **Candidato**: `joao.silva@example.com` / `Candidato123!`
- **Empresa**: `rh@techsolutions.pt` / `Empresa123!`

### 7. Iniciar servidor de desenvolvimento

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3001`

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Iniciar servidor em modo watch
npm run docker:up        # Iniciar containers Docker
npm run docker:down      # Parar containers Docker
npm run docker:logs      # Ver logs dos containers

# Prisma
npm run prisma:generate  # Gerar Prisma Client
npm run prisma:migrate   # Criar/aplicar migrações
npm run prisma:studio    # Abrir Prisma Studio (GUI)
npm run prisma:seed      # Popular BD com dados de teste

# Testes
npm test                 # Executar todos os testes com coverage
npm run test:watch       # Executar testes em modo watch
npm run test:unit        # Executar apenas testes unitários
npm run test:integration # Executar apenas testes de integração

# Qualidade de código
npm run lint             # Executar linter
npm run format           # Formatar código
```

## 🏗️ Estrutura do Projeto

```
backend/
├── src/
│   ├── config/           # Configurações (database, redis, logger, etc)
│   ├── controllers/      # Controllers (lógica request/response)
│   ├── services/         # Lógica de negócio
│   ├── repositories/     # Acesso a dados (Prisma)
│   ├── middlewares/      # Middlewares (auth, validation, error)
│   ├── routes/           # Definição de rotas
│   ├── types/            # TypeScript interfaces e types
│   ├── utils/            # Funções utilitárias
│   ├── validators/       # Schemas de validação
│   ├── app.ts            # Configuração Express
│   └── server.ts         # Entry point
├── prisma/
│   ├── schema.prisma     # Schema do banco de dados
│   ├── migrations/       # Migrações
│   └── seed.ts           # Seed data
├── tests/
│   ├── unit/             # Testes unitários
│   ├── integration/      # Testes de integração
│   └── setup.ts          # Setup de testes
├── docker-compose.yml    # PostgreSQL + Redis
└── package.json
```

## 🔐 Autenticação

A API utiliza JWT (JSON Web Tokens) para autenticação:

- **Access Token**: Expira em 15 minutos
- **Refresh Token**: Expira em 7 dias

### Exemplo de uso:

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "joao.silva@example.com",
  "password": "Candidato123!"
}
```

Resposta:

```json
{
  "user": {
    "id": "...",
    "email": "joao.silva@example.com",
    "name": "João Silva",
    "type": "CANDIDATO",
    "status": "ACTIVE"
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "expiresIn": 900
}
```

Para endpoints protegidos, adicione o header:

```http
Authorization: Bearer {accessToken}
```

## 📚 Endpoints Principais

### Autenticação
- `POST /api/v1/auth/register` - Registar novo utilizador
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Renovar access token
- `POST /api/v1/auth/logout` - Logout
- `POST /api/v1/auth/forgot-password` - Solicitar reset de password
- `POST /api/v1/auth/reset-password` - Resetar password

### Health Check
- `GET /health` - Verificar estado do servidor

Consulte a documentação completa em `/albiemprego/docs/API.md`

## 🧪 Testes

O projeto utiliza Jest para testes unitários e de integração.

```bash
# Executar todos os testes
npm test

# Ver coverage
npm test -- --coverage

# Modo watch
npm run test:watch
```

### Coverage atual:
- Statements: ~70%
- Branches: ~53%
- Functions: ~71%
- Lines: ~70%

## 🐳 Docker

### Containers disponíveis:
- **PostgreSQL**: porta 5432
- **Redis**: porta 6379

```bash
# Ver logs
docker logs albiemprego_postgres
docker logs albiemprego_redis

# Aceder ao PostgreSQL
docker exec -it albiemprego_postgres psql -U postgres -d albiemprego

# Aceder ao Redis
docker exec -it albiemprego_redis redis-cli
```

## 🔧 Troubleshooting

### PostgreSQL não inicia

```bash
# Remover volumes e recriar
npm run docker:down
docker volume rm backend_postgres_data
npm run docker:up
```

### Erros de migração

```bash
# Reset completo do banco
npx prisma migrate reset
npm run prisma:migrate
npm run prisma:seed
```

### Portas em uso

Verifique se as portas 3001, 5432 e 6379 estão disponíveis:

```bash
# Linux/Mac
lsof -i :3001
lsof -i :5432
lsof -i :6379

# Windows
netstat -ano | findstr :3001
```

## 📖 Documentação Adicional

- [Contratos de API](/albiemprego/docs/API.md)
- [Fluxos de Utilizador](/albiemprego/docs/FLOWS.md)
- [Componentes Frontend](/albiemprego/docs/COMPONENTS.md)

## 🚦 Status do Projeto

✅ Sistema de Autenticação completo  
✅ Validações e Error Handling  
✅ Testes Unitários e de Integração  
✅ Rate Limiting  
✅ Logs estruturados  
✅ Docker Setup  
⏳ Módulo de Utilizadores (próximo)  
⏳ Módulo de Vagas (próximo)  
⏳ Módulo de Candidaturas (próximo)  
⏳ Sistema de Mensagens (próximo)  
⏳ Painel Admin (próximo)  

## 👥 Equipa

Desenvolvido pela equipa AlbiEmprego

## 📄 Licença

MIT

---

**Nota**: Este é um projeto em desenvolvimento. Nunca execute `npm run build` - utilize sempre `npm run dev` para desenvolvimento.

