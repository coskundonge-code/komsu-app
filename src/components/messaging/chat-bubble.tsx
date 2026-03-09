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
            ? 'bg-emerald-500 text-white rounded-br-none'
            : 'bg-emerald-100 text-emerald-900 rounded-bl-none'
        }`}
      >
        <p className="break-words">{message.text}</p>
        <div
          className={`flex items-center justify-end gap-1 mt-1 ${
            message.isOwn ? 'text-emerald-100' : 'text-emerald-600'
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
