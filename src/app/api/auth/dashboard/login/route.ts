import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Mock de usuário admin (temporário para teste)
// Em produção, isso virá do banco de dados
const ADMIN_USER = {
  email: 'medescaladev@medescalaapp.com.br',
  password: '$2b$10$WpEIqGcyKEbakJBZLpIrgujVwLsXVIzZtKw4Zgf2K5kQfZEcr5bBm', // Admin2020
  name: 'Administrador MedEscala',
};

const JWT_SECRET = process.env.JWT_SECRET || 'medescala-dashboard-secret-2025-secure-key';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validar campos
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar se é o usuário admin
    if (email !== ADMIN_USER.email) {
      return NextResponse.json(
        { message: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, ADMIN_USER.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    // Gerar token JWT
    const token = jwt.sign({ email: ADMIN_USER.email }, JWT_SECRET, {
      expiresIn: '7d',
    });

    // Retornar sucesso
    return NextResponse.json({
      token,
      user: {
        email: ADMIN_USER.email,
        name: ADMIN_USER.name,
      },
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
