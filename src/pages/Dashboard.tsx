import { Layout } from "@/components/Layout";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { WhatsAppStatus } from "@/components/WhatsAppStatus";
import { Link } from "react-router-dom";
export default function Dashboard() {
  const {
    user
  } = useAuth();
  const [profile, setProfile] = useState<{
    current_plan?: string;
    credits_used?: number;
    max_credits?: number;
    plan_expires_at?: string;
    whatsapp_connected?: boolean;
  } | null>(null);
  const [stats, setStats] = useState({
    totalEditions: 247,
    thisMonth: 28
  });
  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);
  const loadProfile = async () => {
    if (!user) return;
    try {
      const {
        data,
        error
      } = await supabase.from('profiles').select('current_plan, credits_used, max_credits, plan_expires_at, whatsapp_connected').eq('id', user.id).single();
      if (error) {
        console.error('Erro ao carregar perfil:', error);
        return;
      }
      setProfile(data);
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    }
  };
  const getCreditsRemaining = () => {
    if (!profile) return 0;
    return (profile.max_credits || 0) - (profile.credits_used || 0);
  };
  const getCreditsPercentage = () => {
    if (!profile) return 0;
    const used = profile.credits_used || 0;
    const max = profile.max_credits || 1;
    return Math.min(used / max * 100, 100);
  };
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };
  return <Layout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* WhatsApp Status */}
        <WhatsAppStatus />

        {/* Uso do Plano */}
        <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-white/20 shadow-lg p-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-6">Uso do Plano</h2>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-600 font-medium">Créditos utilizados</span>
                <span className="text-slate-800 font-semibold">
                  {profile?.credits_used || 0}/{profile?.max_credits || 0}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-3 rounded-full transition-all duration-500" style={{
                width: `${getCreditsPercentage()}%`
              }}></div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <div>
                <span className="text-slate-600 text-sm">Renovação</span>
                <p className="text-slate-800 font-medium">{formatDate(profile?.plan_expires_at)}</p>
              </div>
              {profile?.current_plan !== 'macro' && (
                <Link to="/planos" className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2">
                  <i className="ri-arrow-up-line w-4 h-4"></i>
                  Fazer Upgrade
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-white/20 shadow-lg p-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-6">Estatísticas</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-600">Total de edições</span>
              <span className="font-bold text-slate-800 text-lg">{stats.totalEditions}</span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-600">Este mês</span>
              <span className="font-bold text-emerald-600 text-lg">{stats.thisMonth}</span>
            </div>
          </div>
        </div>

        {/* Últimas Edições */}
        <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-white/20 shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-slate-800">Últimas Edições</h2>
            <Link to="/biblioteca" className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 transition-colors">
              Ver todas
              <i className="ri-arrow-right-line w-4 h-4"></i>
            </Link>
          </div>
          
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-image-line text-slate-400 text-2xl"></i>
            </div>
            <p className="text-slate-600">Nenhuma edição ainda</p>
            <p className="text-slate-500 text-sm mt-1">Suas edições aparecerão aqui</p>
          </div>
        </div>
      </div>
    </Layout>;
}