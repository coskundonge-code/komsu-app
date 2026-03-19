'use client';

import { useState } from 'react';
import { Heart, ThumbsUp, CheckCircle, Laugh, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ReactionBarProps {
  initialLikes?: number;
  initialThanks?: number;
  initialAgree?: number;
  initialLaugh?: number;
  initialWow?: number;
  onReaction?: (type: string) => void;
}

export function ReactionBar({
  initialLikes = 12,
  initialThanks = 5,
  initialAgree = 8,
  initialLaugh = 2,
  initialWow = 1,
  onReaction,
}: ReactionBarProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [thanks, setThanks] = useState(initialThanks);
  const [agree, setAgree] = useState(initialAgree);
  const [laugh, setLaugh] = useState(initialLaugh);
  const [wow, setWow] = useState(initialWow);
  const [active, setActive] = useState<string | null>(null);

  const handleReaction = (type: string) => {
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
  };

  return (
    <div className="flex flex-wrap gap-2 py-2">
      <button
        onClick={() => handleReaction('like')}
        className={cn(
          'flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-colors',
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
        className={cn(
          'flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-colors',
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
        className={cn(
          'flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-colors',
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
        className={cn(
          'flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-colors',
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
        className={cn(
          'flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-colors',
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
