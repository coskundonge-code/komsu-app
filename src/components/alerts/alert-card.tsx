import React from 'react';
import {
  AlertCircle,
  AlertTriangle,
  AlertOctagon,
  Clock,
  MapPin,
} from 'lucide-react';

export interface Alert {
  id: string;
  title: string;
  body: string;
  location: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'danger';
  type: string;
  actionLink?: string;
}

interface AlertCardProps {
  alert: Alert;
  onActionClick?: (id: string, link?: string) => void;
}

const severityConfig = {
  info: {
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    badgeColor: 'bg-emerald-100 text-emerald-700',
    iconColor: 'text-emerald-600',
  },
  warning: {
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    badgeColor: 'bg-yellow-100 text-yellow-700',
    iconColor: 'text-yellow-600',
  },
  danger: {
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    badgeColor: 'bg-red-100 text-red-700',
    iconColor: 'text-red-600',
  },
};

const iconMap = {
  info: AlertCircle,
  warning: AlertTriangle,
  danger: AlertOctagon,
};

export function AlertCard({
  alert,
  onActionClick,
}: AlertCardProps) {
  const config = severityConfig[alert.severity];
  const Icon = iconMap[alert.severity];

  const severityLabels = {
    info: 'Bilgi',
    warning: 'Uyarı',
    danger: 'Acil',
  };

  return (
    <button
      onClick={() => onActionClick?.(alert.id, alert.actionLink)}
      className={`w-full ${config.bgColor} border-l-4 ${config.borderColor} p-4 rounded transition-colors hover:opacity-80 text-left`}
    >
      <div className="flex gap-4">
        {/* Icon */}
        <div className="flex-shrink-0">
          <Icon size={24} className={config.iconColor} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-gray-900">{alert.title}</h3>
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${config.badgeColor} flex-shrink-0`}
            >
              {severityLabels[alert.severity]}
            </span>
          </div>

          <p className="text-sm text-gray-700 mb-3">{alert.body}</p>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <MapPin size={16} />
              <span>{alert.location}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Clock size={16} />
              <span>{alert.timestamp}</span>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
