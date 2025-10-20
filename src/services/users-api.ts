import apiClient from '@/lib/axios';
import { User, UserStats, UserFilters } from '@/types/user';

export class UsersApiService {
  async getAllUsers(filters?: UserFilters): Promise<User[]> {
    try {
      let queryParams = '';

      if (filters) {
        const params = new URLSearchParams();
        if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
        if (filters.gender) params.append('gender', filters.gender);
        if (filters.hasCNPJ !== undefined) params.append('hasCNPJ', filters.hasCNPJ.toString());
        if (filters.hasLocations !== undefined) params.append('hasLocations', filters.hasLocations.toString());
        if (filters.hasContractors !== undefined) params.append('hasContractors', filters.hasContractors.toString());
        if (filters.platform) params.append('platform', filters.platform);
        if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
        if (filters.dateTo) params.append('dateTo', filters.dateTo);

        queryParams = `?${params.toString()}`;
      }

      const response = await apiClient.get(`/api/users${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw error;
    }
  }

  async getUserById(id: string): Promise<User> {
    try {
      const response = await apiClient.get(`/api/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar usuário ${id}:`, error);
      throw error;
    }
  }

  async getUserStats(): Promise<UserStats> {
    try {
      const response = await apiClient.get('/api/users/stats');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar estatísticas dos usuários:', error);
      throw error;
    }
  }

  // NOTA: Métodos de UPDATE e DELETE removidos
  // Este dashboard é SOMENTE LEITURA - não modifica dados do banco de produção
}

export const usersApiService = new UsersApiService();
