'use client';

import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  MessageCircle,
  Share2,
  Heart,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const mockUserProfile = {
  id: '1',
  name: 'Ayşe Yılmaz',
  bio: 'Mahalle temsilcisi ve sosyal aktiviteler koordinatörü. Komşularla iletişim ve toplum oluşturmada tutkulu.',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
  neighborhood: 'Güngören, İstanbul',
  joinDate: new Date(2023, 5, 15),
  followers: 324,
  following: 187,
  listings: [
    {
      id: '1',
      title: 'Temizlik Hizmeti',
      description: 'Evlerini ve işyerlerini hijyenik bir şekilde temizliyorum.',
      category: 'Hizmet',
      image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=300&h=300&fit=crop',
      rating: 4.8,
      reviews: 24,
    },
    {
      id: '2',
      title: 'İnsan Kaynakları Danışmanlığı',
      description: 'Şirketler için HR danışmanlığı ve eğitim hizmetleri sunuyorum.',
      category: 'Danışmanlık',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=300&fit=crop',
      rating: 4.9,
      reviews: 18,
    },
  ],
  posts: [
    {
      id: '1',
      content: 'Gelecek cumartesi yine mahalle kahvaltısı yapacağız! Herkesi davetliyorum.',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      likes: 45,
      comments: 12,
    },
    {
      id: '2',
      content: 'Mahallede yeni bir spor kulübü kuruyoruz. İlgilenenler lütfen yazın!',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      likes: 67,
      comments: 23,
    },
    {
      id: '3',
      content: 'Bu ay kütüphanede edebiyat klasikleri üzerine tartışma yapacağız.',
      timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      likes: 34,
      comments: 15,
    },
  ],
};

export default function ProfilePage({ params }: { params: { id: string } }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [liked, setLiked] = useState<string[]>([]);

  const joinDateStr = mockUserProfile.joinDate.toLocaleDateString('tr-TR', {
    month: 'long',
    year: 'numeric',
  });

  const handleLike = (postId: string) => {
    if (liked.includes(postId)) {
      setLiked(liked.filter(id => id !== postId));
    } else {
      setLiked([...liked, postId]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/etkinlikler" className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold">
            <ArrowLeft className="w-4 h-4" />
            Geri Dön
          </Link>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-8">
            {/* Avatar */}
            <Image
              src={mockUserProfile.avatar}
              alt={mockUserProfile.name}
              width={120}
              height={120}
              className="w-32 h-32 rounded-full object-cover border-4 border-emerald-600"
            />

            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {mockUserProfile.name}
              </h1>
              <p className="text-gray-600 mb-4">{mockUserProfile.bio}</p>

              <div className="flex flex-wrap gap-6 mb-6">
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  <span>{mockUserProfile.neighborhood}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  <span>{joinDateStr}'den beri üye</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mb-6">
                <div>
                  <p className="text-2xl font-bold text-emerald-600">
                    {mockUserProfile.followers}
                  </p>
                  <p className="text-gray-600 text-sm">Takipçi</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-600">
                    {mockUserProfile.following}
                  </p>
                  <p className="text-gray-600 text-sm">Takip Edilen</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-600">
                    {mockUserProfile.posts.length}
                  </p>
                  <p className="text-gray-600 text-sm">Gönderi</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                    isFollowing
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  {isFollowing ? 'Takip Ediliyor' : 'Takip Et'}
                </button>
                <button className="px-6 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Mesaj Gönder
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Posts */}
          <div className="md:col-span-2">
            {/* Posts Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Gönderiler
              </h2>
              <div className="space-y-6">
                {mockUserProfile.posts.map((post) => (
                  <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
                    <p className="text-gray-700 mb-4">{post.content}</p>
                    <p className="text-sm text-gray-500 mb-4">
                      {post.timestamp.toLocaleDateString('tr-TR')}
                    </p>
                    <div className="flex gap-6 pt-4 border-t">
                      <button
                        onClick={() => handleLike(post.id)}
                        className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors"
                      >
                        <Heart
                          className="w-5 h-5"
                          fill={liked.includes(post.id) ? 'currentColor' : 'none'}
                        />
                        <span className={liked.includes(post.id) ? 'text-emerald-600' : ''}>
                          {post.likes}
                        </span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors">
                        <MessageCircle className="w-5 h-5" />
                        <span>{post.comments}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Listings */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Hizmetler ve Ürünler
              </h3>
              <div className="space-y-4">
                {mockUserProfile.listings.map((listing) => (
                  <Link
                    key={listing.id}
                    href="#"
                    className="block p-3 border border-gray-200 rounded-lg hover:border-emerald-600 hover:bg-emerald-50 transition-colors"
                  >
                    <div className="flex gap-3">
                      <Image
                        src={listing.image}
                        alt={listing.title}
                        width={60}
                        height={60}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {listing.title}
                        </p>
                        <p className="text-xs text-gray-600 mb-1">
                          {listing.category}
                        </p>
                        <p className="text-sm text-emerald-600 font-semibold">
                          {listing.rating} ⭐ ({listing.reviews})
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* About Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Hakkında</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="pb-3 border-b">
                  <p className="text-gray-600 mb-1">Mahalle</p>
                  <p className="font-semibold">{mockUserProfile.neighborhood}</p>
                </div>
                <div className="pb-3 border-b">
                  <p className="text-gray-600 mb-1">Üye Olma Tarihi</p>
                  <p className="font-semibold">{joinDateStr}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Profil Durumu</p>
                  <p className="font-semibold text-emerald-600">Doğrulanmış</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
