-- Script para criar o usuário admin do dashboard MedEscala
-- Execute este script diretamente no banco de dados PostgreSQL

-- Criar tabela de administradores se não existir
CREATE TABLE IF NOT EXISTS admin_users (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir usuário admin (senha: Admin2020)
-- Nota: A senha já está hasheada com bcrypt
INSERT INTO admin_users (email, password, name, created_at, updated_at)
VALUES (
  'medescaladev@medescalaapp.com.br',
  '$2b$10$WpEIqGcyKEbakJBZLpIrgujVwLsXVIzZtKw4Zgf2K5kQfZEcr5bBm',
  'Administrador MedEscala',
  NOW(),
  NOW()
)
ON CONFLICT (email)
DO UPDATE SET
  password = EXCLUDED.password,
  updated_at = NOW();

-- Verificar se o usuário foi criado
SELECT id, email, name, created_at FROM admin_users WHERE email = 'medescaladev@medescalaapp.com.br';
