import React, { useState, useEffect } from 'react';
import { UserProfile, Department, KnowledgeDocument, AuditLog } from '../../types';
import {
  Users,
  Building2,
  Lock,
  BookOpen,
  Plus,
  CheckCircle2,
  ShieldAlert,
  Search,
  Activity,
  Server,
  FileText
} from 'lucide-react';

interface Props {
  departments: Department[];
  onAddDepartment: (dept: Partial<Department>) => void;
  onAddKnowledgeDoc: (doc: Partial<KnowledgeDocument>) => void;
}

export const AdminDashboard: React.FC<Props> = ({
  departments,
  onAddDepartment,
  onAddKnowledgeDoc,
}) => {
  const [activeTab, setActiveTab] = useState<'DEPARTMENTS' | 'KNOWLEDGE' | 'AUDIT'>('DEPARTMENTS');
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [knowledgeDocs, setKnowledgeDocs] = useState<KnowledgeDocument[]>([]);
  const [dbStatus, setDbStatus] = useState<{
    primaryStore: string;
    supabase?: {
      configured: boolean;
      provider: string;
      projectName: string;
      projectId: string;
      url: string;
      lastSyncStatus?: { success: boolean; message: string; timestamp: string };
    };
  } | null>(null);
  const [apiHealth, setApiHealth] = useState<{
    connected: boolean;
    status: string;
    maskedKey: string;
    model: string;
  } | null>(null);

  // Form states
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptCode, setNewDeptCode] = useState('');
  const [newDeptDesc, setNewDeptDesc] = useState('');

  const [newKbTitle, setNewKbTitle] = useState('');
  const [newKbCategory, setNewKbCategory] = useState('');
  const [newKbContent, setNewKbContent] = useState('');
  const [newKbSource, setNewKbSource] = useState('');

  useEffect(() => {
    fetchAuditLogs();
    fetchKnowledgeDocs();
    fetchApiHealth();
    fetchDbStatus();
  }, []);

  const fetchDbStatus = async () => {
    try {
      const res = await fetch('/api/db/status');
      const data = await res.json();
      setDbStatus(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchApiHealth = async () => {
    try {
      const res = await fetch('/api/ai/health');
      const data = await res.json();
      setApiHealth(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const res = await fetch('/api/audit-logs');
      const data = await res.json();
      setAuditLogs(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchKnowledgeDocs = async () => {
    try {
      const res = await fetch('/api/knowledge');
      const data = await res.json();
      setKnowledgeDocs(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName.trim()) return;
    onAddDepartment({
      name: newDeptName,
      code: newDeptCode || 'DEPT',
      description: newDeptDesc,
      officerCount: 5
    });
    setNewDeptName('');
    setNewDeptCode('');
    setNewDeptDesc('');
  };

  const handleCreateKnowledge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKbTitle.trim() || !newKbContent.trim()) return;
    onAddKnowledgeDoc({
      title: newKbTitle,
      category: newKbCategory || 'General Policy',
      content: newKbContent,
      source: newKbSource || 'Municipal Code 2026'
    });
    setNewKbTitle('');
    setNewKbCategory('');
    setNewKbContent('');
    setNewKbSource('');
    fetchKnowledgeDocs();
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 min-h-screen py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-md">
          <div>
            <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 text-xs font-bold mb-2">
              <Lock className="w-3.5 h-3.5 mr-1.5" /> Administrator System Control
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Platform Administration & Governance
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Department configuration, knowledge base indexing for RAG AI, and security audit logs.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0 flex-wrap gap-y-2">
            <button
              onClick={() => setActiveTab('DEPARTMENTS')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'DEPARTMENTS' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Departments
            </button>
            <button
              onClick={() => setActiveTab('KNOWLEDGE')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'KNOWLEDGE' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Knowledge Base
            </button>
            <button
              onClick={() => setActiveTab('AUDIT')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'AUDIT' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Audit Logs
            </button>
          </div>
        </div>

        {/* System Health Status Banner */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase block mb-1">Database & Supabase</span>
            {dbStatus?.supabase?.configured ? (
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-1.5" /> Supabase: {dbStatus.supabase.projectName}
              </span>
            ) : (
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-1.5" /> Persistent Storage Active
              </span>
            )}
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase block mb-1">AI Triage Service</span>
            {apiHealth?.connected ? (
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
                <Server className="w-4 h-4 mr-1.5" /> Gemini {apiHealth.model} Online
              </span>
            ) : (
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center">
                <Server className="w-4 h-4 mr-1.5 text-blue-500" /> Fallback Engine Active
              </span>
            )}
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase block mb-1">Total Departments</span>
            <span className="text-xl font-black text-slate-900 dark:text-white">{departments.length}</span>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase block mb-1">Knowledge Docs Indexed</span>
            <span className="text-xl font-black text-slate-900 dark:text-white">{knowledgeDocs.length}</span>
          </div>
        </div>

        {/* DEPARTMENTS TAB */}
        {activeTab === 'DEPARTMENTS' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Active Municipal Departments
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {departments.map((dept) => (
                  <div key={dept.id} className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 text-[10px] font-bold border border-blue-200 dark:border-blue-800">
                        {dept.code}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{dept.officerCount} Field Officers</span>
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">{dept.name}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{dept.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Create Dept Form */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center">
                <Plus className="w-4 h-4 mr-1.5 text-blue-600 dark:text-blue-400" /> Create Municipal Dept
              </h3>
              <form onSubmit={handleCreateDept} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Department Name *</label>
                  <input
                    type="text"
                    value={newDeptName}
                    onChange={(e) => setNewDeptName(e.target.value)}
                    placeholder="e.g. Environmental Protection Board"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Code Alias</label>
                  <input
                    type="text"
                    value={newDeptCode}
                    onChange={(e) => setNewDeptCode(e.target.value)}
                    placeholder="e.g. EPB"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={newDeptDesc}
                    onChange={(e) => setNewDeptDesc(e.target.value)}
                    placeholder="Responsibilities & operating scope..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                >
                  Create Department
                </button>
              </form>
            </div>
          </div>
        )}

        {/* KNOWLEDGE BASE TAB */}
        {activeTab === 'KNOWLEDGE' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Indexed RAG Knowledge Documents
              </h3>
              <div className="space-y-3">
                {knowledgeDocs.map((doc) => (
                  <div key={doc.id} className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{doc.category}</span>
                      <span className="text-[10px] text-slate-500">{doc.source}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{doc.title}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">{doc.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Knowledge Doc Form */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center">
                <BookOpen className="w-4 h-4 mr-1.5 text-indigo-600 dark:text-indigo-400" /> Index Knowledge Doc
              </h3>
              <form onSubmit={handleCreateKnowledge} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Document Title *</label>
                  <input
                    type="text"
                    value={newKbTitle}
                    onChange={(e) => setNewKbTitle(e.target.value)}
                    placeholder="e.g. Flood Evacuation Protocol"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <input
                    type="text"
                    value={newKbCategory}
                    onChange={(e) => setNewKbCategory(e.target.value)}
                    placeholder="Disaster Management"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Document Content *</label>
                  <textarea
                    rows={4}
                    value={newKbContent}
                    onChange={(e) => setNewKbContent(e.target.value)}
                    placeholder="Full text content for RAG retrieval..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Source Citation</label>
                  <input
                    type="text"
                    value={newKbSource}
                    onChange={(e) => setNewKbSource(e.target.value)}
                    placeholder="Municipal Preparedness Code 2026"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                >
                  Index Document
                </button>
              </form>
            </div>
          </div>
        )}

        {/* AUDIT LOGS TAB */}
        {activeTab === 'AUDIT' && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Immutable Action Audit Trail
            </h3>
            <div className="rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-sm">
              <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Timestamp</th>
                    <th className="px-4 py-3">Actor</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Action</th>
                    <th className="px-4 py-3">Target ID</th>
                    <th className="px-4 py-3">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/60">
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-900 dark:text-white whitespace-nowrap">{log.actorName}</td>
                      <td className="px-4 py-3 text-blue-600 dark:text-blue-400 font-semibold whitespace-nowrap">{log.actorRole}</td>
                      <td className="px-4 py-3 font-bold text-indigo-600 dark:text-indigo-300 whitespace-nowrap">{log.action}</td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">{log.targetId}</td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
