'use client';

import { Heart, MessageCircle, Share2, AlertTriangle } from 'lucide-react';
import { ReactionBar } from './reaction-bar';
import { cn } from '@/lib/utils';

export type PostType = 'genel' | 'guvenlik' | 'oneri' | 'kayipbuluntu' | 'satilik' | 'anket';

export interface PostCardProps {
  id: string;
  authorAvatar: string;
  authorName: string;
  authorHandle?: string;
  timeAgo: string;
  type: PostType;
  title: string;
  body: string;
  mediaUrl?: string;
  commentCount?: number;
  reactions?: {
    likes: number;
    thanks: number;
    agree: number;
  };
  onComment?: () => void;
  onShare?: () => void;
  onReaction?: (type: string) => void;
}

const typeConfig: Record<PostType, { label: string; color: string; bgColor: string }> = {
  genel: { label: 'Genel', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  guvenlik: { label: 'Güvenlik', color: 'text-red-600', bgColor: 'bg-red-100' },
  oneri: { label: 'Öneri', color: 'text-purple-600', bgColor: 'bg-purple-100' },
  kayipbuluntu: { label: 'Kayıp/Buluntu', color: 'text-orange-600', bgColor: 'bg-orange-100' },
  satilik: { label: 'Satılık', color: 'text-green-600', bgColor: 'bg-green-100' },
  anket: { label: 'Anket', color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
};

export function PostCard({
  id,
  authorAvatar,
  authorName,
  authorHandle,
  timeAgo,
  type,
  title,
  body,
  mediaUrl,
  commentCount = 0,
  reactions,
  onComment,
  onShare,
  onReaction,
}: PostCardProps) {
  const config = typeConfig[type];
  const isSafetyPost = type === 'guvenlik';

  return (
    <article
      className={cn(
        'bg-white rounded-lg shadow-sm border transition-all hover:shadow-md',
        isSafetyPost ? 'border-red-300' : 'border-gray-200'
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex gap-3 flex-1">
            <img
              src={authorAvatar}
              alt={authorName}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <h3 className="font-semibold text-gray-900 truncate">
                  {authorName}
                </h3>
                {authorHandle && (
                  <span className="text-sm text-gray-500">@{authorHandle}</span>
                )}
                <span className="text-sm text-gray-500">·</span>
                <span className="text-sm text-gray-500 whitespace-nowrap">
                  {timeAgo}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <span
                  className={cn(
                    'text-xs font-medium px-2.5 py-0.5 rounded-full',
                    config.bgColor,
                    config.color
                  )}
                >
                  {isSafetyPost && <AlertTriangle size={12} className="inline mr-1" />}
                  {config.label}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-3">
        <h2 className="text-base font-semibold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
          {body}
        </p>
      </div>

      {/* Media Preview */}
      {mediaUrl && (
        <div className="px-4 py-2">
          <img
            src={mediaUrl}
            alt="Post media"
            className="w-full h-48 object-cover rounded-lg bg-gray-100"
          />
        </div>
      )}

      {/* Reactions */}
      <div className="px-4 py-2 border-t border-gray-100">
        <ReactionBar
          initialLikes={reactions?.likes ?? 12}
          initialThanks={reactions?.thanks ?? 5}
          initialAgree={reactions?.agree ?? 8}
          onReaction={onReaction}
        />
      </div>

      {/* Footer Actions */}
      <div className="px-4 py-3 flex items-center justify-around border-t border-gray-100 text-gray-600">
        <button
          onClick={onComment}
          className="flex items-center gap-2 flex-1 justify-center py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
        >
          <MessageCircle size={18} />
          <span>{commentCount} Yorum</span>
        </button>
        <button
          onClick={onShare}
          className="flex items-center gap-2 flex-1 justify-center py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
        >
          <Share2 size={18} />
          <span>Paylaş</span>
        </button>
      </div>
    </article>
  );
}
