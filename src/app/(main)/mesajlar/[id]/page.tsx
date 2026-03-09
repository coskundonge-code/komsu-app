'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, Phone, Video, MoreVertical, Send, Paperclip, Smile, ArrowDown } from 'lucide-react';

// Types
interface Message {
  id: string;
  text?: string;
  image?: string;
  timestamp: string;
  isOwn: boolean;
  read: boolean;
  type: 'text' | 'image' | 'system';
  date?: string;
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
}

// Mock data - same as in main messages page
const mockConversations: Conversation[] = [
  {
    id: '1',
    name: 'Ahmet Yılmaz',
    avatar: 'https://picsum.photos/400/400?random=66',
    online: true,
  },
  {
    id: '2',
    name: 'Fatma Şahin',
    avatar: 'https://picsum.photos/400/400?random=67',
    online: false,
  },
  {
    id: '3',
    name: 'Komşu Yardım Grubu',
    avatar: 'https://picsum.photos/400/400?random=68',
    online: true,
  },
  {
    id: '4',
    name: 'Mehmet Demir',
    avatar: 'https://picsum.photos/400/400?random=69',
    online: false,
  },
  {
    id: '5',
    name: 'Zeynep Kaya',
    avatar: 'https://picsum.photos/400/400?random=70',
    online: true,
  },
];

