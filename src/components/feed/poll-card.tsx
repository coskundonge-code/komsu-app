'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

export interface PollOption {
  id: string;
  label: string;
  votes: number;
}

export interface PollCardProps {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  userVoted?: boolean;
  userVoteId?: string;
  onVote?: (optionId: string) => void;
  isLoading?: boolean;
}

export function PollCard({
  id,
  question,
  options,
  totalVotes,
  userVoted = false,
  userVoteId,
  onVote,
  isLoading = false,
}: PollCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(
    userVoteId ?? null
  );

  const handleVote = (optionId: string) => {
    if (userVoted || isLoading) return;
    setSelectedOption(optionId);
    onVote?.(optionId);
  };

  const getPercentage = (votes: number) => {
    return totalVotes === 0 ? 0 : Math.round((votes / totalVotes) * 100);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-base font-semibold text-gray-900 mb-4">{question}</h3>

      <div className="space-y-3">
        {options.map((option) => {
          const percentage = getPercentage(option.votes);
          const isSelected = selectedOption === option.id;
          const isUserVote = userVoteId === option.id;

          return (
            <button
              key={option.id}
              onClick={() => handleVote(option.id)}
              disabled={userVoted || isLoading}
              className={cn(
                'w-full text-left transition-all relative overflow-hidden rounded-lg',
                !userVoted && !isLoading && 'cursor-pointer hover:shadow-md',
                userVoted || isLoading ? 'opacity-80' : ''
              )}
            >
              {/* Background bar */}
              <div
                className={cn(
                  'absolute inset-0 transition-all',
                  isSelected || isUserVote
                    ? 'bg-emerald-100'
                    : 'bg-gray-100'
                )}
                style={{ width: `${percentage}%` }}
              />

              {/* Content */}
              <div className="relative px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  {!userVoted && !isLoading && (
                    <div
                      className={cn(
                        'w-4 h-4 rounded border-2 flex-shrink-0',
                        isSelected
                          ? 'bg-emerald-600 border-emerald-600'
                          : 'border-gray-300'
                      )}
                    />
                  )}
                  {(userVoted || isLoading) && (
                    <div
                      className={cn(
                        'w-4 h-4 rounded-full flex-shrink-0',
                        isUserVote ? 'bg-emerald-600' : 'bg-gray-300'
                      )}
                    />
                  )}
                  <span className="text-sm font-medium text-gray-900">
                    {option.label}
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-700 ml-2">
                  {percentage}%
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          {totalVotes} {totalVotes === 1 ? 'oy' : 'oy'}
        </p>
      </div>
    </div>
  );
}
