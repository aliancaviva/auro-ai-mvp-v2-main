import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import logoImage from "@/assets/logo.png";

interface HeaderProps {
  onMenuClick: () => void;
}

interface UserData {
  full_name?: string;
  whatsapp_connected?: boolean;
  current_plan?: string;
  credits_used?: number;
  max_credits?: number;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuth();
  const location = useLocation();
  const isLandingPage = location.pathname === "/";
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, whatsapp_connected, current_plan, credits_used, max_credits')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        return;
      }

      setUserData(data);
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    }
  };

  const getPlanDisplayName = (plan?: string) => {
    switch (plan) {
      case 'micro': return 'Micro';
      case 'basic': return 'Básico';
      case 'premium': return 'Premium';
      case 'macro': return 'Macro';
      default: return 'Micro';
    }
  };

  const getRemainingCredits = () => {
    const used = userData?.credits_used || 0;
    const max = userData?.max_credits || 15;
    return Math.max(0, max - used);
  };
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-lg border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center h-16 ${isLandingPage ? 'justify-between' : 'justify-between'}`}>
          <Link to="/" className="flex items-center">
            <img src={logoImage} alt="AuroAI" className="h-8" />
          </Link>
          
          {isLandingPage && (
            <div className="flex items-center gap-4">
              <Link 
                to="/dashboard" 
                className="whitespace-nowrap cursor-pointer inline-flex items-center justify-center font-medium transition-all duration-200 px-4 py-2 text-sm rounded-lg text-white hover:opacity-90"
                style={{ backgroundColor: '#24A978' }}
              >
                Começar
              </Link>
            </div>
          )}
          
          {!isLandingPage && (
            <div className="absolute right-4 flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-slate-700 drop-shadow-sm">
                <i className="ri-vip-crown-line w-4 h-4 flex items-center justify-center"></i>
                <span className="text-sm font-medium">{getPlanDisplayName(userData?.current_plan)}</span>
                <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full border border-white/10">
                  {getRemainingCredits()} créditos
                </span>
              </div>
              
              <div className="hidden md:flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-100/80 to-emerald-200/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/10">
                  <i className="ri-user-line text-emerald-600 w-4 h-4 flex items-center justify-center"></i>
                </div>
                <span className="text-sm font-medium text-slate-700 drop-shadow-sm">
                  {userData?.full_name || user?.email?.split('@')[0] || 'Usuário'}
                </span>
              </div>

              <button 
                onClick={onMenuClick}
                className="p-2 text-slate-700 hover:text-emerald-600 hover:bg-white/10 rounded-lg transition-all duration-200"
              >
                <i className="ri-menu-line w-6 h-6 flex items-center justify-center"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}