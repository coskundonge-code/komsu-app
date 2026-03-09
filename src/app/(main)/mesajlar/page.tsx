'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, Edit, Search, Send, Image as ImageIcon, Smile, Plus, MessageCirclePlus, Phone, Video } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    name: 'Ahmet Yılmaz',
    avatar: 'https://picsum.photos/96/96?random=61',
    lastMessage: 'Temizlik malzemeleri hakkında bilgi alabilir miyim?',
    time: '2 sa',
    unread: 2,
    online: true,
  },
  {
    id: '2',
    name: 'Fatma Şahin',
    avatar: 'https://picsum.photos/96/96?random=62',
    lastMessage: 'Tükenmez kalem ve defter bölüştürebiliriz',
    time: '5 sa',
    unread: 1,
    online: false,
  },
  {
    id: '3',
    name: 'Mehmet Demir',
    avatar: 'https://picsum.photos/96/96?random=63',
    lastMessage: 'Elektrik ustası önerebilir misiniz?',
    time: '1 gün',
    unread: 0,
    online: false,
  },
  {
    id: '4',
    name: 'Zeynep Kaya',
    avatar: 'https://picsum.photos/96/96?random=64',
    lastMessage: 'Bisiklet çok güzel olmuş, teşekkürler!',
    time: '3 gün',
    unread: 0,
    online: true,
  },
  {
    id: '5',
    name: 'Komşu Yardım Grubu',
    avatar: 'https://picsum.photos/96/96?random=65',
    lastMessage: 'Herkese iyi akşamlar, yarın piknik var mı?',
    time: '1 hafta',
    unread: 0,
    online: false,
  },
  {
    id: '6',
    name: 'Ayşe Kılıç',
    avatar: 'https://picsum.photos/96/96?random=71',
    lastMessage: 'Balkon bitkileriniz çok güzel!',
    time: '2 gün',
    unread: 0,
    online: true,
  },
  {
    id: '7',
    name: 'Hasan Demir',
    avatar: 'https://picsum.photos/96/96?random=72',
    lastMessage: 'Pazartesi uygun mu sözleşme imzalamak için?',
    time: '4 saat',
    unread: 3,
    online: false,
  },
  {
    id: '8',
    name: 'Müzeyyen Şen',
    avatar: 'https://picsum.photos/96/96?random=73',
    lastMessage: 'Ekmek tarifini bekliyorum sabırsızlıkla!',
    time: '6 saat',
    unread: 0,
    online: true,
  },
  {
    id: '9',
    name: 'Ömer Kaya',
    avatar: 'https://picsum.photos/96/96?random=74',
    lastMessage: 'Oto elektrikçi arkadaşım var lazım olursa haber ver',
    time: '1 hafta',
    unread: 0,
    online: false,
  },
];

const mockMessages: Record<string, Array<{ id: string; text: string; time: string; isOwn: boolean }>> = {
  '1': [
    { id: '1', text: 'Merhaba! Halı temizleme hakkında bir sorum vardı.', time: '10:30', isOwn: true },
    { id: '2', text: 'Merhaba! Elbette, yardımcı olabilirim. Ne tür halı temizliği arıyorsunuz?', time: '10:35', isOwn: false },
    { id: '3', text: 'Oturma odasındaki halı için uygun bir yöntem önerebilir misiniz?', time: '10:40', isOwn: true },
    { id: '4', text: 'Taze lekeler için buz ve limonlu su denemekten başlayabilirsiniz.', time: '10:45', isOwn: false },
  ],
  '2': [
    { id: '1', text: 'Merhabalar, çocuklara kalem ve defter satın aldım ama çok fazla.', time: '08:20', isOwn: false },
    { id: '2', text: 'İlgilenirseniz bölüştürebiliriz.', time: '08:25', isOwn: false },
    { id: '3', text: 'Çok iyi! Kaç kalem ve defter var?', time: '09:00', isOwn: true },
  ],
};

