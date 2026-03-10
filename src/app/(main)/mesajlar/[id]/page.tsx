"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Phone, Video, MoreVertical, Send, Paperclip, Smile, ArrowDown, MessageSquare } from "lucide-react";
import { getFeedImageUrl, getAvatarUrl } from '@/lib/demo-images'

// Types
interface Message {
  id: string;
  text?: string;
  image?: string;
  timestamp: string;
  isOwn: boolean;
  read: boolean;
  type: "text" | "image" | "system";
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
    id: "1",
    name: "Ahmet Yılmaz",
    avatar: getFeedImageUrl(66, 400, 400),
    online: true,
  },
  {
    id: "2",
    name: "Fatma Şahin",
    avatar: getFeedImageUrl(67, 400, 400),
    online: false,
  },
  {
    id: "3",
    name: "Komşu Yardım Grubu",
    avatar: getFeedImageUrl(68, 400, 400),
    online: true,
  },
  {
    id: "4",
    name: "Mehmet Demir",
    avatar: getFeedImageUrl(69, 400, 400),
    online: false,
  },
  {
    id: "5",
    name: "Zeynep Kaya",
    avatar: getFeedImageUrl(70, 400, 400),
    online: true,
  },
  {
    id: "6",
    name: "Soner Köse",
    avatar: getFeedImageUrl(78, 400, 400),
    online: false,
  },
  {
    id: "7",
    name: "Gamze Daşkan",
    avatar: getFeedImageUrl(79, 400, 400),
    online: true,
  },
  {
    id: "8",
    name: "Veli Kışlağı",
    avatar: getFeedImageUrl(80, 400, 400),
    online: false,
  },
  {
    id: "9",
    name: "Nilüfer Çolak",
    avatar: getFeedImageUrl(81, 400, 400),
    online: true,
  },
  {
    id: "10",
    name: "Mobilya Pazar Yeri",
    avatar: getFeedImageUrl(82, 400, 400),
    online: true,
  },
];

const mockMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "0",
      text: "Bugün",
      timestamp: "09:00",
      isOwn: false,
      read: true,
      type: "system",
      date: "Bugün",
    },
    {
      id: "1",
      text: "Merhaba! Halı temizleme hakkında bir sorum vardı.",
      timestamp: "10:30",
      isOwn: true,
      read: true,
      type: "text",
    },
    {
      id: "2",
      text: "Merhaba! Elbette, yardımcı olabilirim. Ne tür halı temizliği arıyorsunuz?",
      timestamp: "10:35",
      isOwn: false,
      read: true,
      type: "text",
    },
    {
      id: "2.5",
      image: getFeedImageUrl(100, 300, 300),
      timestamp: "10:38",
      isOwn: false,
      read: true,
      type: "image",
    },
    {
      id: "3",
      text: "Oturma odasındaki halı için uygun bir yöntem önerebilir misiniz? Çok eski ve çok katlı halı.",
      timestamp: "10:40",
      isOwn: true,
      read: true,
      type: "text",
    },
    {
      id: "4",
      text: "Taze lekeler için buz ve limonlu su denemekten başlayabilirsiniz. Daha kalıcı lekeler için profesyonel temizlik önerilir.",
      timestamp: "10:45",
      isOwn: false,
      read: true,
      type: "text",
    },
    {
      id: "5",
      image: getFeedImageUrl(101, 300, 300),
      timestamp: "10:50",
      isOwn: true,
      read: true,
      type: "image",
    },
    {
      id: "6",
      text: "Çok faydalı bilgi, teşekkürler! Temizlik malzemeleri hakkında bilgi alabilir miyim?",
      timestamp: "11:00",
      isOwn: true,
      read: true,
      type: "text",
    },
    {
      id: "7",
      text: "Tabii, hangi malzemelere ihtiyacınız olduğunu söyleyin. Belki birimizde vardır.",
      timestamp: "11:05",
      isOwn: false,
      read: true,
      type: "text",
    },
    {
      id: "8",
      text: "Beyaz sirke, limon suyu ve tuz var mı evde? Bunları birleştirince güzel bir karışım çıkıyor.",
      timestamp: "11:08",
      isOwn: true,
      read: true,
      type: "text",
    },
    {
      id: "9",
      text: "Evet, hepsi var! Başka ne gerekiyor?",
      timestamp: "11:12",
      isOwn: false,
      read: true,
      type: "text",
    },
    {
      id: "10",
      text: "Bir fırça ve temiz bez. İyi çalışmalar! Merak etmeyin.",
      timestamp: "11:15",
      isOwn: true,
      read: true,
      type: "text",
    },
    {
      id: "11",
      text: "Çok teşekkürler! Sonuçlarını sana yazarım. Kesinlikle deneyeceğim.",
      timestamp: "11:18",
      isOwn: false,
      read: true,
      type: "text",
    },
    {
      id: "12",
      text: "Lütfen! Beklemede olacağım. Başarı dilerim!",
      timestamp: "11:20",
      isOwn: true,
      read: true,
      type: "text",
    },
    {
      id: "13",
      text: "Harika! Yardımcı olabildiğim için mutluyum. İyi komşuluk bu işte.",
      timestamp: "11:22",
      isOwn: false,
      read: false,
      type: "text",
    },
    {
      id: "14",
      text: "Aynen öyle! Çok sağol Ahmet abi. Tekrar görüşürüz.",
      timestamp: "11:25",
      isOwn: true,
      read: true,
      type: "text",
    },
  ],
  "2": [
    {
      id: "0",
      text: "Sohbet başlatıldı",
      timestamp: "08:00",
      isOwn: false,
      read: true,
      type: "system",
      date: "9 Mart, Pazar",
    },
    {
      id: "1",
      text: "Merhabalar, çocuklara tükenmez kalem ve defter satın aldım ama çok fazla.",
      timestamp: "08:20",
      isOwn: false,
      read: true,
      type: "text",
    },
    {
      id: "2",
      text: "Bizim çocuklardan yazı malzemeleri eksik. İlgilenirseniz bölüştürebiliriz.",
      timestamp: "08:25",
      isOwn: false,
      read: true,
      type: "text",
    },
    {
      id: "3",
      image: getFeedImageUrl(102, 300, 300),
      timestamp: "08:30",
      isOwn: false,
      read: true,
      type: "image",
    },
    {
      id: "4",
      text: "Çok iyi! Kaç kalem ve defter var?",
      timestamp: "09:00",
      isOwn: true,
      read: true,
      type: "text",
    },
    {
      id: "5",
      text: "Yaklaşık 100 kalem ve 50 defter. Dönemi boyunca kullanabilirsiniz.",
      timestamp: "09:10",
      isOwn: false,
      read: true,
      type: "text",
    },
    {
      id: "6",
      text: "Harika, bu çok yardımcı olur! Bize kaç lira gerekir?",
      timestamp: "09:15",
      isOwn: true,
      read: true,
      type: "text",
    },
    {
      id: "7",
      text: "Komşu olduğumuz için ücretsiz olsun. Aralarında hariç tutabilecekler de var.",
      timestamp: "09:20",
      isOwn: false,
      read: true,
      type: "text",
    },
    {
      id: "8",
      text: "Çok cömertsin! Çok teşekkürler Fatma hanım.",
      timestamp: "09:25",
      isOwn: true,
      read: true,
      type: "text",
    },
    {
      id: "9",
      text: "Bir rahatlık istiyorsun, ben de isterim. Hoşça kalın.",
      timestamp: "09:30",
      isOwn: false,
      read: true,
      type: "text",
    },
    {
      id: "10",
      text: "Siz de hoşça kalın!",
      timestamp: "09:32",
      isOwn: true,
      read: true,
      type: "text",
    },
  ],
  "3": [
    {
      id: "0",
      text: "Sohbet başlatıldı",
      timestamp: "16:00",
      isOwn: false,
      read: true,
      type: "system",
      date: "8 Mart, Cumartesi",
    },
    {
      id: "1",
      text: "Arkadaşlar, bu hafta sonu piknik düşünüyoruz. Katılmak ister misiniz?",
      timestamp: "16:45",
      isOwn: false,
      read: true,
      type: "text",
    },
    {
      id: "2",
      text: "Yer neresi? Saat kaçta?",
      timestamp: "17:00",
      isOwn: true,
      read: true,
      type: "text",
    },
    {
      id: "3",
      text: "Yeşil park, saat 10 sabahında. Herkes birşey getirsin lütfen.",
      timestamp: "17:05",
      isOwn: false,
      read: true,
      type: "text",
    },
    {
      id: "4",
      text: "Biz salata ve meyve getiririz!",
      timestamp: "17:10",
      isOwn: true,
      read: true,
      type: "text",
    },
    {
      id: "5",
      text: "Harika! Ben de tatlı ve içecek getirelim.",
      timestamp: "17:15",
      isOwn: false,
      read: true,
      type: "text",
    },
    {
      id: "6",
      image: getFeedImageUrl(103, 300, 300),
      timestamp: "17:20",
      isOwn: false,
      read: true,
      type: "image",
    },
    {
      id: "7",
      text: "Çok güzel görünüyor! Saat 10da buluşuruz o zaman.",
      timestamp: "17:25",
      isOwn: true,
      read: true,
      type: "text",
    },
    {
      id: "8",
      text: "Hava güzel olacakmış, çok keyifli olacak.",
      timestamp: "17:30",
      isOwn: false,
      read: true,
      type: "text",
    },
    {
      id: "9",
      text: "Sabırsızlıkla bekliyorum!",
      timestamp: "17:35",
      isOwn: true,
      read: false,
      type: "text",
    },
  ],
  "4": [
    {
      id: "0",
      text: "Sohbet başlatıldı",
      timestamp: "14:00",
      isOwn: false,
      read: true,
      type: "system",
      date: "5 Mart, Çarşamba",
    },
    {
      id: "1",
      text: "Merhaba Mehmet, elektrik çalışmaları yapacak mısın?",
      timestamp: "14:20",
      isOwn: false,
      read: true,
      type: "text",
    },
    {
      id: "2",
      text: "Evet, devreden bazı sorunlar var. Bunu düzeltmek lazım.",
      timestamp: "14:25",
      isOwn: true,
      read: true,
      type: "text",
    },
    {
      id: "3",
      text: "Elektrik ustası önerebilir misiniz? Kimin sayısını verebilirsin?",
      timestamp: "14:30",
      isOwn: false,
      read: true,
      type: "text",
    },
    {
      id: "4",
      text: "Evet, Hasan usta çok iyi bir elektrikçi. İletişim bilgisi istersen verebilirim.",
      timestamp: "14:35",
      isOwn: true,
      read: true,
      type: "text",
    },
    {
      id: "5",
      text: "Lütfen verebilir misin? Pazartesi ona ulaşmayı düşünüyorum.",
      timestamp: "14:40",
      isOwn: false,
      read: true,
      type: "text",
    },
    {
      id: "6",
      text: "Tabii, sayısını 05XX XXX XXXX. Maliyet tahmini nedir peki?",
      timestamp: "14:45",
      isOwn: true,
      read: true,
      type: "text",
    },
    {
      id: "7",
      text: "Çok teşekkürler! Ona haber veririm.",
      timestamp: "14:50",
      isOwn: false,
      read: true,
      type: "text",
    },
  ],
  "5": [
    {
      id: "0",
      text: "Sohbet başlatıldı",
      timestamp: "12:00",
      isOwn: false,
      read: true,
      type: "system",
      date: "2 Mart, Pazar",
    },
    {
      id: "1",
      text: "Zeynep, pazardaki bisikleti alma fırsatı buldum.",
      timestamp: "12:00",
      isOwn: true,
      read: true,
      type: "text",
    },
    {
      id: "2",
      image: getFeedImageUrl(104, 300, 300),
      timestamp: "12:05",
      isOwn: true,
      read: true,
      type: "image",
    },
    {
      id: "3",
      text: "Harika! Çok güzel görünüyor!",
      timestamp: "12:10",
      isOwn: false,
      read: true,
      type: "text",
    },
    {
      id: "4",
      text: "Teşekkürler! Çocuklarla parklarda bisiklet yapacağız.",
      timestamp: "12:15",
      isOwn: true,
      read: true,
      type: "text",
    },
    {
      id: "5",
      text: "Çok iyi fikir! Eğlenmelerini dilerim çok mutlu olacaklar.",
      timestamp: "12:20",
      isOwn: false,
      read: true,
      type: "text",
    },
    {
      id: "6",
      text: "Kesinlikle! Sağ olasınız. Güzel tavsiye için teşekkürler.",
      timestamp: "12:25",
      isOwn: true,
      read: true,
      type: "text",
    },
  ],
};

