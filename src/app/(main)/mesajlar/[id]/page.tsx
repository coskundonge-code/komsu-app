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
const mockConversations: Conversation[] = [];  // mock removed — TODO: Supabase query

const mockMessages: Record<string, Message[]> = {};  // mock removed — TODO: Supabase query

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
