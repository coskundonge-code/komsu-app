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

}



export function VerifiedMessageButton({

  recipientId,

  recipientName,

  listingTitle,

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

        // Redirect to login

        router.push('/giris');

        return;

      }



      // Check if user is a verified neighbor

      const { data: neighborData, error: neighborError } = await supabase

        .from('neighborhood_members')

        .select('id')

        .eq('user_id', user.id)

        .single();



      if (neighborError || !neighborData) {

        // User is not verified

        setShowVerificationModal(true);

        setIsLoading(false);

        return;

      }



      // User is verified, check for existing direct conversation with recipient

      const { data: myConversations } = await supabase

        .from('conversation_participants')

        .select('conversation_id')

        .eq('user_id', user.id);



      let conversationId: string | null = null;



      if (myConversations && myConversations.length > 0) {

        const myConvIds = myConversations.map((c: any) => c.conversation_id);

        const { data: sharedConv } = await supabase

          .from('conversation_participants')

          .select('conversation_id')

          .eq('user_id', recipientId)

          .in('conversation_id', myConvIds);



        if (sharedConv && sharedConv.length > 0) {

          conversationId = sharedConv[0].conversation_id;

        }

      }



      if (conversationId) {

        // Existing conversation found

      } else {

        // Create new conversation

        const { data: newConversation, error: createError } = await supabase

          .from('conversations')

          .insert({

            title: `Chat with ${recipientName}`,

          })

          .select('id')

          .single();



        if (createError || !newConversation) {

          console.error('Failed to create conversation');

          setIsLoading(false);

          return;

        }



        conversationId = newConversation.id;



        // Add participants

        await supabase.from('conversation_participants').insert([

          {

            conversation_id: conversationId,

            user_id: user.id,

          },

          {

            conversation_id: conversationId,

            user_id: recipientId,

          },

        ]);

      }



      // Redirect to messages with selected conversation

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

        className="w-full px-4 py-3 bg-[#00833e] text-white rounded-lg font-semibold hover:bg-[#006b2e] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"

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

              className="absolute right-4 top-4 text-[#8f8f8f] hover:text-[#333] transition-colors"

            >

              <X size={24} />

            </button>



            {/* Content */}

            <div className="mb-6">

              <h2 className="text-lg font-bold text-[#333] mb-3">

                Adres Doğrulaması Gerekli

              </h2>

              <p className="text-sm text-[#666] leading-relaxed">

                Mesaj gönderebilmek için adresinizi doğrulamanız gerekiyor.

                Onaylı komşu olduktan sonra diğer komşularınızla mesajlaşabilirsiniz.

              </p>

            </div>



            {/* Buttons */}

            <div className="space-y-2">

              <Link

                href="/ayarlar"

                className="w-full px-4 py-3 bg-[#00833e] text-white rounded-lg font-semibold hover:bg-[#006b2e] transition-colors text-center block"

              >

                Adres Doğrula

              </Link>

              <button

                onClick={() => setShowVerificationModal(false)}

                className="w-full px-4 py-3 border-2 border-[#e0e0e0] text-[#666] rounded-lg font-semibold hover:bg-[#f5f5f5] transition-colors"

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

