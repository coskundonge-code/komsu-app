"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, Search, Send, Image as ImageIcon, Smile, MessageCirclePlus, MessageSquare, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/lib/hooks/use-auth";
import { createClient as createTypedClient } from '@/lib/supabase/client'
import type { Database } from "@/lib/supabase/types";

const createClient = () => createTypedClient()

// Performans sınırları: sınırsız çekim büyük hesaplarda ağ/bellek yükü yaratır.
const CONVERSATIONS_PAGE_SIZE = 100; // sohbet listesinde en güncel N konuşma
const MESSAGES_PAGE_SIZE = 50; // bir sohbet açıldığında ilk yüklenecek son N mesaj

type ProfileRow = Database['public']['Tables']['profiles']['Row']

type TabKey = "all" | "unread" | "marketplace";

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  type: "personal" | "marketplace" | "group";
  otherUserId?: string;
  otherUserProfile?: ProfileRow;
}

interface Message {
  id: string;
  text: string;
  time: string;
  isOwn: boolean;
  userId?: string;
}

// ---------------------------------------------------------------------------
// Conversation List — module-level component (props in).
// Defining this INSIDE the page caused React to remount it on every keystroke,
// which is why focus jumped out of inputs while typing. Keeping it at module
// scope gives it a stable identity across renders.
// ---------------------------------------------------------------------------
interface ConversationListProps {
  conversations: Conversation[];
  filteredConversations: Conversation[];
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  activeTab: TabKey;
  setActiveTab: React.Dispatch<React.SetStateAction<TabKey>>;
  unreadCount: number;
  marketplaceCount: number;
  selectedId: string;
  setSelectedId: React.Dispatch<React.SetStateAction<string>>;
}

