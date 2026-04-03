'use client';

import { useState } from 'react';
import { Heart, MapPin, Clock, AlertCircle, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tab = 'requests' | 'offers';
type Category = 'all' | 'elderly' | 'shopping' | 'health' | 'household' | 'transport';

interface HelpRequest {
  id: string;
  category: Category;
  title: string;
  description: string;
  location: string;
  postedTime: string;
  urgency: 'acil' | 'normal';
  anonymous: boolean;
  helpers?: number;
}

const MOCK_REQUESTS: HelpRequest[] = [
  {
    id: '1',
    category: 'elderly',
    title: 'Yaşlı komşumuz için market alışverişi',
    description: 'Yaşlı komşumuzun ilaçları ve temel gıda maddelerine ihtiyacı var. Gözlük ameliyatından sonra çıkamıyor.',
    location: 'Cevizli Mahallesi',
    postedTime: '2 saat önce',
    urgency: 'normal',
    anonymous: false,
    helpers: 2,
  },
  {
    id: '2',
    category: 'health',
    title: 'Hastane randevusuna ulaşım',
    description: '82 yaşındaki annem perşembe günü ameliyat öncesi kontrol randevusu var. Acibadem Hastanesi\'ne ulaşım yardımı ihtiyacımız var.',
    location: 'Yeşilköy Mahallesi',
    postedTime: '4 saat önce',
    urgency: 'acil',
    anonymous: true,
    helpers: 1,
  },
  {
    id: '3',
    category: 'household',
    title: 'Ev temizliği yardımı - 3. kat',
    description: 'Ev temizliğinde yardım arıyoruz. 3. kattaki 85 m² dairenin temizliği gerekli. Hafta sonuna kadar olabilir mi?',
    location: 'Nişantaşı Mahallesi',
    postedTime: '6 saat önce',
    urgency: 'normal',
    anonymous: false,
    helpers: 0,
  },
  {
    id: '4',
    category: 'shopping',
    title: 'İlaç alımı - eczane kapalı',
    description: 'Kronik ilaçlarını almam gerekiyor ama hareket edemiyorum. Yakındaki eczaneden alınabilir. Çok acil.',
    location: 'Bebek Mahallesi',
    postedTime: '1 saat önce',
    urgency: 'acil',
    anonymous: true,
    helpers: 3,
  },
  {
    id: '5',
    category: 'elderly',
    title: 'Yaşlı komşuya yemek götürme',
    description: 'Evinden çıkamayan yaşlı komşuma 2-3 gün yemek götürmek isteyen var mı? Çorbayı ben hazırlıyorum.',
    location: 'Etiler Mahallesi',
    postedTime: '8 saat önce',
    urgency: 'normal',
    anonymous: false,
    helpers: 5,
  },
  {
    id: '6',
    category: 'health',
    title: 'Çocuklara ders yardımı',
    description: 'İlkokul 2. ve 4. sınıf çocuklarına matematik ve türkçe ders yardımı. Her cumartesi 2 saat olabilir.',
    location: 'Kanlıca Mahallesi',
    postedTime: '10 saat önce',
    urgency: 'normal',
    anonymous: false,
    helpers: 1,
  },
];

const CATEGORIES = [
  { id: 'all', label: 'Tümü' },
  { id: 'elderly', label: 'Yaşlı Bakım' },
  { id: 'shopping', label: 'Alışveriş' },
  { id: 'health', label: 'Sağlık' },
  { id: 'household', label: 'Ev İşleri' },
  { id: 'transport', label: 'Ulaşım' },
] as const;

const CATEGORY_COLORS: Record<Category, { bg: string; text: string }> = {
  all: { bg: 'bg-gray-100', text: 'text-gray-700' },
  elderly: { bg: 'bg-purple-100', text: 'text-purple-700' },
  shopping: { bg: 'bg-blue-100', text: 'text-blue-700' },
  health: { bg: 'bg-red-100', text: 'text-red-700' },
  household: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  transport: { bg: 'bg-green-100', text: 'text-green-700' },
};

const CATEGORY_LABELS: Record<Category, string> = {
  all: 'Tümü',
  elderly: 'Yaşlı Bakım',
  shopping: 'Alışveriş',
  health: 'Sağlık',
  household: 'Ev İşleri',
  transport: 'Ulaşım',
};

export default function KomsumaYardim() {
  const [activeTab, setActiveTab] = useState<Tab>('requests');
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');

  const filteredRequests = MOCK_REQUESTS.filter(
    (request) =>
      selectedCategory === 'all' || request.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="border-b border-border bg-surface sticky top-0 z-10">
        <div className="max-w-[680px] mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-text-primary">
              Komşuma Yardım
            </h1>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Plus className="w-6 h-6 text-primary" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                setActiveTab('requests');
                setSelectedCategory('all');
              }}
              className={cn(
                'px-4 py-2 rounded-lg font-medium transition-colors',
                activeTab === 'requests'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-text-primary hover:bg-gray-200'
              )}
            >
              Yardım Talepleri
            </button>
            <button
              onClick={() => {
                setActiveTab('offers');
                setSelectedCategory('all');
              }}
              className={cn(
                'px-4 py-2 rounded-lg font-medium transition-colors',
                activeTab === 'offers'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-text-primary hover:bg-gray-200'
              )}
            >
              Yardım Teklif Et
            </button>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="border-b border-border bg-surface">
        <div className="max-w-[680px] mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() =>
                  setSelectedCategory(category.id as Category)
                }
                className={cn(
                  'px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                  selectedCategory === category.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                )}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[680px] mx-auto px-4 py-6">
        {activeTab === 'requests' ? (
          <div className="space-y-4">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))
            ) : (
              <div className="text-center py-12">
                <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-text-secondary">
                  Bu kategoride talep bulunmuyor
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-text-secondary mb-4">
              Henüz yardım teklifi bulunmuyor
            </p>
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors">
              Yardım Teklif Et
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

interface RequestCardProps {
  request: HelpRequest;
}

function RequestCard({ request }: RequestCardProps) {
  const colors = CATEGORY_COLORS[request.category];

  return (
    <div className="bg-surface border border-border rounded-lg p-4 hover:shadow-sm transition-shadow">
      {/* Category Badge and Urgency */}
      <div className="flex items-start justify-between mb-3">
        <span
          className={cn(
            'px-2 py-1 rounded-full text-xs font-semibold',
            colors.bg,
            colors.text
          )}
        >
          {CATEGORY_LABELS[request.category]}
        </span>
        {request.urgency === 'acil' && (
          <div className="flex items-center gap-1 px-2 py-1 bg-red-50 rounded-full">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-xs font-semibold text-red-600">Acil</span>
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-text-primary mb-2">
        {request.title}
      </h3>

      {/* Description */}
      <p className="text-text-secondary text-sm mb-3">{request.description}</p>

      {/* Location and Time */}
      <div className="flex items-center gap-4 mb-4 text-xs text-text-secondary">
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          <span>{request.location}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{request.postedTime}</span>
        </div>
      </div>

      {/* Helpers Count and Anonymous */}
      <div className="flex items-center justify-between mb-4 pb-4 border-t border-border">
        <div className="flex items-center gap-2 mt-3">
          {request.helpers && request.helpers > 0 && (
            <div className="flex items-center gap-1 text-xs text-primary">
              <Heart className="w-4 h-4 fill-current" />
              <span className="font-medium">{request.helpers} kişi yardım etmeyi teklif etti</span>
            </div>
          )}
          {request.anonymous && (
            <span className="text-xs text-text-secondary bg-gray-100 px-2 py-1 rounded">
              Anonim
            </span>
          )}
        </div>
      </div>

      {/* Action Button */}
      <button className="w-full px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-opacity-90 transition-colors">
        Yardım Et
      </button>
    </div>
  );
}