const mockMessages: Record<string, Message[]> = {
  '1': [
    {
      id: '0',
      text: 'Sohbet başlatıldı',
      timestamp: '09:00',
      isOwn: false,
      read: true,
      type: 'system',
      date: '10 Mart, Pazartesi',
    },
    {
      id: '1',
      text: 'Merhaba! Halı temizleme hakkında bir sorum vardı.',
      timestamp: '10:30',
      isOwn: true,
      read: true,
      type: 'text',
    },
    {
      id: '2',
      text: 'Merhaba! Elbette, yardımcı olabilirim. Ne tür halı temizliği arıyorsunuz?',
      timestamp: '10:35',
      isOwn: false,
      read: true,
      type: 'text',
    },
    {
      id: '2.5',
      image: 'https://picsum.photos/300/300?random=100',
      timestamp: '10:38',
      isOwn: false,
      read: true,
      type: 'image',
    },
    {
      id: '3',
      text: 'Oturma odasındaki halı için uygun bir yöntem önerebilir misiniz?',
      timestamp: '10:40',
      isOwn: true,
      read: true,
      type: 'text',
    },
    {
      id: '4',
      text: 'Taze lekeler için buz ve limonlu su denemekten başlayabilirsiniz. Daha kalıcı lekeler için profesyonel temizlik önerilir.',
      timestamp: '10:45',
      isOwn: false,
      read: true,
      type: 'text',
    },
    {
      id: '5',
      image: 'https://picsum.photos/300/300?random=101',
      timestamp: '10:50',
      isOwn: true,
      read: true,
      type: 'image',
    },
    {
      id: '6',
      text: 'Çok faydalı bilgi, teşekkürler! Temizlik malzemeleri hakkında bilgi alabilir miyim?',
      timestamp: '11:00',
      isOwn: true,
      read: true,
      type: 'text',
    },
    {
      id: '7',
      text: 'Tabii, hangi malzemelere ihtiyacınız olduğunu söyleyin.',
      timestamp: '11:05',
      isOwn: false,
      read: true,
      type: 'text',
    },
    {
      id: '8',
      text: 'Beyaz sirke, limon suyu ve tuz var mı evde?',
      timestamp: '11:08',
      isOwn: true,
      read: true,
      type: 'text',
    },
    {
      id: '9',
      text: 'Evet, hepsi var! Başka ne gerekiyor?',
      timestamp: '11:12',
      isOwn: false,
      read: true,
      type: 'text',
    },
    {
      id: '10',
      text: 'Bir fırça ve temiz bez. İyi çalışmalar!',
      timestamp: '11:15',
      isOwn: true,
      read: true,
      type: 'text',
    },
    {
      id: '11',
      text: 'Çok teşekkürler! Sonuçlarını sana yazarım.',
      timestamp: '11:18',
      isOwn: false,
      read: true,
      type: 'text',
    },
    {
      id: '12',
      text: 'Lütfen! Beklemede olacağım.',
      timestamp: '11:20',
      isOwn: true,
      read: true,
      type: 'text',
    },
    {
      id: '13',
      text: 'Harika! Yardımcı olabildiğim için mutluyum 😊',
      timestamp: '11:22',
      isOwn: false,
      read: false,
      type: 'text',
    },
  ],
  '2': [
    {
      id: '0',
      text: 'Sohbet başlatıldı',
      timestamp: '08:00',
      isOwn: false,
      read: true,
      type: 'system',
      date: '9 Mart, Pazar',
    },
    {
      id: '1',
      text: 'Merhabalar, çocuklara tükenmez kalem ve defter satın aldım ama çok fazla.',
      timestamp: '08:20',
      isOwn: false,
      read: true,
      type: 'text',
    },
    {
      id: '2',
      text: 'Bizim çocuklardan şampiyon fiyatlanı kalmış. İlgilenirseniz bölüştürebiliriz.',
      timestamp: '08:25',
      isOwn: false,
      read: true,
      type: 'text',
    },
    {
      id: '3',
      image: 'https://picsum.photos/300/300?random=102',
      timestamp: '08:30',
      isOwn: false,
      read: true,
      type: 'image',
    },
    {
      id: '4',
      text: 'Çok iyi! Kaç kalem ve defter var?',
      timestamp: '09:00',
      isOwn: true,
      read: true,
      type: 'text',
    },
    {
      id: '5',
      text: 'Yaklaşık 100 kalem ve 50 defter. Dönemi boyunca kullanabilirsiniz.',
      timestamp: '09:10',
      isOwn: false,
      read: true,
      type: 'text',
    },
    {
      id: '6',
      text: 'Harika, bu çok yardımcı olur! Bize kaç lira gerekir?',
      timestamp: '09:15',
      isOwn: true,
      read: true,
      type: 'text',
    },
    {
      id: '7',
      text: 'Komşu olduğumuz için ücretsiz olsun. Aralarında hariç tutabilecekler de var.',
      timestamp: '09:20',
      isOwn: false,
      read: true,
      type: 'text',
    },
    {
      id: '8',
      text: 'Çok cömertsin! Çok teşekkürler Fatma hanım 🙏',
      timestamp: '09:25',
      isOwn: true,
      read: true,
      type: 'text',
    },
  ],
  '3': [
    {
      id: '0',
      text: 'Sohbet başlatıldı',
      timestamp: '16:00',
      isOwn: false,
      read: true,
      type: 'system',
      date: '8 Mart, Cumartesi',
    },
    {
      id: '1',
      text: 'Arkadaşlar, bu hafta sonu piknik düşünüyoruz. Katılmak ister misiniz?',
      timestamp: '16:45',
      isOwn: false,
      read: true,
      type: 'text',
    },
    {
      id: '2',
      text: 'Yer neresi? Saat kaçta?',
      timestamp: '17:00',
      isOwn: true,
      read: true,
      type: 'text',
    },
    {
      id: '3',
      text: 'Yeşil park, saat 10 sabahında. Herkes birşey getirsin.',
      timestamp: '17:05',
      isOwn: false,
      read: true,
      type: 'text',
    },
    {
      id: '4',
      text: 'Biz salata getiririz!',
      timestamp: '17:10',
      isOwn: true,
      read: true,
      type: 'text',
    },
    {
      id: '5',
      text: 'Harika! Ben de tatlı getirelim.',
      timestamp: '17:15',
      isOwn: false,
      read: true,
      type: 'text',
    },
    {
      id: '6',
      image: 'https://picsum.photos/300/300?random=103',
      timestamp: '17:20',
      isOwn: false,
      read: true,
      type: 'image',
    },
    {
      id: '7',
      text: 'Çok güzel görünüyor! Saat 10da buluşuruz o zaman.',
      timestamp: '17:25',
      isOwn: true,
      read: true,
      type: 'text',
    },
  ],
  '4': [
    {
      id: '0',
      text: 'Sohbet başlatıldı',
      timestamp: '14:00',
      isOwn: false,
      read: true,
      type: 'system',
      date: '5 Mart, Çarşamba',
    },
    {
      id: '1',
      text: 'Merhaba, elektrik çalışmaları yapacaksın mı?',
      timestamp: '14:20',
      isOwn: false,
      read: true,
      type: 'text',
    },
    {
      id: '2',
      text: 'Evet, devreden bazı sorunlar var.',
      timestamp: '14:25',
      isOwn: true,
      read: true,
      type: 'text',
    },
    {
      id: '3',
      text: 'Elektrik ustası önerebilir misiniz?',
      timestamp: '14:30',
      isOwn: false,
      read: true,
      type: 'text',
    },
    {
      id: '4',
      text: 'Evet, Hasan usta çok iyi bir elektronikçi. İletişim bilgisi istersen verebilirim.',
      timestamp: '14:35',
      isOwn: true,
      read: true,
      type: 'text',
    },
  ],
  '5': [
    {
      id: '0',
      text: 'Sohbet başlatıldı',
      timestamp: '12:00',
      isOwn: false,
      read: true,
      type: 'system',
      date: '2 Mart, Pazar',
    },
    {
      id: '1',
      text: 'Zeynep, pazardaki bisikleti alma fırsatı buldum.',
      timestamp: '12:00',
      isOwn: true,
      read: true,
      type: 'text',
    },
    {
      id: '2',
      image: 'https://picsum.photos/300/300?random=104',
      timestamp: '12:05',
      isOwn: true,
      read: true,
      type: 'image',
    },
    {
      id: '3',
      text: 'Harika! Çok güzel görünüyor!',
      timestamp: '12:10',
      isOwn: false,
      read: true,
      type: 'text',
    },
    {
      id: '4',
      text: 'Teşekkürler! Çocuklarla parklarda bisiklet yapacağız.',
      timestamp: '12:15',
      isOwn: true,
      read: true,
      type: 'text',
    },
    {
      id: '5',
      text: 'Çok iyi fikir! Eğlenmelerini dilerim 😊',
      timestamp: '12:20',
      isOwn: false,
      read: true,
      type: 'text',
    },
  ],
};

