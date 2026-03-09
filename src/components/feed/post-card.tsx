'use client';

import { Heart, MessageCircle, Share2, AlertTriangle, Shield, HelpCircle, Tag, BarChart3 } from 'lucide-react';
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

const typeConfig: Record<PostType, { label: string; color: string; bgColor: string; borderColor: string; icon: any }> = {
  genel: { label: 'Genel', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', icon: Tag },
  guvenlik: { label: 'Güvenlik Uyarısı', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200', icon: Shield },
  oneri: { label: 'Öneri', color: 'text-purple-600', bgColor: 'bg-purple-50', borderColor: 'border-purple-200', icon: HelpCircle },
  kayipbuluntu: { label: 'Kayıp/Buluntu', color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200', icon: Tag },
  satilik: { label: 'Satılık', color: 'text-emerald-600', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200', icon: Tag },
  anket: { label: 'Anket', color: 'text-indigo-600', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-200', icon: BarChart3 },
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
  const Icon = config.icon;
  const isSafetyPost = type === 'guvenlik';

  return (
    <article
      className={cn(
        'bg-white rounded-lg shadow-sm border transition-all hover:shadow-md',
        isSafetyPost ? 'border-red-300' : 'border-[#e0e0e0]'
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-[#e0e0e0]">
        <div className="flex items-start justify-between">
          <div className="flex gap-3 flex-1">
            <img
              src={authorAvatar}
              alt={authorName}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 flex-wrap">
                <h3 className="font-semibold text-[#333] truncate">
                  {authorName}
                </h3>
                {authorHandle && (
                  <span className="text-sm text-[#8f8f8f]">@{authorHandle}</span>
                )}
                {authorHandle && <span className="text-sm text-[#8f8f8f]">·</span>}
                <span className="text-sm text-[#8f8f8f] whitespace-nowrap">
                  {timeAgo}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full',
                    config.bgColor,
                    config.color,
                    `border ${config.borderColor}`
                  )}
                >
                  <Icon size={14} />
                  {config.label}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-3">
        {title && <h2 className="text-base font-semibold text-[#333] mb-2">{title}</h2>}
        <p className="text-[#404040] text-sm leading-relaxed line-clamp-4">
          {body}
        </p>
      </div>

      {/* Media Preview */}
      {mediaUrl && (
        <div className="px-4 py-2">
          <img
            src={mediaUrl}
            alt="Post media"
            className="w-full h-48 object-cover rounded-lg bg-[#f0f2f5]"
          />
        </div>
      )}

      {/* Reactions */}
      {reactions && (
        <div className="px-4 py-2 border-t border-[#e0e0e0]">
          <ReactionBar
            initialLikes={reactions?.likes ?? 12}
            initialThanks={reactions?.thanks ?? 5}
            initialAgree={reactions?.agree ?? 8}
            onReaction={onReaction}
          />
        </div>
      )}

      {/* Footer Actions */}
      <div className="px-4 py-3 flex items-center justify-around border-t border-[#e0e0e0] text-[#404040]">
        <button
          onClick={onComment}
          className="flex items-center gap-2 flex-1 justify-center py-2 rounded-lg hover:bg-[#f0f2f5] transition-colors text-sm font-medium"
        >
          <MessageCircle size={18} />
          <span>{commentCount} Yorum</span>
        </button>
        <button
          onClick={onShare}
          className="flex items-center gap-2 flex-1 justify-center py-2 rounded-lg hover:bg-[#f0f2f5] transition-colors text-sm font-medium"
        >
          <Share2 size={18} />
          <span>Paylaş</span>
        </button>
      </div>
    </article>
  );
}
