import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PersonalDataSectionProps {
  profile: {
    full_name?: string;
  } | null;
  onProfileUpdate: () => void;
}

export function PersonalDataSection({ profile, onProfileUpdate }: PersonalDataSectionProps) {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [editName, setEditName] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [newName, setNewName] = useState(profile?.full_name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleNameUpdate = async () => {
    if (!user || !newName.trim()) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: newName.trim() })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Nome atualizado",
        description: "Seu nome foi atualizado com sucesso.",
      });
      
      setEditName(false);
      onProfileUpdate();
    } catch (error) {
      console.error('Erro ao atualizar nome:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar nome. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!newPassword.trim()) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: "Senha atualizada",
        description: "Sua senha foi atualizada com sucesso.",
      });
      
      setEditPassword(false);
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar senha. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
      // Redirect to homepage after logout
      navigate("/");
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast({
        title: "Erro",
        description: "Erro ao fazer logout. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-100 rounded-xl">
            <i className="ri-user-line text-blue-600 w-6 h-6 flex items-center justify-center"></i>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-800">Dados Pessoais</h2>
            <p className="text-slate-600 text-sm">Informações da sua conta</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {/* Nome */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-slate-50 rounded-xl">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-600 mb-1">Nome completo</p>
              <p className="text-lg font-medium text-slate-800 break-words">{profile?.full_name || user?.email || 'Não informado'}</p>
            </div>
            <button 
              onClick={() => {
                setNewName(profile?.full_name || "");
                setEditName(true);
              }}
              className="inline-flex items-center justify-center font-medium transition-all duration-200 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-3 py-1.5 text-sm rounded-lg self-start sm:self-auto shrink-0"
            >
              <i className="ri-edit-line w-4 h-4 flex items-center justify-center mr-2"></i>
              Editar
            </button>
          </div>
          
          {/* Email */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-slate-50 rounded-xl">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-600 mb-1">E-mail</p>
              <p className="text-lg font-medium text-slate-800 break-all">{user?.email || 'Não informado'}</p>
            </div>
            <div className="px-3 py-1 bg-slate-200 rounded-full self-start sm:self-auto shrink-0">
              <span className="text-sm text-slate-600">Fixo</span>
            </div>
          </div>
          
          {/* Senha */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-slate-50 rounded-xl">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-600 mb-1">Senha</p>
              <p className="text-lg font-medium text-slate-800">••••••••</p>
            </div>
            <button 
              onClick={() => setEditPassword(true)}
              className="inline-flex items-center justify-center font-medium transition-all duration-200 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-3 py-1.5 text-sm rounded-lg self-start sm:self-auto shrink-0"
            >
              <i className="ri-edit-line w-4 h-4 flex items-center justify-center mr-2"></i>
              Alterar
            </button>
          </div>
          
          {/* Idioma */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-slate-50 rounded-xl">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-600 mb-1">Idioma</p>
              <p className="text-lg font-medium text-slate-800">PT-BR</p>
            </div>
            <div className="px-3 py-1 bg-slate-200 rounded-full self-start sm:self-auto shrink-0">
              <span className="text-sm text-slate-600">Padrão</span>
            </div>
          </div>
        </div>
        
        {/* Logout Button */}
        <div className="mt-6 pt-6 border-t border-slate-200">
          <button
            onClick={handleSignOut}
            className="w-full inline-flex items-center justify-center font-medium transition-all duration-200 bg-red-500 hover:bg-red-600 text-white px-4 py-3 text-sm rounded-lg"
          >
            <i className="ri-logout-box-line w-4 h-4 flex items-center justify-center mr-2"></i>
            Sair da conta
          </button>
        </div>
      </div>

      {/* Dialog Editar Nome */}
      <Dialog open={editName} onOpenChange={setEditName}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Nome</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Digite seu nome completo"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setEditName(false)}
                disabled={isLoading}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleNameUpdate}
                disabled={isLoading || !newName.trim()}
                className="flex-1"
              >
                {isLoading ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Alterar Senha */}
      <Dialog open={editPassword} onOpenChange={setEditPassword}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Alterar Senha</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nova senha</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Digite sua nova senha"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setEditPassword(false);
                  setNewPassword("");
                }}
                disabled={isLoading}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handlePasswordUpdate}
                disabled={isLoading || !newPassword.trim()}
                className="flex-1"
              >
                {isLoading ? "Alterando..." : "Alterar Senha"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}