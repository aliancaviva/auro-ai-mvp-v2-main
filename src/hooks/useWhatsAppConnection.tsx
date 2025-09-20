import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const useWhatsAppConnection = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showCodeDialog, setShowCodeDialog] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();

  const connectWhatsApp = async (whatsappData: { ddi: string; ddd: string; number: string }) => {
    if (isConnecting || !user) return;

    const fullNumber = `${whatsappData.ddi}${whatsappData.ddd}${whatsappData.number}`;
    setPhoneNumber(fullNumber);
    setIsConnecting(true);

    try {
      // 1. Salvar número no banco imediatamente
      const { error: dbError } = await supabase
        .from('profiles')
        .update({ whatsapp_number: fullNumber })
        .eq('id', user.id);

      if (dbError) {
        throw new Error('Erro ao salvar número no banco de dados');
      }

      // 2. Enviar para webhook 1 para gerar código
      const webhook1Response = await fetch('https://auro-ai-n8n.5cmfd2.easypanel.host/webhook/evolution-AuroAI-Instance-webhook2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: fullNumber,
          user_id: user.id
        }),
      });

      if (!webhook1Response.ok) {
        throw new Error('Erro ao enviar código de verificação');
      }

      // 3. Mostrar dialog para inserir código
      setShowCodeDialog(true);
      toast({
        title: "Código enviado!",
        description: "Verifique seu WhatsApp e digite o código de 6 dígitos.",
      });

    } catch (error) {
      console.error('Erro ao conectar WhatsApp:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao conectar WhatsApp",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const verifyCode = async (code: string) => {
    if (isVerifying || !user || !phoneNumber) return;

    setIsVerifying(true);

    try {
      // Enviar para webhook 2 para validar código
      const webhook2Response = await fetch('https://auro-ai-n8n.5cmfd2.easypanel.host/webhook/evolution-AuroAI-Instance-webhook3', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: phoneNumber,
          code: code,
          user_id: user.id
        }),
      });

      const result = await webhook2Response.json();

      if (result.status === true) {
        // Código válido - atualizar status no banco
        const { error: dbError } = await supabase
          .from('profiles')
          .update({ whatsapp_connected: true })
          .eq('id', user.id);

        if (dbError) {
          console.error('Erro ao atualizar status:', dbError);
        }

        setShowCodeDialog(false);
        toast({
          title: "WhatsApp conectado!",
          description: "Sua conta WhatsApp foi conectada com sucesso.",
        });

        return true;
      } else {
        // Código inválido
        toast({
          title: "Código incorreto",
          description: "O código digitado está incorreto. Tente novamente.",
          variant: "destructive",
        });

        return false;
      }

    } catch (error) {
      console.error('Erro ao verificar código:', error);
      toast({
        title: "Erro",
        description: "Erro ao verificar código. Tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsVerifying(false);
    }
  };

  const disconnectWhatsApp = async () => {
    if (!user) return;
    
    setIsConnecting(true);
    
    try {
      // Primeiro buscar o número do WhatsApp do usuário
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('whatsapp_number')
        .eq('id', user.id)
        .single();

      if (profileError || !profileData?.whatsapp_number) {
        throw new Error('Número do WhatsApp não encontrado');
      }

      // Chamar webhook4 para desconectar
      const webhook4Response = await fetch('https://auro-ai-n8n.5cmfd2.easypanel.host/webhook/evolution-AuroAI-Instance-webhook4', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          phone_number: profileData.whatsapp_number
        }),
      });

      if (!webhook4Response.ok) {
        throw new Error('Erro ao desconectar WhatsApp');
      }

      // Atualizar status no banco
      const { error: dbError } = await supabase
        .from('profiles')
        .update({ 
          whatsapp_connected: false,
          whatsapp_number: null 
        })
        .eq('id', user.id);

      if (dbError) {
        throw new Error('Erro ao atualizar status no banco');
      }

      toast({
        title: "WhatsApp desconectado!",
        description: "Sua conta WhatsApp foi desconectada com sucesso.",
      });

    } catch (error) {
      console.error('Erro ao desconectar WhatsApp:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao desconectar WhatsApp",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const closeCodeDialog = () => {
    setShowCodeDialog(false);
    setPhoneNumber("");
  };

  return {
    connectWhatsApp,
    verifyCode,
    disconnectWhatsApp,
    closeCodeDialog,
    isConnecting,
    isVerifying,
    showCodeDialog,
  };
};