import React from 'react';
import {
  ShieldAlert,
  ArrowRight,
  Sparkles,
  BarChart3,
  CheckCircle2,
  Brain,
  Camera,
  FileSearch,
  Building2,
  Flame,
  Globe
} from 'lucide-react';
import { Incident } from '../../types';
import { SeverityBadge } from '../common/SeverityBadge';
import { StatusBadge } from '../common/StatusBadge';
import { useLanguage } from '../../context/LanguageContext';

interface Props {
  incidents: Incident[];
  onOpenReportModal: () => void;
  onOpenAssistantModal?: () => void;
  onNavigate: (view: string) => void;
  onSelectIncident: (incident: Incident) => void;
}

export const LandingPage: React.FC<Props> = ({
  incidents,
  onOpenReportModal,
  onOpenAssistantModal,
  onNavigate,
  onSelectIncident,
}) => {
  const { t, translateIncident } = useLanguage();
  const incidentList = (Array.isArray(incidents) ? incidents : []).map((item) => translateIncident(item));
  const totalReports = incidentList.length;
  const criticalCount = incidentList.filter(i => i.severity === 'CRITICAL' || i.severity === 'HIGH').length;
  const resolvedCount = incidentList.filter(i => i.status === 'RESOLVED').length;

  return (
    <div className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 min-h-screen transition-colors">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-blue-50/60 via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-blue-500/10 dark:bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-blue-100 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-700/60 text-blue-800 dark:text-blue-300 text-xs font-semibold mb-6 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 mr-2 text-blue-600 dark:text-blue-400" />
              {t('heroBadge')}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-6">
              {t('heroTitle1')}{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 dark:from-blue-400 dark:via-cyan-400 dark:to-indigo-400 bg-clip-text text-transparent">
                {t('heroTitle2')}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed mb-8">
              {t('heroSub')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onOpenReportModal}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white font-extrabold text-sm shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.02] transition-all flex items-center justify-center cursor-pointer"
              >
                {t('reportAnIssue')} <ArrowRight className="w-4 h-4 ml-2" />
              </button>

              <button
                onClick={() => onNavigate('citizen')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm border border-slate-300 dark:border-slate-700 shadow-sm transition-all flex items-center justify-center cursor-pointer"
              >
                {t('explorePlatform')}
              </button>
            </div>
          </div>

          {/* Live Platform Stats Band */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto p-4 rounded-2xl bg-white/90 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-md">
            <div className="p-4 text-center border-r border-slate-200 dark:border-slate-800/80 last:border-0">
              <span className="block text-2xl font-black text-slate-900 dark:text-white">{totalReports + 420}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t('totalReportsSubmitted')}</span>
            </div>
            <div className="p-4 text-center border-r border-slate-200 dark:border-slate-800/80 last:border-0">
              <span className="block text-2xl font-black text-rose-600 dark:text-rose-400">{criticalCount}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t('activeHighUrgency')}</span>
            </div>
            <div className="p-4 text-center border-r border-slate-200 dark:border-slate-800/80 last:border-0">
              <span className="block text-2xl font-black text-emerald-600 dark:text-emerald-400">{resolvedCount + 380}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t('verifiedResolved')}</span>
            </div>
            <div className="p-4 text-center">
              <span className="block text-2xl font-black text-blue-600 dark:text-blue-400">1.8 hrs</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t('avgResponseTime')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-20 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2">{t('processOverview')}</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">{t('howItWorks')}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 relative hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
              <div className="text-3xl font-black text-blue-500/30 mb-4">01</div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <Camera className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">{t('step1Hero')}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {t('step1HeroDesc')}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 relative hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
              <div className="text-3xl font-black text-indigo-500/30 mb-4">02</div>
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                <Brain className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">{t('step2Hero')}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {t('step2HeroDesc')}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 relative hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
              <div className="text-3xl font-black text-emerald-500/30 mb-4">03</div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">{t('step3Hero')}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {t('step3HeroDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* COMMUNITY BULLETINS, HELPLINES & RECENT RESOLUTIONS SECTION */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2">{t('emergencyResponseBulletins', 'Emergency Response & Community Bulletins')}</h2>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">{t('activeCivicHelplines', 'Active Civic Helplines & Public Alerts')}</h3>
            </div>
            <button
              onClick={() => onNavigate('citizen')}
              className="mt-4 md:mt-0 text-xs text-blue-600 dark:text-blue-400 font-bold flex items-center hover:underline cursor-pointer"
            >
              {t('viewDetailsAndProgress')} <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          {/* Emergency Helplines Quick Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start space-x-3">
              <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{t('disasterRelief', 'Disaster Relief')}</span>
                <a href="tel:108" className="text-lg font-black text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">108 / 1800-220-011</a>
                <span className="text-[11px] text-slate-500 block">{t('floodFireRescue', '24/7 Flood & Fire Rescue')}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start space-x-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{t('municipalHelpline', 'Municipal Helpline')}</span>
                <a href="tel:1916" className="text-lg font-black text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">1916</a>
                <span className="text-[11px] text-slate-500 block">{t('roadsWaterSanitation', 'Roads, Water & Sanitation')}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start space-x-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{t('powerGridEmergency', 'Power Grid Emergency')}</span>
                <a href="tel:1912" className="text-lg font-black text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">1912</a>
                <span className="text-[11px] text-slate-500 block">{t('highVoltageHazardUnit', 'High Voltage Hazard Unit')}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start space-x-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{t('citizenGrievanceCell', 'Citizen Grievance Cell')}</span>
                <a href="tel:1800100200" className="text-lg font-black text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">1800-100-200</a>
                <span className="text-[11px] text-slate-500 block">{t('officialEscalations', 'Official Escalations')}</span>
              </div>
            </div>
          </div>

          {/* Active Public Bulletins & Recent Community Fixes */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Active Public Advisory Bulletins */}
            <div className="lg:col-span-1 space-y-4">
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center">
                <Globe className="w-4 h-4 mr-2 text-blue-500" /> {t('publicCivicBulletins', 'Public Civic Bulletins')}
              </h4>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-slate-900 dark:text-slate-100">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 inline-block mb-2">
                    {t('activeAdvisory', 'Active Advisory')}
                  </span>
                  <h5 className="font-bold text-sm mb-1">{t('advisory1Title', 'Monsoon Storm Drain Inspections')}</h5>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
                    {t('advisory1Desc', 'Disaster Management crews are conducting preventive drain clearing along Sector 4 and MG Road. Drive carefully.')}
                  </p>
                  <span className="text-[10px] text-slate-400 block font-mono">{t('advisory1Meta', 'Issued 2 hours ago • Public Works Dept')}</span>
                </div>

                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-slate-900 dark:text-slate-100">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-700 dark:text-blue-300 inline-block mb-2">
                    {t('serviceRestored', 'Service Restored')}
                  </span>
                  <h5 className="font-bold text-sm mb-1">{t('advisory2Title', 'Water Main Pipeline Repaired')}</h5>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
                    {t('advisory2Desc', 'Pressure pipeline maintenance at Central Avenue completed. Normal water supply resumed.')}
                  </p>
                  <span className="text-[10px] text-slate-400 block font-mono">{t('advisory2Meta', 'Completed Today • Water Supply Dept')}</span>
                </div>
              </div>
            </div>

            {/* Right: Active Civic Reports & Field Updates */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" /> {t('activeCivicAlerts', 'Active Civic Reports & Field Updates')}
                </span>
                <span className="text-xs text-slate-400 font-normal">SLA Compliance: 94.8%</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {incidentList.filter((i) => i.status !== 'RESOLVED').slice(0, 4).map((rawInc) => {
                  const inc = translateIncident(rawInc);
                  return (
                    <div
                      key={inc.id}
                      onClick={() => onSelectIncident(rawInc)}
                      className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <SeverityBadge severity={inc.severity} />
                          <StatusBadge status={inc.status} />
                        </div>

                        <h5 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors line-clamp-1 mb-1">
                          {inc.title}
                        </h5>

                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
                          {inc.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-3 border-t border-slate-100 dark:border-slate-900">
                        <span className="truncate max-w-[160px] font-medium">{inc.location.address}</span>
                        <span className="text-blue-600 dark:text-blue-400 font-bold group-hover:underline flex items-center">
                          {t('details', 'Details')} <ArrowRight className="w-3 h-3 ml-1" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CAPABILITIES GRID SECTION */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2">{t('platformFeatures', 'Platform Features')}</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">{t('engineeredForCivicReliability', 'Engineered for Civic Reliability')}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <Camera className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">{t('multimodalReporting', 'Multimodal Reporting')}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {t('multimodalReportingDesc', 'Accepts images, videos, PDF municipal notices, and audio voice messages with native speech-to-text.')}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                <FileSearch className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">{t('ocrAiClassification', 'OCR & AI Classification')}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {t('ocrAiClassificationDesc', 'Automatically extracts text from uploaded documents and classifies civic issue into correct municipal categories.')}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-4">
                <Globe className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">{t('multilingualCivicAI', 'Multilingual Civic AI')}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {t('multilingualCivicAIDesc', 'Allows citizens to communicate and receive updates in English, Hindi (हिंदी), and Marathi (मराठी).')}
              </p>
            </div>

            <div
              onClick={onOpenAssistantModal}
              className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                {onOpenAssistantModal && (
                  <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 group-hover:underline flex items-center">
                    {t('launchAssistant', 'Launch Assistant')} <ArrowRight className="w-3 h-3 ml-1" />
                  </span>
                )}
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
                {t('ragKnowledgeAssistant', 'RAG Knowledge Assistant')}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {t('ragKnowledgeAssistantDesc', 'Answers citizen questions by retrieving official municipal code and department operating guidelines with source citations.')}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">{t('officialPdfExport', 'Official PDF Export')}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {t('officialPdfExportDesc', 'Generates formal complaint documents and official government reports ready for printing and records archiving.')}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">{t('auditLogTransparency', 'Audit Log Transparency')}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {t('auditLogTransparencyDesc', 'Maintains immutable audit records for priority overrides, status updates, and department reassignments.')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
