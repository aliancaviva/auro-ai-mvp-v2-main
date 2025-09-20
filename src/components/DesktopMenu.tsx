import { Link, useLocation, useNavigate } from "react-router-dom";

interface NavItem {
  path: string;
  icon: string;
  label: string;
}

const navItems: NavItem[] = [
  {
    path: "/",
    icon: "ri-home-line",
    label: "Página Inicial"
  },
  {
    path: "/dashboard",
    icon: "ri-dashboard-line",
    label: "Dashboard"
  },
  {
    path: "/biblioteca", 
    icon: "ri-image-line",
    label: "Biblioteca"
  },
  {
    path: "/perfil",
    icon: "ri-user-line", 
    label: "Meu Perfil"
  },
  {
    path: "/planos",
    icon: "ri-vip-crown-line",
    label: "Planos"
  },
  {
    path: "/ajuda",
    icon: "ri-question-line",
    label: "Ajuda"
  },
  {
    path: "/configuracoes",
    icon: "ri-settings-line",
    label: "Configurações"
  }
];

export function DesktopMenu() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    // Scroll to top after navigation
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <nav className="hidden lg:flex items-center gap-1">
      {navItems.map(item => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive 
                ? 'bg-emerald-500/20 text-emerald-700 backdrop-blur-sm'
                : 'text-slate-700 hover:bg-white/20 hover:text-slate-800'
            }`}
          >
            <i className={`${item.icon} w-4 h-4`}></i>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}