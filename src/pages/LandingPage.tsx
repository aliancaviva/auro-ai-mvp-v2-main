import { Link } from "react-router-dom";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import logoImage from "@/assets/logo.png";
import { GifCarousel } from "@/components/GifCarousel";
import gifExplain from "@/assets/gif_explain.gif";

export default function LandingPage() {
  const { navigateWithAuth } = useAuthGuard();
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header with app styling but landing functionality */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-lg border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center">
              <img src={logoImage} alt="AuroAI" className="h-8" />
            </Link>

            <div className="flex items-center gap-4">
              <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
                <button 
                  onClick={() => scrollToSection('beneficios')}
                  className="text-slate-700 hover:text-emerald-600 transition-colors cursor-pointer text-sm lg:text-base font-medium"
                >
                  Benefícios
                </button>
                <button 
                  onClick={() => scrollToSection('planos')}
                  className="text-slate-700 hover:text-emerald-600 transition-colors cursor-pointer text-sm lg:text-base font-medium"
                >
                  Planos
                </button>
                <button 
                  onClick={() => scrollToSection('depoimentos')}
                  className="text-slate-700 hover:text-emerald-600 transition-colors cursor-pointer text-sm lg:text-base font-medium"
                >
                  Depoimentos
                </button>
                <button 
                  onClick={() => scrollToSection('faq')}
                  className="text-slate-700 hover:text-emerald-600 transition-colors cursor-pointer text-sm lg:text-base font-medium"
                >
                  FAQ
                </button>
              </nav>
              
              <button
                onClick={() => navigateWithAuth("/dashboard")}
                className="whitespace-nowrap cursor-pointer inline-flex items-center justify-center font-medium transition-all duration-200 px-4 py-2 text-sm rounded-lg text-white hover:opacity-90"
                style={{ backgroundColor: '#24A978' }}
              >
                Acessar
              </button>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="relative bg-gradient-to-br from-emerald-50 via-white to-emerald-50 pt-16 sm:pt-20">
          <div className="container mx-auto px-3 sm:px-4 py-12 sm:py-20 lg:py-28">
            <div className="text-center space-y-8 max-w-4xl mx-auto">
              <div className="space-y-6 sm:space-y-8">
                <div className="space-y-3 sm:space-y-4">
                  <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                    <span className="text-emerald-600">Mande a foto.</span><br />Receba pronta.
                  </h1>
                  <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 leading-relaxed">
                    Seu editor pessoal inteligente no WhatsApp. <br /><span className="font-semibold">Sem baixar nenhum app de edição.</span>
                  </p>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={() => scrollToSection('planos')}
                    className="font-semibold rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover:shadow-xl px-6 py-3 text-sm sm:px-8 sm:py-4 sm:text-base lg:text-lg min-w-fit"
                  >
                    <i className="ri-whatsapp-line mr-2 text-lg sm:text-xl flex-shrink-0"></i>
                    <span className="truncate">Quero implementar no WhatsApp</span>
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-6 pt-2 sm:pt-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-emerald-500 rounded-full border-2 border-white"></div>
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full border-2 border-white"></div>
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-500 rounded-full border-2 border-white"></div>
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-pink-500 rounded-full border-2 border-white flex items-center justify-center text-xs text-white font-bold">+</div>
                    </div>
                    <span className="text-xs sm:text-sm text-gray-600">+5.000 fotos editadas</span>
                  </div>

                  <div className="flex items-center space-x-1">
                    <div className="flex text-yellow-400">
                      <i className="ri-star-fill text-sm sm:text-base"></i>
                      <i className="ri-star-fill text-sm sm:text-base"></i>
                      <i className="ri-star-fill text-sm sm:text-base"></i>
                      <i className="ri-star-fill text-sm sm:text-base"></i>
                      <i className="ri-star-fill text-sm sm:text-base"></i>
                    </div>
                    <span className="text-xs sm:text-sm text-gray-600">4.9/5</span>
                  </div>
                </div>
              </div>

              {/* Carrossel de GIFs do processo */}
              <div className="mt-12 sm:mt-16 -mx-3 sm:-mx-4">
                <GifCarousel />
              </div>
            </div>
          </div>
        </section>

        {/* BENEFÍCIOS */}
        <section id="beneficios" className="py-12 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 md:mb-16">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6">Simples e fácil de instalar</h2>
              <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto">Em apenas 3 passos você estará editando suas fotos diretamente pelo WhatsApp</p>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-3 gap-2 md:gap-8 mb-8 md:mb-16">
              <div className="text-center group">
                <div className="relative mb-2 md:mb-6">
                  <div className="w-12 h-12 md:w-20 md:h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto group-hover:bg-emerald-500 transition-colors duration-300">
                    <i className="ri-user-add-line text-lg md:text-3xl text-emerald-600 group-hover:text-white transition-colors duration-300"></i>
                  </div>
                  <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-6 h-6 md:w-8 md:h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs md:text-sm font-bold">1</div>
                </div>
                <h3 className="text-sm md:text-xl font-semibold text-gray-900 mb-1 md:mb-3 leading-tight">Cadastre-se em menos de 1 minuto</h3>
                <p className="text-xs md:text-base text-gray-600 hidden md:block">Processo super rápido e simples</p>
              </div>

              <div className="text-center group">
                <div className="relative mb-2 md:mb-6">
                  <div className="w-12 h-12 md:w-20 md:h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto group-hover:bg-emerald-500 transition-colors duration-300">
                    <i className="ri-whatsapp-line text-lg md:text-3xl text-emerald-600 group-hover:text-white transition-colors duration-300"></i>
                  </div>
                  <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-6 h-6 md:w-8 md:h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs md:text-sm font-bold">2</div>
                </div>
                <h3 className="text-sm md:text-xl font-semibold text-gray-900 mb-1 md:mb-3 leading-tight">Conecte seu WhatsApp com 1 clique</h3>
                <p className="text-xs md:text-base text-gray-600 hidden md:block">Integração automática e segura</p>
              </div>

              <div className="text-center group">
                <div className="relative mb-2 md:mb-6">
                  <div className="w-12 h-12 md:w-20 md:h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto group-hover:bg-emerald-500 transition-colors duration-300">
                    <i className="ri-image-line text-lg md:text-3xl text-emerald-600 group-hover:text-white transition-colors duration-300"></i>
                  </div>
                  <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-6 h-6 md:w-8 md:h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs md:text-sm font-bold">3</div>
                </div>
                <h3 className="text-sm md:text-xl font-semibold text-gray-900 mb-1 md:mb-3 leading-tight">Mande sua primeira foto</h3>
                <p className="text-xs md:text-base text-gray-600 hidden md:block">Para o editor pessoal inteligente</p>
              </div>
            </div>

            <div className="relative max-w-4xl mx-auto mt-8 md:mt-12">
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={gifExplain}
                  alt="Como funciona o processo de edição"
                  className="w-full h-[32rem] md:h-[40rem] lg:h-[42rem] object-contain bg-transparent mx-auto"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        {/* PLANOS */}
        <section id="planos" className="py-12 md:py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 md:mb-16">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6">Escolha seu plano</h2>
              <div className="bg-emerald-100 text-emerald-800 px-4 md:px-6 py-2 md:py-3 rounded-full inline-block mb-6 md:mb-8 font-semibold text-sm md:text-base">
                ⚡ Bônus: Primeiro mês do plano Micro por apenas R$9,97
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto">
              {/* CARD: Gratuito */}
              <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 ring-4 ring-emerald-500 lg:transform lg:scale-105">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold">Teste Grátis</div>
                </div>

                <div className="p-4 md:p-6">
                  <div className="text-center mb-4 md:mb-6">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Gratuito</h3>
                    <p className="text-gray-600 text-xs md:text-sm mb-3 md:mb-4">Experimente</p>

                    <div className="mb-3 md:mb-4">
                      <div className="flex items-center justify-center">
                        <span className="text-2xl md:text-4xl font-bold text-gray-900">R$ 0</span>
                      </div>
                    </div>

                    <div className="bg-emerald-100 text-emerald-800 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold mb-3 md:mb-4">5 edições grátis</div>
                  </div>

                  <div className="mb-4 md:mb-6">
                    <p className="text-gray-700 text-xs md:text-sm leading-relaxed">
                      Teste completo sem compromisso. Experimente todos os recursos antes de escolher um plano.
                    </p>
                  </div>

                  <div className="mb-4 md:mb-6">
                    <div className="flex items-center mb-2">
                      <i className="ri-check-line text-emerald-500 mr-2 text-sm"></i>
                      <span className="text-gray-700 text-xs md:text-sm">Sem assinar cartão</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <i className="ri-check-line text-emerald-500 mr-2 text-sm"></i>
                      <span className="text-gray-700 text-xs md:text-sm">Disponível para qualquer pessoa</span>
                    </div>
                  </div>

                  <div className="mb-4 md:mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2 md:mb-3 text-sm md:text-base">Ideal para:</h4>
                    <div className="text-gray-600 text-xs md:text-sm mb-1">• Teste completo da plataforma</div>
                    <div className="text-gray-600 text-xs md:text-sm mb-1">• Sem compromisso ou cartão</div>
                    <div className="text-gray-600 text-xs md:text-sm mb-1">• Acesso a todos os recursos</div>
                    <div className="text-gray-600 text-xs md:text-sm mb-1">• Suporte via WhatsApp</div>
                  </div>

                  <div className="mb-4 md:mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2 md:mb-3 text-sm md:text-base">Recursos inclusos:</h4>
                    <div className="text-gray-600 text-xs md:text-sm mb-1">• 5 fotos editadas para teste</div>
                    <div className="text-gray-600 text-xs md:text-sm mb-1">• Edição via WhatsApp</div>
                    <div className="text-gray-600 text-xs md:text-sm mb-1">• Remoção de fundo</div>
                    <div className="text-gray-600 text-xs md:text-sm mb-1">• Ajustes de iluminação</div>
                    <div className="text-gray-600 text-xs md:text-sm mb-1">• Redimensionamento</div>
                    <div className="text-gray-600 text-xs md:text-sm mb-1">• Todos os recursos disponíveis</div>
                  </div>

                  <button
                    onClick={() => navigateWithAuth("/dashboard")}
                    className="font-semibold rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover:shadow-xl px-4 py-2.5 text-xs sm:px-6 sm:py-3 sm:text-sm lg:text-base w-full text-sm md:text-base"
                  >
                    Quero implementar no WhatsApp
                  </button>
                </div>
              </div>

              {/* CARD: Micro */}
              <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="p-4 md:p-6">
                  <div className="text-center mb-4 md:mb-6">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Micro</h3>
                    <p className="text-gray-600 text-xs md:text-sm mb-3 md:mb-4">Ideal para: Pessoas físicas</p>

                    <div className="mb-3 md:mb-4">
                      <div className="text-gray-400 line-through text-xs md:text-sm">R$ 29,97</div>
                      <div className="flex items-center justify-center">
                        <span className="text-2xl md:text-4xl font-bold text-gray-900">R$ 9,97</span>
                        <span className="text-gray-600 ml-1 text-sm md:text-base">/mês</span>
                      </div>
                    </div>

                    <div className="bg-emerald-100 text-emerald-800 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold mb-3 md:mb-4">25 edições/mês</div>
                  </div>

                  <div className="mb-4 md:mb-6">
                    <p className="text-gray-700 text-xs md:text-sm leading-relaxed">
                      Perfil sempre apresentável sem gastar tempo. Ideal para documentos, currículos e uso ocasional.
                    </p>
                  </div>

                  <div className="mb-4 md:mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2 md:mb-3 text-sm md:text-base">Ideal para:</h4>
                    <div className="text-gray-600 text-xs md:text-sm mb-1">• Currículos e fotos 3×4</div>
                    <div className="text-gray-600 text-xs md:text-sm mb-1">• Retratos para redes sociais/LinkedIn</div>
                    <div className="text-gray-600 text-xs md:text-sm mb-1">• Pequenos anúncios ocasionais</div>
                    <div className="text-gray-600 text-xs md:text-sm mb-1">• Fotos de produto pontuais</div>
                  </div>

                  <div className="mb-4 md:mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2 md:mb-3 text-sm md:text-base">Recursos inclusos:</h4>
                    <div className="text-gray-600 text-xs md:text-sm mb-1">• 25 fotos editadas por mês</div>
                    <div className="text-gray-600 text-xs md:text-sm mb-1">• Edição via WhatsApp</div>
                    <div className="text-gray-600 text-xs md:text-sm mb-1">• Remoção de fundo</div>
                    <div className="text-gray-600 text-xs md:text-sm mb-1">• Ajustes de iluminação</div>
                    <div className="text-gray-600 text-xs md:text-sm mb-1">• Redimensionamento</div>
                    <div className="text-gray-600 text-xs md:text-sm mb-1">• E muito mais →</div>
                  </div>

                  <button
                    onClick={() => navigateWithAuth("/dashboard")}
                    className="font-semibold rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover:shadow-xl px-4 py-2.5 text-xs sm:px-6 sm:py-3 sm:text-sm lg:text-base w-full text-sm md:text-base"
                  >
                    Quero implementar no WhatsApp
                  </button>
                </div>
              </div>

              {/* CARD: Meso (Mais Popular) */}
              <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 ring-4 ring-emerald-500 lg:transform lg:scale-105">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold">Mais Popular</div>
                </div>

                <div className="p-4 md:p-6">
                  <div className="text-center mb-4 md:mb-6">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Meso</h3>
                    <p className="text-gray-600 text-xs md:text-sm mb-3 md:mb-4">Ideal para: Profissionais liberais</p>

                    <div className="mb-3 md:mb-4">
                      <div className="flex items-center justify-center">
                        <span className="text-2xl md:text-4xl font-bold text-gray-900">R$ 49,97</span>
                        <span className="text-gray-600 ml-1 text-sm md:text-base">/mês</span>
                      </div>
                    </div>

                    <div className="bg-emerald-100 text-emerald-800 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold mb-3 md:mb-4">45 edições/mês</div>
                  </div>

                  <div className="mb-4 md:mb-6">
                    <p className="text-gray-700 text-xs md:text-sm leading-relaxed">
                      Consistência para quem publica com frequência: criadores iniciantes, consultores, profissionais liberais.
                    </p>
                  </div>

                  <div className="mb-4 md:mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2 md:mb-3 text-sm md:text-base">Ideal para:</h4>
                    <div className="text-gray-600 text-xs md:text-sm mb-1">• Consultores e designers</div>
                    <div className="text-gray-600 text-xs md:text-sm mb-1">• Publicitários e fotógrafos</div>
                    <div className="text-gray-600 text-xs md:text-sm mb-1">• Corretores de imóveis</div>
                    <div className="text-gray-600 text-xs md:text-sm mb-1">• Pequenas lojas e restaurantes</div>
                    <div className="text-gray-600 text-xs md:text-sm mb-1">• Criadores iniciantes</div>
                    <div className="text-gray-600 text-xs md:text-sm mb-1">• Posts regulares e campanhas</div>
                  </div>

                  <div className="mb-4 md:mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2 md:mb-3 text-sm md:text-base">Recursos inclusos:</h4>
                    <div className="text-gray-600 text-xs md:text-sm mb-1">• 45 fotos editadas por mês</div>
                    <div className="text-gray-600 text-xs md:text-sm mb-1">• Edição via WhatsApp</div>
                    <div className="text-gray-600 text-xs md:text-sm mb-1">• Todos os recursos do Micro</div>
                    <div className="text-gray-600 text-xs md:text-sm mb-1">• Processamento prioritário</div>
                    <div className="text-gray-600 text-xs md:text-sm mb-1">• Suporte prioritário</div>
                  </div>

                  <button
                    onClick={() => navigateWithAuth("/dashboard")}
                    className="font-semibold rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover:shadow-xl px-4 py-2.5 text-xs sm:px-6 sm:py-3 sm:text-sm lg:text-base w-full text-sm md:text-base"
                  >
                    Quero implementar no WhatsApp
                  </button>
                </div>
              </div>

              {/* CARD: Macro */}
              <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="p-4 md:p-6">
                  <div className="text-center mb-4 md:mb-6">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Macro</h3>
                    <p className="text-gray-600 text-xs md:text-sm mb-3 md:mb-4">Ideal para: Empresas e agências</p>

                    <div className="mb-3 md:mb-4">
                      <div className="flex items-center justify-center">
                        <span className="text-2xl md:text-4xl font-bold text-gray-900">R$ 79,97</span>
                        <span className="text-gray-600 ml-1 text-sm md:text-base">/mês</span>
                      </div>
                    </div>

                    <div className="bg-emerald-100 text-emerald-800 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold mb-3 md:mb-4">Ilimitado (uso justo)</div>
                  </div>

                  <div className="mb-4 md:mb-6">
                    <p className="text-gray-700 text-xs md:text-sm leading-relaxed">
                      Para negócios e equipes que dependem de imagem todos os dias: lojas virtuais, social media, catálogos e squads de vendas.
                    </p>
                  </div>

                  <div className="mb-4 md:mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2 md:mb-3 text-sm md:text-base">Ideal para:</h4>
                    <div className="text-gray-600 text-xs md:text-sm mb-1">• E-commerces com catálogos grandes</div>
                    <div className="text-gray-600 text-xs md:text-sm mb-1">• Imobiliárias com múltiplos imóveis</div>
                    <div className="text-gray-600 text-xs md:text-sm mb-1">• Equipes de conteúdo</div>
                    <div className="text-gray-600 text-xs md:text-sm mb-1">• Agências avulsas</div>
                    <div className="text-gray-600 text-xs md:text-sm mb-1">• Processamento de lotes diários</div>
                    <div className="text-gray-600 text-xs md:text-sm mb-1">• Operações que precisam de previsibilidade</div>
                  </div>

                  <div className="mb-4 md:mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2 md:mb-3 text-sm md:text-base">Recursos inclusos:</h4>
                    <div className="text-gray-600 text-xs md:text-sm mb-1">• Edições ilimitadas (uso justo)</div>
                    <div className="text-gray-600 text-xs md:text-sm mb-1">• Edição via WhatsApp</div>
                    <div className="text-gray-600 text-xs md:text-sm mb-1">• Todos os recursos anteriores</div>
                    <div className="text-gray-600 text-xs md:text-sm mb-1">• Processamento super prioritário</div>
                    <div className="text-gray-600 text-xs md:text-sm mb-1">• Suporte dedicado</div>
                  </div>

                  <Link
                    to="/dashboard"
                    className="font-semibold rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover:shadow-xl px-4 py-2.5 text-xs sm:px-6 sm:py-3 sm:text-sm lg:text-base w-full text-sm md:text-base"
                  >
                    Quero implementar no WhatsApp
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* E SE EU TIVER DÚVIDAS */}
        <section className="py-12 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 md:mb-16">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6">E se eu tiver dúvidas?</h2>
              <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto">Respondemos as principais preocupações dos nossos usuários</p>
            </div>

            <div className="max-w-4xl mx-auto space-y-4 md:space-y-8 mb-8 md:mb-16">
              <div className="bg-gray-50 rounded-xl md:rounded-2xl overflow-hidden hover:bg-emerald-50 transition-colors duration-300 group">
                <button className="w-full px-4 md:px-8 py-4 md:py-6 text-left flex items-center justify-between hover:bg-gray-50 group-hover:bg-emerald-50 transition-colors cursor-pointer">
                  <div className="flex items-start space-x-3 md:space-x-6 flex-1">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-100 group-hover:bg-emerald-500 rounded-full flex items-center justify-center transition-colors duration-300">
                        <i className="ri-message-2-line text-lg md:text-xl text-emerald-600 group-hover:text-white transition-colors duration-300"></i>
                      </div>
                    </div>
                    <h3 className="text-base md:text-xl font-semibold text-gray-900 flex-1 pr-2">"Deve ser complicado"</h3>
                  </div>
                  <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                    <i className="ri-add-line text-lg md:text-xl text-emerald-600 transition-transform duration-200"></i>
                  </div>
                </button>
              </div>

              <div className="bg-gray-50 rounded-xl md:rounded-2xl overflow-hidden hover:bg-emerald-50 transition-colors duration-300 group">
                <button className="w-full px-4 md:px-8 py-4 md:py-6 text-left flex items-center justify-between hover:bg-gray-50 group-hover:bg-emerald-50 transition-colors cursor-pointer">
                  <div className="flex items-start space-x-3 md:space-x-6 flex-1">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-100 group-hover:bg-emerald-500 rounded-full flex items-center justify-center transition-colors duration-300">
                        <i className="ri-user-heart-line text-lg md:text-xl text-emerald-600 group-hover:text-white transition-colors duration-300"></i>
                      </div>
                    </div>
                    <h3 className="text-base md:text-xl font-semibold text-gray-900 flex-1 pr-2">"Funciona para mim?"</h3>
                  </div>
                  <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                    <i className="ri-add-line text-lg md:text-xl text-emerald-600 transition-transform duration-200"></i>
                  </div>
                </button>
              </div>

              <div className="bg-gray-50 rounded-xl md:rounded-2xl overflow-hidden hover:bg-emerald-50 transition-colors duration-300 group">
                <button className="w-full px-4 md:px-8 py-4 md:py-6 text-left flex items-center justify-between hover:bg-gray-50 group-hover:bg-emerald-50 transition-colors cursor-pointer">
                  <div className="flex items-start space-x-3 md:space-x-6 flex-1">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-100 group-hover:bg-emerald-500 rounded-full flex items-center justify-center transition-colors duration-300">
                        <i className="ri-shield-check-line text-lg md:text-xl text-emerald-600 group-hover:text-white transition-colors duration-300"></i>
                      </div>
                    </div>
                    <h3 className="text-base md:text-xl font-semibold text-gray-900 flex-1 pr-2">"É confiável?"</h3>
                  </div>
                  <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                    <i className="ri-add-line text-lg md:text-xl text-emerald-600 transition-transform duration-200"></i>
                  </div>
                </button>
              </div>

              <div className="bg-gray-50 rounded-xl md:rounded-2xl overflow-hidden hover:bg-emerald-50 transition-colors duration-300 group">
                <button className="w-full px-4 md:px-8 py-4 md:py-6 text-left flex items-center justify-between hover:bg-gray-50 group-hover:bg-emerald-50 transition-colors cursor-pointer">
                  <div className="flex items-start space-x-3 md:space-x-6 flex-1">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-100 group-hover:bg-emerald-500 rounded-full flex items-center justify-center transition-colors duration-300">
                        <i className="ri-gift-line text-lg md:text-xl text-emerald-600 group-hover:text-white transition-colors duration-300"></i>
                      </div>
                    </div>
                    <h3 className="text-base md:text-xl font-semibold text-gray-900 flex-1 pr-2">"E se não gostar?"</h3>
                  </div>
                  <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                    <i className="ri-add-line text-lg md:text-xl text-emerald-600 transition-transform duration-200"></i>
                  </div>
                </button>
              </div>

              <div className="bg-gray-50 rounded-xl md:rounded-2xl overflow-hidden hover:bg-emerald-50 transition-colors duration-300 group">
                <button className="w-full px-4 md:px-8 py-4 md:py-6 text-left flex items-center justify-between hover:bg-gray-50 group-hover:bg-emerald-50 transition-colors cursor-pointer">
                  <div className="flex items-start space-x-3 md:space-x-6 flex-1">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-100 group-hover:bg-emerald-500 rounded-full flex items-center justify-center transition-colors duration-300">
                        <i className="ri-chat-voice-line text-lg md:text-xl text-emerald-600 group-hover:text-white transition-colors duration-300"></i>
                      </div>
                    </div>
                    <h3 className="text-base md:text-xl font-semibold text-gray-900 flex-1 pr-2">"Não sou bom de tecnologia"</h3>
                  </div>
                  <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                    <i className="ri-add-line text-lg md:text-xl text-emerald-600 transition-transform duration-200"></i>
                  </div>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto">
              <div className="text-center bg-gray-50 rounded-xl p-4 md:p-6">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <i className="ri-shield-check-line text-xl md:text-2xl text-emerald-600"></i>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">100% Seguro</h4>
                <p className="text-gray-600 text-xs md:text-sm">Suas fotos são protegidas</p>
              </div>

              <div className="text-center bg-gray-50 rounded-xl p-4 md:p-6">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <i className="ri-time-line text-xl md:text-2xl text-emerald-600"></i>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">Resultados Rápidos</h4>
                <p className="text-gray-600 text-xs md:text-sm">Edição em poucos segundos</p>
              </div>

              <div className="text-center bg-gray-50 rounded-xl p-4 md:p-6">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <i className="ri-customer-service-2-line text-xl md:text-2xl text-emerald-600"></i>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">Suporte Dedicado</h4>
                <p className="text-gray-600 text-xs md:text-sm">Ajuda quando precisar</p>
              </div>
            </div>
          </div>
        </section>

        {/* DEPOIMENTOS */}
        <section id="depoimentos" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Mais de 5.000 fotos editadas no último mês</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">Pessoas reais, resultados reais.</p>

              <div className="flex items-center justify-center space-x-8 mb-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600">5.000+</div>
                  <div className="text-gray-600">Fotos Editadas</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600">4.9</div>
                  <div className="text-gray-600">Avaliação Média</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600">1.200+</div>
                  <div className="text-gray-600">Usuários Ativos</div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  <img alt="Maria Silva" className="w-12 h-12 rounded-full object-cover mr-4" src="https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20a%20young%20woman%20designer%2C%20clean%20white%20background%2C%20confident%20smile%2C%20modern%20professional%20style%2C%20high%20quality%20portrait%20photography&width=80&height=80&seq=testimonial-1&orientation=squarish" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Maria Silva</h4>
                    <p className="text-gray-600 text-sm">Designer Freelancer</p>
                  </div>
                </div>
                <div className="flex mb-4"><i className="ri-star-fill text-yellow-400"></i><i className="ri-star-fill text-yellow-400"></i><i className="ri-star-fill text-yellow-400"></i><i className="ri-star-fill text-yellow-400"></i><i className="ri-star-fill text-yellow-400"></i></div>
                <p className="text-gray-700 leading-relaxed">"Revolucionou meu trabalho! Antes eu perdia horas editando fotos, agora é só mandar no WhatsApp e pronto. Meus clientes ficam impressionados com a qualidade."</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  <img alt="João Santos" className="w-12 h-12 rounded-full object-cover mr-4" src="https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20a%20middle-aged%20businessman%20real%20estate%20agent%2C%20clean%20white%20background%2C%20professional%20suit%2C%20confident%20expression%2C%20high%20quality%20portrait%20photography&width=80&height=80&seq=testimonial-2&orientation=squarish" />
                  <div>
                    <h4 className="font-semibold text-gray-900">João Santos</h4>
                    <p className="text-gray-600 text-sm">Corretor de Imóveis</p>
                  </div>
                </div>
                <div className="flex mb-4"><i className="ri-star-fill text-yellow-400"></i><i className="ri-star-fill text-yellow-400"></i><i className="ri-star-fill text-yellow-400"></i><i className="ri-star-fill text-yellow-400"></i><i className="ri-star-fill text-yellow-400"></i></div>
                <p className="text-gray-700 leading-relaxed">"Minhas fotos de imóveis ficam muito mais profissionais. O que mais me impressiona é a praticidade - uso direto do celular, sem complicação."</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  <img alt="Ana Costa" className="w-12 h-12 rounded-full object-cover mr-4" src="https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20a%20young%20businesswoman%20entrepreneur%2C%20clean%20white%20background%2C%20warm%20smile%2C%20modern%20professional%20style%2C%20high%20quality%20portrait%20photography&width=80&height=80&seq=testimonial-3&orientation=squarish" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Ana Costa</h4>
                    <p className="text-gray-600 text-sm">Loja Online</p>
                  </div>
                </div>
                <div className="flex mb-4"><i className="ri-star-fill text-yellow-400"></i><i className="ri-star-fill text-yellow-400"></i><i className="ri-star-fill text-yellow-400"></i><i className="ri-star-fill text-yellow-400"></i><i className="ri-star-fill text-yellow-400"></i></div>
                <p className="text-gray-700 leading-relaxed">"Meu e-commerce cresceu 40% depois que comecei a usar. As fotos dos produtos ficam impecáveis e isso faz toda a diferença nas vendas."</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  <img alt="Carlos Oliveira" className="w-12 h-12 rounded-full object-cover mr-4" src="https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20a%20creative%20photographer%20man%2C%20clean%20white%20background%2C%20artistic%20expression%2C%20modern%20professional%20style%2C%20high%20quality%20portrait%20photography&width=80&height=80&seq=testimonial-4&orientation=squarish" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Carlos Oliveira</h4>
                    <p className="text-gray-600 text-sm">Fotógrafo</p>
                  </div>
                </div>
                <div className="flex mb-4"><i className="ri-star-fill text-yellow-400"></i><i className="ri-star-fill text-yellow-400"></i><i className="ri-star-fill text-yellow-400"></i><i className="ri-star-fill text-yellow-400"></i><i className="ri-star-fill text-yellow-400"></i></div>
                <p className="text-gray-700 leading-relaxed">"Uso para edições rápidas dos meus clientes. A IA entende exatamente o que eu preciso. Economizo tempo e posso focar na criatividade."</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  <img alt="Lucia Ferreira" className="w-12 h-12 rounded-full object-cover mr-4" src="https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20a%20mature%20businesswoman%20consultant%2C%20clean%20white%20background%2C%20confident%20professional%20look%2C%20elegant%20style%2C%20high%20quality%20portrait%20photography&width=80&height=80&seq=testimonial-5&orientation=squarish" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Lucia Ferreira</h4>
                    <p className="text-gray-600 text-sm">Consultora</p>
                  </div>
                </div>
                <div className="flex mb-4"><i className="ri-star-fill text-yellow-400"></i><i className="ri-star-fill text-yellow-400"></i><i className="ri-star-fill text-yellow-400"></i><i className="ri-star-fill text-yellow-400"></i><i className="ri-star-fill text-yellow-400"></i></div>
                <p className="text-gray-700 leading-relaxed">"Perfeito para manter minha presença digital sempre impecável. Uso tanto para LinkedIn quanto para materiais de apresentação."</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  <img alt="Pedro Almeida" className="w-12 h-12 rounded-full object-cover mr-4" src="https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20a%20young%20creative%20social%20media%20manager%2C%20clean%20white%20background%2C%20trendy%20style%2C%20confident%20smile%2C%20high%20quality%20portrait%20photography&width=80&height=80&seq=testimonial-6&orientation=squarish" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Pedro Almeida</h4>
                    <p className="text-gray-600 text-sm">Social Media</p>
                  </div>
                </div>
                <div className="flex mb-4"><i className="ri-star-fill text-yellow-400"></i><i className="ri-star-fill text-yellow-400"></i><i className="ri-star-fill text-yellow-400"></i><i className="ri-star-fill text-yellow-400"></i><i className="ri-star-fill text-yellow-400"></i></div>
                <p className="text-gray-700 leading-relaxed">"Consigo entregar conteúdo de qualidade para meus clientes muito mais rápido. A praticidade do WhatsApp é genial!"</p>
              </div>
            </div>

            <div className="mt-16 text-center">
              <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <div className="flex text-yellow-400 text-2xl">
                    <i className="ri-star-fill"></i><i className="ri-star-fill"></i><i className="ri-star-fill"></i><i className="ri-star-fill"></i><i className="ri-star-fill"></i>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">4.9/5</span>
                </div>
                <p className="text-gray-600">Baseado em mais de 800 avaliações de usuários reais</p>
              </div>
            </div>
          </div>
        </section>

        {/* PARA QUEM É / NÃO É */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Para quem é / Não é</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">Seja transparente sobre suas expectativas</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <div className="bg-emerald-50 rounded-2xl p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mr-4"><i className="ri-check-line text-2xl text-white"></i></div>
                  <h3 className="text-2xl font-bold text-gray-900">Esse programa é para você se…</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0"><i className="ri-check-line text-white text-sm"></i></div>
                    <p className="text-gray-700 leading-relaxed">Quer fotos limpas e consistentes sem aprender softwares</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0"><i className="ri-check-line text-white text-sm"></i></div>
                    <p className="text-gray-700 leading-relaxed">Precisa de imagens melhores para currículo, redes sociais, encontros ou documentos</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0"><i className="ri-check-line text-white text-sm"></i></div>
                    <p className="text-gray-700 leading-relaxed">Valoriza praticidade: só mandar a foto no WhatsApp</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0"><i className="ri-check-line text-white text-sm"></i></div>
                    <p className="text-gray-700 leading-relaxed">Quer padronizar imagens de forma rápida e segura</p>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-emerald-100 rounded-xl">
                  <div className="flex items-center">
                    <i className="ri-lightbulb-line text-emerald-600 text-xl mr-2"></i>
                    <p className="text-emerald-800 font-medium">Perfeito para profissionais que valorizam tempo e qualidade</p>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 rounded-2xl p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mr-4"><i className="ri-close-line text-2xl text-white"></i></div>
                  <h3 className="text-2xl font-bold text-gray-900">Não é para quem quer…</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0"><i className="ri-close-line text-white text-sm"></i></div>
                    <p className="text-gray-700 leading-relaxed">Criar manipulações artísticas extremas (ex.: transformações de fantasia)</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0"><i className="ri-close-line text-white text-sm"></i></div>
                    <p className="text-gray-700 leading-relaxed">Passar horas mexendo em editores complexos</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0"><i className="ri-close-line text-white text-sm"></i></div>
                    <p className="text-gray-700 leading-relaxed">Usar para spam ou automações em massa (uso abusivo não é permitido)</p>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-red-100 rounded-xl">
                  <div className="flex items-center">
                    <i className="ri-information-line text-red-600 text-xl mr-2"></i>
                    <p className="text-red-800 font-medium">Focamos em praticidade e resultados profissionais rápidos</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-16">
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-8 text-white max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold mb-4">Se identificou?</h3>
                <p className="text-emerald-100 mb-6">Junte-se a mais de 1.200 pessoas que já transformaram suas fotos</p>
        <button
          onClick={() => navigateWithAuth("/dashboard")}
          className="bg-white text-emerald-600 font-semibold px-4 py-3 sm:px-8 sm:py-3 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer whitespace-nowrap text-sm sm:text-base inline-flex items-center"
        >
          <i className="ri-whatsapp-line mr-2"></i>Começar Agora Gratuitamente
        </button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-12 md:py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 md:mb-16">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6">Perguntas Frequentes</h2>
              <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto">Tire suas dúvidas sobre nosso editor inteligente</p>
            </div>

            <div className="max-w-3xl mx-auto mb-8 md:mb-16">
              <div className="bg-white rounded-xl md:rounded-2xl shadow-lg mb-3 md:mb-4 overflow-hidden">
                <button className="w-full px-4 md:px-8 py-4 md:py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer">
                  <h3 className="text-sm md:text-lg font-semibold text-gray-900 pr-4 flex-1">Como funciona o uso justo no plano Macro?</h3>
                  <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center"><i className="ri-subtract-line text-lg md:text-xl text-emerald-600 transition-transform duration-200"></i></div>
                </button>
                <div className="px-4 md:px-8 pb-4 md:pb-6">
                  <div className="pt-3 md:pt-4 border-t border-gray-100">
                    <p className="text-gray-700 leading-relaxed text-sm md:text-base">O uso justo significa que você pode editar quantas fotos precisar para suas operações normais. Evitamos apenas uso abusivo ou revenda do serviço. Para uso comercial regular, não há limites.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl md:rounded-2xl shadow-lg mb-3 md:mb-4 overflow-hidden">
                <button className="w-full px-4 md:px-8 py-4 md:py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer">
                  <h3 className="text-sm md:text-lg font-semibold text-gray-900 pr-4 flex-1">Minhas fotos ficam armazenadas no sistema?</h3>
                  <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center"><i className="ri-add-line text-lg md:text-xl text-emerald-600 transition-transform duration-200"></i></div>
                </button>
              </div>

              <div className="bg-white rounded-xl md:rounded-2xl shadow-lg mb-3 md:mb-4 overflow-hidden">
                <button className="w-full px-4 md:px-8 py-4 md:py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer">
                  <h3 className="text-sm md:text-lg font-semibold text-gray-900 pr-4 flex-1">Funciona para qualquer tipo de foto?</h3>
                  <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center"><i className="ri-add-line text-lg md:text-xl text-emerald-600 transition-transform duration-200"></i></div>
                </button>
              </div>

              <div className="bg-white rounded-xl md:rounded-2xl shadow-lg mb-3 md:mb-4 overflow-hidden">
                <button className="w-full px-4 md:px-8 py-4 md:py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer">
                  <h3 className="text-sm md:text-lg font-semibold text-gray-900 pr-4 flex-1">Como cancelar se não gostar?</h3>
                  <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center"><i className="ri-add-line text-lg md:text-xl text-emerald-600 transition-transform duration-200"></i></div>
                </button>
              </div>

              <div className="bg-white rounded-xl md:rounded-2xl shadow-lg mb-3 md:mb-4 overflow-hidden">
                <button className="w-full px-4 md:px-8 py-4 md:py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer">
                  <h3 className="text-sm md:text-lg font-semibold text-gray-900 pr-4 flex-1">Preciso instalar algum aplicativo?</h3>
                  <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center"><i className="ri-add-line text-lg md:text-xl text-emerald-600 transition-transform duration-200"></i></div>
                </button>
              </div>

              <div className="bg-white rounded-xl md:rounded-2xl shadow-lg mb-3 md:mb-4 overflow-hidden">
                <button className="w-full px-4 md:px-8 py-4 md:py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer">
                  <h3 className="text-sm md:text-lg font-semibold text-gray-900 pr-4 flex-1">Quanto tempo demora para receber a foto editada?</h3>
                  <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center"><i className="ri-add-line text-lg md:text-xl text-emerald-600 transition-transform duration-200"></i></div>
                </button>
              </div>

              <div className="bg-white rounded-xl md:rounded-2xl shadow-lg mb-3 md:mb-4 overflow-hidden">
                <button className="w-full px-4 md:px-8 py-4 md:py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer">
                  <h3 className="text-sm md:text-lg font-semibold text-gray-900 pr-4 flex-1">Posso fazer pedidos específicos de edição?</h3>
                  <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center"><i className="ri-add-line text-lg md:text-xl text-emerald-600 transition-transform duration-200"></i></div>
                </button>
              </div>

              <div className="bg-white rounded-xl md:rounded-2xl shadow-lg mb-3 md:mb-4 overflow-hidden">
                <button className="w-full px-4 md:px-8 py-4 md:py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer">
                  <h3 className="text-sm md:text-lg font-semibold text-gray-900 pr-4 flex-1">Tem garantia de qualidade?</h3>
                  <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center"><i className="ri-add-line text-lg md:text-xl text-emerald-600 transition-transform duration-200"></i></div>
                </button>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white rounded-xl md:rounded-2xl p-6 md:pb-8 shadow-lg max-w-2xl mx-auto">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <i className="ri-customer-service-2-line text-xl md:text-2xl text-emerald-600"></i>
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">Ainda tem dúvidas?</h3>
                <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">Nossa equipe está pronta para ajudar você</p>
        <button
          onClick={() => navigateWithAuth("/dashboard")}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 md:px-6 py-2 md:py-3 rounded-lg transition-colors cursor-pointer whitespace-nowrap text-sm md:text-base inline-flex items-center"
        >
          <i className="ri-whatsapp-line mr-2"></i>Falar com Suporte
        </button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section id="comprar" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700">
          <div className="container mx-auto px-3 sm:px-4">
            <div className="max-w-4xl mx-auto text-center text-white mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6">Pronto para transformar suas fotos?</h2>
              <p className="text-lg sm:text-xl lg:text-2xl text-emerald-100 mb-6 sm:mb-8">Junte-se a mais de 1.200 pessoas que já descobriram a praticidade de editar fotos pelo WhatsApp</p>

              <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 sm:mb-3 flex items-center justify-center"><i className="ri-time-line text-2xl sm:text-3xl text-emerald-100"></i></div>
                  <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Resultados em Segundos</h3>
                  <p className="text-emerald-100 text-xs sm:text-sm">Edição profissional sem espera</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 sm:mb-3 flex items-center justify-center"><i className="ri-shield-check-line text-2xl sm:text-3xl text-emerald-100"></i></div>
                  <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">100% Seguro</h3>
                  <p className="text-emerald-100 text-xs sm:text-sm">Suas fotos são protegidas</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 sm:mb-3 flex items-center justify-center"><i className="ri-customer-service-2-line text-2xl sm:text-3xl text-emerald-100"></i></div>
                  <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Suporte Dedicado</h3>
                  <p className="text-emerald-100 text-xs sm:text-sm">Ajuda quando precisar</p>
                </div>
              </div>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8">
                <div className="text-center mb-6 sm:mb-8">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Comece agora gratuitamente</h3>
                  <div className="bg-emerald-100 text-emerald-800 px-3 py-2 sm:px-4 sm:py-2 rounded-full inline-block mb-3 sm:mb-4 font-semibold text-sm sm:text-base">⚡ 5 edições grátis para testar</div>
                </div>

                <form id="whatsapp-signup" className="space-y-4 sm:space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label htmlFor="name" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Nome Completo *</label>
                      <input 
                        id="name" 
                        required 
                        className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm" 
                        placeholder="Seu nome completo" 
                        type="text" 
                        name="name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">E-mail *</label>
                      <input 
                        id="email" 
                        required 
                        className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm" 
                        placeholder="seu@email.com" 
                        type="email" 
                        name="email"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="plan" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Plano de Interesse</label>
                    <select 
                      id="plan" 
                      name="plan" 
                      className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm pr-8"
                    >
                      <option value="gratuito">Gratuito (5 edições)</option>
                      <option value="micro">Micro - R$ 9,97/mês</option>
                      <option value="meso">Meso - R$ 49,97/mês</option>
                      <option value="macro">Macro - R$ 79,97/mês</option>
                    </select>
                  </div>

          <button
            type="submit"
            onClick={() => navigateWithAuth("/dashboard")}
            className="font-semibold rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover:shadow-xl px-6 py-3 text-sm sm:px-8 sm:py-4 sm:text-base lg:text-lg w-full"
          >
            <i className="ri-whatsapp-line mr-2 text-base sm:text-lg flex-shrink-0"></i>
            <span className="truncate">Quero implementar no WhatsApp</span>
          </button>

                  <p className="text-center text-gray-500 text-xs mt-3 sm:mt-4">Ao se cadastrar, você concorda com nossos termos de uso e política de privacidade</p>
                </form>
              </div>
            </div>

            <div className="text-center mt-12 sm:mt-16">
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-8 text-emerald-100">
                <div className="flex items-center"><i className="ri-shield-check-line text-base sm:text-xl mr-2"></i><span className="text-xs sm:text-sm">Dados protegidos</span></div>
                <div className="flex items-center"><i className="ri-time-line text-base sm:text-xl mr-2"></i><span className="text-xs sm:text-sm">Cancelamento fácil</span></div>
                <div className="flex items-center"><i className="ri-customer-service-2-line text-base sm:text-xl mr-2"></i><span className="text-xs sm:text-sm">Suporte 24h</span></div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold mb-4 font-pacifico">AuroAI</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Seu editor pessoal inteligente no WhatsApp. Transforme suas fotos em segundos, 
                sem complicação, direto do seu celular.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-emerald-600 rounded-full flex items-center justify-center transition-colors cursor-pointer">
                  <i className="ri-whatsapp-line text-lg"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-emerald-600 rounded-full flex items-center justify-center transition-colors cursor-pointer">
                  <i className="ri-instagram-line text-lg"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-emerald-600 rounded-full flex items-center justify-center transition-colors cursor-pointer">
                  <i className="ri-linkedin-line text-lg"></i>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Links Rápidos</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button 
                    onClick={() => scrollToSection('beneficios')}
                    className="hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    Benefícios
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('planos')}
                    className="hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    Planos e Preços
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('depoimentos')}
                    className="hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    Depoimentos
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('faq')}
                    className="hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    FAQ
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-emerald-400 transition-colors cursor-pointer">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors cursor-pointer">Contato</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors cursor-pointer">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors cursor-pointer">Política de Privacidade</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 mb-8">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-emerald-400 mb-2">5.000+</div>
                <div className="text-gray-400">Fotos editadas este mês</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-400 mb-2">1.200+</div>
                <div className="text-gray-400">Usuários ativos</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-400 mb-2">4.9</div>
                <div className="text-gray-400">Avaliação média</div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2025 AuroAI. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}