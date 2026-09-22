import React from 'react';
import { Incident } from '../../types';
import { Bell, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface Props {
  incident: Incident;
  className?: string;
}

export const NotifiedBadge: React.FC<Props> = ({ incident, className = '' }) => {
  const notif = incident.resolutionNotification;
  const hasEmail = Boolean(incident.citizenEmail && incident.citizenEmail.trim().length > 0);
  const hasPhone = Boolean(incident.citizenPhone && incident.citizenPhone.trim().length > 0);

  if (notif?.notified) {
    const channels = notif.channelsUsed?.join(' & ') || (notif.emailSent && notif.smsSent ? 'Email & SMS' : notif.emailSent ? 'Email' : notif.smsSent ? 'SMS' : 'Yes');
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 ${className}`}>
        <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-500 shrink-0" />
        Notified: Yes ({channels})
      </span>
    );
  }

  if (notif?.error) {
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 ${className}`}>
        <AlertCircle className="w-3.5 h-3.5 mr-1 text-amber-500 shrink-0" />
        Notified: Failed
      </span>
    );
  }

  if (incident.status === 'RESOLVED') {
    if (hasEmail || hasPhone) {
      return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 ${className}`}>
          <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-500 shrink-0" />
          Notified: Yes
        </span>
      );
    }
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-500/15 text-slate-500 dark:text-slate-400 border border-slate-500/30 ${className}`}>
        <XCircle className="w-3.5 h-3.5 mr-1 text-slate-400 shrink-0" />
        Notified: No
      </span>
    );
  }

  if (hasEmail || hasPhone) {
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 ${className}`}>
        <Bell className="w-3.5 h-3.5 mr-1 text-blue-500 shrink-0" />
        Notified: Pending ({hasEmail && hasPhone ? 'Email & SMS' : hasEmail ? 'Email' : 'SMS'})
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-500/10 text-slate-500 dark:text-slate-400 border border-slate-500/20 ${className}`}>
      <XCircle className="w-3.5 h-3.5 mr-1 text-slate-400 shrink-0" />
      Notified: No
    </span>
  );
};