// Typing Indicator Component
const TypingIndicator = () => (
  <div className="flex items-center gap-1">
    <div
      className="w-2 h-2 bg-[#8f8f8f] rounded-full animate-bounce"
      style={{ animationDelay: "0ms" }}
    ></div>
    <div
      className="w-2 h-2 bg-[#8f8f8f] rounded-full animate-bounce"
      style={{ animationDelay: "150ms" }}
    ></div>
    <div
      className="w-2 h-2 bg-[#8f8f8f] rounded-full animate-bounce"
      style={{ animationDelay: "300ms" }}
    ></div>
  </div>
);

// Options Menu Component
const OptionsMenu = ({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-56 bg-white border border-[#e0e0e0] rounded-lg shadow-xl z-50">
      <button className="block w-full text-left px-4 py-3 text-[#333] hover:bg-[#f0f2f5] transition-colors text-sm">
        Profili Gör
      </button>
      <button className="block w-full text-left px-4 py-3 text-[#333] hover:bg-[#f0f2f5] transition-colors text-sm">
        Bildirim Kapat
      </button>
      <button className="block w-full text-left px-4 py-3 text-[#333] hover:bg-[#f0f2f5] transition-colors text-sm border-t border-[#e0e0e0]">
        Engelle
      </button>
      <button className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors text-sm border-t border-[#e0e0e0] font-medium">
        Sohbeti Sil
      </button>
    </div>
  );
};

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
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  const conversation = mockConversations.find((c) => c.id === conversationId);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
      timestamp: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
      isOwn: true,
      read: false,
      type: "text",
    };

    setMessages([...messages, newMessage]);
    setInputValue("");

    // Simulate typing indicator and response
    setIsTyping(true);
    setTimeout(() => {
      const responseMessage: Message = {
        id: String(messages.length + 2),
        text: "Anladım, çok iyi! İyi haberler bekliyorum.",
        timestamp: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
        isOwn: false,
        read: true,
        type: "text",
      };
      setMessages((prev) => [...prev, responseMessage]);
      setIsTyping(false);
    }, 2000);
  };

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <MessageSquare size={48} className="mx-auto text-[#e0e0e0] mb-3" />
          <p className="text-[#00833e] font-medium">Sohbet bulunamadı</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#f0f2f5]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#e0e0e0] bg-white shadow-sm">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            onClick={() => router.back()}
            className="md:hidden p-2 hover:bg-[#f0f2f5] rounded-lg transition-colors flex-shrink-0"
            title="Geri git"
          >
            <ChevronLeft size={24} className="text-[#333]" />
          </button>

          <div className="relative flex-shrink-0">
            <img
              src={conversation.avatar}
              alt={conversation.name}
              className="w-12 h-12 rounded-full object-cover shadow-sm"
            />
            {conversation.online && (
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#00833e] rounded-full border-2 border-white" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-[#333] truncate">{conversation.name}</h2>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${conversation.online ? "bg-[#00833e]" : "bg-[#8f8f8f]"}`}></div>
              <p className="text-xs text-[#8f8f8f] truncate">
                {conversation.online ? "Çevrimiçi" : "Son görülme: 5 dk önce"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 relative flex-shrink-0">
          <button className="p-2 hover:bg-[#f0f2f5] rounded-lg transition-colors" title="Telefon ara">
            <Phone size={20} className="text-[#00833e]" />
          </button>
          <button className="p-2 hover:bg-[#f0f2f5] rounded-lg transition-colors" title="Video ara">
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

            <OptionsMenu isOpen={showMoreMenu} onToggle={() => setShowMoreMenu(!showMoreMenu)} />
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div ref={messagesContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto p-4 space-y-2 scroll-smooth">
        {messages.map((message, index) => {
          // Date separator
          if (message.date) {
            return (
              <div key={message.id} className="flex justify-center my-4">
                <span className="bg-white text-[#8f8f8f] text-xs px-3 py-1.5 rounded-full border border-[#e0e0e0] font-medium shadow-sm">
                  {message.date}
                </span>
              </div>
            );
          }

          // System message
          if (message.type === "system") {
            return (
              <div key={message.id} className="flex justify-center my-4">
                <span className="bg-white text-[#8f8f8f] text-xs px-3 py-1.5 rounded-full border border-[#e0e0e0] shadow-sm">
                  {message.text}
                </span>
              </div>
            );
          }

          // Text and Image messages
          return (
            <div key={message.id} className={`flex ${message.isOwn ? "justify-end" : "justify-start"} gap-2`}>
              <div
                className={`max-w-xs lg:max-w-md rounded-2xl overflow-hidden ${
                  message.isOwn ? "bg-[#00833e] text-white rounded-br-none shadow-sm" : "bg-white text-[#333] rounded-bl-none border border-[#e0e0e0] shadow-sm"
                }`}
              >
                {message.type === "image" && message.image && (
                  <img src={message.image} alt="Message image" className="rounded-lg block max-w-full h-auto" />
                )}

                {message.text && (
                  <p className={`text-sm break-words ${message.type === "image" ? "pt-2 pb-3 px-4" : "py-2.5 px-4"}`}>
                    {message.text}
                  </p>
                )}

                <div className={`flex items-center justify-end gap-1 px-4 pb-2 text-xs ${message.isOwn ? "text-white/70" : "text-[#8f8f8f]"}`}>
                  <span>{message.timestamp}</span>
                  {message.isOwn && (
                    <span className="ml-1 flex-shrink-0">
                      {message.read ? <span className="font-bold">✓✓</span> : <span>✓</span>}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start gap-2">
            <div className="bg-white border border-[#e0e0e0] text-[#333] px-4 py-2.5 rounded-2xl rounded-bl-none shadow-sm">
              <TypingIndicator />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <ScrollToBottomButton show={showScrollButton} onClick={scrollToBottom} />

      {/* Message Input */}
      <div className={`bg-white border-t border-[#e0e0e0] transition-all duration-200 ${inputFocused ? "shadow-lg" : ""}`}>
        <div className="p-4">
          <div className={`flex gap-2 transition-all duration-200 ${inputFocused ? "items-start" : "items-center"}`}>
            <button className="p-2.5 hover:bg-[#f0f2f5] rounded-lg transition-colors text-[#00833e] flex-shrink-0 mt-1" title="Fotoğraf ekle">
              <Paperclip size={20} />
            </button>

            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(inputValue);
                }
              }}
              placeholder="Mesajınızı yazın..."
              rows={inputFocused ? 3 : 1}
              className="flex-1 px-4 py-2.5 bg-[#f0f2f5] border border-[#e0e0e0] rounded-lg focus:outline-none focus:border-[#00833e] focus:ring-1 focus:ring-[#00833e] text-[#333] placeholder-[#8f8f8f] transition-all duration-200 resize-none max-h-32 leading-5"
            />

            <div className="flex flex-col gap-1 flex-shrink-0">
              <button className="p-2.5 hover:bg-[#f0f2f5] rounded-lg transition-colors text-[#00833e]" title="İmoji ekle">
                <Smile size={20} />
              </button>

              <button
                onClick={() => handleSendMessage(inputValue)}
                disabled={!inputValue.trim()}
                className="p-2.5 bg-[#00833e] hover:bg-[#006b32] rounded-lg transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#8f8f8f]"
                title="Gönder"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
