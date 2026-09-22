import React, { useState } from 'react';
import { Incident } from '../../types';
import { SeverityBadge } from '../common/SeverityBadge';
import { StatusBadge } from '../common/StatusBadge';
import { NotifiedBadge } from '../common/NotifiedBadge';
import {
  Flame,
  ArrowUpRight,
  SlidersHorizontal,
  MapPin,
  Crosshair,
  Sparkles,
  ShieldAlert,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface Props {
  incidents: Incident[];
  onSelectIncident: (incident: Incident) => void;
  onOverridePriority: (incidentId: string, newScore: number, reason: string) => void;
  onLocateIncident?: (incident: Incident) => void;
  selectedIncidentId?: string;
  compact?: boolean;
}

export const PriorityQueue: React.FC<Props> = ({
  incidents,
  onSelectIncident,
  onOverridePriority,
  onLocateIncident,
  selectedIncidentId,
  compact = false,
}) => {
  const { t, translateIncident, translateCategory } = useLanguage();
  const [overrideModalIncident, setOverrideModalIncident] = useState<Incident | null>(null);
  const [overrideScore, setOverrideScore] = useState<number>(85);
  const [overrideReason, setOverrideReason] = useState<string>('');

  // Sort active incidents by priorityScore desc and translate (exclude resolved)
  const list = (Array.isArray(incidents) ? incidents : []).filter((i) => i.status !== 'RESOLVED');
  const sortedQueue = [...list]
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .map((item) => translateIncident(item));

  const handleApplyOverride = () => {
    if (!overrideModalIncident) return;
    if (!overrideReason.trim()) {
      alert('Please provide an operational reason for overriding the AI Priority Score.');
      return;
    }
    onOverridePriority(overrideModalIncident.id, overrideScore, overrideReason);
    setOverrideModalIncident(null);
    setOverrideReason('');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-1">
        <div>
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center">
            <Flame className="w-5 h-5 text-red-500 mr-2 shrink-0 animate-pulse" />
            AI Priority Dispatch Queue
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Ranked by multi-factor algorithmic risk assessment and vulnerability scoring.
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900">
          {sortedQueue.length} Active
        </span>
      </div>

      {/* Incident List */}
      <div className="space-y-3">
        {sortedQueue.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <AlertCircle className="w-8 h-8 mx-auto text-slate-400 mb-2" />
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">No active incidents in queue</h4>
            <p className="text-xs text-slate-500">All submitted reports have been triaged or resolved.</p>
          </div>
        ) : (
          sortedQueue.map((inc, rank) => {
            const isSelected = selectedIncidentId === inc.id;

            return (
              <div
                key={inc.id}
                className={`p-4 rounded-xl bg-white dark:bg-slate-950 border transition-all ${
                  isSelected
                    ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
                }`}
              >
                {/* 1. Header Row: Rank, ID, Badges */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                        rank === 0
                          ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
                          : rank === 1
                          ? 'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      #{rank + 1}
                    </span>
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      {inc.incidentNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {translateCategory(inc.category)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5 shrink-0">
                    <SeverityBadge severity={inc.severity} />
                  </div>
                </div>

                {/* 2. Title & Address (Clean 2-line clamp, never cut off into single words) */}
                <div className="mb-3">
                  <h4
                    onClick={() => {
                      if (onLocateIncident) onLocateIncident(inc);
                      else onSelectIncident(inc);
                    }}
                    className="font-bold text-sm text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors leading-snug line-clamp-2"
                    title={inc.title}
                  >
                    {inc.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center line-clamp-1">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400 shrink-0" />
                    <span>{inc.location?.address}</span>
                  </p>
                </div>

                {/* 3. Full-width Risk Factors Breakdown (only in expanded mode) */}
                {!compact && inc.priorityFactors && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] mb-3">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Severity Factor</span>
                      <strong className="text-slate-800 dark:text-slate-200">{inc.priorityFactors.severity}/100</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Population Risk</span>
                      <strong className="text-slate-800 dark:text-slate-200">{inc.priorityFactors.populationImpact}/100</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Location Impact</span>
                      <strong className="text-slate-800 dark:text-slate-200">{inc.priorityFactors.locationRisk}/100</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Urgency Meter</span>
                      <strong className="text-slate-800 dark:text-slate-200">{inc.priorityFactors.urgency}/100</strong>
                    </div>
                  </div>
                )}

                {/* 4. Footer Row: Priority Score Meter + Action Controls */}
                <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-baseline space-x-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Score:</span>
                      <span className="text-base font-black text-blue-600 dark:text-blue-400">
                        {inc.priorityScore}
                      </span>
                      <span className="text-[10px] text-slate-400">/100</span>
                    </div>
                    <StatusBadge status={inc.status} />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-1.5 shrink-0">
                    {onLocateIncident && (
                      <button
                        onClick={() => onLocateIncident(inc)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold inline-flex items-center transition-colors cursor-pointer"
                        title="Center on Command Map"
                      >
                        <Crosshair className="w-3.5 h-3.5 mr-1 text-slate-500" />
                        Map
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setOverrideModalIncident(inc);
                        setOverrideScore(inc.priorityScore);
                      }}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-colors cursor-pointer"
                      title="Override Priority Score"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onSelectIncident(inc)}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs inline-flex items-center shadow-xs transition-colors cursor-pointer"
                    >
                      Triage <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Manual Priority Override Modal */}
      {overrideModalIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md text-slate-900 dark:text-white p-6 shadow-2xl space-y-4">
            <h4 className="font-extrabold text-lg text-slate-900 dark:text-white">Manual Priority Override</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Override AI risk rank for <strong className="text-slate-800 dark:text-slate-200">{overrideModalIncident.incidentNumber}</strong>. Action will be permanently logged in the municipal audit trail.
            </p>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                  Target Priority Score:
                </label>
                <span className="text-base font-black text-blue-600 dark:text-blue-400">
                  {overrideScore} / 100
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={overrideScore}
                onChange={(e) => setOverrideScore(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Mandatory Operational Justification *
              </label>
              <textarea
                rows={3}
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                placeholder="State operational reason (e.g. Near critical medical hospital or VIP evacuation transit corridor)..."
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                onClick={() => setOverrideModalIncident(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyOverride}
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                Apply Override & Log Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
