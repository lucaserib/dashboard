import axios from 'axios';
import { getAuthToken } from './auth';

const apiClient = axios.create({
  baseURL: '', // Vazio para usar API Routes do Next.js
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Erro na configuração da requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor para respostas
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Erro na requisição:', error.config?.url);

    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Mensagem:', error.response.data?.message || error.message);
    } else if (error.request) {
      console.error('Erro de rede - sem resposta do servidor');
    } else {
      console.error('Erro:', error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
