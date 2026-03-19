"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, Search, Send, Image as ImageIcon, Smile, MessageCirclePlus, Phone, Video, MessageSquare, ShoppingBag, Bell } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getFeedImageUrl, getAvatarUrl } from '@/lib/demo-images'

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  type: "personal" | "marketplace" | "group";
}

const mockConversations: Conversation[] = [
  {
    id: "1",
    name: "Ahmet Yılmaz",
    avatar: getFeedImageUrl(61, 96, 96),
    lastMessage: "Temizlik malzemeleri hakkında bilgi alabilir miyim?",
    time: "2 sa",
    unread: 2,
    online: true,
    type: "personal",
  },
  {
    id: "2",
    name: "Fatma Şahin",
    avatar: getFeedImageUrl(62, 96, 96),
    lastMessage: "Tükenmez kalem ve defter bölüştürebiliriz",
    time: "5 sa",
    unread: 1,
    online: false,
    type: "personal",
  },
  {
    id: "3",
    name: "Mehmet Demir",
    avatar: getFeedImageUrl(63, 96, 96),
    lastMessage: "Elektrik ustası önerebilir misiniz?",
    time: "1 gün",
    unread: 0,
    online: false,
    type: "personal",
  },
  {
    id: "4",
    name: "Zeynep Kaya",
    avatar: getFeedImageUrl(64, 96, 96),
    lastMessage: "Bisiklet çok güzel olmuş, teşekkürler!",
    time: "3 gün",
    unread: 0,
    online: true,
    type: "personal",
  },
  {
    id: "5",
    name: "Komşu Yardım Grubu",
    avatar: getFeedImageUrl(65, 96, 96),
    lastMessage: "Herkese iyi akşamlar, yarın piknik var mı?",
    time: "1 hafta",
    unread: 0,
    online: false,
    type: "group",
  },
  {
    id: "6",
    name: "Ayşe Kılıç",
    avatar: getFeedImageUrl(71, 96, 96),
    lastMessage: "Balkon bitkileriniz çok güzel!",
    time: "2 gün",
    unread: 0,
    online: true,
    type: "personal",
  },
  {
    id: "7",
    name: "Hasan Demir",
    avatar: getFeedImageUrl(72, 96, 96),
    lastMessage: "Pazartesi uygun mu sözleşme imzalamak için?",
    time: "4 saat",
    unread: 3,
    online: false,
    type: "personal",
  },
  {
    id: "8",
    name: "Müzeyyen Şen",
    avatar: getFeedImageUrl(73, 96, 96),
    lastMessage: "Ekmek tarifini bekliyorum sabırsızlıkla!",
    time: "6 saat",
    unread: 0,
    online: true,
    type: "personal",
  },
  {
    id: "9",
    name: "Ömer Kaya",
    avatar: getFeedImageUrl(74, 96, 96),
    lastMessage: "Oto elektrikçi arkadaşım var lazım olursa haber ver",
    time: "1 hafta",
    unread: 0,
    online: false,
    type: "personal",
  },
  {
    id: "10",
    name: "Mobilya Pazar Yeri",
    avatar: getFeedImageUrl(75, 96, 96),
    lastMessage: "Sandalye stokta mevcut, teslim edebilirim",
    time: "3 saat",
    unread: 4,
    online: true,
    type: "marketplace",
  },
  {
    id: "11",
    name: "Elektrik Malzemeleri",
    avatar: getFeedImageUrl(76, 96, 96),
    lastMessage: "Aydınlatma ürünleri şu anda indirimde!",
    time: "1 saat",
    unread: 0,
    online: true,
    type: "marketplace",
  },
  {
    id: "12",
    name: "Yapı Destek Grubu",
    avatar: getFeedImageUrl(77, 96, 96),
    lastMessage: "Harita paylaşımı: Tasarım önerileri var mı?",
    time: "30 dk",
    unread: 5,
    online: true,
    type: "group",
  },
];

