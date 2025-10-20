import apiClient from '@/lib/axios';
import { setAuthToken, removeAuthToken } from '@/lib/auth';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    email: string;
    name?: string;
  };
}

export class AuthApiService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>('/api/auth/dashboard/login', credentials);

      if (response.data.token) {
        setAuthToken(response.data.token);
      }

      return response.data;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    removeAuthToken();
  }

  async validateToken(): Promise<boolean> {
    try {
      const response = await apiClient.get('/api/auth/dashboard/validate');
      return response.status === 200;
    } catch {
      return false;
    }
  }
}

export const authApiService = new AuthApiService();
