import React from 'react';
import { Check, CheckCheck } from 'lucide-react';

export interface Message {
  id: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
  read: boolean;
}

interface ChatBubbleProps {
  message: Message;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  return (
    <div
      className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          message.isOwn
            ? 'bg-primary text-white rounded-br-none'
            : 'bg-primary-light text-primary rounded-bl-none'
        }`}
      >
        <p className="break-words">{message.text}</p>
        <div
          className={`flex items-center justify-end gap-1 mt-1 ${
            message.isOwn ? 'text-[#d1fae5]' : 'text-primary'
          }`}
        >
          <span className="text-xs">{message.timestamp}</span>
          {message.isOwn && (
            <>
              {message.read ? (
                <CheckCheck size={14} />
              ) : (
                <Check size={14} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
