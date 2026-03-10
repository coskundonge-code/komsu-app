'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { getFeedImageUrl, getAvatarUrl } from '@/lib/demo-images';
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  ThumbsUp,
  Share2,
  MessageCircle,
  Flag,
  MapPin,
  Clock,
  User,
  MoreVertical,
  X,
  Send,
  Reply,
} from 'lucide-react';

// Post type badge colors
const POST_TYPE_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  genel: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Genel' },
  guvenlik: { bg: 'bg-red-100', text: 'text-red-800', label: 'Güvenlik' },
  oneri: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Öneri' },
  kayipbuluntu: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    label: 'Kayıp/Buluntu',
  },
  satiliki: { bg: 'bg-green-100', text: 'text-green-800', label: 'Satılık' },
  etkinlik: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Etkinlik' },
  anket: { bg: 'bg-pink-100', text: 'text-pink-800', label: 'Anket' },
};

interface MockPost {
  id: string;
  type: keyof typeof POST_TYPE_STYLES;
  title: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    neighborhood: string;
  };
  createdAt: string;
  body: string;
  images: string[];
  reactions: {
    beğen: number;
    teşekkür: number;
    katılıyorum: number;
  };
  commentsCount: number;
}

interface MockComment {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    neighborhood: string;
  };
  createdAt: string;
  text: string;
  likes: number;
  replies: MockComment[];
}

// Mock post database
const mockPostsDB: Record<string, MockPost> = {
  '1': {
    id: '1',
    type: 'guvenlik',
    title: 'Mahallede Hırsızlık Uyarısı',
    author: {
      id: 'user1',
      name: 'Seda Kaya',
      avatar: getFeedImageUrl(100, 200, 200),
      neighborhood: 'Şişli',
    },
    createdAt: '2 saat önce',
    body: `Komşularım, geçen gece Halaskargazi Caddesi çevresinde araç hırsızlıklarının yoğunlaştığını gözlemledim. Lütfen dikkatli olun ve tüm araçlarınızı kilitli tutuğunuzdan emin olun. Mahallenin bazı noktalarında güvenlik kamerası bulunmadığı için, özellikle geceleri dikkatli olmamız gerekiyor.

Eğer siz de şüpheli bir aktivite gözlemlediyseniz, lütfen paylaşın. Birlikte mahallelerimizi daha güvenli hale getirebiliriz.`,
    images: [
      getFeedImageUrl(101, 800, 600),
      getFeedImageUrl(102, 800, 600),
    ],
    reactions: {
      beğen: 234,
      teşekkür: 156,
      katılıyorum: 89,
    },
    commentsCount: 12,
  },
  '2': {
    id: '2',
    type: 'etkinlik',
    title: 'Mahalle Temizlik Etkinliği - 15 Mart',
    author: {
      id: 'user2',
      name: 'Ahmet Yıldız',
      avatar: getFeedImageUrl(103, 200, 200),
      neighborhood: 'Şişli',
    },
    createdAt: '5 saat önce',
    body: `Sevgili Komşularım,

Bu hafta sonu 15 Mart Cumartesi günü saat 10:00'da mahallemizdeki Sosyal Sit Parkı'nda bir temizlik etkinliği düzenleyeceğiz. Herkes katılmaya davetlidir!

Neler Getirmeli:
- Eldiven
- Çöp torbası
- Su
- Hafif aperitif

Hedefimiz: Parkımızı daha temiz ve yaşanılır bir hale getirmek
Bağlantı: 0553-XXX-XXXX

Katılacaksanız lütfen bu gönderi altında yorum yazın!`,
    images: [
      getFeedImageUrl(104, 800, 600),
      getFeedImageUrl(105, 800, 600),
      getFeedImageUrl(106, 800, 600),
    ],
    reactions: {
      beğen: 156,
      teşekkür: 234,
      katılıyorum: 345,
    },
    commentsCount: 18,
  },
};

