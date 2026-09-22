import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { AuthModal } from './AuthModal';
import { UserRole } from '../../types';
import {
  ShieldAlert,
  Globe,
  PlusCircle,
  Menu,
  X,
  LayoutDashboard,
  Building2,
  Lock,
  Moon,
  Sun,
  Sparkles,
  UserCheck,
  ChevronDown
} from 'lucide-react';

interface Props {
  currentView: string;
  onNavigate: (view: string, explicitRole?: UserRole) => void;
  onOpenReportModal?: () => void;
  onOpenAssistantModal?: () => void;
}

export const Navbar: React.FC<Props> = ({
  currentView,
  onNavigate,
  onOpenReportModal,
  onOpenAssistantModal,
}) => {
  const { user, role, isAuthenticated, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [promptRole, setPromptRole] = useState<UserRole | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') ||
        localStorage.getItem('theme') !== 'light';
    }
    return true;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const getRoleLabel = () => {
    if (!isAuthenticated || !user) return 'Sign In / Portals';
    if (role === 'ADMIN') return t('systemAdmin', 'System Admin');
    if (role === 'AUTHORITY') return `${user.name} (Authority)`;
    return user.name || t('citizenAccount', 'Citizen');
  };

  const handleOpenAuthModal = (targetRole?: UserRole) => {
    setPromptRole(targetRole || null);
    setIsAuthModalOpen(true);
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-2.5 cursor-pointer shrink-0" onClick={() => onNavigate('landing')}>
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/20 ring-1 ring-white/20">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white block">
                CIVIC<span className="text-blue-500">CRISIS</span>
              </span>
              <span className="hidden lg:block text-[9px] text-slate-500 dark:text-slate-400 font-medium tracking-wider uppercase block -mt-1">
                {t('platformName', 'Intelligence Platform')}
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links - Tailored precisely to the active role */}
          <nav className="hidden md:flex items-center space-x-1 shrink-0">
            {role === 'CITIZEN' && (
              <>
                <button
                  onClick={() => onNavigate('landing')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    currentView === 'landing' ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {t('home', 'Home')}
                </button>

                <button
                  onClick={() => onNavigate('citizen')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center ${
                    currentView === 'citizen' ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold border border-blue-200 dark:border-blue-800' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
                  {t('citizen', 'Citizen Dashboard')}
                </button>
              </>
            )}

            {role === 'AUTHORITY' && (
              <>
                <button
                  onClick={() => onNavigate('authority')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center ${
                    currentView === 'authority' ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200 dark:border-indigo-800' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5 mr-1.5 text-indigo-500" />
                  {t('authority', 'Authority Command Center')}
                </button>

                <button
                  onClick={() => onNavigate('landing')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    currentView === 'landing' ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {t('home', 'Public Home')}
                </button>
              </>
            )}

            {role === 'ADMIN' && (
              <>
                <button
                  onClick={() => onNavigate('admin')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center ${
                    currentView === 'admin' ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 font-bold border border-amber-200 dark:border-amber-800' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
                  {t('admin', 'Admin Governance')}
                </button>

                <button
                  onClick={() => onNavigate('authority')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center ${
                    currentView === 'authority' ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5 mr-1.5 text-indigo-500" />
                  Authority Center
                </button>

                <button
                  onClick={() => onNavigate('landing')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    currentView === 'landing' ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {t('home', 'Public Home')}
                </button>
              </>
            )}
          </nav>

          {/* Right Action Tools */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-2.5 shrink-0">
            {/* Quick AI Assistant Trigger */}
            {onOpenAssistantModal && role === 'CITIZEN' && (
              <button
                onClick={onOpenAssistantModal}
                className="hidden lg:inline-flex items-center px-2.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-700/80 text-indigo-700 dark:text-indigo-200 text-xs font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors shadow-sm shrink-0 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1 text-indigo-500 dark:text-indigo-400 animate-pulse" />
                {t('civicAI', 'CivicAI')}
              </button>
            )}

            {/* Language Switcher - Accessible for Citizens only; completely hidden for Authority and Admin */}
            {role === 'CITIZEN' && (
              <div className="relative flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg px-2 py-1 border border-slate-200 dark:border-slate-700 text-xs shrink-0">
                <Globe className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 mr-1.5" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="bg-transparent text-slate-800 dark:text-slate-200 font-bold focus:outline-none cursor-pointer pr-1"
                  aria-label="Select Language"
                >
                  <option value="en" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">English</option>
                  <option value="hi" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">हिंदी</option>
                  <option value="mr" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">मराठी</option>
                </select>
              </div>
            )}

            {/* Role & Account Switcher Button */}
            <button
              onClick={() => handleOpenAuthModal()}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all shrink-0 shadow-sm cursor-pointer ${
                role === 'ADMIN'
                  ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-100'
                  : role === 'AUTHORITY'
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
              }`}
              title="Click to Switch Accounts or Sign In"
            >
              <UserCheck className={`w-3.5 h-3.5 ${role === 'ADMIN' ? 'text-amber-500' : role === 'AUTHORITY' ? 'text-indigo-500' : 'text-blue-500'}`} />
              <span className="font-bold">{getRoleLabel()}</span>
              <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-colors shrink-0 cursor-pointer"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Report an Issue Primary CTA (For citizens/public) */}
            {onOpenReportModal && role === 'CITIZEN' && (
              <button
                onClick={onOpenReportModal}
                className="inline-flex items-center px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-md hover:from-blue-500 hover:to-indigo-500 transition-all active:scale-95 shrink-0 whitespace-nowrap cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 mr-1 lg:mr-1.5" />
                {t('reportAnIssue')}
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2 shrink-0">
            <button
              onClick={toggleDarkMode}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
            {onOpenReportModal && role === 'CITIZEN' && (
              <button
                onClick={onOpenReportModal}
                className="p-2 rounded-lg bg-blue-600 text-white text-xs font-bold shrink-0"
              >
                <PlusCircle className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-6 space-y-3">
          {onOpenAssistantModal && role === 'CITIZEN' && (
            <button
              onClick={() => { onOpenAssistantModal(); setMobileMenuOpen(false); }}
              className="w-full p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-700/80 text-indigo-700 dark:text-indigo-200 text-xs font-bold flex items-center justify-center shadow-sm"
            >
              <Sparkles className="w-4 h-4 mr-2 text-indigo-500 dark:text-indigo-400 animate-pulse" />
              {t('askCivicAI', 'Ask CivicAI Assistant')}
            </button>
          )}

          <div className="flex flex-col space-y-2 pb-3 border-b border-slate-200 dark:border-slate-800">
            {role === 'CITIZEN' && (
              <>
                <button
                  onClick={() => { onNavigate('landing'); setMobileMenuOpen(false); }}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-start px-3"
                >
                  {t('home', 'Home')}
                </button>
                <button
                  onClick={() => { onNavigate('citizen'); setMobileMenuOpen(false); }}
                  className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center justify-start px-3"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 mr-2 text-blue-500" /> {t('citizen', 'Citizen Dashboard')}
                </button>
              </>
            )}

            {role === 'AUTHORITY' && (
              <>
                <button
                  onClick={() => { onNavigate('authority'); setMobileMenuOpen(false); }}
                  className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center justify-start px-3"
                >
                  <Building2 className="w-3.5 h-3.5 mr-2 text-indigo-500" /> {t('authority', 'Authority Command Center')}
                </button>
                <button
                  onClick={() => { onNavigate('landing'); setMobileMenuOpen(false); }}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-start px-3"
                >
                  {t('home', 'Public Home')}
                </button>
              </>
            )}

            {role === 'ADMIN' && (
              <>
                <button
                  onClick={() => { onNavigate('admin'); setMobileMenuOpen(false); }}
                  className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center justify-start px-3"
                >
                  <Lock className="w-3.5 h-3.5 mr-2 text-amber-500" /> {t('admin', 'Admin Governance')}
                </button>
                <button
                  onClick={() => { onNavigate('authority'); setMobileMenuOpen(false); }}
                  className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-xs font-semibold flex items-center justify-start px-3"
                >
                  <Building2 className="w-3.5 h-3.5 mr-2 text-indigo-500" /> Authority Center
                </button>
                <button
                  onClick={() => { onNavigate('landing'); setMobileMenuOpen(false); }}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-start px-3"
                >
                  {t('home', 'Public Home')}
                </button>
              </>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t('switchRole', 'Account')}:</span>
            <button
              onClick={() => { handleOpenAuthModal(); setMobileMenuOpen(false); }}
              className="bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 text-xs font-bold px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700 flex items-center space-x-1"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{getRoleLabel()}</span>
            </button>
          </div>

          {role === 'CITIZEN' && (
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Language / भाषा:</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold px-2 py-1 rounded border border-slate-200 dark:border-slate-700"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="mr">मराठी</option>
              </select>
            </div>
          )}
        </div>
      )}

      {/* Authentication & Demo Accounts Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        promptRole={promptRole}
        onClose={() => {
          setIsAuthModalOpen(false);
          setPromptRole(null);
        }}
        onSuccessRedirect={(newRole) => {
          if (newRole === 'ADMIN') onNavigate('admin', 'ADMIN');
          else if (newRole === 'AUTHORITY') onNavigate('authority', 'AUTHORITY');
          else onNavigate('citizen', 'CITIZEN');
        }}
      />
    </header>
  );
};
