"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { isAuthenticated } from "@/lib/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      console.log('🔐 ProtectedRoute: Verificando autenticação...');
      const authenticated = isAuthenticated();
      console.log('🔐 ProtectedRoute: Autenticado?', authenticated);
      setIsAuth(authenticated);
      setIsLoading(false);

      if (!authenticated) {
        console.log('❌ ProtectedRoute: Não autenticado, redirecionando para /login');
        router.push("/login");
      } else {
        console.log('✅ ProtectedRoute: Autenticado, renderizando conteúdo');
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!isAuth) {
    return null;
  }

  return <>{children}</>;
}
