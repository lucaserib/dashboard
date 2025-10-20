import Cookies from 'js-cookie';

const TOKEN_NAME = 'medescala-auth-token';

export interface AuthPayload {
  email: string;
  iat?: number;
  exp?: number;
}

// Função auxiliar para decodificar JWT (sem verificação de assinatura)
function decodeJWT(token: string): AuthPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));

    // Verificar se o token expirou
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      console.log('🔑 Auth: Token expirado');
      return null;
    }

    return payload as AuthPayload;
  } catch (error) {
    console.error('🔑 Auth: Erro ao decodificar token:', error);
    return null;
  }
}

export function setAuthToken(token: string): void {
  Cookies.set(TOKEN_NAME, token, { expires: 7, sameSite: 'strict' });
}

export function getAuthToken(): string | undefined {
  return Cookies.get(TOKEN_NAME);
}

export function removeAuthToken(): void {
  Cookies.remove(TOKEN_NAME);
}

export function isAuthenticated(): boolean {
  const token = getAuthToken();
  console.log('🔑 Auth: Token do cookie:', token ? 'presente' : 'ausente');
  if (!token) return false;

  const payload = decodeJWT(token);
  console.log('🔑 Auth: Payload decodificado:', payload);
  return payload !== null;
}
