import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useNetwork } from '../contexts/NetworkContext';
import { Home, UserPlus, Clock, RefreshCw, Moon, Sun } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { isOnline } = useNetwork();
  const { campInfo } = useData();

  const tabs = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/registration', icon: UserPlus, label: 'Register' },
    { path: '/queue', icon: Clock, label: 'Queue' },
    { path: '/sync', icon: RefreshCw, label: 'Sync' }
  ];

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Dashboard';
      case '/registration': return 'New Registration';
      case '/queue': return 'Queue';
      case '/sync': return 'Sync & Summary';
      case '/procedure-bill': return 'Procedure Billing';
      case '/pharmacy-bill': return 'Pharmacy Billing';
      default: return 'Ahalia App';
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] dark:bg-gradient-to-b dark:from-[#020617] dark:to-[#020617] transition-colors duration-300">
      {/* Top App Bar */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-lg border-b border-[#E5E7EB] dark:border-[#1E293B] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="https://customer-assets.emergentagent.com/job_95ca46cc-b3b4-4215-bfbb-66ba73df89ce/artifacts/tx0a8ktn_Untitled.png" 
              alt="Ahalia" 
              className="h-10 w-auto object-contain"
            />
            <div className="hidden sm:block">
              <h1 className="text-sm font-semibold text-[#0F172A] dark:text-white leading-tight">Ahalia Group</h1>
              <p className="text-xs text-[#6B7280] dark:text-[#94A3B8]">of Hospitals</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-[#F5F7FB] dark:hover:bg-[#1E293B] transition-all active:scale-95"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-[#6B7280] dark:text-[#94A3B8]" />
              ) : (
                <Sun className="w-5 h-5 text-[#F59E0B]" />
              )}
            </button>
            <div className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              isOnline 
                ? 'bg-[#DCFCE7] text-[#16A34A] dark:bg-[#16A34A]/20 dark:text-[#22C55E]' 
                : 'bg-[#FEF3C7] text-[#F59E0B] dark:bg-[#F59E0B]/20 dark:text-[#FCD34D]'
            }`}>
              {isOnline ? 'ONLINE' : 'OFFLINE'}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto pb-24">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>
      </main>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-[#0F172A]/90 backdrop-blur-xl border-t border-[#E5E7EB] dark:border-[#1E293B] shadow-lg">
        <div className="max-w-7xl mx-auto px-2">
          <div className="grid grid-cols-4 gap-1">
            {tabs.map((tab) => {
              const isActive = location.pathname === tab.path;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.path}
                  onClick={() => navigate(tab.path)}
                  className={`flex flex-col items-center justify-center py-3 transition-all active:scale-95 ${
                    isActive 
                      ? 'text-[#2563EB] dark:text-[#3B82F6]' 
                      : 'text-[#6B7280] dark:text-[#94A3B8] hover:text-[#2563EB] dark:hover:text-[#3B82F6]'
                  }`}
                >
                  <Icon className={`w-6 h-6 mb-1 transition-transform ${
                    isActive ? 'scale-110' : ''
                  }`} />
                  <span className="text-xs font-medium">{tab.label}</span>
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#2563EB] dark:bg-[#3B82F6] rounded-t-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Layout;
