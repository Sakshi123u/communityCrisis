import React, { useState, useEffect } from 'react';
import { useAuth, RegisterPayload } from '../../context/AuthContext';
import {
  X,
  Lock,
  ShieldCheck,
  Building2,
  Shield,
  AlertCircle,
  Eye,
  EyeOff,
  User,
  UserPlus,
  LogIn,
  LogOut,
  ChevronDown,
  ChevronUp,
  Info,
  CheckCircle2
} from 'lucide-react';
import { UserRole } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessRedirect?: (role: UserRole) => void;
  promptRole?: UserRole | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccessRedirect,
  promptRole,
}) => {
  const { user, login, register, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Login Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register Form States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('CITIZEN');
  const [regDept, setRegDept] = useState('Disaster Management & Drainage');
  const [regEmpId, setRegEmpId] = useState('');

  // UI state
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCredsGuide, setShowCredsGuide] = useState(false);
  const [showSwitchForm, setShowSwitchForm] = useState(false);

  useEffect(() => {
    if (promptRole === 'AUTHORITY' || promptRole === 'ADMIN') {
      setShowCredsGuide(true);
    }
  }, [promptRole, isOpen]);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter both your email address and password.');
      return;
    }

    setError(null);
    setSuccessMsg(null);
    setIsLoading(true);

    const result = await login(email, password);
    setIsLoading(false);

    if (result.success && result.user) {
      setSuccessMsg(`Welcome back, ${result.user.name}!`);
      setTimeout(() => {
        onClose();
        if (onSuccessRedirect) {
          onSuccessRedirect(result.user!.role);
        }
      }, 400);
    } else {
      setError(result.error || 'Authentication failed. Please verify your email and password.');
    }
  };

  const handleQuickLogin = async (quickEmail: string, quickPass: string) => {
    setEmail(quickEmail);
    setPassword(quickPass);
    setError(null);
    setSuccessMsg(null);
    setIsLoading(true);

    const result = await login(quickEmail, quickPass);
    setIsLoading(false);

    if (result.success && result.user) {
      setSuccessMsg(`Authenticated as ${result.user.name} (${result.user.role})!`);
      setTimeout(() => {
        onClose();
        if (onSuccessRedirect) {
          onSuccessRedirect(result.user!.role);
        }
      }, 350);
    } else {
      setError(result.error || 'Quick login failed.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setError('Please complete all required fields (Name, Email, Password).');
      return;
    }
    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setError(null);
    setSuccessMsg(null);
    setIsLoading(true);

    const payload: RegisterPayload = {
      name: regName.trim(),
      email: regEmail.trim(),
      password: regPassword.trim(),
      phone: regPhone.trim() || undefined,
      role: regRole,
      departmentName: regRole === 'AUTHORITY' ? regDept : undefined,
      employeeId: regRole !== 'CITIZEN' ? (regEmpId.trim() || `EMP-${Math.floor(1000 + Math.random() * 9000)}`) : undefined,
      preferredLanguage: 'en',
    };

    const result = await register(payload);
    setIsLoading(false);

    if (result.success && result.user) {
      setSuccessMsg(`Account created successfully! Welcome, ${result.user.name}.`);
      setTimeout(() => {
        onClose();
        if (onSuccessRedirect) {
          onSuccessRedirect(result.user!.role);
        }
      }, 600);
    } else {
      setError(result.error || 'Registration failed. Please check your details.');
    }
  };

  const fillCredentials = (fillEmail: string, fillPass: string) => {
    setEmail(fillEmail);
    setPassword(fillPass);
    setActiveTab('LOGIN');
    setShowSwitchForm(true);
    setError(null);
  };

  const handleLogout = () => {
    logout();
    setShowSwitchForm(true);
    setSuccessMsg('You have been signed out.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-blue-900/10 via-indigo-900/10 to-slate-900/10 dark:from-blue-950/40 dark:to-indigo-950/40">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Municipal Portal Authentication</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Secure Role-Based Access Control</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close Authentication Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
          {/* Prompt banner if required role access triggered */}
          {promptRole && !user && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-semibold flex items-start space-x-2">
              <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">{promptRole} Credentials Required</span>
                <span>You cannot access this portal without signing in with an authorized {promptRole.toLowerCase()} email and password.</span>
              </div>
            </div>
          )}

          {/* Feedback messages */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* If user is already logged in and not switching accounts */}
          {user && !showSwitchForm ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Active Authenticated Session
                  </span>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-extrabold border ${
                    user.role === 'ADMIN'
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/20'
                      : user.role === 'AUTHORITY'
                      ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border-indigo-500/20'
                      : 'bg-blue-500/10 text-blue-600 dark:text-blue-300 border-blue-500/20'
                  }`}>
                    {user.role}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black text-lg shadow-sm">
                    {user.name.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-sm truncate">{user.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate">{user.email}</p>
                    {user.departmentName && (
                      <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium mt-0.5 flex items-center">
                        <Building2 className="w-3 h-3 mr-1 shrink-0" /> {user.departmentName}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setShowSwitchForm(true)}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Switch Account</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 font-bold text-xs border border-rose-200 dark:border-rose-800 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Tab Navigation (Sign In vs Register) */}
              <div className="flex border-b border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => { setActiveTab('LOGIN'); setError(null); }}
                  className={`flex-1 pb-2.5 text-xs font-bold transition-all border-b-2 flex items-center justify-center space-x-1.5 cursor-pointer ${
                    activeTab === 'LOGIN'
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('REGISTER'); setError(null); }}
                  className={`flex-1 pb-2.5 text-xs font-bold transition-all border-b-2 flex items-center justify-center space-x-1.5 cursor-pointer ${
                    activeTab === 'REGISTER'
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register Account</span>
                </button>
              </div>

              {/* SIGN IN FORM */}
              {activeTab === 'LOGIN' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Account Email Address *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. rajesh.kumar@citycivic.gov"
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Password *
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full px-3 py-2.5 pr-10 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none cursor-pointer"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md shadow-blue-600/20 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>{isLoading ? 'Verifying with Secure RBAC...' : 'Authenticate & Sign In'}</span>
                  </button>

                  {user && (
                    <button
                      type="button"
                      onClick={() => setShowSwitchForm(false)}
                      className="w-full text-center text-xs text-slate-500 hover:underline cursor-pointer"
                    >
                      Cancel & Return to Current Session
                    </button>
                  )}
                </form>
              )}

              {/* REGISTER FORM */}
              {activeTab === 'REGISTER' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Officer Sunita Deshmukh"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="official@citycivic.gov"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Password (min 6 chars) *
                      </label>
                      <input
                        type="password"
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Account Type / Role *
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRegRole('CITIZEN')}
                        className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                          regRole === 'CITIZEN'
                            ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-500 text-blue-600 dark:text-blue-400'
                            : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <User className="w-3.5 h-3.5" />
                        <span>Citizen</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRegRole('AUTHORITY')}
                        className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                          regRole === 'AUTHORITY'
                            ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                            : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <Building2 className="w-3.5 h-3.5" />
                        <span>Authority Officer</span>
                      </button>
                    </div>
                  </div>

                  {regRole === 'AUTHORITY' && (
                    <div className="space-y-3 p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/50 dark:border-indigo-800/50">
                      <div>
                        <label className="block text-[11px] font-bold text-indigo-900 dark:text-indigo-300 mb-1">
                          Municipal Department *
                        </label>
                        <select
                          value={regDept}
                          onChange={(e) => setRegDept(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                        >
                          <option value="Disaster Management & Drainage">Disaster Management & Drainage</option>
                          <option value="Roads & Transport Authority">Roads & Transport Authority</option>
                          <option value="Solid Waste & Sanitation">Solid Waste & Sanitation</option>
                          <option value="Water Supply Board">Water Supply Board</option>
                          <option value="Fire & Emergency Services">Fire & Emergency Services</option>
                          <option value="Electrical & Power Dept">Electrical & Power Dept</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-indigo-900 dark:text-indigo-300 mb-1">
                          Officer Employee Badge ID
                        </label>
                        <input
                          type="text"
                          value={regEmpId}
                          onChange={(e) => setRegEmpId(e.target.value)}
                          placeholder="e.g. EMP-9042"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>{isLoading ? 'Creating Municipal Profile...' : 'Create Account & Sign In'}</span>
                  </button>
                </form>
              )}

              {/* Official Test Accounts Reference Accordion */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCredsGuide(!showCredsGuide)}
                  className="w-full flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold hover:text-slate-700 dark:hover:text-slate-200 transition-colors py-1 cursor-pointer"
                >
                  <span className="flex items-center space-x-1.5">
                    <Shield className="w-3.5 h-3.5 text-blue-500" />
                    <span>Reference Official Credentials</span>
                  </span>
                  {showCredsGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {showCredsGuide && (
                  <div className="mt-2 space-y-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs animate-fadeIn">
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Click <strong className="text-slate-700 dark:text-slate-300">Fill Credentials</strong> to populate the form and submit for server-side verification:
                    </p>

                    {/* Authority Officer Credential */}
                    <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-slate-900 dark:text-white flex items-center space-x-1.5 truncate">
                          <Building2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          <span className="truncate">Authority Officer (Rajesh Kumar)</span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono truncate">
                          authority@demo.com &bull; Pass: authority123
                        </div>
                      </div>
                      <div className="flex items-center space-x-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => fillCredentials('authority@demo.com', 'authority123')}
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-[10px] border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                        >
                          Fill
                        </button>
                        <button
                          type="button"
                          disabled={isLoading}
                          onClick={() => handleQuickLogin('authority@demo.com', 'authority123')}
                          className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                        >
                          Sign In
                        </button>
                      </div>
                    </div>

                    {/* Administrator Credential */}
                    <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-slate-900 dark:text-white flex items-center space-x-1.5 truncate">
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span className="truncate">System Administrator (Vikram Malhotra)</span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono truncate">
                          admin@demo.com &bull; Pass: admin123
                        </div>
                      </div>
                      <div className="flex items-center space-x-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => fillCredentials('admin@demo.com', 'admin123')}
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-[10px] border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                        >
                          Fill
                        </button>
                        <button
                          type="button"
                          disabled={isLoading}
                          onClick={() => handleQuickLogin('admin@demo.com', 'admin123')}
                          className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white font-bold text-[10px] shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                        >
                          Sign In
                        </button>
                      </div>
                    </div>

                    {/* Citizen Credential */}
                    <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-slate-900 dark:text-white flex items-center space-x-1.5 truncate">
                          <User className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          <span className="truncate">Citizen (Aarav Patel)</span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono truncate">
                          citizen@demo.com &bull; Pass: citizen123
                        </div>
                      </div>
                      <div className="flex items-center space-x-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => fillCredentials('citizen@demo.com', 'citizen123')}
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-[10px] border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                        >
                          Fill
                        </button>
                        <button
                          type="button"
                          disabled={isLoading}
                          onClick={() => handleQuickLogin('citizen@demo.com', 'citizen123')}
                          className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                        >
                          Sign In
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

