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
    <div className="bg-white border-t border-emerald-100 p-4">
      <div className="flex items-end gap-3">
        {/* Emoji Button */}
        <button
          type="button"
          disabled={disabled}
          className="flex-shrink-0 p-2 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Emoji"
        >
          <Smile size={20} className="text-emerald-600" />
        </button>

        {/* Message Input */}
        <div className="flex-1 flex items-center bg-emerald-50 border border-emerald-200 rounded-lg px-3 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-transparent">
          <textarea
            ref={inputRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className="flex-1 bg-transparent py-3 outline-none resize-none max-h-30 text-emerald-900 placeholder-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
            rows={1}
          />
        </div>

        {/* Attachment Button */}
        <button
          type="button"
          disabled={disabled}
          className="flex-shrink-0 p-2 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Dosya ekle"
        >
          <Paperclip size={20} className="text-emerald-600" />
        </button>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={disabled || !message.trim()}
          className="flex-shrink-0 p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Gönder"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
