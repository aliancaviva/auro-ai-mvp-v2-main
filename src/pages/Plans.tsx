import { Layout } from "@/components/Layout";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  price: string;
  period?: string;
  credits: string;
  features: PlanFeature[];
  isPopular?: boolean;
  isCurrent?: boolean;
  buttonText: string;
  buttonVariant: "primary" | "secondary" | "current";
  priceId?: string;
}

const plans: Plan[] = [
  {
    id: "teste",
    name: "Plano Teste",
    description: "Perfeito para testar nossos recursos",
    price: "Gratuito",
    credits: "5 edições",
    features: [
      { text: "5 edições para teste", included: true },
      { text: "Qualidade padrão", included: true },
      { text: "Suporte por email", included: true },
      { text: "Sem renovação automática", included: true },
    ],
    buttonText: "Plano Atual",
    buttonVariant: "current",
  },
  {
    id: "micro",
    name: "Plano Micro",
    description: "Ideal para uso pessoal",
    price: "R$ 29,97",
    period: "/mês",
    credits: "25 edições mensais",
    features: [
      { text: "25 edições por mês", included: true },
      { text: "Qualidade alta", included: true },
      { text: "Suporte prioritário", included: true },
      { text: "Renovação automática", included: true },
    ],
    isPopular: true,
    buttonText: "Assinar Agora",
    buttonVariant: "primary",
    priceId: "price_1S9eiNRGP4n024FuzUZw50LJ",
  },
  {
    id: "meso",
    name: "Plano Meso",
    description: "Para pequenas empresas",
    price: "R$ 49,97",
    period: "/mês",
    credits: "45 edições mensais",
    features: [
      { text: "45 edições por mês", included: true },
      { text: "Qualidade premium", included: true },
      { text: "Suporte prioritário", included: true },
      { text: "API personalizada", included: true },
    ],
    buttonText: "Assinar Agora",
    buttonVariant: "primary",
    priceId: "price_1S9eimRGP4n024Fubc7UAOJc",
  },
  {
    id: "macro",
    name: "Plano Macro",
    description: "Para empresas com alto volume",
    price: "R$ 79,97",
    period: "/mês",
    credits: "Edições ilimitadas",
    features: [
      { text: "Edições ilimitadas", included: true },
      { text: "Qualidade premium", included: true },
      { text: "Suporte dedicado", included: true },
      { text: "API personalizada", included: true },
      { text: "Integrações avançadas", included: true },
    ],
    buttonText: "Assinar Agora",
    buttonVariant: "primary",
    priceId: "price_1S9eisRGP4n024Fu9eiHMXbz",
  },
];

const faqs = [
  {
    question: "Como funciona o uso justo no plano Macro?",
    answer: "O uso justo significa que você pode processar quantas imagens precisar para uso comercial normal, mas não para revenda em massa ou uso abusivo."
  },
  {
    question: "Posso mudar de plano a qualquer momento?",
    answer: "Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As mudanças entram em vigor no próximo ciclo de cobrança."
  },
  {
    question: "O que acontece se eu exceder meu limite?",
    answer: "Nos planos com limite, você será notificado quando estiver próximo do limite. Após exceder, você pode fazer upgrade ou aguardar o próximo ciclo."
  },
  {
    question: "Como funciona o processamento prioritário?",
    answer: "Clientes dos planos Meso e Macro têm suas imagens processadas com prioridade, resultando em tempos de resposta mais rápidos."
  }
];

