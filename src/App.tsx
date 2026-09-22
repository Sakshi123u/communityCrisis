import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { CitizenDashboard } from './components/citizen/CitizenDashboard';
import { ReportWizard } from './components/citizen/ReportWizard';
import { IncidentDetailModal } from './components/citizen/IncidentDetailModal';
import { CivicAssistantModal } from './components/citizen/CivicAssistantModal';
import { AuthorityDashboard } from './components/authority/AuthorityDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Incident, Department, UserRole } from './types';
import { ShieldAlert, AlertTriangle, X } from 'lucide-react';

// Route Guard & Authorization rules
interface RouteCheckResult {
  allowed: boolean;
  targetView: string;
  redirectPath?: string;
  deniedReason?: string;
}

const checkRoutePermission = (pathname: string, userRole: UserRole): RouteCheckResult => {
  const path = pathname.toLowerCase();

  // Admin Protected Routes
  if (path.startsWith('/admin')) {
    if (userRole === 'ADMIN') {
      return { allowed: true, targetView: 'admin' };
    }
    if (userRole === 'AUTHORITY') {
      return {
        allowed: false,
        targetView: 'authority',
        redirectPath: '/authority/dashboard',
        deniedReason: 'Access Denied: Authority role cannot access Administrator Governance.'
      };
    }
    return {
      allowed: false,
      targetView: 'citizen',
      redirectPath: '/citizen/dashboard',
      deniedReason: 'Access Denied: Citizen role cannot access Administrator Governance.'
    };
  }

  // Authority Protected Routes
  if (path.startsWith('/authority')) {
    if (userRole === 'AUTHORITY' || userRole === 'ADMIN') {
      return { allowed: true, targetView: 'authority' };
    }
    return {
      allowed: false,
      targetView: 'citizen',
      redirectPath: '/citizen/dashboard',
      deniedReason: 'Access Denied: Citizen role cannot access Authority Command Center.'
    };
  }

  // Citizen Protected Routes
  if (path.startsWith('/citizen')) {
    if (userRole === 'CITIZEN' || userRole === 'ADMIN') {
      return { allowed: true, targetView: 'citizen' };
    }
    if (userRole === 'AUTHORITY') {
      return {
        allowed: false,
        targetView: 'authority',
        redirectPath: '/authority/dashboard',
        deniedReason: 'Redirecting to your Authority Command Center.'
      };
    }
  }

  // Landing / Home Page
  return { allowed: true, targetView: 'landing' };
};

const getDefaultPathForView = (view: string): string => {
  switch (view) {
    case 'citizen':
      return '/citizen/dashboard';
    case 'authority':
      return '/authority/dashboard';
    case 'admin':
      return '/admin/dashboard';
    default:
      return '/';
  }
};