function ConversationList({
  conversations,
  filteredConversations,
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
  unreadCount,
  marketplaceCount,
  selectedId,
  setSelectedId,
}: ConversationListProps) {
  return (
    <div className="flex flex-col h-full bg-surface border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-text-primary">Mesajlar</h1>
          <Link
            href="/mesajlar/new"
            className="inline-flex items-center gap-2 px-3 py-2 bg-primary hover:bg-primary-hover text-white rounded-full transition-colors text-sm font-medium"
            title="Yeni mesaj başlat"
          >
            <MessageCirclePlus size={18} />
            <span className="hidden sm:inline">Yeni Mesaj</span>
          </Link>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Kişi veya mesaj ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Kişi veya mesaj ara"
            className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-full text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("all")}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
              activeTab === "all"
                ? "bg-primary text-white"
                : "bg-background text-text-primary hover:bg-[#e0e0e0]"
            )}
          >
            Tümü
          </button>
          <button
            onClick={() => setActiveTab("unread")}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors relative",
              activeTab === "unread"
                ? "bg-primary text-white"
                : "bg-background text-text-primary hover:bg-[#e0e0e0]"
            )}
          >
            Okunmamış
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("marketplace")}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 relative",
              activeTab === "marketplace"
                ? "bg-primary text-white"
                : "bg-background text-text-primary hover:bg-[#e0e0e0]"
            )}
          >
            <ShoppingBag size={16} />
            Pazar Yeri
            {marketplaceCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {marketplaceCount > 9 ? "9+" : marketplaceCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#e0e0e0]">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8">
            <MessageSquare size={48} className="text-[#e0e0e0] mb-3" />
            <p className="text-text-muted text-sm font-medium">
              {activeTab === "unread" ? "Okunmamış mesaj yok" : activeTab === "marketplace" ? "Pazar yeri sohbeti yok" : "Sohbet yok"}
            </p>
            <p className="text-text-muted text-xs mt-1">
              {searchQuery ? "Başka bir arama terimi deneyin" : conversations.length === 0 ? "İlk sohbetinizi başlatın" : "Yeni bir sohbet başlatın"}
            </p>
            {!searchQuery && conversations.length === 0 && (
              <Link
                href="/mesajlar/new"
                className="mt-4 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-full text-sm font-medium transition-colors"
              >
                Yeni Sohbet Başlat
              </Link>
            )}
          </div>
        ) : (
          filteredConversations.map((convo) => (
            <button
              key={convo.id}
              onClick={() => setSelectedId(convo.id)}
              className={cn(
                "w-full flex items-center gap-3 p-3 hover:bg-background transition-all duration-150 text-left border-l-4 border-transparent",
                selectedId === convo.id && "bg-primary-light border-l-4 border-primary"
              )}
            >
              {/* Avatar with online indicator */}
              <div className="relative flex-shrink-0">
                <img
                  src={convo.avatar}
                  alt={convo.name}
                  loading="lazy"
                  className="w-14 h-14 rounded-full object-cover shadow-sm"
                />
                {convo.online && (
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-primary rounded-full border-2 border-white shadow-sm" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className={cn("text-sm truncate", convo.unread > 0 ? "font-bold text-text-primary" : "font-semibold text-text-primary")}>
                    {convo.name}
                  </p>
                  <span className="text-xs text-text-muted flex-shrink-0 whitespace-nowrap">{convo.time}</span>
                </div>
                <p className={cn("text-xs truncate", convo.unread > 0 ? "text-text-primary font-medium" : "text-text-muted")}>
                  {convo.lastMessage}
                </p>
              </div>

              {/* Unread Badge */}
              {convo.unread > 0 && (
                <div className="flex-shrink-0">
                  <span className="w-6 h-6 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center shadow-sm">
                    {convo.unread > 9 ? "9+" : convo.unread}
                  </span>
                </div>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Chat View — module-level component (props in). Same remount fix as above:
// this used to be redefined on every render, so the message input lost focus
// after each character.
// ---------------------------------------------------------------------------
interface ChatViewProps {
  isMobile: boolean;
  selected: Conversation | undefined;
  messages: Message[];
  messageText: string;
  setMessageText: React.Dispatch<React.SetStateAction<string>>;
  handleSend: () => void;
  setSelectedId: React.Dispatch<React.SetStateAction<string>>;
}

function ChatView({
  isMobile,
  selected,
  messages,
  messageText,
  setMessageText,
  handleSend,
  setSelectedId,
}: ChatViewProps) {
  return (
    <div className="flex flex-col h-full bg-surface">
      {/* Chat Header */}
      <div className="flex items-center justify-between gap-3 p-4 border-b border-border bg-surface shadow-sm">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {isMobile && (
            <button onClick={() => setSelectedId("")} aria-label="Geri dön" className="p-1 hover:bg-background rounded-full transition-colors flex-shrink-0">
              <ChevronLeft size={20} className="text-text-primary" />
            </button>
          )}
          <div className="relative flex-shrink-0">
            <img
              src={selected?.avatar || ""}
              alt={selected?.name || ""}
              loading="lazy"
              className="w-12 h-12 rounded-full object-cover shadow-sm"
            />
            {selected?.online && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-text-primary truncate">{selected?.name}</p>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${selected?.online ? "bg-primary" : "bg-[#8f8f8f]"}`}></div>
              <p className="text-xs text-text-muted truncate">
                {selected?.online ? "Çevrimiçi" : "Son görülme: 5 dk önce"}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-background space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex", msg.isOwn ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[65%] px-4 py-2.5 rounded-2xl text-sm break-words",
                msg.isOwn
                  ? "bg-primary text-white rounded-br-none shadow-sm"
                  : "bg-surface text-text-primary border border-border rounded-bl-none"
              )}
            >
              <p>{msg.text}</p>
              <p className={cn("text-[10px] mt-1.5 flex items-center justify-end gap-1", msg.isOwn ? "text-[#a7dbb8]" : "text-text-muted")}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-border bg-surface">
        <div className="flex items-center gap-2">
          <button className="p-2.5 hover:bg-background rounded-full transition-colors flex-shrink-0" aria-label="Fotoğraf ekle">
            <ImageIcon size={20} className="text-primary" />
          </button>
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            placeholder="Mesajınızı yazın..."
            className="flex-1 px-4 py-2.5 bg-background border border-border rounded-full text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          />
          <button className="p-2.5 hover:bg-background rounded-full transition-colors flex-shrink-0" aria-label="İmoji ekle">
            <Smile size={20} className="text-primary" />
          </button>
          <button
            onClick={handleSend}
            disabled={!messageText.trim()}
            aria-label="Mesaj gönder"
            className="p-2.5 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-colors flex-shrink-0"
          >
            <Send size={18} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

function MessagesContent() {
  const { user, loading: authLoading } = useCurrentUser();
  const searchParams = useSearchParams();
  // Conversation id passed in by "mesaj gönder" buttons (e.g. /mesajlar?selected=<id>).
  const selectedParam = searchParams.get("selected") ?? "";

  const [selectedId, setSelectedId] = useState(selectedParam);
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageText, setMessageText] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("all");

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [, setLoadingConversations] = useState(true);
  const [, setLoadingMessages] = useState(false);

  const selected = conversations.find((c) => c.id === selectedId);

  // Open the conversation requested via the URL (?selected=...). Runs on mount
  // and whenever the param changes (e.g. tapping "mesaj gönder" again from
  // another page while already on /mesajlar).
  useEffect(() => {
    if (selectedParam) setSelectedId(selectedParam);
  }, [selectedParam]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Fetch conversations from Supabase
  useEffect(() => {
    if (!user || authLoading) return;

    async function loadConversations() {
      setLoadingConversations(true);
      try {
        const supabase = createClient();

        // Kullanıcının katılımcı olduğu konuşmalar (RLS süzer). En güncel N ile
        // sınırlı — sınırsız çekim büyük hesaplarda performans sorunudur.
        const { data: dbConversations, error } = await supabase
          .from('conversations')
          .select(`
            id,
            type,
            listing_id,
            title,
            created_at,
            updated_at
          `)
          .order('updated_at', { ascending: false })
          .limit(CONVERSATIONS_PAGE_SIZE)

        if (error) {
          console.error('Error fetching conversations:', error);
          setConversations([]);
          return;
        }

        if (!dbConversations || dbConversations.length === 0) {
          setConversations([]);
          return;
        }

        const convList = dbConversations as any[];
        const convIds = convList.map((c) => c.id);

        // ── N+1 yerine TOPLU sorgular ─────────────────────────────────────────
        // Önceki tasarım her konuşma için 3 ayrı sorgu atıyordu (katılımcı +
        // profil + son mesaj) → 3×N+1 yuvarlak gidiş. Artık tüm konuşmalar için
        // 3 toplu sorgu. RLS her sorguda aynen geçerli (yalnızca kendi
        // konuşmaları döner).

        // 1) Tüm konuşmaların katılımcıları tek sorguda → karşı taraf eşlemesi.
        const { data: allParticipants } = await supabase
          .from('conversation_participants')
          .select('conversation_id, user_id')
          .in('conversation_id', convIds);

        const otherUserByConv = new Map<string, string>();
        for (const p of ((allParticipants as any[]) || [])) {
          if (p.user_id !== user?.id && !otherUserByConv.has(p.conversation_id)) {
            otherUserByConv.set(p.conversation_id, p.user_id);
          }
        }

        // 2) Karşı tarafların profilleri tek sorguda.
        const otherUserIds = Array.from(
          new Set(Array.from(otherUserByConv.values()).filter(Boolean))
        );
        const profileById = new Map<string, any>();
        if (otherUserIds.length > 0) {
          const { data: profiles } = await supabase
            .from('profiles')
            .select('*')
            .in('id', otherUserIds);
          for (const pr of ((profiles as any[]) || [])) {
            profileById.set(pr.id, pr);
          }
        }

        // 3) Konuşma başına SON mesaj tek RPC ile (DISTINCT ON; SECURITY INVOKER
        //    olduğu için messages RLS'i korunur — IDOR yok).
        const lastMsgByConv = new Map<string, any>();
        const { data: lastMsgs } = await (supabase.rpc as any)('get_last_messages', {
          p_conversation_ids: convIds,
        });
        for (const lm of ((lastMsgs as any[]) || [])) {
          lastMsgByConv.set(lm.conversation_id, lm);
        }

        // Konuşma sırasını (updated_at desc) koruyarak birleştir.
        const loadedConversations: Conversation[] = convList.map((conv) => {
          const otherUserId = otherUserByConv.get(conv.id) || '';
          const profileData = profileById.get(otherUserId);
          const lastMsg = lastMsgByConv.get(conv.id);
          const timeAgo = formatTimeAgo(conv.updated_at || conv.created_at);

          return {
            id: conv.id,
            name: profileData?.full_name || 'Unknown',
            avatar: profileData?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUserId}`,
            lastMessage: lastMsg?.body || 'No messages yet',
            time: timeAgo,
            unread: 0,
            online: false,
            type: 'personal' as const,
            otherUserId,
            otherUserProfile: profileData,
          };
        });

        setConversations(loadedConversations);
      } catch (err) {
        console.error('Error loading conversations:', err);
        setConversations([]);
      } finally {
        setLoadingConversations(false);
      }
    }

    loadConversations();

    // Setup realtime subscription for conversations
    const supabase = createClient();
    const channel = supabase.channel('conversations_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'conversations'
      }, () => {
        // Reload conversations on any change
        loadConversations();
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [user, authLoading]);

  // Fetch messages for selected conversation
  useEffect(() => {
    if (!selectedId || !user) {
      setMessages([]);
      return;
    }

    async function loadMessages() {
      setLoadingMessages(true);
      try {
        const supabase = createClient();

        // Son N mesajı çek (en yeni → en eski), sonra göstermek için ters çevir.
        // Sınırsız çekim yerine sayfalı: uzun sohbetlerde ilk yük hafif kalır;
        // yeni mesajlar zaten realtime INSERT aboneliğiyle eklenir.
        const { data: dbMessages, error } = await supabase
          .from('messages')
          .select('id, sender_id, body, created_at')
          .eq('conversation_id', selectedId)
          .order('created_at', { ascending: false })
          .limit(MESSAGES_PAGE_SIZE);

        if (error) {
          console.error('Error fetching messages:', error);
          setMessages([]);
          return;
        }

        if (!dbMessages || dbMessages.length === 0) {
          setMessages([]);
          return;
        }

        const formattedMessages: Message[] = [...(dbMessages as any[])]
          .reverse()
          .map((msg: any) => ({
            id: msg.id,
            text: msg.body,
            time: formatTimeForDisplay(msg.created_at),
            isOwn: msg.sender_id === user?.id,
            userId: msg.sender_id,
          }));

        setMessages(formattedMessages);
      } catch (err) {
        console.error('Error loading messages:', err);
        setMessages([]);
      } finally {
        setLoadingMessages(false);
      }
    }

    loadMessages();

    // Setup realtime subscription for messages
    const supabase = createClient();
    const channel = supabase.channel(`messages_${selectedId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${selectedId}`
      }, (payload: any) => {
        const newMsg: Message = {
          id: payload.new.id,
          text: payload.new.body,
          time: formatTimeForDisplay(payload.new.created_at),
          isOwn: payload.new.sender_id === user.id,
          userId: payload.new.sender_id,
        };
        setMessages((prev) => [...prev, newMsg]);
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [selectedId, user]);

  const handleSend = async () => {
    if (!messageText.trim() || !selectedId || !user) return;

    const messageContent = messageText.trim();
    setMessageText("");

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: selectedId,
          sender_id: user.id,
          body: messageContent,
        })
        .select()
        .single();

      if (error) {
        console.error('Error sending message:', error);
        // Add as optimistic update
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
        const newMsg: Message = {
          id: `msg-${Date.now()}`,
          text: messageContent,
          time: timeStr,
          isOwn: true,
        };
        setMessages((prev) => [...prev, newMsg]);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      // Fallback to optimistic update
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
      const newMsg: Message = {
        id: `msg-${Date.now()}`,
        text: messageContent,
        time: timeStr,
        isOwn: true,
      };
      setMessages((prev) => [...prev, newMsg]);
    }
  };

  const filteredConversations = conversations.filter((c) => {
    if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase()) && !c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (activeTab === "unread" && c.unread === 0) return false;
    if (activeTab === "marketplace" && c.type !== "marketplace") return false;
    return true;
  });

  const unreadCount = conversations.reduce((sum, c) => sum + c.unread, 0);
  const marketplaceCount = conversations.filter((c) => c.type === "marketplace").reduce((sum, c) => sum + c.unread, 0);

  // Mobile View
  if (isMobile) {
    return (
      <div className="h-[calc(100vh-56px)] bg-surface">
        {selectedId ? (
          <ChatView
            isMobile={isMobile}
            selected={selected}
            messages={messages}
            messageText={messageText}
            setMessageText={setMessageText}
            handleSend={handleSend}
            setSelectedId={setSelectedId}
          />
        ) : (
          <ConversationList
            conversations={conversations}
            filteredConversations={filteredConversations}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            unreadCount={unreadCount}
            marketplaceCount={marketplaceCount}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
          />
        )}
      </div>
    );
  }

  // Desktop Split View
  return (
    <div className="flex h-[calc(100vh-56px)] bg-background">
      <div className="w-80 flex-shrink-0 h-full">
        <ConversationList
          conversations={conversations}
          filteredConversations={filteredConversations}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          unreadCount={unreadCount}
          marketplaceCount={marketplaceCount}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
        />
      </div>
      <div className="flex-1">
        {selected ? (
          <ChatView
            isMobile={isMobile}
            selected={selected}
            messages={messages}
            messageText={messageText}
            setMessageText={setMessageText}
            handleSend={handleSend}
            setSelectedId={setSelectedId}
          />
        ) : conversations.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <MessageSquare size={48} className="mx-auto text-text-muted mb-3 opacity-50" />
              <p className="text-text-primary font-medium">İlk sohbetinizi başlatın</p>
              <p className="text-text-muted text-sm mt-1 mb-4">Komşularınızla bağlantı kurmaya başlayın</p>
              <Link
                href="/mesajlar/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-full text-sm font-medium transition-colors"
              >
                <MessageCirclePlus size={18} />
                Yeni Sohbet Başlat
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Search size={48} className="mx-auto text-text-muted mb-3" />
              <p className="text-text-primary font-medium">Sohbet seçin</p>
              <p className="text-text-muted text-sm mt-1">Mesajı açmak için bir sohbet seçiniz</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-[calc(100vh-56px)] bg-background">
          <div className="text-center">
            <MessageSquare size={48} className="mx-auto text-text-muted mb-3 opacity-50" />
            <p className="text-text-muted text-sm">Mesajlar yükleniyor...</p>
          </div>
        </div>
      }
    >
      <MessagesContent />
    </Suspense>
  );
}

// Helper function to format time for display in chat
function formatTimeForDisplay(isoString: string): string {
  try {
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  } catch {
    return '';
  }
}

// Helper function to format time ago (e.g., "2 sa", "5 dk")
function formatTimeAgo(isoString: string | null): string {
  if (!isoString) return '';

  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);

    if (diffMins < 1) return 'şimdi';
    if (diffMins < 60) return `${diffMins} dk`;
    if (diffHours < 24) return `${diffHours} sa`;
    if (diffDays < 7) return `${diffDays} gün`;
    if (diffWeeks < 4) return `${diffWeeks} hafta`;

    return date.toLocaleDateString('tr-TR');
  } catch {
    return '';
  }
}
