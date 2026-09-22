import React from 'react';
import { ShieldAlert, Heart, Lock, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-900 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
                <ShieldAlert className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-slate-900 dark:text-white text-lg">
                CIVIC<span className="text-blue-600 dark:text-blue-400">CRISIS</span>
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm mb-4">
              {t('footerDesc', 'AI-powered civic issue reporting, crisis intelligence, and authority response system. Empowering citizens and enabling municipality command centers.')}
            </p>
            <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-500">
              <span className="flex items-center"><Lock className="w-3.5 h-3.5 mr-1 text-emerald-600 dark:text-emerald-500" /> {t('encryptedData', 'AES-256 Encrypted Data')}</span>
              <span className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 mr-1 text-blue-600 dark:text-blue-500" /> {t('officialMunicipalIntegration', 'Official Municipal Integration')}</span>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-3">{t('platformNavigation', 'Platform Navigation')}</h4>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">{t('reportAnIssue')}</span></li>
              <li><span className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">{t('howItWorks')}</span></li>
              <li><span className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">{t('interactiveMap', 'Interactive Incident Map')}</span></li>
              <li><span className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">{t('civicKnowledgeBase', 'Civic Knowledge Base')}</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-3">{t('emergencyNotice', 'Emergency Notice')}</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
              {t('emergencyNoticeSub', 'If you are in immediate life-threatening physical danger, contact emergency services directly at')} <strong className="text-slate-900 dark:text-slate-200">112 / 108</strong>.
            </p>
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">{t('triageEngineActive', '24/7 AI Incident Triage Engine Active')}</span>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-900 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 {t('platformName', 'Civic Intelligence Platform')}. {t('builtForCivicResilience', 'Built for civic resilience.')}</p>
          <p className="mt-2 md:mt-0 flex items-center">
            {t('designedWith', 'Designed with')} <Heart className="w-3.5 h-3.5 text-rose-500 mx-1 fill-rose-500" /> {t('forCommunityWelfare', 'for community welfare.')}
          </p>
        </div>
      </div>
    </footer>
  );
};