const MainAppContent: React.FC = () => {
  const { user, role } = useAuth();
  const [currentView, setCurrentView] = useState<string>('landing');
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [accessDeniedMessage, setAccessDeniedMessage] = useState<string | null>(null);

  // Modals
  const [isReportWizardOpen, setIsReportWizardOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [selectedIncidentDetail, setSelectedIncidentDetail] = useState<Incident | null>(null);

  // Route Evaluation & Enforcement
  const enforceRouteGuard = useCallback((targetPathname?: string, roleOverride?: UserRole) => {
    const activePath = targetPathname !== undefined ? targetPathname : window.location.pathname;
    const activeRole = roleOverride !== undefined ? roleOverride : role;
    const result = checkRoutePermission(activePath, activeRole);

    if (result.allowed) {
      setCurrentView(result.targetView);
      setAccessDeniedMessage(null);
    } else {
      // Access Denied! Immediately redirect unauthorized user
      const redirectPath = result.redirectPath || getDefaultPathForView(result.targetView);
      window.history.replaceState({ view: result.targetView }, '', redirectPath);
      setCurrentView(result.targetView);
      if (result.deniedReason) {
        setAccessDeniedMessage(result.deniedReason);
        setTimeout(() => setAccessDeniedMessage(null), 6000);
      }
    }
  }, [role]);

  // Automatically land user on their respective dashboard when role changes
  useEffect(() => {
    if (role === 'ADMIN') {
      window.history.replaceState({ view: 'admin' }, '', '/admin/dashboard');
      setCurrentView('admin');
      setAccessDeniedMessage(null);
    } else if (role === 'AUTHORITY') {
      window.history.replaceState({ view: 'authority' }, '', '/authority/dashboard');
      setCurrentView('authority');
      setAccessDeniedMessage(null);
    } else if (role === 'CITIZEN') {
      const activePath = window.location.pathname.toLowerCase();
      if (activePath.startsWith('/authority') || activePath.startsWith('/admin')) {
        window.history.replaceState({ view: 'citizen' }, '', '/citizen/dashboard');
        setCurrentView('citizen');
      } else {
        enforceRouteGuard();
      }
    }
  }, [role, user?.id, enforceRouteGuard]);

  // Handle browser Back / Forward history events
  useEffect(() => {
    const handlePopState = () => {
      enforceRouteGuard(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [enforceRouteGuard]);

  // User-initiated Navigation handler
  const handleNavigate = (requestedView: string, roleOverride?: UserRole) => {
    const activeRole = roleOverride !== undefined ? roleOverride : role;
    const targetPath = getDefaultPathForView(requestedView);
    const result = checkRoutePermission(targetPath, activeRole);

    if (result.allowed) {
      window.history.pushState({ view: result.targetView }, '', targetPath);
      setCurrentView(result.targetView);
      setAccessDeniedMessage(null);
    } else {
      const redirectPath = result.redirectPath || getDefaultPathForView(result.targetView);
      window.history.replaceState({ view: result.targetView }, '', redirectPath);
      setCurrentView(result.targetView);
      if (result.deniedReason) {
        setAccessDeniedMessage(result.deniedReason);
        setTimeout(() => setAccessDeniedMessage(null), 6000);
      }
    }
  };

  useEffect(() => {
    fetchIncidents();
    fetchDepartments();
  }, []);

  const fetchIncidents = async () => {
    try {
      const res = await fetch('/api/incidents');
      const data = await res.json();
      if (Array.isArray(data)) {
        setIncidents(data);
      } else if (data && Array.isArray(data.incidents)) {
        setIncidents(data.incidents);
      } else {
        setIncidents([]);
      }
    } catch (e) {
      console.error('Failed to load incidents', e);
      setIncidents([]);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await fetch('/api/departments');
      const data = await res.json();
      if (Array.isArray(data)) {
        setDepartments(data);
      } else if (data && Array.isArray(data.departments)) {
        setDepartments(data.departments);
      } else {
        setDepartments([]);
      }
    } catch (e) {
      console.error('Failed to load departments', e);
      setDepartments([]);
    }
  };

  const handleCreateIncident = (newIncident: Incident) => {
    setIncidents((prev) => [newIncident, ...prev]);
  };

  const handleUpdateIncident = async (id: string, updates: any) => {
    try {
      const res = await fetch(`/api/incidents/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const updatedIncident = await res.json();
      setIncidents((prev) => prev.map((inc) => (inc.id === id ? updatedIncident : inc)));
    } catch (e) {
      console.error('Failed to update incident', e);
    }
  };

  const handleAddDepartment = async (dept: Partial<Department>) => {
    try {
      const res = await fetch('/api/departments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dept)
      });
      const created = await res.json();
      setDepartments((prev) => [...prev, created]);
    } catch (e) {
      console.error('Failed to add department', e);
    }
  };

  const handleAddKnowledgeDoc = async (doc: any) => {
    try {
      await fetch('/api/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doc)
      });
    } catch (e) {
      console.error('Failed to index document', e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white transition-colors duration-200">
      {/* Access Denied Alert Banner */}
      {accessDeniedMessage && (
        <div className="bg-amber-500/15 dark:bg-amber-950/80 border-b border-amber-500/30 text-amber-900 dark:text-amber-200 px-4 py-2.5 text-xs font-semibold flex items-center justify-between shadow-inner transition-all">
          <div className="flex items-center space-x-2 max-w-7xl mx-auto w-full">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
            <span>{accessDeniedMessage}</span>
          </div>
          <button
            onClick={() => setAccessDeniedMessage(null)}
            className="p-1 rounded text-amber-700 dark:text-amber-300 hover:bg-amber-500/20"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenReportModal={() => setIsReportWizardOpen(true)}
        onOpenAssistantModal={() => setIsAssistantOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            incidents={incidents}
            onOpenReportModal={() => setIsReportWizardOpen(true)}
            onOpenAssistantModal={() => setIsAssistantOpen(true)}
            onNavigate={handleNavigate}
            onSelectIncident={(inc) => setSelectedIncidentDetail(inc)}
          />
        )}

        {currentView === 'citizen' && (
          <CitizenDashboard
            incidents={incidents}
            onOpenReportModal={() => setIsReportWizardOpen(true)}
            onOpenAssistantModal={() => setIsAssistantOpen(true)}
            onSelectIncident={(inc) => setSelectedIncidentDetail(inc)}
          />
        )}

        {currentView === 'authority' && (
          <AuthorityDashboard
            incidents={incidents}
            departments={departments}
            onSelectIncident={(inc) => setSelectedIncidentDetail(inc)}
            onUpdateIncident={handleUpdateIncident}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard
            departments={departments}
            onAddDepartment={handleAddDepartment}
            onAddKnowledgeDoc={handleAddKnowledgeDoc}
          />
        )}
      </main>

      {/* Global Modals */}
      <ReportWizard
        isOpen={isReportWizardOpen}
        onClose={() => setIsReportWizardOpen(false)}
        onSubmitSuccess={handleCreateIncident}
      />

      <IncidentDetailModal
        incident={selectedIncidentDetail}
        onClose={() => setSelectedIncidentDetail(null)}
      />

      <CivicAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <MainAppContent />
      </LanguageProvider>
    </AuthProvider>
  );
}
