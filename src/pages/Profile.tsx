import { Layout } from "@/components/Layout";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useWhatsAppConnection } from "@/hooks/useWhatsAppConnection";
import { WhatsAppCodeDialog } from "@/components/WhatsAppCodeDialog";
import { PersonalDataSection } from "@/components/PersonalDataSection";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { connectWhatsApp, verifyCode, disconnectWhatsApp, closeCodeDialog, isConnecting, isVerifying, showCodeDialog } = useWhatsAppConnection();
  
  const [whatsappData, setWhatsappData] = useState({
    ddi: "+55",
    ddd: "",
    number: ""
  });
  
  const [profile, setProfile] = useState<{
    full_name?: string;
    whatsapp_number?: string;
    whatsapp_connected?: boolean;
  } | null>(null);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, whatsapp_number, whatsapp_connected')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Erro ao carregar perfil:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    }
  };

  const handleConnectWhatsApp = async () => {
    if (!whatsappData.ddd || !whatsappData.number) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha o DDD e número do WhatsApp.",
        variant: "destructive",
      });
      return;
    }

    await connectWhatsApp(whatsappData);
    loadProfile(); // Recarregar perfil após conectar
  };

  const handleDisconnectWhatsApp = async () => {
    await disconnectWhatsApp();
    loadProfile(); // Recarregar perfil após desconectar
    // Limpar campos
    setWhatsappData({
      ddi: "+55",
      ddd: "",
      number: ""
    });
  };

  const handleVerifyCode = async (code: string) => {
    const success = await verifyCode(code);
    if (success) {
      loadProfile(); // Recarregar perfil após verificar código
    }
    return success;
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Título */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Meu Perfil</h1>
          <p className="text-slate-600">Gerencie suas informações pessoais e configurações do WhatsApp</p>
        </div>

        {/* WhatsApp Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-xl">
                <i className="ri-whatsapp-line text-green-600 w-6 h-6 flex items-center justify-center"></i>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-800">WhatsApp</h2>
                <p className="text-slate-600 text-sm">Configure seu número para receber edições</p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${
              profile?.whatsapp_connected 
                ? 'text-green-700 bg-green-50' 
                : 'text-slate-600 bg-slate-50'
            }`}>
              <i className={`w-4 h-4 flex items-center justify-center ${
                profile?.whatsapp_connected 
                  ? 'ri-check-line text-green-600' 
                  : 'ri-error-warning-line'
              }`}></i>
              {profile?.whatsapp_connected ? 'Conectado' : 'Não cadastrado'}
            </div>
          </div>
          
          <div className="space-y-4">
            {profile?.whatsapp_connected ? (
              // WhatsApp Conectado - Mostrar apenas aviso e botão desconectar
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <i className="ri-check-line text-green-600 w-5 h-5"></i>
                    </div>
                    <div>
                      <p className="text-green-800 font-medium">WhatsApp Conectado</p>
                      <p className="text-green-600 text-sm">Você receberá suas edições automaticamente</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleDisconnectWhatsApp}
                    disabled={isConnecting}
                    className="inline-flex items-center justify-center font-medium transition-all duration-200 bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl px-4 py-2 text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
                  >
                    {isConnecting ? (
                      <>
                        <i className="ri-loader-4-line animate-spin w-4 h-4 flex items-center justify-center mr-2"></i>
                        Desconectando...
                      </>
                    ) : (
                      <>
                        <i className="ri-close-line w-4 h-4 flex items-center justify-center mr-2"></i>
                        Desconectar
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              // WhatsApp não conectado - Mostrar campos de entrada
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-slate-600 mb-4">Digite seu número do WhatsApp para começar a receber suas edições:</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">DDI</label>
                    <select 
                      value={whatsappData.ddi}
                      onChange={(e) => setWhatsappData(prev => ({ ...prev, ddi: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="+55">+55 (Brasil)</option>
                      <option value="+1">+1 (EUA)</option>
                      <option value="+44">+44 (Reino Unido)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">DDD</label>
                    <input 
                      placeholder="11"
                      value={whatsappData.ddd}
                      onChange={(e) => setWhatsappData(prev => ({ ...prev, ddd: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
                      type="text"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Número</label>
                    <input 
                      placeholder="99999-9999"
                      value={whatsappData.number}
                      onChange={(e) => setWhatsappData(prev => ({ ...prev, number: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
                      type="text"
                    />
                  </div>
                </div>
                <button 
                  onClick={handleConnectWhatsApp}
                  disabled={!whatsappData.ddd || !whatsappData.number || isConnecting}
                  className="inline-flex items-center justify-center font-medium transition-all duration-200 bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 px-6 py-2.5 text-sm rounded-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isConnecting ? (
                    <>
                      <i className="ri-loader-4-line animate-spin w-4 h-4 flex items-center justify-center mr-2"></i>
                      Conectando...
                    </>
                  ) : (
                    <>
                      <i className="ri-whatsapp-line w-4 h-4 flex items-center justify-center mr-2"></i>
                      Conectar WhatsApp
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Dados Pessoais */}
        <PersonalDataSection profile={profile} onProfileUpdate={loadProfile} />
      </div>

      <WhatsAppCodeDialog
        open={showCodeDialog}
        onClose={closeCodeDialog}
        onVerify={handleVerifyCode}
        isVerifying={isVerifying}
      />
    </Layout>
  );
}