import React from 'react';
import { IncidentStatus } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { CheckCircle2, Clock, AlertCircle, PlayCircle, XCircle, ArrowRightCircle } from 'lucide-react';

interface Props {
  status: IncidentStatus;
  className?: string;
}

export const StatusBadge: React.FC<Props> = ({ status, className = '' }) => {
  const { translateStatus } = useLanguage();

  const getStyles = () => {
    switch (status) {
      case 'SUBMITTED':
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
          icon: <Clock className="w-3.5 h-3.5 mr-1" />
        };
      case 'UNDER_REVIEW':
        return {
          bg: 'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800',
          icon: <AlertCircle className="w-3.5 h-3.5 mr-1" />
        };
      case 'ASSIGNED':
        return {
          bg: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800',
          icon: <ArrowRightCircle className="w-3.5 h-3.5 mr-1" />
        };
      case 'IN_PROGRESS':
        return {
          bg: 'bg-cyan-100 text-cyan-800 border-cyan-300 dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-800',
          icon: <PlayCircle className="w-3.5 h-3.5 mr-1 animate-pulse" />
        };
      case 'ON_HOLD':
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800',
          icon: <Clock className="w-3.5 h-3.5 mr-1" />
        };
      case 'RESOLVED':
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
          icon: <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
        };
      case 'REJECTED':
        return {
          bg: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800',
          icon: <XCircle className="w-3.5 h-3.5 mr-1" />
        };
      default:
        return {
          bg: 'bg-gray-100 text-gray-800 border-gray-300',
          icon: null
        };
    }
  };

  const style = getStyles();

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${style.bg} ${className}`}
    >
      {style.icon}
      {translateStatus(status)}
    </span>
  );
};
