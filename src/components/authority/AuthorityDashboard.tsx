import React, { useState } from 'react';
import { Incident, Department } from '../../types';
import { SeverityBadge } from '../common/SeverityBadge';
import { StatusBadge } from '../common/StatusBadge';
import { NotifiedBadge } from '../common/NotifiedBadge';
import { MapViewer } from '../common/MapViewer';
import { PriorityQueue } from './PriorityQueue';
import { AnalyticsView } from './AnalyticsView';
import { AuthorityManagementModal } from './AuthorityManagementModal';
import { generateIncidentPDF } from '../../lib/pdfGenerator';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import {
  Building2,
  SlidersHorizontal,
  BarChart3,
  Flame,
  Search,
  Filter,
  Download,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  MapPin,
  FileText,
  Activity
} from 'lucide-react';

interface Props {
  incidents: Incident[];
  departments: Department[];
  onSelectIncident: (incident: Incident) => void;
  onUpdateIncident: (id: string, updates: any) => void;
}

export const AuthorityDashboard: React.FC<Props> = ({
  incidents,
  departments,
  onSelectIncident,
  onUpdateIncident,
}) => {
  const { t, translateIncident, translateCategory, translateDepartment } = useLanguage();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'COMMAND' | 'TABLE' | 'PRIORITY' | 'ANALYTICS'>('COMMAND');
  const [selectedIncidentForManage, setSelectedIncidentForManage] = useState<Incident | null>(null);
  const [selectedIncidentForMap, setSelectedIncidentForMap] = useState<string | undefined>(undefined);

  // Filter states for Table
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [filterDepartment, setFilterDepartment] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Command Center Metrics
  const incidentList = Array.isArray(incidents) ? incidents : [];
  const deptList = Array.isArray(departments) ? departments : [];

  const totalIncidents = incidentList.length;
  const criticalCount = incidentList.filter((i) => i.severity === 'CRITICAL' || i.severity === 'HIGH').length;
  const pendingCount = incidentList.filter((i) => i.status === 'SUBMITTED' || i.status === 'UNDER_REVIEW').length;
  const inProgressCount = incidentList.filter((i) => i.status === 'IN_PROGRESS' || i.status === 'ASSIGNED').length;
  const resolvedCount = incidentList.filter((i) => i.status === 'RESOLVED').length;

  const filteredIncidents = incidentList
    .map((item) => translateIncident(item))
    .filter((inc) => {
      if (filterSeverity !== 'ALL' && inc.severity !== filterSeverity) return false;
      if (filterStatus !== 'ALL' && inc.status !== filterStatus) return false;
      if (filterDepartment !== 'ALL' && inc.assignedDepartmentId !== filterDepartment) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          inc.title.toLowerCase().includes(q) ||
          inc.incidentNumber.toLowerCase().includes(q) ||
          inc.description.toLowerCase().includes(q) ||
          inc.location.address.toLowerCase().includes(q)
        );
      }
      return true;
    });

  const handlePriorityOverride = (incidentId: string, newScore: number, reason: string) => {
    onUpdateIncident(incidentId, {
      priorityScore: newScore,
      priorityOverride: {
        score: newScore,
        reason,
        overriddenBy: user?.name ? `Officer ${user.name}` : 'Authorized Officer',
        timestamp: new Date().toISOString()
      }
    });
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 min-h-screen py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold">
                <Building2 className="w-3.5 h-3.5 mr-1.5" /> Authority Command Center
              </div>
              {user?.name && (
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Officer: <strong className="text-slate-800 dark:text-slate-200">{user.name}</strong>
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Municipal Incident Command Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Real-time AI triage routing, geospatial hazard mapping, and municipal emergency dispatch.
            </p>
          </div>

          <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0">
            <button
              onClick={() => setActiveTab('COMMAND')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'COMMAND' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Command Map & Triage
            </button>
            <button
              onClick={() => setActiveTab('PRIORITY')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'PRIORITY' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Priority Queue
            </button>
            <button
              onClick={() => setActiveTab('TABLE')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'TABLE' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Incident Records
            </button>
            <button
              onClick={() => setActiveTab('ANALYTICS')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'ANALYTICS' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Analytics
            </button>
          </div>
        </div>

        {/* Top Metrics Banner */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">Total Reports</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">{totalIncidents}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Activity className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block mb-1">Critical / High</span>
              <span className="text-2xl font-black text-rose-600 dark:text-rose-400">{criticalCount}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block mb-1">Pending Triage</span>
              <span className="text-2xl font-black text-amber-600 dark:text-amber-400">{pendingCount}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider block mb-1">In Progress</span>
              <span className="text-2xl font-black text-cyan-600 dark:text-cyan-400">{inProgressCount}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
              <Flame className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between col-span-2 md:col-span-1">
            <div>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-1">Verified Resolved</span>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{resolvedCount}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* TAB 1: COMMAND CENTER (EXPANSIVE MAP + ADAPTIVE DISPATCH FEED) */}
        {activeTab === 'COMMAND' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            {/* Left Main (7 columns): Geospatial Incident Command Map */}
            <div className="xl:col-span-7">
              <MapViewer
                incidents={incidents}
                selectedIncidentId={selectedIncidentForMap}
                onSelectIncident={(inc) => {
                  setSelectedIncidentForMap(inc.id);
                  setSelectedIncidentForManage(inc);
                }}
                height="560px"
              />
            </div>

            {/* Right Side (5 columns): AI Priority Dispatch Feed */}
            <div className="xl:col-span-5">
              <PriorityQueue
                incidents={incidents}
                compact={true}
                selectedIncidentId={selectedIncidentForMap}
                onLocateIncident={(inc) => {
                  setSelectedIncidentForMap(inc.id);
                }}
                onSelectIncident={(inc) => {
                  setSelectedIncidentForMap(inc.id);
                  setSelectedIncidentForManage(inc);
                }}
                onOverridePriority={handlePriorityOverride}
              />
            </div>
          </div>
        )}

        {/* TAB 2: PRIORITY QUEUE FULL EXPANDED VIEW */}
        {activeTab === 'PRIORITY' && (
          <PriorityQueue
            incidents={incidents}
            compact={false}
            selectedIncidentId={selectedIncidentForMap}
            onLocateIncident={(inc) => {
              setSelectedIncidentForMap(inc.id);
              setActiveTab('COMMAND');
            }}
            onSelectIncident={(inc) => setSelectedIncidentForManage(inc)}
            onOverridePriority={handlePriorityOverride}
          />
        )}

        {/* TAB 3: FULL INCIDENT TABLE */}
        {activeTab === 'TABLE' && (
          <div className="space-y-4">
            {/* Table Filters */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by ID, title, keyword or landmark..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto">
                <select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer"
                >
                  <option value="ALL">All Severities</option>
                  <option value="CRITICAL">Critical</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>

                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer"
                >
                  <option value="ALL">All Departments</option>
                  {deptList.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.code} - {d.name}
                    </option>
                  ))}
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="SUBMITTED">Submitted</option>
                  <option value="ASSIGNED">Assigned</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-sm">
              <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-3.5">ID</th>
                    <th className="px-4 py-3.5">Incident Title</th>
                    <th className="px-4 py-3.5">Category</th>
                    <th className="px-4 py-3.5">Severity</th>
                    <th className="px-4 py-3.5">Priority Score</th>
                    <th className="px-4 py-3.5">Department</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5">Notified</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
                  {filteredIncidents.map((inc) => (
                    <tr key={inc.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors">
                      <td className="px-4 py-3 font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                        {inc.incidentNumber}
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        <span className="font-bold text-slate-900 dark:text-white block line-clamp-1">{inc.title}</span>
                        <span className="text-[10px] text-slate-500 line-clamp-1">{inc.location.address}</span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        {translateCategory(inc.category)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <SeverityBadge severity={inc.severity} />
                      </td>
                      <td className="px-4 py-3 font-black text-slate-900 dark:text-white whitespace-nowrap">
                        {inc.priorityScore} / 100
                      </td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {translateDepartment(inc.assignedDepartmentName) || 'Unassigned'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <StatusBadge status={inc.status} />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <NotifiedBadge incident={inc} />
                      </td>
                      <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedIncidentForManage(inc)}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px]"
                        >
                          Triage & Manage
                        </button>
                        <button
                          onClick={() => generateIncidentPDF(inc)}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:text-white"
                          title="Export PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: ANALYTICS & AI INSIGHTS */}
        {activeTab === 'ANALYTICS' && (
          <AnalyticsView incidents={incidents} departments={departments} />
        )}

        {/* Manage & Triage Incident Modal */}
        {selectedIncidentForManage && (
          <AuthorityManagementModal
            incident={selectedIncidentForManage}
            departments={departments}
            onClose={() => setSelectedIncidentForManage(null)}
            onUpdateIncident={(id, updates) => {
              onUpdateIncident(id, updates);
              setSelectedIncidentForManage(null);
            }}
          />
        )}
      </div>
    </div>
  );
};
