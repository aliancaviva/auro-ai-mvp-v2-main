import { Layout } from "@/components/Layout";

export default function Ajuda() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Ajuda</h1>
          <p className="text-slate-600">Tutoriais e suporte técnico</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg text-center">
          <i className="ri-question-line text-6xl text-slate-400 mb-4"></i>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Em desenvolvimento</h2>
          <p className="text-slate-600">Esta funcionalidade estará disponível em breve.</p>
        </div>
      </div>
    </Layout>
  );
}