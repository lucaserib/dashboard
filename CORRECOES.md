# Correções do Dashboard

## Problemas Identificados e Corrigidos

### 1. ✅ Tailwind CSS não estava aplicando estilos

**Problema:**
- O `globals.css` estava usando a sintaxe antiga do Tailwind v3
- Tailwind v4 requer uma sintaxe diferente

**Solução:**
- Atualizado `src/app/globals.css`:
  ```css
  @import "tailwindcss";
  ```

  (Antes era: `@tailwind base; @tailwind components; @tailwind utilities;`)

### 2. ✅ Erro de login - API não encontrada

**Problema:**
- A URL da API estava apontando para `https://www.medescalaapp.com.br`
- O endpoint `/auth/dashboard/login` não existe no backend em produção
- O backend não tem os endpoints de autenticação do dashboard ainda

**Solução:**
- Criados **API Routes do Next.js** como endpoints temporários:
  - `src/app/api/auth/dashboard/login/route.ts` - Login
  - `src/app/api/auth/dashboard/validate/route.ts` - Validação de token

- Atualizado `.env` para usar API local:
  ```env
  NEXT_PUBLIC_API_URL=http://localhost:3000
  ```

**Como funciona agora:**
1. O dashboard faz requisição para `/auth/dashboard/login`
2. O Next.js processa via API Route (não vai pro backend ainda)
3. Valida credenciais contra o mock hardcoded
4. Retorna JWT válido
5. Dashboard armazena token e permite acesso

## 🔑 Credenciais para Teste

- **Email**: `medescaladev@medescalaapp.com.br`
- **Senha**: `Admin2020`

## 🚀 Como Testar Agora

```bash
# No diretório do dashboard
cd /Users/lucasemanuelpereiraribeiro/Projects/dashboard

# Limpar cache (se necessário)
rm -rf .next

# Instalar dependências (se necessário)
npm install

# Rodar em desenvolvimento
npm run dev
```

Acesse: http://localhost:3000

## 📊 Estado Atual

- ✅ **Tailwind**: Funcionando
- ✅ **Login**: Funcionando (via API Routes mock)
- ✅ **Proteção de rotas**: Funcionando
- ✅ **Logout**: Funcionando
- ⚠️ **Endpoints de usuários**: Ainda dependem do backend real

## 🔄 Próximos Passos (Futuro)

### Opção 1: Manter API Routes do Next.js (Recomendado para desenvolvimento)
- ✅ Já está funcionando
- ✅ Não precisa do backend rodando
- ❌ Não acessa dados reais do banco

### Opção 2: Criar endpoints no backend NestJS
Criar no backend MedEscala:

```typescript
// backend/src/auth/auth.controller.ts (criar novo módulo)

@Post('dashboard/login')
async dashboardLogin(@Body() credentials: LoginDto) {
  // Validar contra tabela admin_users no banco
  // Retornar JWT
}

@Get('dashboard/validate')
@UseGuards(JwtAuthGuard)
async validateDashboard() {
  return { valid: true };
}
```

E adicionar Guard para proteger endpoints `/users`:
```typescript
@UseGuards(DashboardAuthGuard)
@Controller('users')
export class UsersController { ... }
```

## 📝 Notas Importantes

1. **Mock de autenticação**:
   - O usuário admin está hardcoded em `src/app/api/auth/dashboard/login/route.ts`
   - Senha hasheada com bcrypt: `$2b$10$WpEIqGcyKEbakJBZLpIrgujVwLsXVIzZtKw4Zgf2K5kQfZEcr5bBm`

2. **JWT Secret**:
   - Configurado em `.env`: `JWT_SECRET`
   - Mesmo secret usado para gerar e validar tokens

3. **Endpoints de usuários**:
   - Ainda apontam para o backend real em `http://localhost:3000/users`
   - Requerem que o backend esteja rodando na porta 3000
   - Para testar sem backend, seria necessário criar mocks para esses endpoints também

## 🎯 Recomendação

Para desenvolvimento completo do dashboard sem depender do backend:

1. Criar mais API Routes mockadas:
   - `GET /api/users` - Lista de usuários mock
   - `GET /api/users/stats` - Estatísticas mock
   - `GET /api/users/[id]` - Usuário específico mock
   - etc.

2. Ou conectar ao banco de dados diretamente do Next.js:
   - Usar Prisma Client no Next.js
   - Acessar o banco PostgreSQL diretamente
   - Criar API Routes que consultam o banco

**Ou simplesmente rodar o backend junto:**
```bash
# Terminal 1: Backend
cd /Users/lucasemanuelpereiraribeiro/Projects/MedEscala/backend
npm run start:dev

# Terminal 2: Dashboard
cd /Users/lucasemanuelpereiraribeiro/Projects/dashboard
npm run dev
```

E mudar o `.env` do dashboard para:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```
(Assumindo que o backend roda na 3001)
