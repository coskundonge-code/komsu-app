import React from 'react';
import {
  MessageCircle,
  Heart,
  Bell,
  Share2,
  User,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';

export interface Notification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  type: 'message' | 'like' | 'share' | 'alert' | 'follow' | 'comment';
  actionLink?: string;
  avatar?: string;
}

interface NotificationItemProps {
  notification: Notification;
  onActionClick?: (id: string, link?: string) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  message: <MessageCircle size={20} className="text-emerald-500" />,
  like: <Heart size={20} className="text-red-500" />,
  share: <Share2 size={20} className="text-emerald-500" />,
  alert: <AlertCircle size={20} className="text-yellow-500" />,
  follow: <User size={20} className="text-emerald-500" />,
  comment: <MessageCircle size={20} className="text-emerald-500" />,
};

export function NotificationItem({
  notification,
  onActionClick,
}: NotificationItemProps) {
  return (
    <button
      onClick={() => onActionClick?.(notification.id, notification.actionLink)}
      className={`w-full p-4 border-b border-emerald-100 transition-colors text-left hover:bg-emerald-25 ${
        !notification.read ? 'bg-emerald-50' : 'bg-white'
      }`}
    >
      <div className="flex gap-3">
        {/* Icon or Avatar */}
        <div className="flex-shrink-0">
          {notification.avatar ? (
            <img
              src={notification.avatar}
              alt={notification.title}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
              {iconMap[notification.type]}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-semibold text-emerald-900 truncate">
              {notification.title}
            </h3>
            {!notification.read && (
              <div className="flex-shrink-0 w-2 h-2 bg-emerald-500 rounded-full" />
            )}
          </div>

          <p className="text-sm text-emerald-700 line-clamp-2 mt-1">
            {notification.body}
          </p>

          <div className="flex justify-between items-center gap-2 mt-2">
            <span className="text-xs text-emerald-600">{notification.timestamp}</span>
            <ChevronRight size={16} className="text-emerald-400" />
          </div>
        </div>
      </div>
    </button>
  );
}
