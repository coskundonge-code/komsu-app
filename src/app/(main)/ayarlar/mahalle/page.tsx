'use client';

import { useState } from 'react';
import { MapPin, Map, ChevronRight, Filter } from 'lucide-react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

interface NearbyNeighborhood {
  id: string;
  name: string;
  distance: string;
  enabled: boolean;
}

interface PostCategory {
  id: string;
  name: string;
  enabled: boolean;
}

export default function MahallePage() {
  const [nearbyNeighborhoods, setNearbyNeighborhoods] = useState<NearbyNeighborhood[]>([
    { id: '1', name: 'Teşvikiye', distance: '2 km uzakta', enabled: true },
    { id: '2', name: 'Nişantaşı', distance: '3 km uzakta', enabled: false },
    { id: '3', name: 'Maçka', distance: '4 km uzakta', enabled: true },
    { id: '4', name: 'Kurtuluş', distance: '5 km uzakta', enabled: false },
  ]);

  const [postCategories, setPostCategories] = useState<PostCategory[]>([
    { id: 'announcements', name: 'Duyurular', enabled: true },
    { id: 'events', name: 'Etkinlikler', enabled: true },
    { id: 'marketplace', name: 'Pazar Yeri', enabled: true },
    { id: 'recommendations', name: 'Tavsiyeler', enabled: true },
    { id: 'discussions', name: 'Tartışmalar', enabled: true },
    { id: 'help', name: 'Yardım / İhtiyaçlar', enabled: false },
  ]);

  const toggleNeighborhood = (id: string) => {
    setNearbyNeighborhoods(
      nearbyNeighborhoods.map((n) =>
        n.id === id ? { ...n, enabled: !n.enabled } : n
      )
    );
  };

  const toggleCategory = (id: string) => {
    setPostCategories(
      postCategories.map((c) =>
        c.id === id ? { ...c, enabled: !c.enabled } : c
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Header */}
      <div className="bg-white border-b border-[#e0e0e0] sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link
            href="/ayarlar"
            className="p-2 hover:bg-[#f0f2f5] rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-[#333]" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#f0f2f5] rounded-lg">
              <MapPin className="w-6 h-6 text-[#00833e]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#333]">Mahalle Ayarları</h1>
              <p className="text-sm text-[#8f8f8f]">Mahalle ve ilgi alanlarını yönetin</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Current Neighborhood */}
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-6 mb-6">
          <h2 className="text-lg font-semibold text-[#333] mb-4">Mevcut Mahalle</h2>

          {/* Map Placeholder */}
          <div className="w-full h-40 bg-[#f0f2f5] rounded-lg border border-[#e0e0e0] flex items-center justify-center mb-4">
            <div className="text-center">
              <Map className="w-12 h-12 text-[#8f8f8f] mx-auto mb-2" />
              <p className="text-sm text-[#8f8f8f]">Harita Yer Tutucu</p>
            </div>
          </div>

          {/* Current Neighborhood Display */}
          <div className="p-4 bg-[#f0f2f5] rounded-lg mb-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-6 h-6 text-[#00833e]" />
              <div>
                <p className="text-sm text-[#8f8f8f]">Konumunuz</p>
                <h3 className="text-lg font-bold text-[#333]">Beşiktaş, İstanbul</h3>
              </div>
            </div>
          </div>

          {/* Change Neighborhood Button */}
          <button className="w-full py-3 px-4 bg-[#00833e] text-white font-semibold rounded-lg hover:bg-[#006b32] transition-colors flex items-center justify-center gap-2">
            <MapPin className="w-5 h-5" />
            Mahalle Değiştir
          </button>
        </div>

        {/* Nearby Neighborhoods */}
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-6 mb-6">
          <h2 className="text-lg font-semibold text-[#333] mb-4">Yakındaki Mahalleler</h2>
          <p className="text-sm text-[#8f8f8f] mb-4">
            Bu mahallelerin gönderilerini görmek istiyorsanız açın
          </p>

          <div className="space-y-2">
            {nearbyNeighborhoods.map((neighborhood) => (
              <div
                key={neighborhood.id}
                className="flex items-center justify-between p-4 rounded-lg bg-[#f0f2f5] hover:bg-[#e8eaed] transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-[#333]">{neighborhood.name}</h3>
                  <p className="text-sm text-[#8f8f8f]">{neighborhood.distance}</p>
                </div>
                <button
                  onClick={() => toggleNeighborhood(neighborhood.id)}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors flex-shrink-0 ${
                    neighborhood.enabled ? 'bg-[#00833e]' : 'bg-[#e0e0e0]'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      neighborhood.enabled ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Neighborhood Preferences - Post Categories */}
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-6 h-6 text-[#00833e]" />
            <h2 className="text-lg font-semibold text-[#333]">Mahalle Tercihleri</h2>
          </div>
          <p className="text-sm text-[#8f8f8f] mb-4">
            Takip etmek istediğiniz gönderi kategorilerini seçin
          </p>

          <div className="space-y-3">
            {postCategories.map((category) => (
              <label
                key={category.id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#f0f2f5] cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={category.enabled}
                  onChange={() => toggleCategory(category.id)}
                  className="w-4 h-4 accent-[#00833e] cursor-pointer"
                />
                <span className="text-[#404040] font-medium">{category.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-12">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">İpucu:</span> Mahalle ayarlarınız ne zaman değişse
            hiç anlık olarak uygulanır. Mahalle gönderilerini hemen görmek için feed'i
            yenileyin.
          </p>
        </div>
      </div>
    </div>
  );
}
