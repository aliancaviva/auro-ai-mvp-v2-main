import { Link, useLocation } from "react-router-dom";
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}
interface NavItem {
  path: string;
  icon: string;
  label: string;
}
const navItems: NavItem[] = [{
  path: "/",
  icon: "ri-home-line",
  label: "Página Inicial"
}, {
  path: "/dashboard",
  icon: "ri-dashboard-line",
  label: "Dashboard"
}, {
  path: "/biblioteca",
  icon: "ri-image-line",
  label: "Biblioteca"
}, {
  path: "/perfil",
  icon: "ri-user-line",
  label: "Meu Perfil"
}, {
  path: "/planos",
  icon: "ri-vip-crown-line",
  label: "Planos"
}, {
  path: "/ajuda",
  icon: "ri-question-line",
  label: "Ajuda"
}, {
  path: "/configuracoes",
  icon: "ri-settings-line",
  label: "Configurações"
}];
export function Sidebar({
  isOpen,
  onClose
}: SidebarProps) {
  const location = useLocation();
  return <div className={`fixed top-0 right-0 h-full w-80 bg-white/10 backdrop-blur-xl border-l border-white/10 shadow-2xl z-50 transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <h2 className="text-lg font-semibold text-slate-800 drop-shadow-sm">Menu</h2>
        <button onClick={onClose} className="p-2 text-slate-700 hover:text-slate-800 hover:bg-white/10 rounded-lg transition-all duration-200">
          <i className="ri-close-line w-5 h-5 flex items-center justify-center"></i>
        </button>
      </div>
      
      <nav className="p-4 space-y-2">
        {navItems.map(item => {
        const isActive = location.pathname === item.path;
        return <Link key={item.path} to={item.path} onClick={onClose} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-emerald-400/20 backdrop-blur-sm text-emerald-700 border-l-4 border-emerald-500 shadow-sm' : 'text-slate-700 hover:bg-white/10 hover:text-slate-800 hover:backdrop-blur-sm'}`}>
              <i className={`${item.icon} w-5 h-5 flex items-center justify-center`}></i>
              <span className="font-medium drop-shadow-sm">{item.label}</span>
            </Link>;
      })}
      </nav>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
        <div className="text-center text-xs text-slate-600 drop-shadow-sm">
          <a href="https://readdy.ai/?origin=logo" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 transition-colors">Auro AI</a>
        </div>
      </div>
    </div>;
}