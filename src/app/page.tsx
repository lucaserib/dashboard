"use client";

import { useEffect, useState } from "react";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { PlatformDistribution } from "@/components/dashboard/platform-distribution";
import { GenderDistribution } from "@/components/dashboard/gender-distribution";
import { UsersTable } from "@/components/dashboard/users-table";
import { UserDetailModal } from "@/components/dashboard/user-detail-modal";
import { DashboardHeader } from "@/components/dashboard/header";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useUsersApi } from "@/services/users-api-client";
import { User, UserStats } from "@/types/user";
import { Loader2, AlertCircle } from "lucide-react";

function DashboardContent() {
  console.log('📊 Dashboard: DashboardContent renderizado');
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { getAllUsers, getUserStats } = useUsersApi();

  useEffect(() => {
    console.log('📊 Dashboard: useEffect executado');
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    try {
      console.log('📊 Dashboard: Iniciando carregamento de dados...');
      setLoading(true);
      setError(null);

      // Carregar usuários e estatísticas em paralelo
      console.log('📊 Dashboard: Buscando usuários e estatísticas...');
      const [usersData, statsData] = await Promise.all([
        getAllUsers(),
        getUserStats(),
      ]);

      console.log('📊 Dashboard: Dados recebidos:', {
        usersCount: usersData.length,
        stats: statsData
      });
      setUsers(usersData);
      setStats(statsData);
    } catch (err) {
      console.error("❌ Dashboard: Erro ao carregar dados:", err);
      setError(
        "Erro ao carregar dados do dashboard. Verifique sua conexão e tente novamente."
      );
    } finally {
      console.log('📊 Dashboard: Carregamento finalizado');
      setLoading(false);
    }
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Erro ao carregar dados
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Stats Cards */}
        {stats && <StatsCards stats={stats} />}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {stats && <PlatformDistribution stats={stats} />}
          {stats && <GenderDistribution stats={stats} />}
        </div>

        {/* Users Table */}
        <div className="mt-8">
          <UsersTable
            users={users}
            onViewUser={handleViewUser}
          />
        </div>
      </div>

      {/* User Detail Modal */}
      <UserDetailModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
        }}
      />
    </div>
  );
}

export default function DashboardPage() {
  console.log('📊 Dashboard: DashboardPage renderizado');
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
