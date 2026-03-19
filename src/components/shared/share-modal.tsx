'use client';

import { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
}

export function ShareModal({ isOpen, onClose, title, url }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Kopyalama başarısız:', error);
    }
  };

  const shareOptions = [
    {
      id: 'copy',
      label: 'Link Kopyala',
      icon: Copy,
      action: handleCopyLink,
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      icon: () => (
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-9.746 9.875c0 2.72.738 5.378 2.137 7.657L2.57 23.978l8.02-2.106a9.857 9.857 0 004.759 1.205h.005c5.45 0 9.885-4.418 9.88-9.897 0-2.637-.704-5.153-2.041-7.335A9.865 9.865 0 0012.051 6.979z" />
        </svg>
      ),
      action: () => {
        const text = `${title} ${url}`;
        window.open(
          `https://wa.me/?text=${encodeURIComponent(text)}`,
          '_blank',
          'noopener,noreferrer'
        );
      },
    },
    {
      id: 'twitter',
      label: 'Twitter',
      icon: () => (
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7s1.1 2.2 3.75 2.25c.75.25 1.75-.25 1.75-.25z" />
        </svg>
      ),
      action: () => {
        const text = `${title} ${url}`;
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
          '_blank',
          'noopener,noreferrer'
        );
      },
    },
    {
      id: 'facebook',
      label: 'Facebook',
      icon: () => (
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      action: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          '_blank',
          'noopener,noreferrer'
        );
      },
    },
    {
      id: 'email',
      label: 'E-posta',
      icon: () => (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      action: () => {
        window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`;
      },
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg shadow-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-text-primary">Paylaş</h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title */}
          <p className="text-sm text-text-muted mb-4">{title}</p>

          {/* Share Options */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {shareOptions.map((option) => (
              <button
                key={option.id}
                onClick={option.action}
                className="flex flex-col items-center justify-center p-4 rounded-lg border border-border hover:border-primary hover:bg-background transition-all duration-200"
              >
                <div className="text-primary mb-2">
                  {option.icon instanceof Function ? <option.icon /> : option.icon}
                </div>
                <span className="text-xs text-text-primary text-center">{option.label}</span>
              </button>
            ))}
          </div>

          {/* Link Copy Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-text-primary mb-2">
              Bağlantı
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={url}
                readOnly
                className="flex-1 px-4 py-2 border border-border rounded-lg text-sm text-text-muted bg-background"
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors"
              >
                {copied ? (
                  <Check size={20} />
                ) : (
                  <Copy size={20} />
                )}
              </button>
            </div>
            {copied && (
              <p className="text-xs text-primary mt-2">Kopyalandı!</p>
            )}
          </div>

          {/* QR Code Placeholder */}
          <div className="bg-background rounded-lg p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="w-32 h-32 bg-[#e0e0e0] rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-text-muted text-sm">QR Kodu</span>
              </div>
              <p className="text-xs text-text-muted">Telefon ile oku</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
