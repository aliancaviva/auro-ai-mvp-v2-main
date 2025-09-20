import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-auro">
      <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
        <h1 className="mb-4 text-4xl font-bold text-slate-800">404</h1>
        <p className="mb-4 text-xl text-slate-600">Oops! Página não encontrada</p>
        <a href="/" className="text-emerald-600 underline hover:text-emerald-700 transition-colors">
          Voltar ao Dashboard
        </a>
      </div>
    </div>
  );
};

export default NotFound;
