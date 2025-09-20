import { Layout } from "@/components/Layout";
import { useState } from "react";

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
}

const plans: Plan[] = [
  {
    id: "teste",
    name: "Teste",
    description: "Com 5 edições grátis sem compromisso",
    price: "Gratuito",
    credits: "5 edições",
    features: [
      { text: "Sem assinar cartão", included: true },
      { text: "Disponível para qualquer pessoa", included: true },
    ],
    buttonText: "Quero implementar no WhatsApp",
    buttonVariant: "primary"
  },
  {
    id: "micro",
    name: "Micro",
    description: "Perfeito para uso pessoal e ocasional",
    price: "R$ 9,97",
    period: "/mês",
    credits: "25 edições/mês",
    features: [
      { text: "25 fotos editadas por mês", included: true },
      { text: "Edição via WhatsApp", included: true },
      { text: "Remoção de fundo", included: true },
      { text: "Ajustes de iluminação", included: true },
      { text: "Redimensionamento", included: true },
      { text: "E muito mais +", included: true },
    ],
    isPopular: true,
    isCurrent: true,
    buttonText: "Plano Atual",
    buttonVariant: "current"
  },
  {
    id: "meso",
    name: "Meso",
    description: "Ideal para autônomos e criadores regulares",
    price: "R$ 49,97",
    period: "/mês",
    credits: "45 edições/mês",
    features: [
      { text: "45 fotos editadas por mês", included: true },
      { text: "Edição via WhatsApp", included: true },
      { text: "Todos os recursos do Micro", included: true },
      { text: "Processamento prioritário", included: true },
      { text: "Suporte prioritário", included: true },
    ],
    buttonText: "Fazer Upgrade",
    buttonVariant: "primary"
  },
  {
    id: "macro",
    name: "Macro",
    description: "Para operações de alto volume",
    price: "R$ 79,97",
    period: "/mês",
    credits: "Ilimitado (uso justo)",
    features: [
      { text: "Edições ilimitadas (uso justo)", included: true },
      { text: "Edição via WhatsApp", included: true },
      { text: "Todos os recursos anteriores", included: true },
      { text: "Processamento super prioritário", included: true },
      { text: "Suporte dedicado", included: true },
    ],
    buttonText: "Fazer Upgrade",
    buttonVariant: "primary"
  }
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

  const getButtonStyles = (variant: string) => {
    switch (variant) {
      case "current":
        return "bg-slate-400 text-white cursor-not-allowed";
      case "secondary":
        return "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200";
      default:
        return "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5";
    }
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

          {/* Planos Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {plans.map((plan) => (
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
                  {plan.id === "micro" && (
                    <p className="text-xs text-slate-500 mt-1">1º mês • Depois R$ 29,97</p>
                  )}
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

                <button
                  disabled={plan.buttonVariant === "current"}
                  className={`w-full py-2.5 px-4 rounded-lg font-medium transition-all duration-200 text-sm ${getButtonStyles(plan.buttonVariant)}`}
                >
                  {plan.buttonText}
                </button>
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