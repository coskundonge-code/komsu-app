'use client';

import { GroupHeader } from '@/components/groups/group-header';
import { Button } from '@/components/ui/button';
import {
  Heart,
  MessageCircle,
  Share2,
  ArrowLeft,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const mockGroupDetail = {
  name: 'Komşu Kahvaltıları',
  slug: 'komsu-kahvaltilari',
  coverImage: 'https://images.unsplash.com/photo-1585518419759-ab60cb0bf33f?w=1200&h=600&fit=crop',
  icon: 'https://api.dicebear.com/7.x/avataaars/svg?seed=group1',
  description: 'Mahallede tüm komşuları bir araya getirerek sosyal bağları güçlendiren kahvaltı grubu.',
  memberCount: 47,
  postCount: 156,
  isJoined: true,
  isAdmin: true,
  members: [
    { id: '1', name: 'Ayşe Yılmaz', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1', role: 'Admin' },
    { id: '2', name: 'Fatih Demir', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2', role: 'Üye' },
    { id: '3', name: 'Zeynep Kaya', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3', role: 'Üye' },
    { id: '4', name: 'Meral Çetin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4', role: 'Üye' },
    { id: '5', name: 'Hakan Yağız', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5', role: 'Moderatör' },
    { id: '6', name: 'Emre Kılıç', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=6', role: 'Üye' },
  ],
  posts: [
    {
      id: '1',
      author: 'Fatih Demir',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
      content: 'Gelecek hafta cumartesi sabahı yine kahvaltı yapacağız! Kim gelecek?',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      likes: 12,
      comments: 5,
      liked: false,
      image: 'https://images.unsplash.com/photo-1585518419759-ab60cb0bf33f?w=400&h=300&fit=crop',
    },
    {
      id: '2',
      author: 'Zeynep Kaya',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
      content: 'Geçen cumartesinin kahvaltısı çok güzeldi! Herkese teşekkür ederim.',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      likes: 18,
      comments: 8,
      liked: true,
      image: undefined,
    },
    {
      id: '3',
      author: 'Hakan Yağız',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5',
      content: 'Kahvaltıya katılanlar için özel anket: Gelecek ayda nereye gidelim?',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      likes: 25,
      comments: 12,
      liked: false,
      image: undefined,
    },
  ],
  aboutText: 'Komşu Kahvaltıları grubu, mahallede yaşayan insanları bir araya getirerek sosyal bağları güçlendirmeyi amaçlayan bir topluluğudur. Her ayın ilk cumartesi sabahı mahalle parkında toplanırız ve lezzetli bir kahvaltı yaparız. Yalnızca kahvaltı değil, aynı zamanda komşularımızla tanışma, sohbet etme ve arkadaşlık kurma fırsatı da buluyoruz.',
};

export default function GroupDetailPage({ params }: { params: { slug: string } }) {
  const [activeTab, setActiveTab] = useState<'posts' | 'members' | 'about'>('posts');
  const [posts, setPosts] = useState(mockGroupDetail.posts);
  const [likedPosts, setLikedPosts] = useState<string[]>(
    mockGroupDetail.posts.filter(p => p.liked).map(p => p.id)
  );

  const handleLike = (postId: string) => {
    if (likedPosts.includes(postId)) {
      setLikedPosts(likedPosts.filter(id => id !== postId));
    } else {
      setLikedPosts([...likedPosts, postId]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b py-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/gruplar" className="flex items-center gap-2 text-[#00833e] hover:text-[#006b32] font-semibold">
            <ArrowLeft className="w-4 h-4" />
            Gruplara Geri Dön
          </Link>
        </div>
      </div>

      {/* Group Header */}
      <GroupHeader
        name={mockGroupDetail.name}
        coverImage={mockGroupDetail.coverImage}
        icon={mockGroupDetail.icon}
        description={mockGroupDetail.description}
        memberCount={mockGroupDetail.memberCount}
        postCount={mockGroupDetail.postCount}
        isJoined={mockGroupDetail.isJoined}
        isAdmin={mockGroupDetail.isAdmin}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'posts' && (
              <div className="space-y-6">
                {/* Post Input */}
                {mockGroupDetail.isJoined && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex gap-4">
                      <Image
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=99"
                        alt="You"
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1">
                        <textarea
                          placeholder="Gruba bir şeyler paylaş..."
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e] resize-none"
                          rows={3}
                        />
                        <div className="flex justify-end mt-2">
                          <button className="bg-[#00833e] hover:bg-[#006b32] text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                            Gönder
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Posts Feed */}
                {posts.map((post) => (
                  <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
                    {/* Post Header */}
                    <div className="flex items-center gap-4 mb-4">
                      <Image
                        src={post.avatar}
                        alt={post.author}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900">{post.author}</h4>
                        <p className="text-sm text-gray-500">
                          {post.timestamp.toLocaleDateString('tr-TR', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Post Content */}
                    <p className="text-gray-700 mb-4">{post.content}</p>

                    {/* Post Image */}
                    {post.image && (
                      <div className="relative h-64 bg-gray-200 rounded-lg overflow-hidden mb-4">
                        <Image
                          src={post.image}
                          alt="Post"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    {/* Post Actions */}
                    <div className="flex gap-6 pt-4 border-t">
                      <button
                        onClick={() => handleLike(post.id)}
                        className="flex items-center gap-2 text-gray-600 hover:text-[#00833e] transition-colors"
                      >
                        <Heart
                          className="w-5 h-5"
                          fill={likedPosts.includes(post.id) ? 'currentColor' : 'none'}
                        />
                        <span className={likedPosts.includes(post.id) ? 'text-[#00833e]' : ''}>
                          {likedPosts.includes(post.id) ? post.likes + 1 : post.likes}
                        </span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-600 hover:text-[#00833e] transition-colors">
                        <MessageCircle className="w-5 h-5" />
                        <span>{post.comments}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'members' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Grup Üyeleri ({mockGroupDetail.members.length})
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {mockGroupDetail.members.map((member) => (
                    <Link key={member.id} href={`/profil/${member.id}`}>
                      <div className="text-center p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                        <Image
                          src={member.avatar}
                          alt={member.name}
                          width={80}
                          height={80}
                          className="w-20 h-20 rounded-full object-cover mx-auto mb-3"
                        />
                        <p className="font-semibold text-gray-900">{member.name}</p>
                        <p className="text-xs text-[#00833e] font-semibold mt-1">
                          {member.role}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'about' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Grup Hakkında</h2>
                <p className="text-gray-700 leading-relaxed">
                  {mockGroupDetail.aboutText}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Group Stats */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Grup Bilgileri</h3>
              <div className="space-y-4">
                <div className="pb-4 border-b">
                  <p className="text-sm text-gray-600 mb-1">Üye Sayısı</p>
                  <p className="text-2xl font-bold text-[#00833e]">
                    {mockGroupDetail.memberCount}
                  </p>
                </div>
                <div className="pb-4 border-b">
                  <p className="text-sm text-gray-600 mb-1">Toplam Gönderi</p>
                  <p className="text-2xl font-bold text-[#00833e]">
                    {mockGroupDetail.postCount}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Kategori</p>
                  <p className="text-lg font-semibold text-gray-900">Sosyal Ağ</p>
                </div>
              </div>
            </div>

            {/* Rules/Guidelines */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Grup Kuralları</h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex gap-2">
                  <span className="text-[#00833e] font-bold">•</span>
                  <span>Saygılı ve nazik bir dil kullanın</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#00833e] font-bold">•</span>
                  <span>Spam ve ticari içerik paylaşmayın</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#00833e] font-bold">•</span>
                  <span>Başkalarının mahremiyetine saygı gösterin</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#00833e] font-bold">•</span>
                  <span>Hayaletçilik ve mobbing yasaktır</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
