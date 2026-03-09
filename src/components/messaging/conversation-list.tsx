import React from 'react';
import { Search, Plus } from 'lucide-react';

export interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  online?: boolean;
}

interface ConversationListProps {
  conversations: Conversation[];
  selectedId?: string;
  onSelect: (id: string) => void;
  onNewConversation?: () => void;
}

export function ConversationList({
  conversations,
  selectedId,
  onSelect,
  onNewConversation,
}: ConversationListProps) {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-white border-r border-emerald-100">
      {/* Header */}
      <div className="p-4 border-b border-emerald-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-emerald-900">Mesajlar</h2>
          {onNewConversation && (
            <button
              onClick={onNewConversation}
              className="p-2 hover:bg-emerald-50 rounded-lg transition-colors"
              title="Yeni sohbet"
            >
              <Plus size={20} className="text-emerald-600" />
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400"
          />
          <input
            type="text"
            placeholder="Ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex items-center justify-center h-full text-emerald-600">
            <p>Sohbet bulunamadı</p>
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => onSelect(conversation.id)}
              className={`w-full p-4 border-b border-emerald-50 transition-colors text-left ${
                selectedId === conversation.id
                  ? 'bg-emerald-50'
                  : 'hover:bg-emerald-25'
              }`}
            >
              <div className="flex gap-3">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <img
                    src={conversation.avatar}
                    alt={conversation.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {conversation.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-semibold text-emerald-900 truncate">
                      {conversation.name}
                    </h3>
                    <span className="text-xs text-emerald-600 flex-shrink-0">
                      {conversation.timestamp}
                    </span>
                  </div>

                  <div className="flex justify-between items-center gap-2 mt-1">
                    <p className="text-sm text-emerald-700 truncate">
                      {conversation.lastMessage}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <span className="flex-shrink-0 bg-emerald-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
