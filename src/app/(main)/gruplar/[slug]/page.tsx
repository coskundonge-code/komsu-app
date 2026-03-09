'use client';

import {
  Heart,
  MessageCircle,
  Share2,
  ArrowLeft,
  MoreVertical,
  Clock,
  MapPin,
  AlertCircle,
  Trash2,
  Flag,
  Users,
  Settings,
  UserPlus,
  LogOut,
  Lock,
  Globe,
  Calendar,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface Post {
  id: string;
  author: string;
  authorId: string;
  avatar: string;
  content: string;
  timestamp: Date;
  likes: number;
  comments: number;
  liked: boolean;
  image?: string;
}

interface Member {
  id: string;
  name: string;
  avatar: string;
  role: 'Admin' | 'Moderatör' | 'Üye';
  joinedDate: Date;
}

const mockGroupDetail = {
  id: 'komsu-kahvaltilari',
  name: 'Kadıköy Spor Kulübü',
  slug: 'kadikoy-spor-kulubu',
  coverImage: 'https://picsum.photos/1200/600?random=39',
  icon: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sportclub',
  category: 'Spor & Fitness',
  privacy: 'public',
  description: 'Kadıköy mahallesi sakinleri için futbol, voleybol, tenis ve genel fitness etkinlikleri.',
  fullDescription: 'Kadıköy Spor Kulübü, mahallede yaşayan spor meraklılarını bir araya getirerek aktif bir yaşam kültürü oluşturmayı amaçlayan bir topluluğudur. Futbol, voleybol, tenis, yüzme ve fitness gibi çeşitli spor branşlarında haftalık etkinlikler düzenleriz. Amacımız sadece spor yapmak değil, aynı zamanda komşularımızla tanışma, sağlıklı bir yaşam tarzı geliştirme ve arkadaşlık kurma fırsatı sağlamaktır.',
  memberCount: 128,
  postCount: 342,
  createdDate: new Date('2022-03-15'),
  isJoined: true,
  isAdmin: true,
  isModerator: false,
  members: [
    { id: '1', name: 'Mehmet Demirel', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1', role: 'Admin', joinedDate: new Date('2022-03-15') },
    { id: '2', name: 'Ayşe Kılıç', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2', role: 'Moderatör', joinedDate: new Date('2022-04-20') },
    { id: '3', name: 'Fatih Özdemir', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3', role: 'Moderatör', joinedDate: new Date('2022-05-10') },
    { id: '4', name: 'Zeynep Yavuz', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4', role: 'Üye', joinedDate: new Date('2023-01-22') },
    { id: '5', name: 'Hakan Şahin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5', role: 'Üye', joinedDate: new Date('2023-02-14') },
    { id: '6', name: 'Meral Coşkun', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=6', role: 'Üye', joinedDate: new Date('2023-06-08') },
    { id: '7', name: 'Emre Kardeş', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=7', role: 'Üye', joinedDate: new Date('2024-01-11') },
    { id: '8', name: 'Serap Ersoy', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=8', role: 'Üye', joinedDate: new Date('2024-05-03') },
  ] as Member[],
  posts: [
    {
      id: '1',
      author: 'Fatih Özdemir',
      authorId: '3',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
      content: '⚽ Cumartesi 15:00 parkta futbol maçı var! Herkesi bekliyoruz. Forma veya sadece spor giyim yeterli. Katılmak için cevaplayın 👇',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      likes: 23,
      comments: 8,
      liked: false,
      image: 'https://picsum.photos/400/300?random=40',
    },
    {
      id: '2',
      author: 'Ayşe Kılıç',
      authorId: '2',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
      content: 'Yeni yüzme antrenmanları başlıyor! Pazartesi ve perşembe akşamları 18:30-19:30 arasında. Herkesin seviyesine uygun. İlgilenenler bize yazabilir.',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      likes: 31,
      comments: 12,
      liked: true,
      image: undefined,
    },
    {
      id: '3',
      author: 'Mehmet Demirel',
      authorId: '1',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
      content: '🏆 Geçtiğimiz cumartesinin futbol turnuvasında harika bir gün geçirdik! Tüm katılımcılara teşekkür ederim. Resimler albümde. Gelecek ay yine yapacağız!',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      likes: 52,
      comments: 18,
      liked: false,
      image: undefined,
    },
    {
      id: '4',
      author: 'Zeynep Yavuz',
      authorId: '4',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
      content: 'Yoga sınıfı için aydınlık bir mekan arıyoruz. Pazardaki etkinlik çok sıcak oldu. Bir çatı bahçesi veya kapalı mekan bilen var mı?',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      likes: 14,
      comments: 5,
      liked: false,
      image: undefined,
    },
    {
      id: '5',
      author: 'Hakan Şahin',
      authorId: '5',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5',
      content: 'Tenis turnuvası için kaydolmak isteyen varsa lütfen haber versin. 20 kişi sayımız tamamlanırsa başlayabiliriz. Hepinizi bekliyoruz!',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      likes: 18,
      comments: 7,
      liked: false,
      image: undefined,
    },
  ] as Post[],
};

export default function GroupDetailPage({ params }: { params: { slug: string } }) {
  const [activeTab, setActiveTab] = useState<'posts' | 'members' | 'about' | 'media' | 'events'>('posts');
  const [posts, setPosts] = useState(mockGroupDetail.posts);
  const [likedPosts, setLikedPosts] = useState<string[]>(
    mockGroupDetail.posts.filter(p => p.liked).map(p => p.id)
  );
  const [newPostContent, setNewPostContent] = useState('');
  const [showPostMenu, setShowPostMenu] = useState<string | null>(null);
  const [showMemberFilter, setShowMemberFilter] = useState<'all' | 'admin' | 'moderator'>('all');
  const [isJoined, setIsJoined] = useState(mockGroupDetail.isJoined);
  const [showAdminMenu, setShowAdminMenu] = useState(false);

  const handleLike = (postId: string) => {
    if (likedPosts.includes(postId)) {
      setLikedPosts(likedPosts.filter(id => id !== postId));
    } else {
      setLikedPosts([...likedPosts, postId]);
    }
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const newPost: Post = {
      id: String(posts.length + 1),
      author: 'Siz',
      authorId: 'current-user',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=99',
      content: newPostContent,
      timestamp: new Date(),
      likes: 0,
      comments: 0,
      liked: false,
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-red-100 text-red-700';
      case 'Moderatör':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-green-100 text-green-700';
    }
  };

  const filteredMembers = mockGroupDetail.members.filter(member => {
    if (showMemberFilter === 'admin') return member.role === 'Admin';
    if (showMemberFilter === 'moderator') return member.role === 'Moderatör';
    return true;
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Şimdi';
    if (diffMins < 60) return `${diffMins} dakika önce`;
    if (diffHours < 24) return `${diffHours} saat önce`;
    if (diffDays < 7) return `${diffDays} gün önce`;
    return formatDate(date);
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Back Button Bar */}
      <div className="bg-white border-b border-[#e0e0e0] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Link
            href="/gruplar"
            className="inline-flex items-center gap-2 text-[#00833e] hover:text-[#006b32] font-semibold transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Gruplara Geri Dön
          </Link>
        </div>
      </div>

      {/* Group Header with Cover and Info */}
      <div className="relative bg-white border-b border-[#e0e0e0]">
        {/* Cover Photo */}
        <div className="relative h-48 sm:h-64 bg-gradient-to-r from-[#00833e] to-[#006b32] overflow-hidden">
          <Image
            src={mockGroupDetail.coverImage}
            alt={mockGroupDetail.name}
            fill
            className="object-cover"
            unoptimized
            priority
          />
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        {/* Group Info Card */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 -mt-16 sm:-mt-24 relative z-10 mb-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-white">
                <Image
                  src={mockGroupDetail.icon}
                  alt={mockGroupDetail.name}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>
            </div>

            {/* Group Details */}
            <div className="flex-1 pt-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#333] mb-2">
                    {mockGroupDetail.name}
                  </h1>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#d1fae5] text-[#00833e] rounded-full text-sm font-semibold">
                      {mockGroupDetail.privacy === 'public' ? (
                        <>
                          <Globe className="w-4 h-4" />
                          Herkese Açık
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          Özel
                        </>
                      )}
                    </span>
                    <span className="text-sm text-[#8f8f8f]">
                      {mockGroupDetail.memberCount} üye
                    </span>
                    <span className="text-sm text-[#8f8f8f]">
                      {mockGroupDetail.postCount} gönderi
                    </span>
                  </div>
                </div>

                {/* Admin Actions */}
                {mockGroupDetail.isAdmin && (
                  <div className="relative">
                    <button
                      onClick={() => setShowAdminMenu(!showAdminMenu)}
                      className="p-2 hover:bg-[#f0f2f5] rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-5 h-5 text-[#404040]" />
                    </button>
                    {showAdminMenu && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-[#e0e0e0] z-20">
                        <button className="w-full text-left px-4 py-3 hover:bg-[#f0f2f5] flex items-center gap-2 text-[#404040] transition-colors border-b border-[#e0e0e0]">
                          <Settings className="w-4 h-4" />
                          Grup Ayarları
                        </button>
                        <button className="w-full text-left px-4 py-3 hover:bg-[#f0f2f5] flex items-center gap-2 text-[#404040] transition-colors border-b border-[#e0e0e0]">
                          <Users className="w-4 h-4" />
                          Üyeleri Yönet
                        </button>
                        <button className="w-full text-left px-4 py-3 hover:bg-[#f0f2f5] flex items-center gap-2 text-[#404040] transition-colors">
                          <UserPlus className="w-4 h-4" />
                          Davet Et
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Join/Leave Button */}
          <div className="flex gap-3">
            <button
              onClick={() => setIsJoined(!isJoined)}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                isJoined
                  ? 'bg-[#e0e0e0] text-[#404040] hover:bg-[#d0d0d0]'
                  : 'bg-[#00833e] text-white hover:bg-[#006b32]'
              }`}
            >
              {isJoined ? (
                <>
                  <LogOut className="w-4 h-4" />
                  Ayrıl
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Gruba Katıl
                </>
              )}
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-6 border-b border-[#e0e0e0] overflow-x-auto">
            {(['posts', 'about', 'members', 'media', 'events'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 font-semibold transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === tab
                    ? 'text-[#00833e] border-[#00833e]'
                    : 'text-[#8f8f8f] border-transparent hover:text-[#404040]'
                }`}
              >
                {tab === 'posts' && 'Gönderiler'}
                {tab === 'about' && 'Hakkında'}
                {tab === 'members' && 'Üyeler'}
                {tab === 'media' && 'Medya'}
                {tab === 'events' && 'Etkinlikler'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Posts Tab */}
            {activeTab === 'posts' && (
              <div className="space-y-6">
                {/* Create Post Card */}
                {mockGroupDetail.isJoined && (
                  <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6">
                    <form onSubmit={handlePostSubmit} className="space-y-4">
                      <div className="flex gap-4">
                        <Image
                          src="https://api.dicebear.com/7.x/avataaars/svg?seed=99"
                          alt="Sizin Avatarınız"
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover flex-shrink-0 border border-[#e0e0e0]"
                          unoptimized
                        />
                        <div className="flex-1">
                          <textarea
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                            placeholder="Gruba bir şeyler paylaş..."
                            className="w-full p-3 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e] focus:border-transparent resize-none text-[#333]"
                            rows={3}
                          />
                          <div className="flex justify-end gap-2 mt-3">
                            <button
                              type="button"
                              className="px-4 py-2 text-[#404040] hover:bg-[#f0f2f5] rounded-lg transition-colors font-medium"
                            >
                              İptal
                            </button>
                            <button
                              type="submit"
                              disabled={!newPostContent.trim()}
                              className="px-6 py-2 bg-[#00833e] hover:bg-[#006b32] disabled:bg-gray-300 text-white rounded-lg font-semibold transition-colors"
                            >
                              Gönder
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                )}

                {/* Posts Feed */}
                <div className="space-y-6">
                  {posts.length > 0 ? (
                    posts.map((post) => (
                      <div key={post.id} className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] overflow-hidden hover:shadow-md transition-shadow">
                        {/* Post Header */}
                        <div className="p-6">
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="flex gap-3 flex-1">
                              <Image
                                src={post.avatar}
                                alt={post.author}
                                width={40}
                                height={40}
                                className="w-10 h-10 rounded-full object-cover flex-shrink-0 border border-[#e0e0e0]"
                                unoptimized
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-[#333]">{post.author}</h4>
                                <p className="text-sm text-[#8f8f8f]">
                                  {formatTimeAgo(post.timestamp)}
                                </p>
                              </div>
                            </div>
                            <div className="relative">
                              <button
                                onClick={() => setShowPostMenu(showPostMenu === post.id ? null : post.id)}
                                className="p-2 hover:bg-[#f0f2f5] rounded-full transition-colors text-[#8f8f8f]"
                              >
                                <MoreVertical className="w-5 h-5" />
                              </button>

                              {/* Post Menu */}
                              {showPostMenu === post.id && (
                                <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-[#e0e0e0] z-10">
                                  <button className="w-full text-left px-4 py-3 hover:bg-[#f0f2f5] flex items-center gap-2 text-[#404040] transition-colors border-b border-[#e0e0e0]">
                                    <Share2 className="w-4 h-4" />
                                    Paylaş
                                  </button>
                                  {mockGroupDetail.isAdmin && (
                                    <>
                                      <button className="w-full text-left px-4 py-3 hover:bg-[#f0f2f5] flex items-center gap-2 text-[#404040] transition-colors border-b border-[#e0e0e0]">
                                        <Trash2 className="w-4 h-4" />
                                        Sil
                                      </button>
                                    </>
                                  )}
                                  <button className="w-full text-left px-4 py-3 hover:bg-[#f0f2f5] flex items-center gap-2 text-red-600 transition-colors">
                                    <Flag className="w-4 h-4" />
                                    Bildir
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Post Content */}
                          <p className="text-[#404040] mb-4 leading-relaxed whitespace-pre-wrap">
                            {post.content}
                          </p>

                          {/* Post Image */}
                          {post.image && (
                            <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden mb-4">
                              <Image
                                src={post.image}
                                alt="Gönderi resmi"
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                          )}

                          {/* Post Actions */}
                          <div className="flex gap-6 pt-4 border-t border-[#e0e0e0]">
                            <button
                              onClick={() => handleLike(post.id)}
                              className="flex items-center gap-2 text-[#8f8f8f] hover:text-[#00833e] transition-colors group"
                            >
                              <Heart
                                className="w-5 h-5 group-hover:scale-110 transition-transform"
                                fill={likedPosts.includes(post.id) ? 'currentColor' : 'none'}
                                color={likedPosts.includes(post.id) ? '#00833e' : 'currentColor'}
                              />
                              <span className={`text-sm font-medium ${likedPosts.includes(post.id) ? 'text-[#00833e]' : ''}`}>
                                {likedPosts.includes(post.id) ? post.likes + 1 : post.likes}
                              </span>
                            </button>
                            <button className="flex items-center gap-2 text-[#8f8f8f] hover:text-[#00833e] transition-colors group">
                              <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                              <span className="text-sm font-medium">{post.comments}</span>
                            </button>
                            <button className="flex items-center gap-2 text-[#8f8f8f] hover:text-[#00833e] transition-colors group">
                              <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                              <span className="text-sm font-medium">Paylaş</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-12 text-center">
                      <AlertCircle className="w-12 h-12 text-[#8f8f8f] mx-auto mb-3" />
                      <p className="text-[#8f8f8f]">Bu grupta henüz gönderi yok. İlk gönderiyi siz paylaşabilirsiniz!</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Members Tab */}
            {activeTab === 'members' && (
              <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-[#333]">
                    Grup Üyeleri ({filteredMembers.length})
                  </h2>
                  {mockGroupDetail.isAdmin && (
                    <div className="flex gap-2">
                      {['all', 'admin', 'moderator'].map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setShowMemberFilter(filter as any)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            showMemberFilter === filter
                              ? 'bg-[#00833e] text-white'
                              : 'bg-[#f0f2f5] text-[#404040] hover:bg-[#e0e0e0]'
                          }`}
                        >
                          {filter === 'all' && 'Hepsi'}
                          {filter === 'admin' && 'Yönetici'}
                          {filter === 'moderator' && 'Moderatör'}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredMembers.map((member) => (
                    <Link key={member.id} href={`/profil/${member.id}`}>
                      <div className="p-4 rounded-lg hover:bg-[#f0f2f5] transition-colors cursor-pointer border border-transparent hover:border-[#e0e0e0]">
                        <div className="flex flex-col items-center">
                          <Image
                            src={member.avatar}
                            alt={member.name}
                            width={80}
                            height={80}
                            className="w-20 h-20 rounded-full object-cover mb-3 border-2 border-[#e0e0e0]"
                            unoptimized
                          />
                          <p className="font-semibold text-[#333] text-center text-sm">{member.name}</p>
                          <div className={`mt-2 px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(member.role)}`}>
                            {member.role}
                          </div>
                          <p className="text-xs text-[#8f8f8f] mt-2">
                            {member.joinedDate.toLocaleDateString('tr-TR', { month: 'short', year: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Media Tab */}
            {activeTab === 'media' && (
              <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6">
                <h2 className="text-2xl font-bold text-[#333] mb-6">Medya</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="relative h-32 bg-[#e0e0e0] rounded-lg overflow-hidden hover:opacity-80 transition-opacity cursor-pointer">
                      <Image
                        src={`https://picsum.photos/200/200?random=${i + 100}`}
                        alt={`Medya ${i}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Events Tab */}
            {activeTab === 'events' && (
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] overflow-hidden hover:shadow-md transition-shadow">
                  <div className="flex gap-4 p-4 sm:p-6">
                    <div className="relative h-24 w-24 sm:h-32 sm:w-32 flex-shrink-0 rounded-lg overflow-hidden bg-[#e0e0e0]">
                      <Image
                        src="https://picsum.photos/300/200?random=50"
                        alt="Etkinlik"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[#333] text-sm sm:text-base mb-2">Futbol Maçı</h3>
                      <div className="space-y-1 text-xs sm:text-sm text-[#8f8f8f]">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 flex-shrink-0" />
                          <span>15 Mart 2026, 15:00</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">Mahalle Spor Alanı</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 flex-shrink-0" />
                          <span>24 katılımcı</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] overflow-hidden hover:shadow-md transition-shadow">
                  <div className="flex gap-4 p-4 sm:p-6">
                    <div className="relative h-24 w-24 sm:h-32 sm:w-32 flex-shrink-0 rounded-lg overflow-hidden bg-[#e0e0e0]">
                      <Image
                        src="https://picsum.photos/300/200?random=51"
                        alt="Etkinlik"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[#333] text-sm sm:text-base mb-2">Yoga Dersi</h3>
                      <div className="space-y-1 text-xs sm:text-sm text-[#8f8f8f]">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 flex-shrink-0" />
                          <span>22 Mart 2026, 09:00</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">Mahalle Parkı</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 flex-shrink-0" />
                          <span>18 katılımcı</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] overflow-hidden hover:shadow-md transition-shadow">
                  <div className="flex gap-4 p-4 sm:p-6">
                    <div className="relative h-24 w-24 sm:h-32 sm:w-32 flex-shrink-0 rounded-lg overflow-hidden bg-[#e0e0e0]">
                      <Image
                        src="https://picsum.photos/300/200?random=52"
                        alt="Etkinlik"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[#333] text-sm sm:text-base mb-2">Tenis Turnuvası</h3>
                      <div className="space-y-1 text-xs sm:text-sm text-[#8f8f8f]">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 flex-shrink-0" />
                          <span>29 Mart 2026, 14:00</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">Tenis Kortları</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 flex-shrink-0" />
                          <span>32 katılımcı</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* About Tab */}
            {activeTab === 'about' && (
              <div className="space-y-6">
                {/* Description */}
                <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6">
                  <h2 className="text-2xl font-bold text-[#333] mb-4">Grup Hakkında</h2>
                  <p className="text-[#404040] leading-relaxed">
                    {mockGroupDetail.fullDescription}
                  </p>
                </div>

                {/* Group Details */}
                <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6">
                  <h3 className="text-xl font-bold text-[#333] mb-6">Grup Bilgileri</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 pb-4 border-b border-[#e0e0e0]">
                      <Users className="w-5 h-5 text-[#00833e] flex-shrink-0" />
                      <div>
                        <p className="text-sm text-[#8f8f8f]">Üye Sayısı</p>
                        <p className="font-bold text-[#333]">{mockGroupDetail.memberCount} kişi</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 pb-4 border-b border-[#e0e0e0]">
                      <MapPin className="w-5 h-5 text-[#00833e] flex-shrink-0" />
                      <div>
                        <p className="text-sm text-[#8f8f8f]">Kategori</p>
                        <p className="font-bold text-[#333]">{mockGroupDetail.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Clock className="w-5 h-5 text-[#00833e] flex-shrink-0" />
                      <div>
                        <p className="text-sm text-[#8f8f8f]">Kurulma Tarihi</p>
                        <p className="font-bold text-[#333]">{formatDate(mockGroupDetail.createdDate)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rules */}
                <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6">
                  <h3 className="text-xl font-bold text-[#333] mb-6">Grup Kuralları</h3>
                  <ul className="space-y-4">
                    <li className="flex gap-3">
                      <span className="text-[#00833e] font-bold text-lg flex-shrink-0">•</span>
                      <span className="text-[#404040]">Saygılı ve nazik bir dil kullanın. Diğer üyelere karşı saygısız yorum ve sözlere izin verilmez.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-[#00833e] font-bold text-lg flex-shrink-0">•</span>
                      <span className="text-[#404040]">Spam, ticari reklam ve direkt pazarlama içeriği paylaşmayın.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-[#00833e] font-bold text-lg flex-shrink-0">•</span>
                      <span className="text-[#404040]">Başkalarının mahremiyetine ve kişisel verilerine saygı gösterin.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-[#00833e] font-bold text-lg flex-shrink-0">•</span>
                      <span className="text-[#404040]">Mobbing, taciz, hayaletçilik ve tehdit yasaktır.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-[#00833e] font-bold text-lg flex-shrink-0">•</span>
                      <span className="text-[#404040]">Kin, nefret ve ayrımcılık içeren içerik paylaşmayın.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-[#00833e] font-bold text-lg flex-shrink-0">•</span>
                      <span className="text-[#404040]">Sahte bilgi ve dezenformasyon yayınlamayın.</span>
                    </li>
                  </ul>
                </div>

                {/* Admins */}
                <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6">
                  <h3 className="text-xl font-bold text-[#333] mb-6">Yöneticiler</h3>
                  <div className="space-y-4">
                    {mockGroupDetail.members.filter(m => m.role === 'Admin' || m.role === 'Moderatör').map(admin => (
                      <div key={admin.id} className="flex items-center gap-4 pb-4 border-b border-[#e0e0e0] last:border-b-0 last:pb-0">
                        <Image
                          src={admin.avatar}
                          alt={admin.name}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-full object-cover border border-[#e0e0e0]"
                          unoptimized
                        />
                        <div className="flex-1">
                          <p className="font-bold text-[#333]">{admin.name}</p>
                          <p className="text-sm text-[#8f8f8f]">{admin.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Group Stats Card */}
            <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6">
              <h3 className="font-bold text-[#333] mb-6 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#00833e]" />
                Grup Bilgileri
              </h3>
              <div className="space-y-5">
                <div className="pb-5 border-b border-[#e0e0e0]">
                  <p className="text-sm text-[#8f8f8f] mb-2">Üye Sayısı</p>
                  <p className="text-3xl font-bold text-[#00833e]">{mockGroupDetail.memberCount}</p>
                </div>
                <div className="pb-5 border-b border-[#e0e0e0]">
                  <p className="text-sm text-[#8f8f8f] mb-2">Toplam Gönderi</p>
                  <p className="text-3xl font-bold text-[#00833e]">{mockGroupDetail.postCount}</p>
                </div>
                <div>
                  <p className="text-sm text-[#8f8f8f] mb-2">Kategori</p>
                  <p className="font-semibold text-[#333]">{mockGroupDetail.category}</p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6">
              <h3 className="font-bold text-[#333] mb-4">Hızlı İşlemler</h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-3 bg-[#f0f2f5] hover:bg-[#e0e0e0] text-[#00833e] font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Mesaj Gönder
                </button>
                {mockGroupDetail.isAdmin && (
                  <button className="w-full px-4 py-3 bg-[#f0f2f5] hover:bg-[#e0e0e0] text-[#333] font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Bildirim Gönder
                  </button>
                )}
              </div>
            </div>

            {/* Group Description Sidebar */}
            <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6">
              <h3 className="font-bold text-[#333] mb-4">Grup Açıklaması</h3>
              <p className="text-sm text-[#404040] leading-relaxed">
                {mockGroupDetail.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
