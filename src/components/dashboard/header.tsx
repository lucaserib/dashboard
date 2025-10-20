"use client";

import { useRouter } from "next/navigation";
import { authApiService } from "@/services/auth-api";
import { LogOut } from "lucide-react";

export function DashboardHeader() {
  const router = useRouter();

  async function handleLogout() {
    await authApiService.logout();
    router.push("/login");
  }

  return (
    <div className="bg-white border-b border-gray-200 mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard MedEscala
            </h1>
            <p className="text-gray-600 mt-1">
              Visão geral dos usuários e estatísticas da plataforma
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </div>
    </div>
  );
}