// Mock comments
const mockComments: Record<string, MockComment[]> = {
  '1': [
    {
      id: 'c1',
      author: {
        id: 'user3',
        name: 'Müge Özdemir',
        avatar: getFeedImageUrl(107, 200, 200),
        neighborhood: 'Şişli',
      },
      createdAt: '1 saat önce',
      text: 'Ben de geçen hafta bir şüpheli aktivite gördüm. Polise haber verdim. Hepimiz dikkatli olmalıyız.',
      likes: 23,
      replies: [
        {
          id: 'r1',
          author: {
            id: 'user1',
            name: 'Seda Kaya',
            avatar: getFeedImageUrl(100, 200, 200),
            neighborhood: 'Şişli',
          },
          createdAt: '45 dakika önce',
          text: 'Teşekkürler Müge. Evet, birlikte dikkatli olmamız gerekiyor. Mahalle İnisiyatifi olarak bir toplantı düzenleyebiliriz.',
          likes: 12,
          replies: [],
        },
      ],
    },
    {
      id: 'c2',
      author: {
        id: 'user4',
        name: 'İbrahim Demir',
        avatar: getFeedImageUrl(108, 200, 200),
        neighborhood: 'Şişli',
      },
      createdAt: '1.5 saat önce',
      text: "Bu maalesef yeni bir trend. Komşumun aynı durum başına geldi. Mahalle STK'larına bilgi vermek gerekir.",
      likes: 18,
      replies: [],
    },
    {
      id: 'c3',
      author: {
        id: 'user5',
        name: 'Fatma Yildiz',
        avatar: getFeedImageUrl(109, 200, 200),
        neighborhood: 'Şişli',
      },
      createdAt: '2 saat önce',
      text: 'Teşekkürler bilgilendirme için. Araçlarımı güvenli bir garajda parklamaya başladım. Güvenlik kamerası kurma konusunda koordine edilebiliriz mi?',
      likes: 34,
      replies: [
        {
          id: 'r2',
          author: {
            id: 'user6',
            name: 'Murat Gül',
            avatar: getFeedImageUrl(110, 200, 200),
            neighborhood: 'Şişli',
          },
          createdAt: '1.5 saat önce',
          text: 'Harika fikir Fatma! Ben kamera konusunda uzmanım, yardımcı olmaktan memnun olurum. Mesaj yaz bana.',
          likes: 9,
          replies: [],
        },
        {
          id: 'r3',
          author: {
            id: 'user5',
            name: 'Fatma Yildiz',
            avatar: getFeedImageUrl(109, 200, 200),
            neighborhood: 'Şişli',
          },
          createdAt: '1 saat önce',
          text: 'Çok teşekkürler Murat, sana yazacağım!',
          likes: 4,
          replies: [],
        },
      ],
    },
    {
      id: 'c4',
      author: {
        id: 'user7',
        name: 'Zeynep Aydın',
        avatar: getFeedImageUrl(111, 200, 200),
        neighborhood: 'Şişli',
      },
      createdAt: '2.5 saat önce',
      text: 'Mahalle WhatsApp grubu var mı? Böyle önemli haberleri anında paylaşabilmek için bir grup kurmalıyız.',
      likes: 45,
      replies: [],
    },
  ],
  '2': [
    {
      id: 'c5',
      author: {
        id: 'user8',
        name: 'Gül Kaya',
        avatar: getFeedImageUrl(112, 200, 200),
        neighborhood: 'Şişli',
      },
      createdAt: '3 saat önce',
      text: 'Harika bir inisiyatif Ahmet! Kesinlikle katılacağım. Arkadaşlarımı da davet edebilir miyim?',
      likes: 32,
      replies: [
        {
          id: 'r4',
          author: {
            id: 'user2',
            name: 'Ahmet Yıldız',
            avatar: getFeedImageUrl(103, 200, 200),
            neighborhood: 'Şişli',
          },
          createdAt: '2.5 saat önce',
          text: 'Tabii ki Gül! Ne kadar çok kişi o kadar iyi. Herkesi davet et!',
          likes: 18,
          replies: [],
        },
      ],
    },
    {
      id: 'c6',
      author: {
        id: 'user9',
        name: 'Can Yüksek',
        avatar: getFeedImageUrl(113, 200, 200),
        neighborhood: 'Şişli',
      },
      createdAt: '4 saat önce',
      text: 'Ben ve ailem katılacağız! Çocuklarımız da gelecek, onlar için eğlenceli bir aktivite olur.',
      likes: 28,
      replies: [],
    },
    {
      id: 'c7',
      author: {
        id: 'user10',
        name: 'Aslı Türk',
        avatar: getFeedImageUrl(114, 200, 200),
        neighborhood: 'Şişli',
      },
      createdAt: '4.5 saat önce',
      text: 'Şahane! Sosyal Sit Parkı çok güzel ama son zamanlarda çok kirli hale geldi. Bu çok gerekli bir etkinlik.',
      likes: 41,
      replies: [],
    },
  ],
};