// Typing Indicator Component
const TypingIndicator = () => (
  <div className="flex items-center gap-1">
    <div className="w-2 h-2 bg-[#8f8f8f] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
    <div className="w-2 h-2 bg-[#8f8f8f] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
    <div className="w-2 h-2 bg-[#8f8f8f] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
  </div>
);

// Scroll to Bottom Button
const ScrollToBottomButton = ({ show, onClick }: { show: boolean; onClick: () => void }) => {
  if (!show) return null;

  return (
    <button
      onClick={onClick}
      className="absolute bottom-24 right-6 bg-[#00833e] hover:bg-[#006b32] text-white rounded-full p-3 shadow-lg transition-all duration-200 z-10"
      title="En alta git"
    >
      <ArrowDown size={20} />
    </button>
  );
};

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const conversationId = params.id as string;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>(mockMessages[conversationId] || []);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const conversation = mockConversations.find((c) => c.id === conversationId);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle scroll to show/hide button
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isAtBottom);
    }
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const newMessage: Message = {
      id: String(messages.length + 1),
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
      read: false,
      type: 'text',
    };

    setMessages([...messages, newMessage]);
    setInputValue('');

    // Simulate typing indicator and response
    setIsTyping(true);
    setTimeout(() => {
      const responseMessage: Message = {
        id: String(messages.length + 2),
        text: 'Bu çok iyi! 👍',
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        isOwn: false,
        read: true,
        type: 'text',
      };
      setMessages((prev) => [...prev, responseMessage]);
      setIsTyping(false);
    }, 2000);
  };

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <p className="text-[#00833e]">Sohbet bulunamadı</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#f0f2f5]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#e0e0e0] bg-white shadow-sm">
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={() => router.back()}
            className="md:hidden p-2 hover:bg-[#f0f2f5] rounded-lg transition-colors"
            title="Geri git"
          >
            <ChevronLeft size={24} className="text-[#00833e]" />
          </button>

          <Image
            src={conversation.avatar}
            alt={conversation.name}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover"
            unoptimized
          />

          <div className="flex-1">
            <h2 className="font-semibold text-[#333]">{conversation.name}</h2>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${conversation.online ? 'bg-[#00833e]' : 'bg-[#8f8f8f]'}`}></div>
              <p className="text-xs text-[#8f8f8f]">
                {conversation.online ? 'Çevrimiçi' : 'Çevrimdışı'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 relative">
          <button
            className="p-2 hover:bg-[#f0f2f5] rounded-lg transition-colors"
            title="Ara"
          >
            <Phone size={20} className="text-[#00833e]" />
          </button>
          <button
            className="p-2 hover:bg-[#f0f2f5] rounded-lg transition-colors"
            title="Video ara"
          >
            <Video size={20} className="text-[#00833e]" />
          </button>
          <div className="relative">
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="p-2 hover:bg-[#f0f2f5] rounded-lg transition-colors"
              title="Seçenekler"
            >
              <MoreVertical size={20} className="text-[#00833e]" />
            </button>

            {showMoreMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-[#e0e0e0] rounded-lg shadow-lg z-50">
                <button className="block w-full text-left px-4 py-2 text-[#333] hover:bg-[#f0f2f5] transition-colors">
                  Profili Görüntüle
                </button>
                <button className="block w-full text-left px-4 py-2 text-[#333] hover:bg-[#f0f2f5] transition-colors">
                  Saçla
                </button>
                <button className="block w-full text-left px-4 py-2 text-[#333] hover:bg-[#f0f2f5] transition-colors">
                  Engelle
                </button>
                <button className="block w-full text-left px-4 py-2 text-red-600 hover:bg-[#f0f2f5] transition-colors border-t border-[#e0e0e0]">
                  Sohbeti Sil
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth"
      >
        {messages.map((message) => {
          // Date separator
          if (message.date) {
            return (
              <div key={message.id} className="flex justify-center my-4">
                <span className="bg-white text-[#8f8f8f] text-xs px-3 py-1 rounded-full border border-[#e0e0e0]">
                  {message.date}
                </span>
              </div>
            );
          }

          // System message
          if (message.type === 'system') {
            return (
              <div key={message.id} className="flex justify-center my-4">
                <span className="bg-white text-[#8f8f8f] text-xs px-3 py-1 rounded-full border border-[#e0e0e0]">
                  {message.text}
                </span>
              </div>
            );
          }

          // Text and Image messages
          return (
            <div
              key={message.id}
              className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'} mb-2`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  message.isOwn
                    ? 'bg-[#00833e] text-white rounded-br-none'
                    : 'bg-white text-[#333] rounded-bl-none border border-[#e0e0e0]'
                }`}
              >
                {message.type === 'image' && message.image && (
                  <Image
                    src={message.image}
                    alt="Message image"
                    width={250}
                    height={250}
                    className="rounded-lg mb-2 max-w-full h-auto"
                    unoptimized
                  />
                )}

                {message.text && (
                  <p className="text-sm break-words">{message.text}</p>
                )}

                <div className={`flex items-center justify-end gap-1 mt-1 text-xs ${message.isOwn ? 'text-white/70' : 'text-[#8f8f8f]'}`}>
                  <span>{message.timestamp}</span>
                  {message.isOwn && (
                    <span>{message.read ? '✓✓' : '✓'}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start mb-2">
            <div className="bg-white border border-[#e0e0e0] text-[#333] px-4 py-2 rounded-2xl rounded-bl-none">
              <TypingIndicator />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <ScrollToBottomButton show={showScrollButton} onClick={scrollToBottom} />

      {/* Message Input */}
      <div className="bg-white border-t border-[#e0e0e0] p-4">
        <div className="flex items-center gap-2">
          <button
            className="p-2 hover:bg-[#f0f2f5] rounded-lg transition-colors text-[#00833e]"
            title="Fotoğraf ekle"
          >
            <Paperclip size={20} />
          </button>

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(inputValue);
              }
            }}
            placeholder="Mesaj yaz..."
            className="flex-1 px-4 py-2 bg-[#f0f2f5] border border-[#e0e0e0] rounded-full focus:outline-none focus:border-[#00833e] text-[#333] placeholder-[#8f8f8f] transition-colors"
          />

          <button
            className="p-2 hover:bg-[#f0f2f5] rounded-lg transition-colors text-[#00833e]"
            title="İmoji ekle"
          >
            <Smile size={20} />
          </button>

          <button
            onClick={() => handleSendMessage(inputValue)}
            disabled={!inputValue.trim()}
            className="p-2 hover:bg-[#f0f2f5] rounded-lg transition-colors text-[#00833e] disabled:opacity-50 disabled:cursor-not-allowed"
            title="Gönder"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
