'use client';

import { useState } from 'react';
import { Camera, MoreHorizontal, Globe, ThumbsUp, MessageCircle, Share2, ChevronRight, Download, Building2, X, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { PostFormModal } from '@/components/feed/post-form-modal';
import StoriesBar from '@/components/feed/stories-bar';

// Feed filter tabs - Nextdoor style pill buttons
const feedTabs = [
  { id: 'foryou', label: 'Senin İçin' },
  { id: 'recent', label: 'Son Paylaşılanlar' },
  { id: 'nearby', label: 'Yakın Mahalleler' },
  { id: 'trending', label: 'Gündem' },
];

// Onboarding steps
const onboardingCards = [
  {
    icon: Building2,
    title: 'İşletme sahibi? Sayfanı oluştur',
    cta: 'Başla',
    ctaColor: 'bg-[#00833e] text-white hover:bg-[#006b32]',
    href: '/isletme-ekle',
  },
  {
    icon: Download,
    title: 'Mobil uygulamayı indir',
    cta: 'Uygulamayı İndir',
    ctaColor: 'bg-[#333] text-white hover:bg-[#1a1a1a]',
    href: '/yardim',
  },
];

// Mock posts with feed category for tab filtering
const mockPosts = [
  {
    id: '1',
    author: { name: 'Ayşe K.', initial: 'A', neighborhood: 'Kadıköy, Moda', profileId: 'ayse-k' },
    timeAgo: '2 dk',
    isSponsored: false,
    title: '',
    body: 'Merhaba komşular, bu akşam saat 20:00\'de mahalle parkında piknik yapıyoruz. Katılmak isteyen herkesi bekliyoruz! Yanınıza battaniye ve atıştırmalık getirmeniz yeterli.',
    image: 'https://picsum.photos/800/400?random=58',
    reactions: 24,
    comments: 8,
    feed: 'foryou',
  },
  {
    id: '2',
    author: { name: 'Mehmet Y.', initial: 'M', neighborhood: 'Kadıköy, Caferağa', profileId: 'mehmet-y' },
    timeAgo: '1 sa',
    isSponsored: false,
    title: 'Kayıp Kedi - Turuncu Tekir',
    body: 'Pazartesi günü turuncu renkli kedim mahallede kayboldu. Adı Mişmiş, çok uysal. Görürseniz lütfen haber verin.',
    image: 'https://picsum.photos/800/400?random=59',
    reactions: 42,
    comments: 15,
    feed: 'recent',
  },
  {
    id: '3',
    author: { name: 'Fatma Ç.', initial: 'F', neighborhood: 'Kadıköy, Moda', profileId: 'fatma-c' },
    timeAgo: '3 sa',
    isSponsored: false,
    title: '',
    body: 'Yeni açılan Moda Kafe\'yi denediniz mi? Kahveleri harika ve fiyatlar gayet makul. Bir denemenizi tavsiye ederim! Özellikle çilekli cheesecake mutlaka denmeli.',
    reactions: 18,
    comments: 5,
    feed: 'foryou',
  },
  {
    id: 'sponsored',
    author: { name: 'Moda Ev Temizlik', initial: 'M', neighborhood: '', profileId: 'moda-ev-temizlik' },
    timeAgo: '',
    isSponsored: true,
    title: 'Profesyonel Ev Temizliği Hizmeti',
    body: 'Mahallenizdeki güvenilir temizlik hizmeti. İlk temizliğe %20 indirim! Hemen randevu alın.',
    image: 'https://picsum.photos/800/400?random=60',
    reactions: 5,
    comments: 2,
    feed: 'foryou',
  },
  {
    id: '4',
    author: { name: 'Emre D.', initial: 'E', neighborhood: 'Kadıköy, Moda', profileId: 'emre-d' },
    timeAgo: '5 sa',
    isSponsored: false,
    title: 'Mahallede Şüpheli Araç',
    body: 'Dün gece saat 23:00 civarında Moda Caddesi üzerinde uzun süre park halinde bekleyen koyu renkli bir araç dikkatimi çekti. Plakayı not edemedim ama dikkatli olalım komşular.',
    reactions: 67,
    comments: 23,
    feed: 'trending',
  },
  {
    id: '5',
    author: { name: 'Ali R.', initial: 'A', neighborhood: 'Üsküdar, Çengelköy', profileId: 'ali-r' },
    timeAgo: '6 sa',
    isSponsored: false,
    title: 'Çengelköy Sahilinde Yeni Yürüyüş Yolu',
    body: 'Belediye sahil boyunca harika bir yürüyüş yolu yaptı. Akşam saatlerinde çok güzel oluyor, herkese tavsiye ederim.',
    reactions: 31,
    comments: 9,
    feed: 'nearby',
  },
  {
    id: '6',
    author: { name: 'Selin T.', initial: 'S', neighborhood: 'Beşiktaş, Levent', profileId: 'selin-t' },
    timeAgo: '8 sa',
    isSponsored: false,
    title: '',
    body: 'Levent\'teki yeni organik pazarı denediniz mi? Her cumartesi kuruluyor, sebzeler çok taze ve uygun fiyatlı.',
    reactions: 55,
    comments: 18,
    feed: 'nearby',
  },
];

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState('foryou');
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showPostForm, setShowPostForm] = useState(false);
  const [postText, setPostText] = useState('');
  const [postSubmitted, setPostSubmitted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCommentPostId, setExpandedCommentPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [postsToShow, setPostsToShow] = useState(4);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState(mockPosts);

  const toggleLike = (postId: string) => {
    setLikedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleCameraClick = () => {
    alert('Fotoğraf yükleme özelliği yakında kullanılabilir olacak.');
  };

  const handleCommentSubmit = (postId: string) => {
    if (!commentText.trim()) return;
    alert(`Yorum gönderildi: "${commentText}"`);
    setCommentText('');
    setExpandedCommentPostId(null);
  };

  const filteredPosts = posts.filter((post) => {
    let tabMatch = true;
    if (activeTab !== 'foryou') {
      tabMatch = post.feed === activeTab;
    }

    if (!searchQuery.trim()) return tabMatch;

    const query = searchQuery.toLowerCase();
    const titleMatch = post.title.toLowerCase().includes(query);
    const bodyMatch = post.body.toLowerCase().includes(query);
    const authorMatch = post.author.name.toLowerCase().includes(query);

    return tabMatch && (titleMatch || bodyMatch || authorMatch);
  });

  const handlePostSubmit = () => {
    if (!postText.trim()) return;
    setPostText('');
    setShowPostForm(false);
    setPostSubmitted(true);
    setTimeout(() => setPostSubmitted(false), 3000);
  };

  const handleModalSubmit = (newPost: any) => {
    setPosts([newPost, ...posts]);
    setPostSubmitted(true);
    setTimeout(() => setPostSubmitted(false), 3000);
  };

  const displayedPosts = filteredPosts.slice(0, postsToShow);
  const hasMorePosts = filteredPosts.length > postsToShow;

  return (
    <>
      <PostFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
      <div className="max-w-[680px] mx-auto px-4 py-4">
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Gönderilerde ara..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPostsToShow(4); // Reset to initial view when searching
          }}
          className="w-full px-4 py-2.5 bg-[#f0f2f5] border border-[#e0e0e0] rounded-full text-[15px] text-[#333] placeholder-[#8f8f8f] focus:outline-none focus:border-[#00833e] focus:ring-1 focus:ring-[#00833e] transition-colors"
        />
      </div>

      {/* Stories Bar */}
      <StoriesBar />

      {/* Post submitted confirmation */}
      {postSubmitted && (
        <div className="bg-[#e6f4ec] border border-[#00833e] rounded-lg p-3 mb-3 text-sm text-[#00833e] font-medium text-center">
          Gönderiniz başarıyla paylaşıldı!
        </div>
      )}

      {/* Create Post Box - Opens Modal */}
      {!showPostForm ? (
        <div
          onClick={() => setIsModalOpen(true)}
          className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-4 mb-3 hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#404040] rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              C
            </div>
            <div className="flex-1 px-4 py-2.5 bg-[#f0f2f5] text-[#8f8f8f] rounded-full text-[15px]">
              Neler oluyor, komşu?
            </div>
            <button onClick={handleCameraClick} className="p-2 hover:bg-[#f0f2f5] rounded-full transition-colors">
              <Camera className="w-5 h-5 text-[#8f8f8f]" />
            </button>
            <div className="px-5 py-2 bg-[#00833e] text-white font-semibold text-sm rounded-full">
              Paylaş
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-4 mb-3">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 bg-[#404040] rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              C
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-[#333]">Coşkun Dönge</p>
              <p className="text-xs text-[#8f8f8f]">Kadıköy, Moda</p>
            </div>
          </div>
          <textarea
            autoFocus
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder="Neler oluyor, komşu?"
            className="w-full min-h-[120px] p-3 bg-[#f0f2f5] border border-[#e0e0e0] rounded-lg text-[15px] text-[#333] placeholder-[#8f8f8f] focus:outline-none focus:border-[#00833e] focus:ring-1 focus:ring-[#00833e] resize-none"
          />
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#e0e0e0]">
            <button onClick={handleCameraClick} className="p-2 hover:bg-[#f0f2f5] rounded-full transition-colors">
              <Camera className="w-5 h-5 text-[#8f8f8f]" />
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => { setShowPostForm(false); setPostText(''); }}
                className="px-4 py-2 text-sm font-medium text-[#8f8f8f] hover:bg-[#f0f2f5] rounded-full transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handlePostSubmit}
                disabled={!postText.trim()}
                className={cn(
                  'px-5 py-2 text-sm font-semibold rounded-full transition-colors',
                  postText.trim()
                    ? 'bg-[#00833e] text-white hover:bg-[#006b32]'
                    : 'bg-[#e0e0e0] text-[#8f8f8f] cursor-not-allowed'
                )}
              >
                Paylaş
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feed Tabs - Nextdoor style pill buttons */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {feedTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border transition-colors',
              activeTab === tab.id
                ? 'border-[#333] text-[#333] bg-white'
                : 'border-[#e0e0e0] text-[#8f8f8f] bg-white hover:border-[#c4c4c4] hover:text-[#404040]'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Onboarding Section */}
      {showOnboarding && (
        <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-4 mb-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-[#333]">KomşuApp&apos;a Başla</h2>
            <button
              onClick={() => setShowOnboarding(false)}
              className="p-1 hover:bg-[#f0f2f5] rounded-full"
            >
              <MoreHorizontal className="w-5 h-5 text-[#8f8f8f]" />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto">
            {onboardingCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <Link key={i} href={card.href} className="min-w-[200px] border border-[#e0e0e0] rounded-lg p-4 flex flex-col items-start gap-3 hover:border-[#00833e] hover:shadow-md transition-all">
                  <div className="w-10 h-10 bg-[#f0f2f5] rounded-full flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#404040]" />
                  </div>
                  <p className="text-sm font-medium text-[#333]">{card.title}</p>
                  <span
                    className={cn('px-4 py-2 rounded-full text-sm font-semibold transition-colors', card.ctaColor)}
                  >
                    {card.cta}
                  </span>
                </Link>
              );
            })}
          </div>
          <div className="mt-3 pt-3 border-t border-[#e0e0e0]">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#00833e] font-medium">3 / 7 adım tamamlandı</span>
            </div>
            <div className="w-full h-1.5 bg-[#e0e0e0] rounded-full mt-2">
              <div className="h-full bg-[#00833e] rounded-full" style={{ width: '43%' }} />
            </div>
          </div>
        </div>
      )}

      {/* Posts Feed */}
      <div className="space-y-3">
        {filteredPosts.length === 0 && (
          <div className="bg-white rounded-lg border border-[#e0e0e0] p-12 text-center">
            <p className="text-[#333] font-medium">{searchQuery.trim() ? 'Arama sonucu bulunamadı' : 'Bu kategoride gönderi yok'}</p>
            <p className="text-[#8f8f8f] text-sm mt-1">{searchQuery.trim() ? 'Farklı bir arama terimi deneyin' : 'Başka bir sekme deneyin'}</p>
          </div>
        )}
        {displayedPosts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-sm border border-[#e0e0e0]">
            {/* Post Header */}
            <div className="p-4 pb-0">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Link href={`/profil/${post.author.profileId}`} className="w-10 h-10 bg-[#e0e0e0] rounded-full flex items-center justify-center text-[#404040] text-sm font-bold flex-shrink-0 hover:ring-2 hover:ring-[#00833e] transition-all">
                    {post.author.initial}
                  </Link>
                  <div>
                    <Link href={`/profil/${post.author.profileId}`} className="text-[15px] font-bold text-[#333] hover:underline">
                      {post.author.name}
                    </Link>
                    {post.isSponsored ? (
                      <p className="text-xs text-[#8f8f8f]">Sponsorlu</p>
                    ) : (
                      <p className="text-xs text-[#8f8f8f]">
                        {post.author.neighborhood} · {post.timeAgo} · <Globe className="w-3 h-3 inline" />
                      </p>
                    )}
                  </div>
                </div>
                <button className="p-1 hover:bg-[#f0f2f5] rounded-full">
                  <MoreHorizontal className="w-5 h-5 text-[#8f8f8f]" />
                </button>
              </div>
            </div>

            {/* Post Content - Clickable */}
            <Link href={`/profil/${post.author.profileId}`} className="block px-4 py-2 hover:bg-[#fafafa] transition-colors">
              {post.title && (
                <h3 className="text-[15px] font-bold text-[#333] mb-1">{post.title}</h3>
              )}
              <p className="text-[15px] text-[#404040] leading-relaxed">{post.body}</p>
            </Link>

            {/* Post Image */}
            {post.image && (
              <div className="mt-1 relative w-full max-h-[400px] overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title || 'Gönderi görseli'}
                  width={800}
                  height={400}
                  unoptimized
                  className="w-full object-cover"
                />
              </div>
            )}

            {/* Learn more for sponsored */}
            {post.isSponsored && (
              <Link href="/isletmeler" className="block px-4 py-3 border-t border-[#e0e0e0] flex items-center justify-between hover:bg-[#f0f2f5] transition-colors">
                <span className="text-sm font-medium text-[#404040]">Daha fazla bilgi</span>
                <ChevronRight className="w-4 h-4 text-[#8f8f8f]" />
              </Link>
            )}

            {/* Reactions summary */}
            {!post.isSponsored && (
              <>
                <div className="px-4 py-2 flex items-center justify-between text-xs text-[#8f8f8f]">
                  <div className="flex items-center gap-1">
                    <span className="flex -space-x-1">
                      <span className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-[10px]">👍</span>
                      <span className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px]">❤️</span>
                    </span>
                    <span className="ml-1 text-[13px]">{post.reactions + (likedPosts[post.id] ? 1 : 0)}</span>
                  </div>
                  <span className="text-[13px]">{post.comments} yorum</span>
                </div>

                {/* Action buttons */}
                <div className="px-4 py-1 border-t border-[#e0e0e0]">
                  <div className="flex items-center">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className={cn(
                        'flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-colors',
                        likedPosts[post.id]
                          ? 'text-[#00833e] bg-[#e6f4ec]'
                          : 'text-[#404040] hover:bg-[#f0f2f5]'
                      )}
                    >
                      <ThumbsUp className={cn('w-5 h-5', likedPosts[post.id] && 'fill-current')} />
                      {likedPosts[post.id] ? 'Beğendin' : 'Beğen'}
                    </button>
                    <button
                      onClick={() => setExpandedCommentPostId(expandedCommentPostId === post.id ? null : post.id)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-[#404040] hover:bg-[#f0f2f5] rounded-lg transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Yorum
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-[#404040] hover:bg-[#f0f2f5] rounded-lg transition-colors">
                      <Share2 className="w-5 h-5" />
                      Paylaş
                    </button>
                  </div>
                </div>

                {/* Expandable Comment Section */}
                {expandedCommentPostId === post.id && (
                  <div className="px-4 py-3 border-t border-[#e0e0e0] bg-[#f0f2f5]">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-[#404040] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        C
                      </div>
                      <div className="flex-1">
                        <textarea
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Bir yorum yaz..."
                          className="w-full p-2 bg-white border border-[#e0e0e0] rounded-lg text-[14px] text-[#333] placeholder-[#8f8f8f] focus:outline-none focus:border-[#00833e] focus:ring-1 focus:ring-[#00833e] resize-none"
                          rows={2}
                        />
                        <div className="flex gap-2 mt-2 justify-end">
                          <button
                            onClick={() => {
                              setExpandedCommentPostId(null);
                              setCommentText('');
                            }}
                            className="px-3 py-1.5 text-sm font-medium text-[#8f8f8f] hover:bg-white rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleCommentSubmit(post.id)}
                            disabled={!commentText.trim()}
                            className={cn(
                              'px-4 py-1.5 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2',
                              commentText.trim()
                                ? 'bg-[#00833e] text-white hover:bg-[#006b32]'
                                : 'bg-[#e0e0e0] text-[#8f8f8f] cursor-not-allowed'
                            )}
                          >
                            <Send className="w-4 h-4" />
                            Gönder
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMorePosts && (
        <div className="text-center py-8">
          <button
            onClick={() => setPostsToShow(postsToShow + 2)}
            className="px-6 py-2.5 bg-[#00833e] text-white font-semibold rounded-full hover:bg-[#006b32] transition-colors"
          >
            Daha Fazla Gönderi Yükle
          </button>
        </div>
      )}
    </div>
    </>
  );
}
