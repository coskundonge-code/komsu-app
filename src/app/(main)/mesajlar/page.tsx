'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, Edit, Search, Send, Image, Smile } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data
const mockConversations = [
  {
    id: '1',
    name: 'Ahmet Yılmaz',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop',
    lastMessage: 'Temizlik malzemeleri hakkında bilgi alabilir miyim?',
    time: '2 sa',
    unread: 2,
    online: true,
    type: 'dm' as const,
  },
  {
    id: '2',
    name: 'Fatma Şahin',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop',
    lastMessage: 'Tükenmez kalem ve defter bölüştürebiliriz',
    time: '5 sa',
    unread: 1,
    online: false,
    type: 'dm' as const,
  },
  {
    id: '3',
    name: 'Komşu Yardım Grubu',
    avatar: 'https://images.unsplash.com/photo-1517457373614-b7152f800fd1?w=96&h=96&fit=crop',
    lastMessage: 'Herkese iyi akşamlar, yarın piknik var mı?',
    time: '1 gün',
    unread: 0,
    online: false,
    type: 'group' as const,
  },
  {
    id: '4',
    name: 'Mehmet Demir',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop',
    lastMessage: 'Elektrik ustası önerebilir misiniz?',
    time: '3 gün',
    unread: 0,
    online: false,
    type: 'dm' as const,
  },
  {
    id: '5',
    name: 'Zeynep Kaya - Bisiklet',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop',
    lastMessage: 'Bisiklet çok güzel olmuş, teşekkürler!',
    time: '1 hafta',
    unread: 0,
    online: true,
    type: 'forsale' as const,
  },
];

const mockMessages: Record<string, Array<{ id: string; text: string; time: string; isOwn: boolean }>> = {
  '1': [
    { id: '1', text: 'Merhaba! Halı temizleme hakkında bir sorum vardı.', time: '10:30', isOwn: true },
    { id: '2', text: 'Merhaba! Elbette, yardımcı olabilirim. Ne tür halı temizliği arıyorsunuz?', time: '10:35', isOwn: false },
    { id: '3', text: 'Oturma odasındaki halı için uygun bir yöntem önerebilir misiniz?', time: '10:40', isOwn: true },
    { id: '4', text: 'Taze lekeler için buz ve limonlu su denemekten başlayabilirsiniz. Daha kalıcı lekeler için profesyonel temizlik önerilir.', time: '10:45', isOwn: false },
    { id: '5', text: 'Çok faydalı bilgi, teşekkürler! Temizlik malzemeleri hakkında bilgi alabilir miyim?', time: '11:00', isOwn: true },
  ],
  '2': [
    { id: '1', text: 'Merhabalar, çocuklara kalem ve defter satın aldım ama çok fazla.', time: '08:20', isOwn: false },
    { id: '2', text: 'İlgilenirseniz bölüştürebiliriz.', time: '08:25', isOwn: false },
    { id: '3', text: 'Çok iyi! Kaç kalem ve defter var?', time: '09:00', isOwn: true },
  ],
};

const tabs = [
  { id: 'all', label: 'Tümü' },
  { id: 'dm', label: 'DM' },
  { id: 'forsale', label: 'Satılık' },
];

export default function MessagesPage() {
  const [selectedId, setSelectedId] = useState('1');
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [messageText, setMessageText] = useState('');

  const selected = mockConversations.find((c) => c.id === selectedId);
  const messages = mockMessages[selectedId] || [];

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const filteredConversations = mockConversations.filter((c) => {
    if (activeTab !== 'all' && c.type !== activeTab) return false;
    if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Conversation list component
  const ConvoList = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-lg font-bold text-gray-900">Mesajlar</h1>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Edit className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Sohbet ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#f0f2f5] border border-[#e0e0e0] rounded-full text-sm text-[#333] placeholder-[#8f8f8f] focus:outline-none focus:border-[#00833e] focus:ring-1 focus:ring-[#00833e]"
          />
        </div>
        {/* Tabs */}
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
                activeTab === tab.id
                  ? 'bg-[#00833e] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.map((convo) => (
          <button
            key={convo.id}
            onClick={() => setSelectedId(convo.id)}
            className={cn(
              'w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-left',
              selectedId === convo.id && 'bg-[#e6f4ec]'
            )}
          >
            <div className="relative flex-shrink-0">
              <img src={convo.avatar} alt={convo.name} className="w-12 h-12 rounded-full object-cover" />
              {convo.online && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className={cn('text-sm truncate', convo.unread > 0 ? 'font-bold text-gray-900' : 'font-medium text-gray-700')}>
                  {convo.name}
                </p>
                <span className="text-xs text-gray-400 flex-shrink-0">{convo.time}</span>
              </div>
              <p className={cn('text-xs truncate mt-0.5', convo.unread > 0 ? 'text-gray-900 font-medium' : 'text-gray-500')}>
                {convo.lastMessage}
              </p>
            </div>
            {convo.unread > 0 && (
              <span className="w-5 h-5 bg-[#00833e] text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">
                {convo.unread}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  // Chat view component
  const ChatView = () => (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-white">
        {isMobile && (
          <button onClick={() => setSelectedId('')} className="p-1 hover:bg-gray-100 rounded-full">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
        )}
        <img src={selected?.avatar} alt={selected?.name} className="w-10 h-10 rounded-full object-cover" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900">{selected?.name}</p>
          <p className="text-xs text-gray-500">{selected?.online ? 'Çevrimiçi' : 'Çevrimdışı'}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={cn('flex', msg.isOwn ? 'justify-end' : 'justify-start')}>
            <div className={cn(
              'max-w-[70%] px-4 py-2.5 rounded-2xl text-sm',
              msg.isOwn
                ? 'bg-[#00833e] text-white rounded-br-md'
                : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
            )}>
              <p>{msg.text}</p>
              <p className={cn('text-[10px] mt-1', msg.isOwn ? 'text-[#a7dbb8]' : 'text-gray-400')}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-200 bg-white">
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Image className="w-5 h-5 text-gray-500" />
          </button>
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Mesajınızı yazın..."
            className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#00833e]"
          />
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Smile className="w-5 h-5 text-gray-500" />
          </button>
          <button className="p-2 bg-[#00833e] hover:bg-[#006b32] rounded-full transition-colors">
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );

  // Mobile
  if (isMobile) {
    return (
      <div className="h-[calc(100vh-56px)] bg-white">
        {selectedId ? <ChatView /> : <ConvoList />}
      </div>
    );
  }

  // Desktop - split view like Nextdoor
  return (
    <div className="flex h-[calc(100vh-56px)] bg-white">
      <div className="w-[340px] border-r border-gray-200 flex-shrink-0">
        <ConvoList />
      </div>
      <div className="flex-1">
        {selected ? (
          <ChatView />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>Sohbet seçin</p>
          </div>
        )}
      </div>
    </div>
  );
}
