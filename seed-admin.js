const { Client } = require('pg');

const DATABASE_URL = "postgresql://neondb_owner:npg_r9I4VxTZPhdN@ep-round-snowflake-a59wxtjq-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require";

async function seedAdmin() {
  const client = new Client({
    connectionString: DATABASE_URL,
  });

  try {
    console.log('🔌 Conectando ao banco de dados...');
    await client.connect();
    console.log('✅ Conectado!');

    // Criar tabela admin_users se não existir
    console.log('\n📋 Criando tabela admin_users...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    console.log('✅ Tabela criada/verificada!');

    // Inserir usuário admin
    console.log('\n👤 Inserindo usuário admin...');
    const result = await client.query(`
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
        updated_at = NOW()
      RETURNING id, email, name, created_at
    `);

    console.log('✅ Usuário admin criado/atualizado!');
    console.log('\n📊 Dados do usuário:');
    console.log(result.rows[0]);

    // Verificar o usuário
    console.log('\n🔍 Verificando usuário no banco...');
    const verify = await client.query(
      "SELECT id, email, name, created_at FROM admin_users WHERE email = 'medescaladev@medescalaapp.com.br'"
    );
    console.log('✅ Usuário encontrado:');
    console.log(verify.rows[0]);

    console.log('\n✨ Seed concluído com sucesso!');
    console.log('\n🔑 Credenciais de acesso:');
    console.log('   Email: medescaladev@medescalaapp.com.br');
    console.log('   Senha: Admin2020');

  } catch (error) {
    console.error('❌ Erro ao executar seed:', error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n🔌 Conexão fechada.');
  }
}

seedAdmin();
