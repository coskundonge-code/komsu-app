'use client';

import { useState } from 'react';
import { Camera, MoreHorizontal, Globe, ThumbsUp, MessageCircle, Share2, ChevronRight, Download, Building2, X, Send, MapPin, AlertTriangle, Heart, Pin } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { PostFormModal } from '@/components/feed/post-form-modal';
import StoriesBar from '@/components/feed/stories-bar';
import { getFeedImageUrl } from '@/lib/demo-images';
import { AddressVerificationBanner } from '@/components/feed/address-verification-banner';

// Category definitions
const POST_CATEGORIES = [
  { id: 'tumu', label: 'Tümü', color: 'bg-gray-100', textColor: 'text-gray-700', badgeColor: 'bg-gray-100 text-gray-700' },
  { id: 'genel', label: 'Genel', color: 'bg-blue-100', textColor: 'text-blue-700', badgeColor: 'bg-blue-100 text-blue-700' },
  { id: 'guvenlik', label: 'Güvenlik', color: 'bg-red-100', textColor: 'text-red-700', badgeColor: 'bg-red-100 text-red-700' },
  { id: 'satilik', label: 'Satılık', color: 'bg-amber-100', textColor: 'text-amber-700', badgeColor: 'bg-amber-100 text-amber-700' },
  { id: 'etkinlikler', label: 'Etkinlikler', color: 'bg-purple-100', textColor: 'text-purple-700', badgeColor: 'bg-purple-100 text-purple-700' },
  { id: 'oneriler', label: 'Öneriler', color: 'bg-green-100', textColor: 'text-green-700', badgeColor: 'bg-green-100 text-green-700' },
  { id: 'sorular', label: 'Sorular', color: 'bg-cyan-100', textColor: 'text-cyan-700', badgeColor: 'bg-cyan-100 text-cyan-700' },
  { id: 'kayipbuluntu', label: 'Kayıp/Buluntu', color: 'bg-orange-100', textColor: 'text-orange-700', badgeColor: 'bg-orange-100 text-orange-700' },
];

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
    title: "İşletme sahibi? Sayfanı oluştur",
    cta: 'Başla',
    ctaColor: 'bg-[#00833e] text-white hover:bg-[#006b32]',
    href: '/isletme-ekle',
    isDownload: false,
  },
  {
    icon: Download,
    title: 'Mobil uygulamayı indir',
    cta: 'Uygulamayı İndir',
    ctaColor: 'bg-[#333] text-white hover:bg-[#1a1a1a]',
    href: '#',
    isDownload: true,
  },
];

