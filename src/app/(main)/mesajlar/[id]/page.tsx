'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, Phone, Video, MoreVertical } from 'lucide-react';
import { ChatBubble, type Message } from '@/components/messaging/chat-bubble';
import { MessageInput } from '@/components/messaging/message-input';

// Mock data - same as in main messages page
const mockConversations = [
  {
    id: '1',
    name: 'Ahmet Yılmaz',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    online: true,
  },
  {
    id: '2',
    name: 'Fatma Şahin',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    online: false,
  },
  {
    id: '3',
    name: 'Komşu Yardım Grubu',
    avatar: 'https://images.unsplash.com/photo-1517457373614-b7152f800fd1?w=400&h=400&fit=crop',
    online: true,
  },
  {
    id: '4',
    name: 'Mehmet Demir',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    online: false,
  },
  {
    id: '5',
    name: 'Zeynep Kaya',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    online: true,
  },
];

const mockMessages: Record<string, Message[]> = {
  '1': [
    {
      id: '1',
      text: 'Merhaba! Halı temizleme hakkında bir sorum vardı.',
      timestamp: '10:30',
      isOwn: true,
      read: true,
    },
    {
      id: '2',
      text: 'Merhaba! Elbette, yardımcı olabilirim. Ne tür halı temizliği arıyorsunuz?',
      timestamp: '10:35',
      isOwn: false,
      read: true,
    },
    {
      id: '3',
      text: 'Oturma odasındaki halı için uygun bir yöntem önerebilir misiniz?',
      timestamp: '10:40',
      isOwn: true,
      read: true,
    },
    {
      id: '4',
      text: 'Taze lekeler için buz ve limonlu su denemekten başlayabilirsiniz. Daha kalıcı lekeler için profesyonel temizlik önerilir.',
      timestamp: '10:45',
      isOwn: false,
      read: true,
    },
    {
      id: '5',
      text: 'Çok faydalı bilgi, teşekkürler! Temizlik malzemeleri hakkında bilgi alabilir miyim?',
      timestamp: '11:00',
      isOwn: true,
      read: false,
    },
    {
      id: '6',
      text: 'Tabii, hangi malzemelere ihtiyacınız olduğunu söyleyin.',
      timestamp: '11:05',
      isOwn: false,
      read: false,
    },
  ],
  '2': [
    {
      id: '1',
      text: 'Merhabalar, çocuklara tükenmez kalem ve defter satın aldım ama çok fazla.',
      timestamp: '08:20',
      isOwn: false,
      read: true,
    },
    {
      id: '2',
      text: 'Bizim çocuklardan şampiyon fiyatlanı kalmış. İlgilenirseniz bölüştürebiliriz.',
      timestamp: '08:25',
      isOwn: false,
      read: true,
    },
    {
      id: '3',
      text: 'Çok iyi! Kaç kalem ve defter var?',
      timestamp: '09:00',
      isOwn: true,
      read: true,
    },
    {
      id: '4',
      text: 'Yaklaşık 100 kalem ve 50 defter. Dönemi boyunca kullanabilirsiniz.',
      timestamp: '09:10',
      isOwn: false,
      read: true,
    },
  ],
  '3': [
    {
      id: '1',
      text: 'Arkadaşlar, bu hafta sonu piknik düşünüyoruz. Katılmak ister misiniz?',
      timestamp: '16:45',
      isOwn: false,
      read: true,
    },
    {
      id: '2',
      text: 'Yer neresi? Saat kaçta?',
      timestamp: '17:00',
      isOwn: true,
      read: true,
    },
    {
      id: '3',
      text: 'Yeşil park, saat 10 sabahında. Herkes birşey getirsin.',
      timestamp: '17:05',
      isOwn: false,
      read: true,
    },
    {
      id: '4',
      text: 'Biz salata getiririz!',
      timestamp: '17:10',
      isOwn: true,
      read: true,
    },
    {
      id: '5',
      text: 'Harika! Herkese iyi akşamlar, yarın piknik var mı?',
      timestamp: '17:15',
      isOwn: false,
      read: true,
    },
  ],
  '4': [
    {
      id: '1',
      text: 'Merhaba, elektrik çalışmaları yapacaksın mı?',
      timestamp: '14:20',
      isOwn: false,
      read: true,
    },
    {
      id: '2',
      text: 'Evet, devreden bazı sorunlar var.',
      timestamp: '14:25',
      isOwn: true,
      read: true,
    },
    {
      id: '3',
      text: 'Elektrik ustası önerebilir misiniz?',
      timestamp: '14:30',
      isOwn: false,
      read: true,
    },
  ],
  '5': [
    {
      id: '1',
      text: 'Zeynep, pazardaki bisikleti alma fırsatı buldum.',
      timestamp: '12:00',
      isOwn: true,
      read: true,
    },
    {
      id: '2',
      text: 'Harika! Öyle sevdim!',
      timestamp: '12:05',
      isOwn: false,
      read: true,
    },
    {
      id: '3',
      text: 'Bisiklet çok güzel olmuş, teşekkürler!',
      timestamp: '12:10',
      isOwn: false,
      read: true,
    },
  ],
};

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const conversationId = params.id as string;

  const conversation = mockConversations.find((c) => c.id === conversationId);
  const messages = mockMessages[conversationId] || [];

  const handleSendMessage = (text: string) => {
    console.log('Message sent:', text);
  };

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <p className="text-emerald-600">Sohbet bulunamadı</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-emerald-100 bg-white">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-emerald-50 rounded-lg transition-colors"
          >
            <ChevronLeft size={24} className="text-emerald-600" />
          </button>
          <div>
            <h2 className="font-semibold text-emerald-900">{conversation.name}</h2>
            <p className="text-xs text-emerald-600">
              {conversation.online ? 'Çevrimiçi' : 'Çevrimdışı'}
            </p>
          </div>
          <img
            src={conversation.avatar}
            alt={conversation.name}
            className="w-10 h-10 rounded-full object-cover ml-2"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            className="p-2 hover:bg-emerald-50 rounded-lg transition-colors"
            title="Ara"
          >
            <Phone size={20} className="text-emerald-600" />
          </button>
          <button
            className="p-2 hover:bg-emerald-50 rounded-lg transition-colors"
            title="Video ara"
          >
            <Video size={20} className="text-emerald-600" />
          </button>
          <button
            className="p-2 hover:bg-emerald-50 rounded-lg transition-colors"
            title="Seçenekler"
          >
            <MoreVertical size={20} className="text-emerald-600" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-emerald-25">
        {messages.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ))}
      </div>

      {/* Message Input */}
      <MessageInput onSend={handleSendMessage} />
    </div>
  );
}
