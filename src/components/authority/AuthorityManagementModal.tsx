import React, { useState } from 'react';
import { Incident, IncidentStatus, Department } from '../../types';
import { X, Building2, User, CheckCircle2, AlertTriangle, FileText, Send, Download, Lock, MessageSquare, Mail, Phone, Bell } from 'lucide-react';
import { SeverityBadge } from '../common/SeverityBadge';
import { StatusBadge } from '../common/StatusBadge';
import { NotifiedBadge } from '../common/NotifiedBadge';
import { EvidenceGallery } from '../common/EvidenceGallery';
import { generateIncidentPDF } from '../../lib/pdfGenerator';
import { useLanguage } from '../../context/LanguageContext';

interface Props {
  incident: Incident | null;
  departments: Department[];
  onClose: () => void;
  onUpdateIncident: (id: string, updates: any) => void;
}

export const AuthorityManagementModal: React.FC<Props> = ({
  incident: rawIncident,
  departments,
  onClose,
  onUpdateIncident,
}) => {
  const { t, translateIncident, translateDepartment, translateStatus } = useLanguage();
  const incident = rawIncident ? translateIncident(rawIncident) : null;
  const [status, setStatus] = useState<IncidentStatus>(rawIncident?.status || 'SUBMITTED');
  const [departmentId, setDepartmentId] = useState<string>(rawIncident?.assignedDepartmentId || '');
  const [internalNote, setInternalNote] = useState('');
  const [publicUpdate, setPublicUpdate] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  if (!incident || !rawIncident) return null;

  const handleSaveStatus = () => {
    if (status === 'REJECTED' && !rejectionReason.trim()) {
      alert('Mandatory reason required when rejecting an incident.');
      return;
    }

    const deptObj = departments.find((d) => d.id === departmentId);

    onUpdateIncident(incident.id, {
      status,
      assignedDepartmentId: departmentId,
      assignedDepartmentName: deptObj ? deptObj.name : incident.assignedDepartmentName,
      rejectionReason: status === 'REJECTED' ? rejectionReason : undefined,
      newInternalNote: internalNote.trim() || undefined,
      newPublicUpdate: publicUpdate.trim() || undefined,
      actorName: 'Officer Rajesh Kumar',
      actorRole: 'AUTHORITY'
    });

    setInternalNote('');
    setPublicUpdate('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl text-white shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block">
                Authority Triage & Incident Command — {incident.incidentNumber}
              </span>
              <NotifiedBadge incident={incident} />
            </div>
            <h3 className="text-xl font-extrabold text-white mt-1 line-clamp-1">{incident.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {/* Status & Department Update Panel */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Update Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-white focus:outline-none focus:border-blue-500"
              >
                <option value="SUBMITTED">Submitted</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="ON_HOLD">On Hold</option>
                <option value="RESOLVED">Resolved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Assign Responsible Department
              </label>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-white focus:outline-none focus:border-blue-500"
              >
                <option value="">-- Select Municipal Department --</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {translateDepartment(dept.name)} ({dept.code})
                  </option>
                ))}
              </select>
            </div>

            {status === 'REJECTED' && (
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-rose-400 uppercase tracking-wider mb-1.5">
                  Mandatory Rejection Reason *
                </label>
                <input
                  type="text"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="State reason (e.g. Duplicate report or outside municipal jurisdiction)..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-rose-800 text-xs text-white focus:outline-none"
                />
              </div>
            )}

            {/* Citizen Notification Info Card */}
            <div className="md:col-span-2 p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-3">
                <Bell className="w-4 h-4 text-blue-400 shrink-0" />
                <div>
                  <span className="font-bold text-slate-200 block">Citizen Contact & Resolution Notification</span>
                  <div className="flex items-center space-x-3 text-slate-400 mt-0.5 text-[11px]">
                    {incident.citizenEmail && (
                      <span className="flex items-center"><Mail className="w-3 h-3 mr-1 text-slate-500" /> {incident.citizenEmail}</span>
                    )}
                    {incident.citizenPhone && (
                      <span className="flex items-center"><Phone className="w-3 h-3 mr-1 text-slate-500" /> {incident.citizenPhone}</span>
                    )}
                    {!incident.citizenEmail && !incident.citizenPhone && (
                      <span className="text-slate-500 italic">No direct email/SMS contact provided by citizen (Guest report)</span>
                    )}
                  </div>
                </div>
              </div>
              <NotifiedBadge incident={incident} />
            </div>
          </div>

          {/* Internal Notes vs Public Citizen Updates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Internal Notes */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center">
                <Lock className="w-3.5 h-3.5 mr-1" /> Internal Officer Notes (Private)
              </span>
              <textarea
                rows={3}
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                placeholder="Add confidential notes for field technicians or officers..."
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
              />

              {incident.internalNotes && incident.internalNotes.length > 0 && (
                <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                  {incident.internalNotes.map((note) => (
                    <div key={note.id} className="p-2 rounded bg-slate-900 text-[11px] text-slate-300 border border-slate-800">
                      <span className="font-bold text-amber-300 block">{note.author}:</span>
                      {note.text}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Public Updates */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center">
                <MessageSquare className="w-3.5 h-3.5 mr-1" /> Public Citizen Updates
              </span>
              <textarea
                rows={3}
                value={publicUpdate}
                onChange={(e) => setPublicUpdate(e.target.value)}
                placeholder="Message visible to reporting citizen on their dashboard..."
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
              />

              {incident.publicUpdates && incident.publicUpdates.length > 0 && (
                <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                  {incident.publicUpdates.map((upd) => (
                    <div key={upd.id} className="p-2 rounded bg-slate-900 text-[11px] text-slate-300 border border-slate-800">
                      <span className="font-bold text-blue-300 block">{upd.author}:</span>
                      {upd.text}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Evidence Media Preview */}
          {incident.media && incident.media.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Submitted Media Evidence</h4>
              <EvidenceGallery media={incident.media} />
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <button
            onClick={() => generateIncidentPDF(incident)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 flex items-center"
          >
            <Download className="w-4 h-4 mr-1.5 text-blue-400" /> Export Official PDF Report
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveStatus}
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center"
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" /> Save Changes & Log Audit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
