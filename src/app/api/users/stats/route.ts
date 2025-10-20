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
    console.log('📊 API: Calculando estatísticas do banco de dados...');

    // Buscar dados agregados (SOMENTE LEITURA)
    const [
      totalUsers,
      usersWithCNPJ,
      usersWithLocations,
      usersWithContractors,
      totalShifts,
      activeDeviceTokens,
      allUsers
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { cnpjData: { isNot: null } } }),
      prisma.user.count({ where: { locations: { some: {} } } }),
      prisma.user.count({ where: { contractors: { some: {} } } }),
      prisma.plantao.count(),
      prisma.deviceToken.findMany({
        where: { isActive: true },
        select: { deviceType: true }
      }),
      prisma.user.findMany({
        select: { gender: true }
      })
    ]);

    // Calcular usuários ativos (com device token ativo nos últimos 30 dias)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activeUsers = await prisma.user.count({
      where: {
        deviceTokens: {
          some: {
            isActive: true,
            lastUsedAt: {
              gte: thirtyDaysAgo
            }
          }
        }
      }
    });

    // Calcular receita total dos plantões
    const revenueResult = await prisma.plantao.aggregate({
      _sum: {
        value: true
      }
    });

    // Distribuição de plataforma
    const platformDistribution = {
      ios: activeDeviceTokens.filter(t => t.deviceType?.toLowerCase() === 'ios').length,
      android: activeDeviceTokens.filter(t => t.deviceType?.toLowerCase() === 'android').length,
      web: activeDeviceTokens.filter(t => t.deviceType?.toLowerCase() === 'web').length,
    };

    // Distribuição de gênero
    const genderDistribution: Record<string, number> = {
      'masculino': 0,
      'feminino': 0,
      'outro': 0,
      'não informado': 0,
    };

    allUsers.forEach(user => {
      const gender = user.gender?.toLowerCase() || 'não informado';
      if (gender in genderDistribution) {
        genderDistribution[gender]++;
      } else {
        genderDistribution['não informado']++;
      }
    });

    const stats = {
      totalUsers,
      activeUsers,
      usersWithCNPJ,
      usersWithLocations,
      usersWithContractors,
      totalShifts,
      totalRevenue: revenueResult._sum.value || 0,
      averageShiftsPerUser: totalUsers > 0 ? Math.round(totalShifts / totalUsers) : 0,
      platformDistribution,
      genderDistribution,
    };

    console.log('📊 API: Estatísticas calculadas:', stats);

    return NextResponse.json(stats);
  } catch (error) {
    console.error('❌ API: Erro ao buscar estatísticas:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