const mockMessages: Record<string, Array<{ id: string; text: string; time: string; isOwn: boolean }>> = {
  "1": [
    { id: "1", text: "Merhaba! Halı temizleme hakkında bir sorum vardı.", time: "10:30", isOwn: true },
    { id: "2", text: "Merhaba! Elbette, yardımcı olabilirim. Ne tür halı temizliği arıyorsunuz?", time: "10:35", isOwn: false },
    { id: "3", text: "Oturma odasındaki halı için uygun bir yöntem önerebilir misiniz?", time: "10:40", isOwn: true },
    { id: "4", text: "Taze lekeler için buz ve limonlu su denemekten başlayabilirsiniz.", time: "10:45", isOwn: false },
  ],
  "2": [
    { id: "1", text: "Merhabalar, çocuklara kalem ve defter satın aldım ama çok fazla.", time: "08:20", isOwn: false },
    { id: "2", text: "İlgilenirseniz bölüştürebiliriz.", time: "08:25", isOwn: false },
    { id: "3", text: "Çok iyi! Kaç kalem ve defter var?", time: "09:00", isOwn: true },
  ],
};

export default function MessagesPage() {
  const [selectedId, setSelectedId] = useState("1");
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageText, setMessageText] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "marketplace">("all");

  const [allMessages, setAllMessages] = useState(mockMessages);
  const selected = mockConversations.find((c) => c.id === selectedId);
  const messages = allMessages[selectedId] || [];

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleSend = () => {
    if (!messageText.trim() || !selectedId) return;
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    const newMsg = {
      id: `msg-${Date.now()}`,
      text: messageText.trim(),
      time: timeStr,
      isOwn: true,
    };
    setAllMessages((prev) => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] || []), newMsg],
    }));
    setMessageText("");
  };

  let filteredConversations = mockConversations.filter((c) => {
    if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase()) && !c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (activeTab === "unread" && c.unread === 0) return false;
    if (activeTab === "marketplace" && c.type !== "marketplace") return false;
    return true;
  });

  const unreadCount = mockConversations.reduce((sum, c) => sum + c.unread, 0);
  const marketplaceCount = mockConversations.filter((c) => c.type === "marketplace").reduce((sum, c) => sum + c.unread, 0);

  // Conversation List Component
  const ConversationList = () => (
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
              {activeTab === "unread" ? "Okunmamış mesaj yok" : activeTab === "marketplace" ? "Pazar yeri sohbeti yok" : "Sohbet bulunamadı"}
            </p>
            <p className="text-text-muted text-xs mt-1">
              {searchQuery ? "Başka bir arama terimi deneyin" : "Yeni bir sohbet başlatın"}
            </p>
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

  // Chat View Component
  const ChatView = () => (
    <div className="flex flex-col h-full bg-surface">
      {/* Chat Header */}
      <div className="flex items-center justify-between gap-3 p-4 border-b border-border bg-surface shadow-sm">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {isMobile && (
            <button onClick={() => setSelectedId("")} className="p-1 hover:bg-background rounded-full transition-colors flex-shrink-0">
              <ChevronLeft size={20} className="text-text-primary" />
            </button>
          )}
          <div className="relative flex-shrink-0">
            <img
              src={selected?.avatar || ""}
              alt={selected?.name || ""}
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

        {/* Header Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button className="p-2 hover:bg-background rounded-full transition-colors" title="Telefon ara">
            <Phone size={20} className="text-primary" />
          </button>
          <button className="p-2 hover:bg-background rounded-full transition-colors" title="Video ara">
            <Video size={20} className="text-primary" />
          </button>
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
          <button className="p-2.5 hover:bg-background rounded-full transition-colors flex-shrink-0" title="Fotoğraf ekle">
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
          <button className="p-2.5 hover:bg-background rounded-full transition-colors flex-shrink-0" title="İmoji ekle">
            <Smile size={20} className="text-primary" />
          </button>
          <button
            onClick={handleSend}
            disabled={!messageText.trim()}
            className="p-2.5 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-colors flex-shrink-0"
            title="Gönder"
          >
            <Send size={18} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );

  // Mobile View
  if (isMobile) {
    return (
      <div className="h-[calc(100vh-56px)] bg-surface">
        {selectedId ? <ChatView /> : <ConversationList />}
      </div>
    );
  }

  // Desktop Split View
  return (
    <div className="flex h-[calc(100vh-56px)] bg-background">
      <div className="w-80 flex-shrink-0 h-full">
        <ConversationList />
      </div>
      <div className="flex-1">
        {selected ? (
          <ChatView />
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