// Mock posts with enhanced structure
const mockPosts = [
  {
    id: 'pinned-1',
    author: { name: 'İbrahim M. (Muhtar)', initial: 'İ', neighborhood: 'Kadıköy, Moda', profileId: 'ibrahim-muhtar' },
    timeAgo: '3 sa',
    isSponsored: false,
    isPinned: true,
    category: 'guvenlik',
    title: "Mahallede Şüpheli Faaliyet - Dikkat",
    body: "Değerli mahalleli komşularımız, son iki haftada mahalle çeperinde bazı şüpheli hareketliler yaşanmıştır. Lütfen çevre dikkat edin ve yetkililerine haber veriniz. Acil durumda 155 arayınız. Mahalle güvenliği hepimizin sorumluluğudur.",
    image: getFeedImageUrl(100),
    reactions: 156,
    comments: 42,
    feed: 'foryou',
  },
  {
    id: '1',
    author: { name: 'Ayşe K.', initial: 'A', neighborhood: 'Kadıköy, Moda', profileId: 'ayse-k' },
    timeAgo: '2 dk',
    isSponsored: false,
    isPinned: false,
    category: 'etkinlikler',
    title: "Mahalle Pikniği Bu Akşam!",
    body: "Merhaba komşular, bu akşam saat 20:00'de mahalle parkında piknik yapıyoruz. Katılmak isteyen herkesi bekliyoruz! Yanınıza battaniye ve atıştırmalık getirmeniz yeterli. Çocuklar için oyunlar da planlıyoruz.",
    image: getFeedImageUrl(58),
    reactions: 24,
    comments: 8,
    feed: 'foryou',
  },
  {
    id: '2',
    author: { name: 'Mehmet Y.', initial: 'M', neighborhood: 'Kadıköy, Caferağa', profileId: 'mehmet-y' },
    timeAgo: '1 sa',
    isSponsored: false,
    isPinned: false,
    category: 'kayipbuluntu',
    title: "Kayıp Kedi - Turuncu Tekir",
    body: "Pazartesi günü turuncu renkli kedim mahallede kayboldu. Adı Mişmiş, çok uysal ve evcil. Görürseniz lütfen haber verin. 0555 123 4567 arayabilirsiniz. Ödül vardır.",
    image: getFeedImageUrl(59),
    reactions: 42,
    comments: 15,
    feed: 'recent',
  },
  {
    id: '3',
    author: { name: 'Fatma Ç.', initial: 'F', neighborhood: 'Kadıköy, Moda', profileId: 'fatma-c' },
    timeAgo: '3 sa',
    isSponsored: false,
    isPinned: false,
    category: 'oneriler',
    title: "Yeni Kafede Harika Çilekli Cheesecake!",
    body: "Yeni açılan Moda Kafe'yi denediniz mi? Kahveleri harika ve fiyatlar gayet makul. Bir denemenizi tavsiye ederim! Özellikle çilekli cheesecake mutlaka denmeli. Sıcak tavsiyem!",
    reactions: 18,
    comments: 5,
    feed: 'foryou',
  },
  {
    id: '4',
    author: { name: 'Emre D.', initial: 'E', neighborhood: 'Kadıköy, Moda', profileId: 'emre-d' },
    timeAgo: '5 sa',
    isSponsored: false,
    isPinned: false,
    category: 'guvenlik',
    title: "Mahallede Şüpheli Araç",
    body: "Dün gece saat 23:00 civarında Moda Caddesi üzerinde uzun süre park halinde bekleyen koyu renkli bir araç dikkatimi çekti. Plakayı not edemedim ama dikkatli olalım komşular. Benzer durum görenler haber versin.",
    image: getFeedImageUrl(61),
    reactions: 67,
    comments: 23,
    feed: 'trending',
  },
  {
    id: '5',
    author: { name: 'Ali R.', initial: 'A', neighborhood: 'Üsküdar, Çengelköy', profileId: 'ali-r' },
    timeAgo: '6 sa',
    isSponsored: false,
    isPinned: false,
    category: 'oneriler',
    title: "Çengelköy Sahilinde Yeni Yürüyüş Yolu",
    body: 'Belediye sahil boyunca harika bir yürüyüş yolu yaptı. Akşam saatlerinde çok güzel oluyor, herkese tavsiye ederim. Doğa ve deniz keyfi için ideal!',
    image: getFeedImageUrl(62),
    reactions: 31,
    comments: 9,
    feed: 'nearby',
  },
  {
    id: '6',
    author: { name: 'Selin T.', initial: 'S', neighborhood: 'Beşiktaş, Levent', profileId: 'selin-t' },
    timeAgo: '8 sa',
    isSponsored: false,
    isPinned: false,
    category: 'oneriler',
    title: "Organik Pazarı - Taze Sebzeler",
    body: 'Levent\'teki yeni organik pazarı denediniz mi? Her cumartesi kuruluyor, sebzeler çok taze ve uygun fiyatlı. Yerel üreticilerden doğrudan alışveriş yapabiliyoruz.',
    image: getFeedImageUrl(63),
    reactions: 55,
    comments: 18,
    feed: 'nearby',
  },
  {
    id: '7',
    author: { name: 'Zeynep A.', initial: 'Z', neighborhood: 'Kadıköy, Moda', profileId: 'zeynep-a' },
    timeAgo: '10 sa',
    isSponsored: false,
    isPinned: false,
    category: 'sorular',
    title: "Mahallede Iyi Bir Elektrikçi Biliyor Musunuz?",
    body: 'Evimin elektrik sisteminde sorun var. Mahallede güvenilir bir elektrikçi biliyor musunuz? Teferruatı hızlı yapan ve uygun fiyatlı birini arıyorum. Tavsiyeleriniz için teşekkür ederim.',
    reactions: 12,
    comments: 8,
    feed: 'foryou',
  },
  {
    id: '8',
    author: { name: 'Hasan B.', initial: 'H', neighborhood: 'Kadıköy, Caferağa', profileId: 'hasan-b' },
    timeAgo: '12 sa',
    isSponsored: false,
    isPinned: false,
    category: 'satilik',
    title: "Ikinci El Bisiklet - Satılık",
    body: 'Çok az kullanılmış dağ bisikleti satıyorum. Marka: Trek, modelo: Marlin 7, 2023 yılı, durumu müthiş. Sadece 2.500 TL. İletişim: 0555 987 6543',
    image: getFeedImageUrl(64),
    reactions: 34,
    comments: 12,
    feed: 'recent',
  },
  {
    id: '9',
    author: { name: 'Nur Y.', initial: 'N', neighborhood: 'Kadıköy, Moda', profileId: 'nur-y' },
    timeAgo: '14 ha',
    isSponsored: false,
    isPinned: false,
    category: 'genel',
    title: "Mahalle Temizlik Etkinliği",
    body: 'Cumartesi sabahı mahalle parkında ortak temizlik etkinliği yapıyoruz. Herkesi katılmaya davet ediyoruz. Eldiveler ve çöp torbaları biz sağlayacağız. Saat 09:00\'da başlıyoruz!',
    image: getFeedImageUrl(65),
    reactions: 48,
    comments: 16,
    feed: 'foryou',
  },
  {
    id: '10',
    author: { name: 'Rıza Ş.', initial: 'R', neighborhood: 'Kadıköy, Moda', profileId: 'riza-s' },
    timeAgo: '16 sa',
    isSponsored: false,
    isPinned: false,
    category: 'satilik',
    title: "Antika Mobilya Koleksiyonu",
    body: 'Ev taşındığından antika mobilya satıyorum. Masif meşe yemek masası, sandalyeler, kütüphane. Fotoğralar ve fiyat listesi için WhatsApp: 0555 444 1111',
    image: getFeedImageUrl(66),
    reactions: 22,
    comments: 7,
    feed: 'recent',
  },
];

