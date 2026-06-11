'use client';

import { useState } from 'react';
import { Heart, ThumbsUp, CheckCircle, Laugh, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toggleReaction } from '@/lib/hooks/use-posts';
import { useCurrentUser } from '@/lib/hooks/use-auth';
import { useVerificationGate } from '@/components/shared/verification-gate';

export interface ReactionBarProps {
  initialLikes?: number;
  initialThanks?: number;
  initialAgree?: number;
  initialLaugh?: number;
  initialWow?: number;
  onReaction?: (type: string) => void;
  postId?: string;
}

export function ReactionBar({
  initialLikes = 12,
  initialThanks = 5,
  initialAgree = 8,
  initialLaugh = 2,
  initialWow = 1,
  onReaction,
  postId,
}: ReactionBarProps) {
  const { user } = useCurrentUser();
  const [likes, setLikes] = useState(initialLikes);
  const [thanks, setThanks] = useState(initialThanks);
  const [agree, setAgree] = useState(initialAgree);
  const [laugh, setLaugh] = useState(initialLaugh);
  const [wow, setWow] = useState(initialWow);
  const [active, setActive] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const reactionTypeMap: { [key: string]: string } = {
    like: 'like',
    thanks: 'thanks',
    agree: 'agree',
    laugh: 'laugh',
    wow: 'wow',
  };

  const { checkVerified, gateModal } = useVerificationGate('Tepki verebilmek');

  const handleReaction = async (type: string) => {
    if (!user || !postId) return;
    if (!(await checkVerified())) return;

    setIsLoading(true);
    try {
      const reactionType = reactionTypeMap[type];
      const { error } = await toggleReaction(postId, user.id, reactionType) as any;

      if (!error) {
        setActive(active === type ? null : type);
        onReaction?.(type);

        switch (type) {
          case 'like':
            setLikes(likes + (active === 'like' ? -1 : 1));
            break;
          case 'thanks':
            setThanks(thanks + (active === 'thanks' ? -1 : 1));
            break;
          case 'agree':
            setAgree(agree + (active === 'agree' ? -1 : 1));
            break;
          case 'laugh':
            setLaugh(laugh + (active === 'laugh' ? -1 : 1));
            break;
          case 'wow':
            setWow(wow + (active === 'wow' ? -1 : 1));
            break;
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 py-2">
      {gateModal}
      <button
        onClick={() => handleReaction('like')}
        disabled={isLoading}
        className={cn(
          'flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-colors disabled:opacity-50',
          active === 'like'
            ? 'bg-primary-light text-primary-hover'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        )}
      >
        <Heart
          size={16}
          className={active === 'like' ? 'fill-current' : ''}
        />
        <span>{likes}</span>
      </button>

      <button
        onClick={() => handleReaction('thanks')}
        disabled={isLoading}
        className={cn(
          'flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-colors disabled:opacity-50',
          active === 'thanks'
            ? 'bg-primary-light text-primary-hover'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        )}
      >
        <ThumbsUp size={16} />
        <span>Teşekkür {thanks}</span>
      </button>

      <button
        onClick={() => handleReaction('agree')}
        disabled={isLoading}
        className={cn(
          'flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-colors disabled:opacity-50',
          active === 'agree'
            ? 'bg-primary-light text-primary-hover'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        )}
      >
        <CheckCircle size={16} />
        <span>Katılıyorum {agree}</span>
      </button>

      <button
        onClick={() => handleReaction('laugh')}
        disabled={isLoading}
        className={cn(
          'flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-colors disabled:opacity-50',
          active === 'laugh'
            ? 'bg-primary-light text-primary-hover'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        )}
      >
        <Laugh size={16} />
        <span>{laugh}</span>
      </button>

      <button
        onClick={() => handleReaction('wow')}
        disabled={isLoading}
        className={cn(
          'flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-colors disabled:opacity-50',
          active === 'wow'
            ? 'bg-primary-light text-primary-hover'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        )}
      >
        <Eye size={16} />
        <span>Vay {wow}</span>
      </button>
    </div>
  );
}
