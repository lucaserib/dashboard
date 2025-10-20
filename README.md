# Dashboard MedEscala

Dashboard administrativo **read-only** para visualização de dados dos usuários da plataforma MedEscala em produção.

## ⚠️ Importante

Este dashboard é **somente leitura** - não realiza nenhuma modificação no banco de dados de produção do MedEscala. Serve apenas para visualização estatística e controle de informações dos usuários.

## Funcionalidades

- **Visão Geral**: Estatísticas gerais dos usuários em tempo real
- **Listagem de Usuários**: Tabela profissional com busca e filtros (iOS/Android/CNPJ)
- **Detalhes Completos**: Modal com abas para dados pessoais, plantões, CNPJ e dispositivos
- **Estatísticas**: Plantões totais, receita, locais, contratantes
- **Autenticação**: Login com credenciais de admin
- **Interface Profissional**: Design limpo usando shadcn/ui

## Tecnologias

- **Next.js 15.5.6** - Framework React com Turbopack
- **TypeScript** - Tipagem estática
- **Tailwind CSS v4** - Estilização
- **shadcn/ui** - Componentes UI profissionais
- **Prisma** - ORM para acesso ao banco de dados
- **PostgreSQL** - Banco de dados (Neon)
- **Lucide React** - Ícones
- **JWT** - Autenticação com tokens

## Estrutura do Projeto

```
src/
├── app/                    # Páginas do Next.js
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página inicial do dashboard
│   └── sign-in/           # Páginas de autenticação
├── components/            # Componentes React
│   ├── auth/              # Componentes de autenticação
│   ├── dashboard/         # Componentes do dashboard
│   └── ui/                # Componentes de UI reutilizáveis
├── lib/                   # Utilitários e configurações
├── services/              # Serviços de API
└── types/                 # Definições de tipos TypeScript
```

## Configuração

1. **Instalar dependências**:
   ```bash
   npm install
   ```

2. **Configurar variáveis de ambiente**:
   Crie um arquivo `.env` com:
   ```env
   DATABASE_URL="postgresql://..."
   JWT_SECRET="medescala-dashboard-secret-2025-secure-key"
   ```

3. **Gerar Prisma Client**:
   ```bash
   npx prisma generate
   ```

4. **Executar em desenvolvimento**:
   ```bash
   npm run dev
   ```

5. **Acessar o dashboard**:
   - URL: `http://localhost:3000/login`
   - Email: `medescaladev@medescalaapp.com.br`
   - Senha: `Admin2020`

6. **Build para produção**:
   ```bash
   npm run build
   npm start
   ```

## Integração com Banco de Dados

O dashboard se conecta diretamente ao banco de dados de produção do MedEscala via Prisma (modo read-only):

- Utiliza o mesmo schema do backend principal
- Queries otimizadas com relacionamentos (plantões, locais, contratantes, dispositivos)
- **Nenhuma operação de escrita** (UPDATE/DELETE/CREATE foram removidas)
- Conexão segura via PostgreSQL (Neon)

## Dados Exibidos

### Estatísticas Gerais
- Total de usuários
- Usuários ativos
- Usuários com CNPJ
- Usuários com locais
- Usuários com contratantes
- Total de plantões
- Receita total
- Média de plantões por usuário

### Informações dos Usuários
- **Dados Pessoais**: Nome, email, telefone, gênero, data de nascimento, idade
- **Plantões**: Lista completa com local, contratante, valor, tipo (fixo/variável), status de pagamento
- **Receita**: Cálculo automático da receita total de todos os plantões
- **Dados de CNPJ**: Empresa, número CNPJ, contabilidade, taxa mensal
- **Dispositivos**: Plataforma (iOS/Android), versão do app, último uso, status ativo/inativo
- **Relacionamentos**: Contagem de locais e contratantes vinculados

### Interface
- **Busca**: Pesquisa por nome, email ou telefone
- **Filtros**: iOS, Android, Com CNPJ
- **Modal de Detalhes**: 4 abas (Dados Pessoais, Plantões, CNPJ, Dispositivos)
- **Cards Coloridos**: Estatísticas visuais com cores distintas
- **Tabelas Profissionais**: Design limpo com bordas e hover states

## Segurança

- Autenticação via credenciais de admin (email/senha)
- Proteção de rotas com middleware Next.js
- Tokens JWT armazenados em cookies httpOnly
- Validação de tokens em todas as requisições
- **Read-only**: Nenhuma operação destrutiva disponível
- Variáveis de ambiente para secrets (.env não commitado)

## Desenvolvimento

### Adicionando Novos Componentes

1. Crie o componente em `src/components/`
2. Adicione os tipos necessários em `src/types/`
3. Implemente os serviços de API em `src/services/`
4. Use os utilitários em `src/lib/utils.ts`

### Padrões de Código

- Use TypeScript para tipagem
- Componentes funcionais com hooks
- Tailwind CSS para estilização
- Componentes reutilizáveis
- Tratamento de erros consistente
- Loading states apropriados

## Deploy

O dashboard pode ser deployado em qualquer plataforma que suporte Next.js:

- **Vercel** (recomendado)
- **Netlify**
- **Railway**
- **Docker**

Certifique-se de configurar as variáveis de ambiente no ambiente de produção.