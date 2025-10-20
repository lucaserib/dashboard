"use client";

import { usersApiService } from "./users-api";
import { User, UserStats, UserFilters } from "@/types/user";

export function useUsersApi() {
  const getAllUsers = async (filters?: UserFilters): Promise<User[]> => {
    return usersApiService.getAllUsers(filters);
  };

  const getUserById = async (id: string): Promise<User> => {
    return usersApiService.getUserById(id);
  };

  const getUserStats = async (): Promise<UserStats> => {
    return usersApiService.getUserStats();
  };

  // NOTA: Funções de UPDATE e DELETE removidas
  // Dashboard é SOMENTE LEITURA

  return {
    getAllUsers,
    getUserById,
    getUserStats,
  };
}
