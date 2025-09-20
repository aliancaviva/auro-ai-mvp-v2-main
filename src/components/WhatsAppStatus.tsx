import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export function WhatsAppStatus() {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadWhatsAppStatus();
    }
  }, [user]);

  const loadWhatsAppStatus = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('whatsapp_connected')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Erro ao carregar status WhatsApp:', error);
        return;
      }

      setIsConnected(data?.whatsapp_connected || false);
    } catch (error) {
      console.error('Erro ao carregar status WhatsApp:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return null;
  }

  if (isConnected) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-100 rounded-lg mt-1">
              <i className="ri-check-line text-green-600 w-5 h-5"></i>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-1">WhatsApp Conectado</h3>
              <p className="text-slate-600 text-sm">Você receberá suas edições automaticamente no WhatsApp</p>
            </div>
          </div>
          <div className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 w-fit">
            <i className="ri-check-line w-4 h-4"></i>
            Conectado
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-red-100 rounded-lg mt-1">
            <i className="ri-error-warning-line text-red-600 w-5 h-5"></i>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 mb-1">Conecte seu WhatsApp</h3>
            <p className="text-slate-600 text-sm">Configure seu número para receber as edições automaticamente</p>
          </div>
        </div>
        <Link 
          to="/perfil" 
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 w-fit"
        >
          <i className="ri-add-line w-4 h-4"></i>
          Conectar
        </Link>
      </div>
    </div>
  );
}