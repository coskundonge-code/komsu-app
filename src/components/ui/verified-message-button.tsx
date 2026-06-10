'use client';

import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface VerifiedMessageButtonProps {
  recipientId: string;
  recipientName: string;
  listingTitle?: string;
  listingId?: string;
}

export function VerifiedMessageButton({
  recipientId,
  recipientName,
  listingTitle,
  listingId,
}: VerifiedMessageButtonProps) {
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleMessageClick = async () => {
    try {
      setIsLoading(true);

      // Get current user
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.push('/giris');
        return;
      }

      // Check if user is a verified neighbor
      const { data: neighborData, error: neighborError } = await supabase
        .from('neighborhood_members')
        .select('user_id')
        .eq('user_id', user.id)
        .single();

      if (neighborError || !neighborData) {
        setShowVerificationModal(true);
        setIsLoading(false);
        return;
      }

      // Find-or-create the conversation atomically on the server. The previous
      // client-side flow (read conversation_participants, then insert BOTH
      // participants) was broken by RLS — it recursed on read and rejected the
      // recipient's participant row. The SECURITY DEFINER RPC handles both safely.
      const conversationType = listingId ? 'marketplace' : 'direct';
      const conversationTitle = listingTitle
        ? `${listingTitle} - ${recipientName}`
        : `Chat with ${recipientName}`;

      const { data: convRows, error: rpcError } = await (supabase.rpc as any)(
        'get_or_create_direct_conversation',
        {
          p_other_user: recipientId,
          p_listing_id: listingId ?? null,
          p_title: conversationTitle,
          p_type: conversationType,
        },
      );

      const row = Array.isArray(convRows) ? convRows[0] : convRows;
      const conversationId: string | undefined = row?.conversation_id;

      if (rpcError || !conversationId) {
        console.error('Failed to create conversation', rpcError);
        setIsLoading(false);
        return;
      }

      // Send the initial listing message only for a freshly created marketplace
      // conversation (avoid duplicate intro messages when reusing an existing one).
      if (row?.created && listingTitle && listingId) {
        await supabase.from('messages').insert({
          conversation_id: conversationId,
          sender_id: user.id,
          body: `Merhaba, "${listingTitle}" ilanınız hakkında bilgi almak istiyorum.`,
        } as any);
      }

      router.push(`/mesajlar?selected=${conversationId}`);
    } catch (error) {
      console.error('Error handling message click:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleMessageClick}
        disabled={isLoading}
        className="w-full px-4 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <MessageCircle size={18} />
        Mesaj Gönder
      </button>

      {/* Verification Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg max-w-sm mx-4 p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setShowVerificationModal(false)}
              className="absolute right-4 top-4 text-text-muted hover:text-text-primary transition-colors"
            >
              <X size={24} />
            </button>

            {/* Content */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-text-primary mb-3">
                Adres Doğrulaması Gerekli
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                Mesaj gönderebilmek için adresinizi doğrulamanız gerekiyor.
                Onaylı komşu olduktan sonra diğer komşularınızla mesajlaşabilirsiniz.
              </p>
            </div>

            {/* Buttons */}
            <div className="space-y-2">
              <Link
                href="/adres-dogrulama"
                className="w-full px-4 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover transition-colors text-center block"
              >
                Adres Doğrula
              </Link>
              <button
                onClick={() => setShowVerificationModal(false)}
                className="w-full px-4 py-3 border-2 border-border text-text-secondary rounded-lg font-semibold hover:bg-surface-active transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
