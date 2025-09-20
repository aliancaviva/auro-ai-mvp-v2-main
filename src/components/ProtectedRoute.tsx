import { ReactNode, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      // Redirect to auth page with current path as redirect
      navigate(`/auth?redirectTo=${encodeURIComponent(location.pathname)}`);
    }
  }, [user, loading, navigate, location.pathname]);

  // Show loading while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-auro flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-slate-700">Verificando autenticação...</span>
        </div>
      </div>
    );
  }

  // Don't render anything if user is not authenticated
  if (!user) {
    return null;
  }

  return <>{children}</>;
}