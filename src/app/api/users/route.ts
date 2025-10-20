import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'medescala-dashboard-secret-2025-secure-key';

function verifyAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }

  const token = authHeader.substring(7);
  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  // Verificar autenticação
  if (!verifyAuth(request)) {
    return NextResponse.json(
      { message: 'Não autorizado' },
      { status: 401 }
    );
  }

  try {
    console.log('📊 API: Buscando usuários do banco de dados...');

    // Buscar todos os usuários com seus relacionamentos (SOMENTE LEITURA)
    const users = await prisma.user.findMany({
      include: {
        cnpjData: true,
        deviceTokens: {
          where: {
            isActive: true
          },
          orderBy: {
            lastUsedAt: 'desc'
          }
        },
        plantoes: {
          include: {
            location: true,
            contractor: true,
            payments: true
          },
          orderBy: {
            date: 'desc'
          }
        },
        locations: true,
        contractors: true,
        _count: {
          select: {
            plantoes: true,
            locations: true,
            contractors: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`📊 API: ${users.length} usuários encontrados`);

    return NextResponse.json(users);
  } catch (error) {
    console.error('❌ API: Erro ao buscar usuários:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
