import React from 'react';
import { IncidentSeverity } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldAlert, AlertTriangle, Info, Flame } from 'lucide-react';

interface Props {
  severity: IncidentSeverity;
  showIcon?: boolean;
  className?: string;
}

export const SeverityBadge: React.FC<Props> = ({ severity, showIcon = true, className = '' }) => {
  const { translateSeverity } = useLanguage();

  const getStyles = () => {
    switch (severity) {
      case 'CRITICAL':
        return {
          bg: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950/80 dark:text-red-300 dark:border-red-800',
          icon: <Flame className="w-3.5 h-3.5 mr-1 text-red-600 dark:text-red-400" />
        };
      case 'HIGH':
        return {
          bg: 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950/80 dark:text-orange-300 dark:border-orange-800',
          icon: <ShieldAlert className="w-3.5 h-3.5 mr-1 text-orange-600 dark:text-orange-400" />
        };
      case 'MEDIUM':
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800',
          icon: <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600 dark:text-amber-400" />
        };
      case 'LOW':
      default:
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800',
          icon: <Info className="w-3.5 h-3.5 mr-1 text-emerald-600 dark:text-emerald-400" />
        };
    }
  };

  const style = getStyles();

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${style.bg} ${className}`}
    >
      {showIcon && style.icon}
      {translateSeverity(severity)}
    </span>
  );
};
