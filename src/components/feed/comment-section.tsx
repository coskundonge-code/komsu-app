'use client';

import { useState } from 'react';
import { MessageCircle, MoreVertical, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Comment {
  id: string;
  authorAvatar: string;
  authorName: string;
  authorHandle?: string;
  body: string;
  timeAgo: string;
  likes: number;
  replies?: Comment[];
  isLiked?: boolean;
}

export interface CommentSectionProps {
  comments: Comment[];
  userAvatar: string;
  userName: string;
  onAddComment?: (text: string, parentId?: string) => void;
  isLoading?: boolean;
}

export function CommentSection({
  comments,
  userAvatar,
  userName,
  onAddComment,
  isLoading = false,
}: CommentSectionProps) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(
    new Set()
  );
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());

  const handleReplySubmit = (commentId: string) => {
    if (!replyText.trim()) return;
    onAddComment?.(replyText, commentId);
    setReplyText('');
    setReplyingTo(null);
  };

  const toggleReplies = (commentId: string) => {
    const newExpanded = new Set(expandedReplies);
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId);
    } else {
      newExpanded.add(commentId);
    }
    setExpandedReplies(newExpanded);
  };

  const toggleLike = (commentId: string) => {
    const newLiked = new Set(likedComments);
    if (newLiked.has(commentId)) {
      newLiked.delete(commentId);
    } else {
      newLiked.add(commentId);
    }
    setLikedComments(newLiked);
  };

  const CommentItem = ({ comment, depth = 0 }: { comment: Comment; depth?: number }) => {
    const isLiked = likedComments.has(comment.id);
    const isExpanded = expandedReplies.has(comment.id);

    return (
      <div className={cn('', depth > 0 && 'ml-8')}>
        <div className="flex gap-3 py-3">
          <img
            src={comment.authorAvatar}
            alt={comment.authorName}
            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            {/* Comment Header */}
            <div className="flex items-baseline justify-between gap-2 mb-1">
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-sm text-gray-900">
                  {comment.authorName}
                </span>
                {comment.authorHandle && (
                  <span className="text-xs text-gray-500">
                    @{comment.authorHandle}
                  </span>
                )}
                <span className="text-xs text-gray-500">·</span>
                <span className="text-xs text-gray-500">{comment.timeAgo}</span>
              </div>
              <button className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                <MoreVertical size={14} />
              </button>
            </div>

            {/* Comment Body */}
            <p className="text-sm text-gray-700 mb-2 break-words">
              {comment.body}
            </p>

            {/* Comment Actions */}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <button
                onClick={() => toggleLike(comment.id)}
                className={cn(
                  'flex items-center gap-1 hover:text-emerald-600 transition-colors',
                  isLiked && 'text-emerald-600'
                )}
              >
                <Heart
                  size={14}
                  className={isLiked ? 'fill-current' : ''}
                />
                <span>{comment.likes + (isLiked ? 1 : 0)}</span>
              </button>
              <button
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className="flex items-center gap-1 hover:text-emerald-600 transition-colors"
              >
                <MessageCircle size={14} />
                <span>Yanıtla</span>
              </button>
            </div>

            {/* Reply Form */}
            {replyingTo === comment.id && (
              <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                <img
                  src={userAvatar}
                  alt={userName}
                  className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Yanıt yazın..."
                    className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleReplySubmit(comment.id);
                      }
                    }}
                  />
                  <button
                    onClick={() => handleReplySubmit(comment.id)}
                    disabled={isLoading || !replyText.trim()}
                    className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                  >
                    Gönder
                  </button>
                </div>
              </div>
            )}

            {/* Nested Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-2">
                <button
                  onClick={() => toggleReplies(comment.id)}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  {isExpanded
                    ? `Yanıtları Gizle (${comment.replies.length})`
                    : `Yanıtları Göster (${comment.replies.length})`}
                </button>
                {isExpanded && (
                  <div className="mt-3">
                    {comment.replies.map((reply) => (
                      <CommentItem
                        key={reply.id}
                        comment={reply}
                        depth={depth + 1}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {depth === 0 && <div className="border-b border-gray-100" />}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="font-semibold text-gray-900 mb-4">
        Yorumlar ({comments.length})
      </h3>

      {/* Add Comment Form */}
      <div className="flex gap-3 mb-4 pb-4 border-b border-gray-200">
        <img
          src={userAvatar}
          alt={userName}
          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            placeholder="Bir yorum ekleyin..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && e.currentTarget.value.trim()) {
                e.preventDefault();
                onAddComment?.(e.currentTarget.value);
                e.currentTarget.value = '';
              }
            }}
          />
          <button className="px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50">
            Gönder
          </button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-0">
        {comments.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            Henüz yorum yok. İlk yorum yapan siz olun!
          </p>
        ) : (
          comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        )}
      </div>
    </div>
  );
}