export default function MessagesPage() {
  const [selectedId, setSelectedId] = useState('1');
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageText, setMessageText] = useState('');

  const [allMessages, setAllMessages] = useState(mockMessages);
  const selected = mockConversations.find((c) => c.id === selectedId);
  const messages = allMessages[selectedId] || [];

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleSend = () => {
    if (!messageText.trim() || !selectedId) return;
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
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
    setMessageText('');
  };

  const filteredConversations = mockConversations.filter((c) => {
    if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const unreadCount = mockConversations.reduce((sum, c) => sum + c.unread, 0);

  // Conversation List Component
  const ConversationList = () => (
    <div className="flex flex-col h-full bg-white border-r border-[#e0e0e0]">
      {/* Header */}
      <div className="p-4 border-b border-[#e0e0e0]">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-[#333]">Mesajlar</h1>
          <Link
            href="/mesajlar/new"
            className="inline-flex items-center gap-2 px-3 py-2 bg-[#00833e] hover:bg-[#006b32] text-white rounded-full transition-colors text-sm font-medium"
            title="Yeni mesaj başlat"
          >
            <MessageCirclePlus size={18} />
            <span className="hidden sm:inline">Yeni Mesaj</span>
          </Link>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8f8f8f]" />
          <input
            type="text"
            placeholder="Kişi veya mesaj ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#f0f2f5] border border-[#e0e0e0] rounded-full text-sm text-[#333] placeholder-[#8f8f8f] focus:outline-none focus:border-[#00833e] focus:ring-1 focus:ring-[#00833e] transition-colors"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#e0e0e0]">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8">
            <Search size={48} className="text-[#e0e0e0] mb-3" />
            <p className="text-[#8f8f8f] text-sm font-medium">Sohbet bulunamadı</p>
            <p className="text-[#8f8f8f] text-xs mt-1">Başka bir arama terimi deneyin</p>
          </div>
        ) : (
          filteredConversations.map((convo) => (
            <Link
              key={convo.id}
              href={`/mesajlar/${convo.id}`}
              className={cn(
                'w-full flex items-center gap-3 p-3 hover:bg-[#f0f2f5] transition-all duration-150 text-left border-l-4 border-transparent',
                selectedId === convo.id && 'bg-[#e6f4ec] border-l-4 border-[#00833e]'
              )}
            >
              {/* Avatar with online indicator */}
              <div className="relative flex-shrink-0">
                <Image
                  src={convo.avatar}
                  alt={convo.name}
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-full object-cover shadow-sm"
                  unoptimized
                />
                {convo.online && (
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#00833e] rounded-full border-2 border-white shadow-sm" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className={cn('text-sm truncate', convo.unread > 0 ? 'font-bold text-[#333]' : 'font-semibold text-[#333]')}>
                    {convo.name}
                  </p>
                  <span className="text-xs text-[#8f8f8f] flex-shrink-0 whitespace-nowrap">{convo.time}</span>
                </div>
                <p className={cn('text-xs truncate', convo.unread > 0 ? 'text-[#333] font-medium text-[#404040]' : 'text-[#8f8f8f]')}>
                  {convo.lastMessage}
                </p>
              </div>

              {/* Unread Badge */}
              {convo.unread > 0 && (
                <div className="flex flex-col items-center justify-center flex-shrink-0">
                  <span className="w-6 h-6 bg-[#00833e] text-white text-xs font-bold rounded-full flex items-center justify-center shadow-sm">
                    {convo.unread > 9 ? '9+' : convo.unread}
                  </span>
                </div>
              )}
            </Link>
          ))
        )}
      </div>
    </div>
  );

  // Chat View Component
  const ChatView = () => (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="flex items-center justify-between gap-3 p-4 border-b border-[#e0e0e0] bg-white shadow-sm">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {isMobile && (
            <button onClick={() => setSelectedId('')} className="p-1 hover:bg-[#f0f2f5] rounded-full transition-colors flex-shrink-0">
              <ChevronLeft size={20} className="text-[#333]" />
            </button>
          )}
          <Image
            src={selected?.avatar || ''}
            alt={selected?.name || ''}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full object-cover shadow-sm flex-shrink-0"
            unoptimized
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-[#333] truncate">{selected?.name}</p>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${selected?.online ? 'bg-[#00833e]' : 'bg-[#8f8f8f]'}`}></div>
              <p className="text-xs text-[#8f8f8f] truncate">
                {selected?.online ? 'Çevrimiçi' : 'Son görülme: 5 dk önce'}
              </p>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button className="p-2 hover:bg-[#f0f2f5] rounded-full transition-colors" title="Telefon ara">
            <Phone size={20} className="text-[#00833e]" />
          </button>
          <button className="p-2 hover:bg-[#f0f2f5] rounded-full transition-colors" title="Video ara">
            <Video size={20} className="text-[#00833e]" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#f0f2f5] space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={cn('flex', msg.isOwn ? 'justify-end' : 'justify-start')}>
            <div className={cn(
              'max-w-[65%] px-4 py-2.5 rounded-2xl text-sm break-words',
              msg.isOwn
                ? 'bg-[#00833e] text-white rounded-br-none shadow-sm'
                : 'bg-white text-[#333] border border-[#e0e0e0] rounded-bl-none'
            )}>
              <p>{msg.text}</p>
              <p className={cn('text-[10px] mt-1.5 flex items-center justify-end gap-1', msg.isOwn ? 'text-[#a7dbb8]' : 'text-[#8f8f8f]')}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-[#e0e0e0] bg-white">
        <div className="flex items-center gap-2">
          <button className="p-2.5 hover:bg-[#f0f2f5] rounded-full transition-colors flex-shrink-0" title="Fotoğraf ekle">
            <ImageIcon size={20} className="text-[#00833e]" />
          </button>
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
            placeholder="Mesajınızı yazın..."
            className="flex-1 px-4 py-2.5 bg-[#f0f2f5] border border-[#e0e0e0] rounded-full text-sm text-[#333] placeholder-[#8f8f8f] focus:outline-none focus:border-[#00833e] focus:ring-1 focus:ring-[#00833e] transition-colors"
          />
          <button className="p-2.5 hover:bg-[#f0f2f5] rounded-full transition-colors flex-shrink-0" title="İmoji ekle">
            <Smile size={20} className="text-[#00833e]" />
          </button>
          <button
            onClick={handleSend}
            disabled={!messageText.trim()}
            className="p-2.5 bg-[#00833e] hover:bg-[#006b32] disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-colors flex-shrink-0"
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
      <div className="h-[calc(100vh-56px)] bg-white">
        {selectedId ? <ChatView /> : <ConversationList />}
      </div>
    );
  }

  // Desktop Split View
  return (
    <div className="flex h-[calc(100vh-56px)] bg-[#f0f2f5]">
      <div className="w-80 flex-shrink-0 h-full">
        <ConversationList />
      </div>
      <div className="flex-1">
        {selected ? (
          <ChatView />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Search size={48} className="mx-auto text-[#8f8f8f] mb-3" />
              <p className="text-[#333] font-medium">Sohbet seçin</p>
              <p className="text-[#8f8f8f] text-sm mt-1">Mesajı açmak için bir sohbet seçiniz</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
