import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import logoImage from "@/assets/logo.png";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const redirectTo = searchParams.get("redirectTo") || "/dashboard";
  const planIntent = searchParams.get('plan'); // Para detectar se veio de CTA de plano pago
  const priceId = searchParams.get('priceId'); // Para checkout automático após login

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Se já logado e tem priceId, iniciar checkout
        if (priceId) {
          initiateCheckoutAfterLogin(priceId);
        } else {
          navigate(redirectTo);
        }
      }
    };
    checkUser();
  }, [navigate, redirectTo, priceId]);

  const initiateCheckoutAfterLogin = async (priceId: string) => {
    try {
      toast({
        title: "Iniciando checkout...",
        description: "Redirecionando para o pagamento.",
      });

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId }
      });

      if (error) {
        console.error('Checkout error:', error);
        toast({
          title: "Erro no checkout",
          description: "Erro ao criar checkout. Redirecionando para planos.",
          variant: "destructive",
        });
        navigate('/planos');
        return;
      }

      if (data?.url) {
        window.open(data.url, '_blank');
        toast({
          title: "Sucesso!",
          description: "Redirecionando para o pagamento...",
        });
        // Redirecionar para planos após abrir checkout
        navigate('/planos');
      } else {
        toast({
          title: "Erro",
          description: "URL do checkout não encontrada. Redirecionando para planos.",
          variant: "destructive",
        });
        navigate('/planos');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Erro",
        description: "Erro ao processar checkout. Redirecionando para planos.",
        variant: "destructive",
      });
      navigate('/planos');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalRedirectTo = redirectTo;
      
      // Se veio de um plano pago, redirecionar para os planos após cadastro para processar pagamento
      if (planIntent && ['micro', 'meso', 'macro'].includes(planIntent)) {
        finalRedirectTo = `/planos?plan=${planIntent}`;
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}${finalRedirectTo}`,
          data: {
            full_name: fullName,
          }
        }
      });

      if (error) {
        toast({
          title: "Erro no cadastro",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Cadastro realizado!",
          description: "Verifique seu email para confirmar sua conta.",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Erro no login",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // Se veio de um priceId, iniciar checkout automático
        if (priceId) {
          initiateCheckoutAfterLogin(priceId);
        }
        // Se veio de um plano pago, redirecionar para os planos após login
        else if (planIntent && ['micro', 'meso', 'macro'].includes(planIntent)) {
          navigate(`/planos?plan=${planIntent}`);
        } else {
          navigate(redirectTo);
        }
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3 mb-6">
              <img src={logoImage} alt="AuroAI" className="h-10" />
            </Link>
            <h1 className="text-2xl font-bold text-slate-700 mb-2">
              {isLogin ? "Bem-vindo de volta!" : "Crie sua conta"}
            </h1>
            <p className="text-slate-600">
              {isLogin 
                ? "Entre com suas credenciais para continuar" 
                : "Junte-se a mais de 1.200 pessoas que já transformaram suas fotos"
              }
            </p>
          </div>

          <form onSubmit={isLogin ? handleSignIn : handleSignUp} className="space-y-4">
            {!isLogin && (
              <div>
                <Label htmlFor="fullName">Nome Completo</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="Seu nome completo"
                  className="mt-1"
                />
              </div>
            )}

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="seu@email.com"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Sua senha"
                className="mt-1"
                minLength={6}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600"
              disabled={loading}
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isLogin ? "Entrar" : "Criar Conta"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
            >
              {isLogin 
                ? "Não tem uma conta? Cadastre-se" 
                : "Já tem uma conta? Faça login"
              }
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-center space-x-6 text-sm text-slate-500">
              <div className="flex items-center">
                <i className="ri-shield-check-line text-emerald-500 mr-2"></i>
                100% Seguro
              </div>
              <div className="flex items-center">
                <i className="ri-time-line text-emerald-500 mr-2"></i>
                Acesso Imediato
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-500 text-xs mt-4">
          Ao se cadastrar, você concorda com nossos{" "}
          <Link to="#" className="text-emerald-600 hover:underline">
            termos de uso
          </Link>{" "}
          e{" "}
          <Link to="#" className="text-emerald-600 hover:underline">
            política de privacidade
          </Link>
        </p>
      </div>
    </div>
  );
}