export default function PostDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const mockPost = mockPostsDB[params.id] || mockPostsDB['1'];
  const comments = mockComments[params.id] || [];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [reactions, setReactions] = useState(mockPost.reactions);
  const [userReaction, setUserReaction] = useState<keyof typeof reactions | null>(null);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());

  const postTypeStyle = POST_TYPE_STYLES[mockPost.type];

  const handleImageNav = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentImageIndex(
        (prev) => (prev - 1 + mockPost.images.length) % mockPost.images.length
      );
    } else {
      setCurrentImageIndex(
        (prev) => (prev + 1) % mockPost.images.length
      );
    }
  };

  const handleReaction = (type: keyof typeof reactions) => {
    if (userReaction === type) {
      setReactions({
        ...reactions,
        [type]: reactions[type] - 1,
      });
      setUserReaction(null);
    } else {
      if (userReaction) {
        setReactions({
          ...reactions,
          [userReaction]: reactions[userReaction] - 1,
          [type]: reactions[type] + 1,
        });
      } else {
        setReactions({
          ...reactions,
          [type]: reactions[type] + 1,
        });
      }
      setUserReaction(type);
    }
  };

  const toggleReplies = (commentId: string) => {
    const newExpanded = new Set(expandedReplies);
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId);
    } else {
      newExpanded.add(commentId);
    }
    setExpandedReplies(newExpanded);
  };

  const handleCommentSubmit = () => {
    if (commentText.trim()) {
      setCommentText('');
      setShowCommentBox(false);
    }
  };

  const handleReplySubmit = () => {
    if (replyText.trim()) {
      setReplyText('');
      setReplyingTo(null);
    }
  };

  // Related posts sidebar
  const relatedPosts = [
    {
      id: '3',
      type: 'guvenlik' as const,
      title: 'Caddede Kuyu Açılmış, Dikkat!',
      author: 'Levent Kara',
      image: getFeedImageUrl(115, 300, 300),
      timeAgo: '6 saat önce',
    },
    {
      id: '4',
      type: 'satiliki' as const,
      title: 'Masif Ahşap Masa - 1500₺',
      author: 'Hasan Demir',
      image: getFeedImageUrl(116, 300, 300),
      timeAgo: '8 saat önce',
    },
    {
      id: '5',
      type: 'oneri' as const,
      title: 'Mahallede Kütüphane Açılması Önerisi',
      author: 'Nilüfer Aksoy',
      image: getFeedImageUrl(117, 300, 300),
      timeAgo: '1 gün önce',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Header with Back Button */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#e0e0e0] shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/kesfet"
            className="flex items-center gap-2 text-[#00833e] hover:text-[#006b32] font-semibold transition-colors"
          >
            <ChevronLeft size={20} />
            <span className="hidden sm:inline">Geri Dön</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {}}
              className="p-2 rounded-full hover:bg-[#f0f2f5] transition-colors"
              title="Paylaş"
            >
              <Share2 size={24} className="text-[#404040]" />
            </button>
            <button
              className="p-2 rounded-full hover:bg-[#f0f2f5] transition-colors"
              title="Bildir"
            >
              <Flag size={24} className="text-[#404040]" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Post Card */}
          <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] overflow-hidden">
            {/* Post Header */}
            <div className="p-4 sm:p-6 border-b border-[#e0e0e0]">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <Image
                    src={mockPost.author.avatar}
                    alt={mockPost.author.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    unoptimized
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#333]">
                      {mockPost.author.name}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-[#8f8f8f] mb-2 flex-wrap">
                      <MapPin size={14} />
                      <span>{mockPost.author.neighborhood}</span>
                      <span>•</span>
                      <Clock size={14} className="inline" />
                      <span>{mockPost.createdAt}</span>
                    </div>
                    <span
                      className={cn(
                        'inline-block px-2.5 py-1 rounded-full text-xs font-semibold',
                        postTypeStyle.bg,
                        postTypeStyle.text
                      )}
                    >
                      {postTypeStyle.label}
                    </span>
                  </div>
                </div>
                <button className="p-2 rounded-full hover:bg-[#f0f2f5] transition-colors flex-shrink-0">
                  <MoreVertical size={20} className="text-[#8f8f8f]" />
                </button>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-[#333] mb-4">
                {mockPost.title}
              </h1>
            </div>

            {/* Post Body */}
            <div className="p-4 sm:p-6 border-b border-[#e0e0e0]">
              <p className="text-[#333] leading-relaxed whitespace-pre-wrap mb-4">
                {mockPost.body}
              </p>
            </div>

            {/* Images */}
            {mockPost.images.length > 0 && (
              <div className="border-b border-[#e0e0e0] overflow-hidden">
                {/* Main Image */}
                <div className="relative aspect-video bg-[#f0f2f5] overflow-hidden group">
                  <Image
                    src={mockPost.images[currentImageIndex]}
                    alt={`Post image ${currentImageIndex + 1}`}
                    fill
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />

                  {mockPost.images.length > 1 && (
                    <>
                      <button
                        onClick={() => handleImageNav('prev')}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110"
                        title="Önceki resim"
                      >
                        <ChevronLeft size={24} className="text-[#333]" />
                      </button>
                      <button
                        onClick={() => handleImageNav('next')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110"
                        title="Sonraki resim"
                      >
                        <ChevronRight size={24} className="text-[#333]" />
                      </button>

                      <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-2 rounded-lg text-sm font-medium">
                        {currentImageIndex + 1} / {mockPost.images.length}
                      </div>
                    </>
                  )}
                </div>

                {/* Thumbnail Gallery */}
                {mockPost.images.length > 1 && (
                  <div className="flex gap-2 p-4 overflow-x-auto bg-[#f0f2f5] border-t border-[#e0e0e0]">
                    {mockPost.images.map((image, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={cn(
                          'w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all hover:border-[#00833e]',
                          currentImageIndex === idx
                            ? 'border-[#00833e] ring-2 ring-[#00833e] ring-offset-1'
                            : 'border-[#e0e0e0]'
                        )}
                      >
                        <Image
                          src={image}
                          alt={`Thumbnail ${idx + 1}`}
                          fill
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Reactions Bar */}
            <div className="p-4 sm:p-6 border-b border-[#e0e0e0] bg-[#f9f9f9]">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleReaction('beğen')}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all',
                    userReaction === 'beğen'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-[#f0f2f5] text-[#404040] hover:bg-[#e0e0e0]'
                  )}
                >
                  <Heart
                    size={18}
                    className={cn(
                      userReaction === 'beğen' && 'fill-blue-700'
                    )}
                  />
                  <span>Beğen {reactions.beğen > 0 && `(${reactions.beğen})`}</span>
                </button>

                <button
                  onClick={() => handleReaction('teşekkür')}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all',
                    userReaction === 'teşekkür'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-[#f0f2f5] text-[#404040] hover:bg-[#e0e0e0]'
                  )}
                >
                  <ThumbsUp
                    size={18}
                    className={cn(
                      userReaction === 'teşekkür' && 'fill-green-700'
                    )}
                  />
                  <span>Teşekkürler {reactions.teşekkür > 0 && `(${reactions.teşekkür})`}</span>
                </button>

                <button
                  onClick={() => handleReaction('katılıyorum')}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all',
                    userReaction === 'katılıyorum'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-[#f0f2f5] text-[#404040] hover:bg-[#e0e0e0]'
                  )}
                >
                  <User
                    size={18}
                    className={cn(
                      userReaction === 'katılıyorum' && 'fill-orange-700'
                    )}
                  />
                  <span>Katılıyorum {reactions.katılıyorum > 0 && `(${reactions.katılıyorum})`}</span>
                </button>
              </div>
            </div>

            {/* Comments Section */}
            <div className="p-4 sm:p-6">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-[#333] mb-4">
                  Yorumlar ({comments.length})
                </h2>

                {/* Comment Input Box */}
                <div className="mb-6 pb-6 border-b border-[#e0e0e0]">
                  <button
                    onClick={() => setShowCommentBox(!showCommentBox)}
                    className="w-full p-4 bg-[#f0f2f5] rounded-lg text-[#8f8f8f] text-left hover:bg-[#e0e0e0] transition-colors font-medium"
                  >
                    <MessageCircle className="inline mr-2" size={18} />
                    Bir yorum yazın...
                  </button>

                  {showCommentBox && (
                    <div className="mt-4 space-y-3">
                      <div className="flex gap-3">
                        <Image
                          src={getFeedImageUrl(200, 200, 200)}
                          alt="Your avatar"
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                          unoptimized
                        />
                        <textarea
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Düşüncelerinizi paylaşın..."
                          rows={4}
                          className="flex-1 px-4 py-3 border border-[#e0e0e0] rounded-lg text-sm text-[#333] placeholder-[#8f8f8f] focus:outline-none focus:ring-2 focus:ring-[#00833e] focus:ring-opacity-30 resize-none"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setShowCommentBox(false);
                            setCommentText('');
                          }}
                          className="px-4 py-2 rounded-lg text-[#404040] hover:bg-[#f0f2f5] transition-colors font-medium"
                        >
                          İptal
                        </button>
                        <button
                          onClick={handleCommentSubmit}
                          disabled={!commentText.trim()}
                          className="px-4 py-2 bg-[#00833e] text-white rounded-lg hover:bg-[#006b32] disabled:bg-[#e0e0e0] disabled:text-[#8f8f8f] transition-colors font-medium flex items-center gap-2"
                        >
                          <Send size={16} />
                          Gönder
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Comments List */}
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <div key={comment.id} className="space-y-4">
                      {/* Main Comment */}
                      <div className="flex gap-3">
                        <Image
                          src={comment.author.avatar}
                          alt={comment.author.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                          unoptimized
                        />
                        <div className="flex-1 min-w-0">
                          <div className="bg-[#f0f2f5] rounded-lg p-3 mb-2">
                            <p className="font-semibold text-[#333] text-sm">
                              {comment.author.name}
                            </p>
                            <p className="text-xs text-[#8f8f8f] mb-2">
                              {comment.author.neighborhood} • {comment.createdAt}
                            </p>
                            <p className="text-[#333] text-sm leading-relaxed">
                              {comment.text}
                            </p>
                          </div>
                          <div className="flex items-center gap-4 px-2">
                            <button className="text-xs text-[#8f8f8f] hover:text-[#00833e] transition-colors font-medium">
                              ♥ {comment.likes > 0 && comment.likes}
                            </button>
                            <button
                              onClick={() =>
                                setReplyingTo(
                                  replyingTo === comment.id ? null : comment.id
                                )
                              }
                              className="text-xs text-[#8f8f8f] hover:text-[#00833e] transition-colors font-medium flex items-center gap-1"
                            >
                              <Reply size={14} />
                              Yanıt
                            </button>
                            {comment.replies.length > 0 && (
                              <button
                                onClick={() => toggleReplies(comment.id)}
                                className="text-xs text-[#00833e] hover:text-[#006b32] transition-colors font-medium"
                              >
                                {expandedReplies.has(comment.id)
                                  ? `Yanıtları Gizle (${comment.replies.length})`
                                  : `Yanıtları Gör (${comment.replies.length})`}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Reply Input */}
                      {replyingTo === comment.id && (
                        <div className="ml-10 flex gap-3 mt-3">
                          <Image
                            src={getFeedImageUrl(200, 200, 200)}
                            alt="Your avatar"
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                            unoptimized
                          />
                          <div className="flex-1 flex gap-2">
                            <input
                              type="text"
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder={`${comment.author.name}'e yanıt ver...`}
                              className="flex-1 px-3 py-2 border border-[#e0e0e0] rounded-lg text-sm text-[#333] placeholder-[#8f8f8f] focus:outline-none focus:ring-2 focus:ring-[#00833e] focus:ring-opacity-30"
                            />
                            <button
                              onClick={handleReplySubmit}
                              disabled={!replyText.trim()}
                              className="px-3 py-2 bg-[#00833e] text-white rounded-lg hover:bg-[#006b32] disabled:bg-[#e0e0e0] transition-colors"
                            >
                              <Send size={16} />
                            </button>
                            <button
                              onClick={() => {
                                setReplyingTo(null);
                                setReplyText('');
                              }}
                              className="px-3 py-2 bg-[#f0f2f5] text-[#404040] rounded-lg hover:bg-[#e0e0e0] transition-colors"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Nested Replies */}
                      {comment.replies.length > 0 &&
                        expandedReplies.has(comment.id) && (
                          <div className="ml-10 space-y-4 pt-4 border-l-2 border-[#e0e0e0] pl-4">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex gap-3">
                                <Image
                                  src={reply.author.avatar}
                                  alt={reply.author.name}
                                  width={32}
                                  height={32}
                                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                  unoptimized
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="bg-[#f0f2f5] rounded-lg p-2.5">
                                    <p className="font-semibold text-[#333] text-xs">
                                      {reply.author.name}
                                    </p>
                                    <p className="text-xs text-[#8f8f8f] mb-1">
                                      {reply.author.neighborhood} • {reply.createdAt}
                                    </p>
                                    <p className="text-[#333] text-sm leading-relaxed">
                                      {reply.text}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-4 px-2 mt-1">
                                    <button className="text-xs text-[#8f8f8f] hover:text-[#00833e] transition-colors font-medium">
                                      ♥ {reply.likes > 0 && reply.likes}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Related Posts */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-4 sm:p-6">
              <h3 className="text-lg font-bold text-[#333] mb-4">
                İlgili Gönderiler
              </h3>
              <div className="space-y-4">
                {relatedPosts.map((post) => {
                  const typeStyle = POST_TYPE_STYLES[post.type];
                  return (
                    <Link
                      key={post.id}
                      href={`/gonderi/${post.id}`}
                      className="group block p-3 rounded-lg hover:bg-[#f0f2f5] transition-colors"
                    >
                      <div className="flex gap-3">
                        <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-[#f0f2f5]">
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            unoptimized
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap gap-1 mb-1">
                            <span
                              className={cn(
                                'inline-block px-2 py-0.5 rounded-full text-xs font-semibold',
                                typeStyle.bg,
                                typeStyle.text
                              )}
                            >
                              {typeStyle.label}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-[#333] line-clamp-2 mb-1">
                            {post.title}
                          </p>
                          <p className="text-xs text-[#8f8f8f]">
                            {post.author} • {post.timeAgo}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Neighborhood Info Card */}
            <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-4 sm:p-6">
              <h3 className="text-lg font-bold text-[#333] mb-3">Şişli Mahallesi</h3>
              <div className="space-y-2 text-sm text-[#404040]">
                <p className="flex items-center gap-2">
                  <MapPin size={16} className="text-[#00833e] flex-shrink-0" />
                  İstanbul, Türkiye
                </p>
                <p>
                  <span className="font-semibold text-[#333]">2,847</span>{' '}
                  Komşu
                </p>
                <p>
                  <span className="font-semibold text-[#333]">156</span> Bu hafta
                  aktif gönderi
                </p>
              </div>
              <button className="w-full mt-4 px-4 py-2 bg-[#00833e] text-white rounded-lg font-semibold hover:bg-[#006b32] transition-colors">
                Mahalle Hakkında
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Spacer */}
      <div className="h-8" />
    </div>
  );
}
