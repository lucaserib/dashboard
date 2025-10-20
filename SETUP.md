# Setup do Dashboard MedEscala

## 1. Configuração do Banco de Dados

### Executar o script SQL para criar o usuário admin

Você precisa executar o arquivo `seed-admin.sql` no banco de dados PostgreSQL.

**Opção 1: Usando psql (linha de comando)**

```bash
PGPASSWORD='npg_r9I4VxTZPhdN' psql \
  -h ep-round-snowflake-a59wxtjq-pooler.us-east-2.aws.neon.tech \
  -U neondb_owner \
  -d neondb \
  -f seed-admin.sql
```

**Opção 2: Usando o console do Neon DB**

1. Acesse https://console.neon.tech/
2. Faça login na sua conta
3. Selecione o projeto MedEscala
4. Vá em "SQL Editor"
5. Copie e cole o conteúdo do arquivo `seed-admin.sql`
6. Execute o script

**Opção 3: Usando qualquer cliente PostgreSQL (DBeaver, pgAdmin, etc.)**

1. Conecte-se ao banco de dados usando as credenciais:
   - Host: `ep-round-snowflake-a59wxtjq-pooler.us-east-2.aws.neon.tech`
   - Database: `neondb`
   - User: `neondb_owner`
   - Password: `npg_r9I4VxTZPhdN`
   - SSL Mode: require
2. Abra e execute o arquivo `seed-admin.sql`

## 2. Credenciais do Admin

Após executar o script SQL, você poderá fazer login com:

- **Email**: `medescaladev@medescalaapp.com.br`
- **Senha**: `Admin2020`

## 3. Executar o Dashboard

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build
npm start
```

## 4. Acessar o Dashboard

Abra o navegador e acesse: http://localhost:3000

Você será redirecionado automaticamente para a página de login.

## 5. Estrutura de Autenticação

O dashboard agora usa **autenticação JWT simples** sem dependência do Clerk:

- **Login**: `/login`
- **Dashboard**: `/` (protegido por autenticação)
- **Token JWT**: Armazenado em cookies com expiração de 7 dias
- **API Backend**: Todas as chamadas incluem o token JWT no header `Authorization`

## 6. Variáveis de Ambiente

O arquivo `.env` já está configurado com:

```env
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_API_URL=https://www.medescalaapp.com.br
JWT_SECRET="medescala-dashboard-secret-2025-secure-key"
```

## 7. Segurança

⚠️ **IMPORTANTE**:

- O usuário admin só pode ser criado diretamente no banco de dados
- Não há endpoint de registro público
- Altere o `JWT_SECRET` em produção para um valor mais seguro
- A senha do admin está hasheada com bcrypt (10 rounds)

## 8. Endpoints do Backend Necessários

O dashboard espera que o backend tenha os seguintes endpoints:

### Autenticação
- `POST /auth/dashboard/login` - Login do admin
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
  Response:
  ```json
  {
    "token": "string",
    "user": {
      "email": "string",
      "name": "string"
    }
  }
  ```

- `GET /auth/dashboard/validate` - Validar token JWT

### Usuários
- `GET /users` - Listar todos os usuários (com filtros opcionais)
- `GET /users/stats` - Estatísticas dos usuários
- `GET /users/:id` - Detalhes de um usuário
- `PATCH /users/:id` - Atualizar usuário
- `DELETE /users/:id` - Excluir usuário

Todos os endpoints (exceto login) devem exigir autenticação via JWT no header:
```
Authorization: Bearer <token>
```
