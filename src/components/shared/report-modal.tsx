'use client';

import { useState } from 'react';
import { X, Check } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'post' | 'comment' | 'user' | 'listing';
  targetId: string;
}

export function ReportModal({ isOpen, onClose, type, targetId }: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [details, setDetails] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const reasons = [
    { id: 'spam', label: 'Spam' },
    { id: 'harassment', label: 'Taciz/Nefret Söylemi' },
    { id: 'misinformation', label: 'Yanlış Bilgi' },
    { id: 'obscene', label: 'Müstehcen İçerik' },
    { id: 'fake_account', label: 'Sahte Hesap' },
    { id: 'fraud', label: 'Dolandırıcılık' },
    { id: 'other', label: 'Diğer' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReason) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        setSelectedReason('');
        setDetails('');
        setIsSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Report submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#e0e0e0]">
          <h2 className="text-lg font-semibold text-[#333]">İçeriği Bildir</h2>
          <button
            onClick={onClose}
            className="text-[#8f8f8f] hover:text-[#333] transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-[#00833e]/10 p-3 mb-4">
                <Check size={32} className="text-[#00833e]" />
              </div>
              <h3 className="text-lg font-semibold text-[#333] mb-2">Bildiriminiz alındı</h3>
              <p className="text-sm text-[#8f8f8f]">
                İçeriği incelememiz için teşekkür ederiz.
              </p>
            </div>
          ) : (
            <>
              {/* Reason Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#333] mb-3">
                  Bildirme nedeniniz
                </label>
                <div className="space-y-3">
                  {reasons.map((reason) => (
                    <label
                      key={reason.id}
                      className="flex items-center p-3 border border-[#e0e0e0] rounded-lg cursor-pointer hover:bg-[#f0f2f5] transition-colors"
                    >
                      <input
                        type="radio"
                        name="reason"
                        value={reason.id}
                        checked={selectedReason === reason.id}
                        onChange={(e) => setSelectedReason(e.target.value)}
                        className="w-4 h-4 accent-[#00833e]"
                      />
                      <span className="ml-3 text-sm text-[#333]">{reason.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Details Textarea */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#333] mb-2">
                  Ek detaylar (isteğe bağlı)
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Daha fazla bilgi sağlayın..."
                  className="w-full px-4 py-2 border border-[#e0e0e0] rounded-lg focus:outline-none focus:border-[#00833e] text-[#333] placeholder-[#8f8f8f] resize-none"
                  rows={4}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!selectedReason || isLoading}
                className="w-full py-2.5 bg-[#00833e] hover:bg-[#006b32] disabled:bg-[#8f8f8f] text-white font-medium rounded-lg transition-colors disabled:opacity-60"
              >
                {isLoading ? 'Gönderiliyor...' : 'Bildir'}
              </button>

              {/* Cancel Button */}
              <button
                type="button"
                onClick={onClose}
                className="w-full mt-2 py-2.5 bg-[#f0f2f5] hover:bg-[#e0e0e0] text-[#333] font-medium rounded-lg transition-colors"
              >
                İptal
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