function getCategoryInfo(categoryId: string) {
  return POST_CATEGORIES.find(cat => cat.id === categoryId) || POST_CATEGORIES[0];
}

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState('foryou');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('tumu');
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showPostForm, setShowPostForm] = useState(false);
  const [postText, setPostText] = useState('');
  const [postCategory, setPostCategory] = useState('genel');
  const [postSubmitted, setPostSubmitted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCommentPostId, setExpandedCommentPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [postsToShow, setPostsToShow] = useState(6);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState(mockPosts);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

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

    let categoryMatch = true;
    if (activeCategoryFilter !== 'tumu') {
      categoryMatch = post.category === activeCategoryFilter;
    }

    if (!searchQuery.trim()) return tabMatch && categoryMatch;

    const query = searchQuery.toLowerCase();
    const titleMatch = post.title.toLowerCase().includes(query);
    const bodyMatch = post.body.toLowerCase().includes(query);
    const authorMatch = post.author.name.toLowerCase().includes(query);

    return tabMatch && categoryMatch && (titleMatch || bodyMatch || authorMatch);
  });

  // Separate pinned posts from regular posts
  const pinnedPosts = filteredPosts.filter(p => p.isPinned);
  const regularPosts = filteredPosts.filter(p => !p.isPinned);
  const displayedRegularPosts = regularPosts.slice(0, postsToShow);
  const hasMorePosts = regularPosts.length > postsToShow;

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

  // Check for active safety alerts
  const hasSafetyAlert = posts.some(p => p.category === 'guvenlik' && p.isPinned);

  return (
    <>
      <PostFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
      />

      {/* Download App Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowDownloadModal(false)}>
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowDownloadModal(false)} className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full">
              <X className="w-5 h-5 text-gray-500" />
            </button>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#00833e] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🏘️</span>
              </div>
              <h3 className="text-xl font-bold text-[#333] mb-2">Mahallem Mobil</h3>
              <p className="text-sm text-[#8f8f8f] mb-6">Mobil uygulamamız yakında App Store ve Google Play&apos;de!</p>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors">
                  <span className="text-xl">🍎</span>
                  <div className="text-left">
                    <p className="text-[10px] text-gray-400">Yakında</p>
                    <p className="text-sm font-semibold">App Store</p>
                  </div>
                </button>
                <button className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors">
                  <span className="text-xl">▶️</span>
                  <div className="text-left">
                    <p className="text-[10px] text-gray-400">Yakında</p>
                    <p className="text-sm font-semibold">Google Play</p>
                  </div>
                </button>
              </div>
              <p className="text-xs text-[#8f8f8f] mt-4">Uygulama çıktığında bildirim almak için e-postanızı bırakın.</p>
              <div className="flex gap-2 mt-2">
                <input type="email" placeholder="E-posta adresiniz" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00833e]" />
                <button className="px-4 py-2 bg-[#00833e] text-white text-sm font-medium rounded-lg hover:bg-[#006b32]">Bildir</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-[680px] mx-auto px-4 py-4">
        {/* Safety Alert Banner */}
        {hasSafetyAlert && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-r-lg flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold text-red-900 text-sm">Mahallede Aktif Güvenlik Uyarısı</p>
              <p className="text-red-700 text-xs mt-1">Lütfen dikkat edin ve yetkililerine bildirin. Detaylar için aşağı kaydırın.</p>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Gönderilerde ara..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPostsToShow(6);
            }}
            className="w-full px-4 py-2.5 bg-[#f0f2f5] border border-[#e0e0e0] rounded-full text-[15px] text-[#333] placeholder-[#8f8f8f] focus:outline-none focus:border-[#00833e] focus:ring-1 focus:ring-[#00833e] transition-colors"
          />
        </div>

        {/* Address Verification Banner - shown to unverified users */}
        <AddressVerificationBanner status="unverified" daysRemaining={27} />

        {/* Stories Bar */}
        <StoriesBar />

        {/* Post submitted confirmation */}
        {postSubmitted && (
          <div className="bg-[#e6f4ec] border border-[#00833e] rounded-lg p-3 mb-3 text-sm text-[#00833e] font-medium text-center">
            Gönderiniz başarıyla paylaşıldı!
          </div>
        )}

        {/* Create Post Box - Enhanced with Category and Location */}
        {!showPostForm ? (
          <div
            onClick={() => setIsModalOpen(true)}
            className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-4 mb-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#404040] rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                C
              </div>
              <div className="flex-1 px-4 py-2.5 bg-[#f0f2f5] text-[#8f8f8f] rounded-full text-[15px]">
                Mahallenize bir şeyler paylaşın...
              </div>
              <button onClick={handleCameraClick} className="p-2 hover:bg-[#f0f2f5] rounded-full transition-colors">
                <Camera className="w-5 h-5 text-[#8f8f8f]" />
              </button>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#8f8f8f]">
              <MapPin className="w-4 h-4" />
              <span>Konumunuz: Kadıköy, Moda</span>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-4 mb-4">
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
              placeholder="Mahallenize bir şeyler paylaşın..."
              className="w-full min-h-[120px] p-3 bg-[#f0f2f5] border border-[#e0e0e0] rounded-lg text-[15px] text-[#333] placeholder-[#8f8f8f] focus:outline-none focus:border-[#00833e] focus:ring-1 focus:ring-[#00833e] resize-none"
            />
            
            {/* Category Selector */}
            <div className="mt-3 pt-3 border-t border-[#e0e0e0]">
              <label className="block text-xs font-semibold text-[#333] mb-2">Kategori Seçin:</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {POST_CATEGORIES.filter(c => c.id !== 'tumu').map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setPostCategory(cat.id)}
                    className={cn(
                      'px-3 py-1.5 text-xs font-medium rounded-full border transition-all',
                      postCategory === cat.id
                        ? `${cat.badgeColor} border-transparent font-semibold`
                        : 'border-[#e0e0e0] text-[#404040] hover:border-[#00833e]'
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Location and Photo */}
            <div className="flex items-center gap-3 mb-3 pb-3 border-b border-[#e0e0e0]">
              <button onClick={handleCameraClick} className="p-2 hover:bg-[#f0f2f5] rounded-full transition-colors">
                <Camera className="w-5 h-5 text-[#8f8f8f]" />
              </button>
              <button className="p-2 hover:bg-[#f0f2f5] rounded-full transition-colors">
                <MapPin className="w-5 h-5 text-[#8f8f8f]" />
              </button>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-end gap-2">
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
        )}

        {/* Feed Tabs - Nextdoor style pill buttons */}
        <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
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

        {/* Category Filter Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
          {POST_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryFilter(cat.id)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all',
                activeCategoryFilter === cat.id
                  ? `${cat.badgeColor} border-transparent`
                  : 'border-[#e0e0e0] text-[#404040] bg-white hover:border-[#00833e]'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Onboarding Section */}
        {showOnboarding && (
          <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-[#333]">Mahallem&apos;a Başla</h2>
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
                if (card.isDownload) {
                  return (
                    <button key={i} onClick={() => setShowDownloadModal(true)} className="min-w-[200px] border border-[#e0e0e0] rounded-lg p-4 flex flex-col items-start gap-3 hover:border-[#00833e] hover:shadow-md transition-all text-left">
                      <div className="w-10 h-10 bg-[#f0f2f5] rounded-full flex items-center justify-center">
                        <Icon className="w-5 h-5 text-[#404040]" />
                      </div>
                      <p className="text-sm font-medium text-[#333]">{card.title}</p>
                      <span className={cn('px-4 py-2 rounded-full text-sm font-semibold transition-colors', card.ctaColor)}>
                        {card.cta}
                      </span>
                    </button>
                  );
                }
                return (
                  <Link key={i} href={card.href} className="min-w-[200px] border border-[#e0e0e0] rounded-lg p-4 flex flex-col items-start gap-3 hover:border-[#00833e] hover:shadow-md transition-all">
                    <div className="w-10 h-10 bg-[#f0f2f5] rounded-full flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#404040]" />
                    </div>
                    <p className="text-sm font-medium text-[#333]">{card.title}</p>
                    <span className={cn('px-4 py-2 rounded-full text-sm font-semibold transition-colors', card.ctaColor)}>
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

          {/* Pinned Posts First */}
          {pinnedPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              likedPosts={likedPosts}
              toggleLike={toggleLike}
              expandedCommentPostId={expandedCommentPostId}
              setExpandedCommentPostId={setExpandedCommentPostId}
              commentText={commentText}
              setCommentText={setCommentText}
              handleCommentSubmit={handleCommentSubmit}
              isPinned={true}
            />
          ))}

          {/* Regular Posts */}
          {[...pinnedPosts, ...displayedRegularPosts].slice(pinnedPosts.length).map((post) => (
            <PostCard
              key={post.id}
              post={post}
              likedPosts={likedPosts}
              toggleLike={toggleLike}
              expandedCommentPostId={expandedCommentPostId}
              setExpandedCommentPostId={setExpandedCommentPostId}
              commentText={commentText}
              setCommentText={setCommentText}
              handleCommentSubmit={handleCommentSubmit}
              isPinned={false}
            />
          ))}
        </div>

        {/* Load More Button */}
        {hasMorePosts && (
          <div className="text-center py-8">
            <button
              onClick={() => setPostsToShow(postsToShow + 3)}
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

// Post Card Component
function PostCard({
  post,
  likedPosts,
  toggleLike,
  expandedCommentPostId,
  setExpandedCommentPostId,
  commentText,
  setCommentText,
  handleCommentSubmit,
  isPinned,
}: any) {
  const categoryInfo = getCategoryInfo(post.category);

  return (
    <div className={cn('bg-white rounded-lg shadow-sm border', isPinned ? 'border-orange-300 bg-orange-50/30' : 'border-[#e0e0e0]')}>
      {/* Pinned Badge */}
      {isPinned && (
        <div className="bg-orange-100 text-orange-700 px-4 py-2 flex items-center gap-2 text-xs font-semibold border-b border-orange-200">
          <Pin className="w-4 h-4" />
          Komunite Lideri Tarafından Sabitlendi
        </div>
      )}

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
      <Link href={`/profil/${post.author.profileId}`} className="block px-4 py-3 hover:bg-[#fafafa] transition-colors">
        {post.title && (
          <h3 className="text-[15px] font-bold text-[#333] mb-2">{post.title}</h3>
        )}
        <p className="text-[15px] text-[#404040] leading-relaxed">{post.body}</p>
      </Link>

      {/* Category Badge */}
      <div className="px-4 py-1">
        <span className={cn('inline-block px-2.5 py-1 rounded-full text-xs font-semibold', categoryInfo.badgeColor)}>
          {categoryInfo.label}
        </span>
      </div>

      {/* Post Image */}
      {post.image && (
        <div className="mt-2 relative w-full max-h-[400px] overflow-hidden">
          <Image
            src={post.image}
            alt={post.title || 'Gönderi görseli'}
            width={800}
            height={400}
            unoptimized
            className="w-full object-cover hover:opacity-90 transition-opacity cursor-pointer"
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
                    ? 'text-red-500 bg-red-50'
                    : 'text-[#404040] hover:bg-[#f0f2f5]'
                )}
              >
                <Heart className={cn('w-5 h-5', likedPosts[post.id] && 'fill-current')} />
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
  );
}
