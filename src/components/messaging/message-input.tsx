import React from 'react';
import { Send, Smile, Paperclip } from 'lucide-react';

interface MessageInputProps {
  onSend: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function MessageInput({
  onSend,
  placeholder = 'Bir mesaj yazın...',
  disabled = false,
}: MessageInputProps) {
  const [message, setMessage] = React.useState('');
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage('');
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    // Auto-resize textarea
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  return (
    <div className="bg-surface border-t border-[#d1fae5] p-4">
      <div className="flex items-end gap-3">
        {/* Emoji Button */}
        <button
          type="button"
          disabled={disabled}
          className="flex-shrink-0 p-2 hover:bg-primary-light rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Emoji"
        >
          <Smile size={20} className="text-primary" />
        </button>

        {/* Message Input */}
        <div className="flex-1 flex items-center bg-primary-light border border-[#a7dbb8] rounded-lg px-3 focus-within:ring-2 focus-within:ring-[#00833e] focus-within:border-transparent">
          <textarea
            ref={inputRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className="flex-1 bg-transparent py-3 outline-none resize-none max-h-30 text-primary placeholder-[#00a24d] disabled:opacity-50 disabled:cursor-not-allowed"
            rows={1}
          />
        </div>

        {/* Attachment Button */}
        <button
          type="button"
          disabled={disabled}
          className="flex-shrink-0 p-2 hover:bg-primary-light rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Dosya ekle"
        >
          <Paperclip size={20} className="text-primary" />
        </button>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={disabled || !message.trim()}
          className="flex-shrink-0 p-2 bg-primary hover:bg-primary text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Gönder"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
