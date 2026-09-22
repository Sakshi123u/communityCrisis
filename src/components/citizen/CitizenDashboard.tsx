import React, { useState } from 'react';
import { Incident } from '../../types';
import { SeverityBadge } from '../common/SeverityBadge';
import { StatusBadge } from '../common/StatusBadge';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import {
  PlusCircle,
  Search,
  Filter,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  MapPin,
  Sparkles,
  Calendar,
  Camera
} from 'lucide-react';

interface Props {
  incidents: Incident[];
  onOpenReportModal: () => void;
  onOpenAssistantModal?: () => void;
  onSelectIncident: (incident: Incident) => void;
}

export const CitizenDashboard: React.FC<Props> = ({
  incidents,
  onOpenReportModal,
  onOpenAssistantModal,
  onSelectIncident,
}) => {
  const { t, translateCategory, translateStatus, translateIncident } = useLanguage();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const displayName = user?.name || 'Citizen';

  const myIncidents = Array.isArray(incidents) ? incidents : [];
  const activeCount = myIncidents.filter((i) => i.status !== 'RESOLVED' && i.status !== 'REJECTED').length;
  const resolvedCount = myIncidents.filter((i) => i.status === 'RESOLVED').length;
  const pendingCount = myIncidents.filter((i) => i.status === 'SUBMITTED' || i.status === 'UNDER_REVIEW').length;

  const filteredIncidents = myIncidents
    .filter((inc) => inc.status !== 'RESOLVED') // Automatically hide resolved issues from the website
    .map((item) => translateIncident(item))
    .filter((inc) => {
      if (selectedCategory !== 'ALL' && inc.category !== selectedCategory) return false;
      if (selectedStatus !== 'ALL' && inc.status !== selectedStatus) return false;
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

  return (
    <div className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 min-h-screen py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-md">
          <div>
            <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 text-xs font-bold mb-2">
              {t('citizenPortal')}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {t('welcomeBack')}, {displayName}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {t('trackReportsSub')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {onOpenAssistantModal && (
              <button
                onClick={onOpenAssistantModal}
                className="px-5 py-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/90 border border-indigo-200 dark:border-indigo-700 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-200 font-bold text-xs shadow-md flex items-center justify-center cursor-pointer transition-colors"
              >
                <Sparkles className="w-4 h-4 mr-2 text-indigo-500 dark:text-indigo-400" /> {t('askCivicAI')}
              </button>
            )}
            <button
              onClick={onOpenReportModal}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg flex items-center justify-center cursor-pointer transition-all hover:scale-[1.02]"
            >
              <PlusCircle className="w-4 h-4 mr-2" /> {t('reportAnIssue')}
            </button>
          </div>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold mb-2">
              <span>{t('myReports')}</span>
              <FileText className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            </div>
            <span className="text-2xl font-black text-slate-900 dark:text-white">{myIncidents.length}</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-1">{t('totalSubmitted')}</span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold mb-2">
              <span>{t('activeTriage')}</span>
              <AlertTriangle className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            </div>
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400">{activeCount}</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-1">{t('inProgressAssigned')}</span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold mb-2">
              <span>{t('resolved')}</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            </div>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{resolvedCount}</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-1">{t('verifiedFixed')}</span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold mb-2">
              <span>{t('pendingReview')}</span>
              <Clock className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
            </div>
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{pendingCount}</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-1">{t('queuedForAI')}</span>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchReportsPlaceholder')}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <div className="flex items-center bg-slate-50 dark:bg-slate-900 rounded-xl px-3 py-1.5 border border-slate-200 dark:border-slate-800 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 mr-2" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent text-slate-800 dark:text-slate-200 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="ALL" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{t('allCategories')}</option>
                <option value="Flood" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{t('cat_Flood')}</option>
                <option value="Road Damage" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{t('cat_RoadDamage')}</option>
                <option value="Garbage" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{t('cat_Garbage')}</option>
                <option value="Water Leakage" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{t('cat_WaterLeakage')}</option>
                <option value="Electricity" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{t('cat_Electricity')}</option>
                <option value="Streetlight" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{t('cat_Streetlight')}</option>
                <option value="Traffic Accident" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{t('cat_TrafficAccident')}</option>
                <option value="Drainage" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{t('cat_Drainage')}</option>
              </select>
            </div>

            <div className="flex items-center bg-slate-50 dark:bg-slate-900 rounded-xl px-3 py-1.5 border border-slate-200 dark:border-slate-800 text-xs">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-transparent text-slate-800 dark:text-slate-200 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="ALL" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{t('allStatuses')}</option>
                <option value="SUBMITTED" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{translateStatus('SUBMITTED')}</option>
                <option value="UNDER_REVIEW" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{translateStatus('UNDER_REVIEW')}</option>
                <option value="IN_PROGRESS" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{translateStatus('IN_PROGRESS')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Incident Reports List */}
        <div className="space-y-4">
          <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">{t('submittedReportsHeading')}</h3>

          {filteredIncidents.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <FileText className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto mb-3" />
              <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-1">{t('noReportsMatch')}</h4>
              <p className="text-xs text-slate-500">{t('adjustFilters')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredIncidents.map((inc) => {
                const primaryImage = inc.media?.find((m) => m.mediaType === 'image');
                return (
                  <div
                    key={inc.id}
                    onClick={() => onSelectIncident(inc)}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-all cursor-pointer group flex flex-col justify-between space-y-4 shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                          #{inc.incidentNumber}
                        </span>
                        <div className="flex items-center space-x-2">
                          <SeverityBadge severity={inc.severity} />
                          <StatusBadge status={inc.status} />
                        </div>
                      </div>

                      {primaryImage && (
                        <div className="relative h-36 w-full rounded-xl overflow-hidden mb-3 border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900">
                          <img
                            src={primaryImage.downloadURL}
                            alt={inc.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              const target = e.currentTarget;
                              if (!target.dataset.failed) {
                                target.dataset.failed = 'true';
                                target.src = 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80';
                              }
                            }}
                          />
                          <div className="absolute top-2 left-2 px-2.5 py-1 rounded-lg bg-slate-900/85 backdrop-blur-md text-white text-[10px] font-bold flex items-center border border-white/20 shadow-sm">
                            <Camera className="w-3 h-3 mr-1.5 text-blue-400" /> {t('issuePhotoVerified')}
                          </div>
                        </div>
                      )}

                      <h4 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1 mb-1">
                        {inc.title}
                      </h4>

                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
                        {inc.description}
                      </p>

                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 text-xs text-slate-700 dark:text-slate-300 flex items-center justify-between">
                        <span className="truncate max-w-[200px] flex items-center text-[11px] text-slate-500 dark:text-slate-400">
                          <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400 dark:text-slate-500 shrink-0" />
                          {inc.location.address}
                        </span>
                        <span className="font-bold text-blue-600 dark:text-blue-400 shrink-0">
                          {t('priority')}: {inc.priorityScore}/100
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-900 flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center text-[11px]">
                        <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400 dark:text-slate-600" />
                        {new Date(inc.createdAt).toLocaleDateString()}
                      </span>
                      <button className="text-xs text-blue-600 dark:text-blue-400 font-bold flex items-center group-hover:underline">
                        {t('viewDetailsAndProgress')} <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
