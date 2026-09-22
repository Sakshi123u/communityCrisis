import React from 'react';
import { Incident } from '../../types';
import { X, MapPin, Calendar, Download, CheckCircle2 } from 'lucide-react';
import { SeverityBadge } from '../common/SeverityBadge';
import { StatusBadge } from '../common/StatusBadge';
import { NotifiedBadge } from '../common/NotifiedBadge';
import { EvidenceGallery } from '../common/EvidenceGallery';
import { generateIncidentPDF } from '../../lib/pdfGenerator';
import { useLanguage } from '../../context/LanguageContext';

interface Props {
  incident: Incident | null;
  onClose: () => void;
}

export const IncidentDetailModal: React.FC<Props> = ({ incident: rawIncident, onClose }) => {
  const { t, translateIncident } = useLanguage();
  if (!rawIncident) return null;
  const incident = translateIncident(rawIncident);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl text-white shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block">
              {t('incidentRecord', 'Incident Record')} — {incident.incidentNumber}
            </span>
            <h3 className="text-xl font-extrabold text-white mt-1 line-clamp-1">{incident.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {/* Top Status & Score Band */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{t('status', 'Status')}</span>
              <StatusBadge status={incident.status} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{t('severity', 'Severity')}</span>
              <SeverityBadge severity={incident.severity} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{t('aiPriorityScore', 'AI Priority Score')}</span>
              <span className="text-base font-black text-blue-400">{incident.priorityScore} / 100</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{t('citizenNotified', 'Citizen Notified')}</span>
              <NotifiedBadge incident={incident} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{t('assignedDept', 'Assigned Dept')}</span>
              <span className="text-xs font-bold text-slate-200 truncate block">
                {incident.assignedDepartmentName || t('unassigned', 'Unassigned')}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">{t('citizenReportDesc', 'Citizen Report Description')}</h4>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
              {incident.description}
            </div>
          </div>

          {/* Location & Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-slate-200 block mb-0.5">{t('location', 'Location')}</span>
                <p className="text-xs text-slate-400">{incident.location.address}</p>
                <p className="text-[10px] text-slate-500 mt-1">
                  Lat {incident.location.latitude.toFixed(4)}, Long {incident.location.longitude.toFixed(4)}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start space-x-3">
              <Calendar className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-slate-200 block mb-0.5">{t('reportMetadata', 'Report Metadata')}</span>
                <p className="text-xs text-slate-400">{t('created', 'Created')}: {new Date(incident.createdAt).toLocaleString()}</p>
                <p className="text-xs text-slate-400 mt-0.5">{t('reporter', 'Reporter')}: {incident.citizenName}</p>
              </div>
            </div>
          </div>

          {/* Evidence Gallery */}
          {incident.media && incident.media.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">{t('submittedMediaEvidence', 'Submitted Media Evidence')}</h4>
              <EvidenceGallery media={incident.media} />
            </div>
          )}

          {/* Public Updates Timeline */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">{t('authorityResponseTimeline', 'Authority Response Timeline')}</h4>
            <div className="space-y-2">
              {incident.publicUpdates && incident.publicUpdates.length > 0 ? (
                incident.publicUpdates.map((upd) => (
                  <div key={upd.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-start space-x-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white">{upd.author}</span>
                        <span className="text-[10px] text-slate-500">{new Date(upd.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-300 mt-1">{upd.text}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-500 bg-slate-950 rounded-xl border border-slate-800">
                  {t('reportLoggedQueue', 'Report logged in queue. Authority review in progress.')}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <button
            onClick={() => generateIncidentPDF(incident)}
            className="px-4 py-2 rounded-xl bg-blue-600/20 text-blue-400 font-bold text-xs border border-blue-500/40 hover:bg-blue-600/30 transition-colors flex items-center cursor-pointer"
          >
            <Download className="w-4 h-4 mr-1.5" /> {t('downloadComplaintPDF', 'Download Complaint PDF')}
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
          >
            {t('close', 'Close')}
          </button>
        </div>
      </div>
    </div>
  );
};