export default function Plans() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [searchParams] = useSearchParams();
  const { user, session, subscription, checkSubscription } = useAuth();
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    const payment = searchParams.get('payment');
    if (payment === 'success') {
      toast.success('Pagamento realizado com sucesso! Verificando sua assinatura...');
      checkSubscription();
    } else if (payment === 'canceled') {
      toast.error('Pagamento cancelado');
    }
  }, [searchParams, checkSubscription]);

  const testStripeConnection = async () => {
    setTesting(true);
    try {
      console.log('Testando conectividade com Stripe...');
      const { data, error } = await supabase.functions.invoke('test-stripe');
      
      if (error) {
        console.error('Erro no teste do Stripe:', error);
        toast.error(`Erro no teste: ${error.message || error}`);
        return;
      }

      console.log('Resultado do teste Stripe:', data);
      
      if (data.success) {
        toast.success('✅ Conectividade com Stripe OK! Verifique o console para detalhes.');
        
        // Verificar se há problemas com os price IDs
        const failedPrices = data.priceTests?.filter((p: any) => !p.valid);
        if (failedPrices && failedPrices.length > 0) {
          console.warn('Price IDs com problemas:', failedPrices);
          toast.error(`⚠️ Alguns Price IDs têm problemas. Verifique o console.`);
        }
      } else {
        toast.error(`❌ Teste falhou: ${data.error}`);
      }
    } catch (error) {
      console.error('Erro inesperado no teste:', error);
      toast.error('Erro inesperado durante o teste');
    } finally {
      setTesting(false);
    }
  };

  const handleSubscribe = async (plan: Plan) => {
    if (!user) {
      toast.error('Você precisa estar logado para assinar um plano');
      return;
    }

    if (!session?.access_token) {
      toast.error('Sessão expirada. Faça login novamente');
      return;
    }

    if (!plan.priceId) {
      toast.error('Plano não disponível para assinatura');
      return;
    }

    console.log('Iniciando checkout para plano:', plan.name, 'Price ID:', plan.priceId);
    setLoading(true);
    
    try {
      console.log('Chamando create-checkout com:', { 
        priceId: plan.priceId, 
        userId: user.id,
        userEmail: user.email 
      });

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId: plan.priceId },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        }
      });

      if (error) {
        console.error('Erro na função create-checkout:', error);
        throw error;
      }
      
      console.log('Resposta da função create-checkout:', data);
      
      if (data?.url) {
        console.log('Redirecionando para checkout:', data.url);
        window.location.href = data.url;
      } else {
        console.error('URL de checkout não recebida:', data);
        throw new Error('URL de checkout não foi retornada pelo servidor');
      }
    } catch (error: any) {
      console.error('Erro completo no checkout:', error);
      
      let errorMessage = 'Erro ao processar pagamento';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.details) {
        errorMessage = error.details;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      // Mensagens específicas baseadas no tipo de erro
      if (errorMessage.includes('Authentication') || errorMessage.includes('authorization')) {
        errorMessage = 'Sessão expirada. Faça login novamente.';
      } else if (errorMessage.includes('Price') && errorMessage.includes('not active')) {
        errorMessage = 'Este plano não está mais disponível. Tente outro plano.';
      } else if (errorMessage.includes('Stripe validation failed')) {
        errorMessage = 'Erro na validação do pagamento. Verifique sua conta Stripe.';
      } else if (errorMessage.includes('secret key')) {
        errorMessage = 'Configuração de pagamento incorreta. Contate o suporte.';
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        }
      });

      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast.error('Erro ao abrir portal do cliente. Tente novamente.');
    }
  };

  const getButtonStyles = (variant: "primary" | "secondary" | "current") => {
    switch (variant) {
      case "primary":
        return "bg-emerald-600 text-white hover:bg-emerald-700";
      case "secondary":
        return "bg-gray-100 text-gray-900 hover:bg-gray-200";
      case "current":
        return "bg-emerald-100 text-emerald-700 cursor-not-allowed";
      default:
        return "bg-emerald-600 text-white hover:bg-emerald-700";
    }
  };

  const getUpdatedPlans = () => {
    return plans.map(plan => {
      const isCurrentPlan = subscription?.current_plan === plan.id;
      return {
        ...plan,
        isCurrent: isCurrentPlan,
        buttonText: isCurrentPlan ? "Plano Atual" : plan.buttonText,
        buttonVariant: isCurrentPlan ? "current" as const : plan.buttonVariant,
      };
    });
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Título */}
        <div className="mb-12 sm:mb-16">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2 sm:mb-3 text-center sm:text-left">
            Escolha seu Plano
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mb-6 sm:mb-8 text-center sm:text-left">
            Escolha um plano, pare de se preocupar com edição e cancele a qualquer momento.
          </p>

          {/* Botão de Diagnóstico */}
          <div className="mb-6 text-center sm:text-left">
            <Button
              onClick={testStripeConnection}
              disabled={testing}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              {testing ? '🔄 Testando...' : '🔧 Testar Conectividade Stripe'}
            </Button>
          </div>

          {/* Planos Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {getUpdatedPlans().map((plan) => (
              <div
                key={plan.id}
                className={`bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 border-2 shadow-lg relative ${
                  plan.isCurrent ? 'border-emerald-500' : 'border-white/20'
                }`}
              >
                {plan.isCurrent && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Atual
                    </span>
                  </div>
                )}
                
                <div className={`mb-4 ${plan.isCurrent ? 'pt-2' : ''}`}>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-800">{plan.name}</h3>
                  <p className="text-slate-600 text-sm mt-1">{plan.description}</p>
                </div>
                
                <div className="mb-4 sm:mb-6">
                  <div className="text-xl sm:text-2xl font-bold text-slate-800">
                    {plan.price}
                    {plan.period && (
                      <span className="text-sm font-normal text-slate-600">{plan.period}</span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-emerald-600 mt-1">{plan.credits}</p>
                </div>

                <div className="mb-4 sm:mb-6">
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <i className="ri-check-line w-4 h-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0"></i>
                        <span className="text-slate-600">{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {plan.isCurrent && subscription?.subscribed ? (
                    <div className="flex flex-col gap-2">
                      <button 
                        className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${getButtonStyles(plan.buttonVariant)}`}
                        disabled={true}
                      >
                        {plan.buttonText}
                      </button>
                      <button 
                        onClick={handleManageSubscription}
                        className="w-full py-2 px-4 rounded-lg font-medium text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200"
                      >
                        Gerenciar Assinatura
                      </button>
                    </div>
                  ) : (
                    <button 
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${getButtonStyles(plan.buttonVariant)} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={plan.buttonVariant === "current" || loading}
                      onClick={() => plan.priceId && handleSubscribe(plan)}
                    >
                      {loading ? 'Processando...' : plan.buttonText}
                    </button>
                  )}
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-8 border border-white/20 shadow-lg">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 sm:mb-6 text-center sm:text-left">
            Perguntas Frequentes
          </h2>
          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-slate-200 rounded-lg">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-3 sm:p-4 text-left flex items-center justify-between hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <span className="font-medium text-slate-800 text-sm sm:text-base pr-4">
                    {faq.question}
                  </span>
                  <i className={`ri-arrow-down-s-line w-5 h-5 text-slate-500 transition-transform flex-shrink-0 ${
                    openFaq === index ? 'rotate-180' : ''
                  }`}></i>
                </button>
                {openFaq === index && (
                  <div className="px-3 sm:px-4 pb-3 sm:pb-4">
                    <p className="text-slate-600 text-sm">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}