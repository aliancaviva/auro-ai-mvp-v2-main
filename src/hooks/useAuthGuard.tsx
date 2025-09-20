import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function useAuthGuard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const requireAuth = (targetPath: string) => {
    if (loading) return;
    
    if (!user) {
      navigate(`/auth?redirectTo=${encodeURIComponent(targetPath)}`);
      return false;
    }
    
    return true;
  };

  const navigateWithAuth = (targetPath: string) => {
    if (requireAuth(targetPath)) {
      navigate(targetPath);
    }
  };

  return {
    requireAuth,
    navigateWithAuth,
    isAuthenticated: !!user,
    loading,
  };
}