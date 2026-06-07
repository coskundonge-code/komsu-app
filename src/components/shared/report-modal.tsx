'use client';

import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useCurrentUser } from '@/lib/hooks/use-auth';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'post' | 'comment' | 'user' | 'listing';
  targetId: string;
}

const REASONS = [
  { id: 'spam', label: 'Spam' },
  { id: 'harassment', label: 'Taciz/Nefret Söylemi' },
  { id: 'misinformation', label: 'Yanlış Bilgi' },
  { id: 'obscene', label: 'Müstehcen İçerik' },
  { id: 'fake_account', label: 'Sahte Hesap' },
  { id: 'fraud', label: 'Dolandırıcılık' },
  { id: 'other', label: 'Diğer' },
];

export function ReportModal({ isOpen, onClose, type, targetId }: ReportModalProps) {
  const { user } = useCurrentUser();
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [details, setDetails] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const resetAndClose = () => {
    onClose();
    setSelectedReason('');
    setDetails('');
    setIsSuccess(false);
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReason) return;
    if (!user) {
      setErrorMsg('Bildirim göndermek için giriş yapmalısınız.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    try {
      const reasonLabel = REASONS.find((r) => r.id === selectedReason)?.label || selectedReason;
      const supabase = createClient();

      let error;
      if (type === 'listing') {
        // İlan şikâyetleri content_moderation kuyruğuna düşer (reports tablosunda listing kolonu yok)
        ({ error } = await supabase.from('content_moderation').insert({
          content_type: 'listing',
          content_id: targetId,
          reported_by: user.id,
          status: 'pending_admin',
          reason: details.trim() ? `${reasonLabel} — ${details.trim()}` : reasonLabel,
          priority: 'medium',
        }));
      } else {
        // post / comment / user → reports tablosu
        ({ error } = await supabase.from('reports').insert({
          reporter_id: user.id,
          reason: reasonLabel,
          description: details.trim() || null,
          post_id: type === 'post' ? targetId : null,
          comment_id: type === 'comment' ? targetId : null,
          reported_user_id: type === 'user' ? targetId : null,
        }));
      }

      if (error) throw error;

      setIsSuccess(true);
      setTimeout(resetAndClose, 2000);
    } catch (err) {
      console.error('Report submission error:', err);
      setErrorMsg('Bildirim gönderilemedi. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-text-primary">İçeriği Bildir</h2>
          <button
            onClick={resetAndClose}
            className="text-text-muted hover:text-text-primary transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-primary/10 p-3 mb-4">
                <Check size={32} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Bildiriminiz alındı</h3>
              <p className="text-sm text-text-muted">
                İçeriği incelememiz için teşekkür ederiz.
              </p>
            </div>
          ) : (
            <>
              {/* Reason Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-text-primary mb-3">
                  Bildirme nedeniniz
                </label>
                <div className="space-y-3">
                  {REASONS.map((reason) => (
                    <label
                      key={reason.id}
                      className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:bg-background transition-colors"
                    >
                      <input
                        type="radio"
                        name="reason"
                        value={reason.id}
                        checked={selectedReason === reason.id}
                        onChange={(e) => setSelectedReason(e.target.value)}
                        className="w-4 h-4 accent-[#00833e]"
                      />
                      <span className="ml-3 text-sm text-text-primary">{reason.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Details Textarea */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Ek detaylar (isteğe bağlı)
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Daha fazla bilgi sağlayın..."
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary text-text-primary placeholder:text-text-muted resize-none"
                  rows={4}
                />
              </div>

              {errorMsg && (
                <p className="mb-4 text-sm text-red-600" role="alert">{errorMsg}</p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!selectedReason || isLoading}
                className="w-full py-2.5 bg-primary hover:bg-primary-hover disabled:bg-[#8f8f8f] text-white font-medium rounded-lg transition-colors disabled:opacity-60"
              >
                {isLoading ? 'Gönderiliyor...' : 'Bildir'}
              </button>

              {/* Cancel Button */}
              <button
                type="button"
                onClick={resetAndClose}
                className="w-full mt-2 py-2.5 bg-background hover:bg-[#e0e0e0] text-text-primary font-medium rounded-lg transition-colors"
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
