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
  message: <MessageCircle size={20} className="text-primary" />,
  like: <Heart size={20} className="text-red-500" />,
  share: <Share2 size={20} className="text-primary" />,
  alert: <AlertCircle size={20} className="text-yellow-500" />,
  follow: <User size={20} className="text-primary" />,
  comment: <MessageCircle size={20} className="text-primary" />,
};

export function NotificationItem({
  notification,
  onActionClick,
}: NotificationItemProps) {
  return (
    <button
      onClick={() => onActionClick?.(notification.id, notification.actionLink)}
      className={`w-full p-4 border-b border-[#d1fae5] transition-colors text-left hover:bg-[#f0fdf4] ${
        !notification.read ? 'bg-primary-light' : 'bg-surface'
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
            <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center">
              {iconMap[notification.type]}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-semibold text-primary truncate">
              {notification.title}
            </h3>
            {!notification.read && (
              <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full" />
            )}
          </div>

          <p className="text-sm text-primary-hover line-clamp-2 mt-1">
            {notification.body}
          </p>

          <div className="flex justify-between items-center gap-2 mt-2">
            <span className="text-xs text-primary">{notification.timestamp}</span>
            <ChevronRight size={16} className="text-[#00a24d]" />
          </div>
        </div>
      </div>
    </button>
  );
}
