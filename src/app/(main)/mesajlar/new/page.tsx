'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Search, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useCurrentUser } from '@/lib/hooks/use-auth';
import { createClient as createTypedClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/types';

const createClient = () => createTypedClient() as any;

type ProfileRow = Database['public']['Tables']['profiles']['Row'];

export default function NewConversationPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useCurrentUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ProfileRow[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const timeout = setTimeout(async () => {
      if (!user) return;

      try {
        const supabase = createClient();

        const { data: profiles, error: searchError } = await supabase
          .from('profiles')
          .select('*')
          .ilike('full_name', `%${searchQuery}%`)
          .neq('id', user.id)
          .limit(10);

        if (searchError) {
          console.error('Error searching users:', searchError);
          setError('Kullanıcı araması başarısız oldu');
          return;
        }

        setSearchResults(profiles || []);
        setError('');
      } catch (err) {
        console.error('Error during search:', err);
        setError('Bir hata oluştu');
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchQuery, user]);

  const handleUserSelect = async (selectedUser: ProfileRow) => {
    if (!user) return;

    setIsCreating(true);
    setError('');

    try {
      const supabase = createClient();

      // Check if conversation already exists between these two users
      const { data: existingParticipants, error: participantError } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user.id);

      if (participantError) throw participantError;

      if (existingParticipants && existingParticipants.length > 0) {
        // Get all conversation IDs the current user is part of
        const userConversationIds = existingParticipants.map((p: any) => p.conversation_id);

        // Check if any of these conversations have the selected user
        const { data: existingConversation, error: checkError } = await supabase
          .from('conversation_participants')
          .select('conversation_id')
          .eq('user_id', selectedUser.id)
          .in('conversation_id', userConversationIds)
          .limit(1)
          .single();

        if (!checkError && existingConversation) {
          // Conversation already exists, just redirect
          router.push(`/mesajlar?selected=${existingConversation.conversation_id}`);
          return;
        }
      }

      // Create new conversation
      const { data: newConversation, error: createError } = await supabase
        .from('conversations')
        .insert({
          type: 'direct',
          title: null,
        } as any)
        .select()
        .single();

      if (createError) throw createError;

      // Add participants
      const { error: participantInsertError } = await supabase
        .from('conversation_participants')
        .insert([
          {
            conversation_id: newConversation.id,
            user_id: user.id,
          },
          {
            conversation_id: newConversation.id,
            user_id: selectedUser.id,
          },
        ] as any);

      if (participantInsertError) throw participantInsertError;

      // Redirect to the new conversation
      router.push(`/mesajlar?selected=${newConversation.id}`);
    } catch (err) {
      console.error('Error creating conversation:', err);
      setError('Sohbet oluşturulurken bir hata oluştu');
      setIsCreating(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-surface">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-surface flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-border">
        <Link
          href="/mesajlar"
          className="p-2 hover:bg-background rounded-full transition-colors"
        >
          <ChevronLeft size={24} className="text-text-primary" />
        </Link>
        <h1 className="text-2xl font-bold text-text-primary">Yeni Sohbet</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto">
          {/* Search Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-text-primary mb-2">
              Kullanıcı Ara
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="text"
                placeholder="Adıyla bir kişi arayın..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Search Results */}
          <div className="space-y-2">
            {isSearching ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : searchQuery.trim() === '' ? (
              <div className="text-center py-12">
                <Search size={48} className="mx-auto text-text-muted mb-3 opacity-50" />
                <p className="text-text-primary font-medium">Arama yapın</p>
                <p className="text-text-muted text-sm mt-1">
                  Sohbet başlatmak istediğiniz kişinin adını yazın
                </p>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-text-primary font-medium">Kullanıcı bulunamadı</p>
                <p className="text-text-muted text-sm mt-1">
                  &quot;{searchQuery}&quot; için sonuç yok. Başka bir ad deneyin.
                </p>
              </div>
            ) : (
              searchResults.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => handleUserSelect(profile)}
                  disabled={isCreating}
                  className="w-full flex items-center gap-4 p-4 bg-background border border-border hover:border-primary hover:bg-primary/5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-left"
                >
                  {/* Avatar */}
                  <img
                    src={
                      profile.avatar_url ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.id}`
                    }
                    alt={profile.full_name || 'User'}
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                  />

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-text-primary truncate">
                      {profile.full_name || 'Anonim Kullanıcı'}
                    </p>
                    <p className="text-sm text-text-muted truncate">
                      {profile.bio || 'Biyografi yok'}
                    </p>
                  </div>

                  {/* Verification Badge */}
                  {profile.is_verified && (
                    <div className="flex-shrink-0 px-3 py-1 bg-primary/10 border border-primary/30 rounded-full">
                      <p className="text-xs font-medium text-primary">Doğrulanmış</p>
                    </div>
                  )}

                  {/* Loading State */}
                  {isCreating && (
                    <Loader2 className="w-5 h-5 animate-spin text-primary flex-shrink-0" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
