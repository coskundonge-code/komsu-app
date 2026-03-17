"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("@/components/map/leaflet-map"), { ssr: false });
import {
  MapPin,
  Map,
  ChevronLeft,
  Filter,
  Check,
  AlertCircle,
  Ruler,
  Bell,
} from "lucide-react";

interface NearbyNeighborhood {
  id: string;
  name: string;
  distance: string;
  enabled: boolean;
}

interface PostCategory {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  icon: React.ReactNode;
}

interface NotificationPreference {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export default function MahallePage() {
  const [nearbyNeighborhoods, setNearbyNeighborhoods] =
    useState<NearbyNeighborhood[]>([
      { id: "1", name: "Teşvikiye", distance: "2 km uzakta", enabled: true },
      { id: "2", name: "Nişantaşı", distance: "3 km uzakta", enabled: false },
      { id: "3", name: "Maçka", distance: "4 km uzakta", enabled: true },
      { id: "4", name: "Kurtuluş", distance: "5 km uzakta", enabled: false },
      { id: "5", name: "Cihangir", distance: "6 km uzakta", enabled: true },
    ]);

  const [postCategories, setPostCategories] = useState<PostCategory[]>([
    {
      id: "announcements",
      name: "Duyurular",
      description: "Mahalle haberleri ve önemli duyurular",
      enabled: true,
      icon: "📢",
    },
    {
      id: "events",
      name: "Etkinlikler",
      description: "Mahallede yapılacak etkinlikler",
      enabled: true,
      icon: "🎉",
    },
    {
      id: "marketplace",
      name: "Pazar Yeri",
      description: "Ürün satışı, alımı ve takas",
      enabled: true,
      icon: "🛒",
    },
    {
      id: "recommendations",
      name: "Tavsiyeler",
      description: "Mekan ve hizmet tavsiyeleri",
      enabled: true,
      icon: "⭐",
    },
    {
      id: "discussions",
      name: "Tartışmalar",
      description: "Genel konu tartışmaları",
      enabled: true,
      icon: "💬",
    },
    {
      id: "help",
      name: "Yardım / İhtiyaçlar",
      description: "Yardım talepleri ve ihtiyaçlar",
      enabled: false,
      icon: "🤝",
    },
  ]);

  const [notificationPrefs, setNotificationPrefs] =
    useState<NotificationPreference[]>([
      {
        id: "new_posts",
        label: "Yeni Gönderiler",
        description: "Mahallede yeni gönderi yayınlandığında bildir",
        enabled: true,
      },
      {
        id: "nearby_neighborhoods",
        label: "Yakındaki Mahalleler",
        description: "Yakındaki mahallelerde yeni gönderiler",
        enabled: true,
      },
      {
        id: "trending",
        label: "Popüler Gönderiler",
        description: "Haftanın en popüler gönderilerinin özeti",
        enabled: false,
      },
    ]);

  const [distancePreference, setDistancePreference] = useState("5");
  const [saved, setSaved] = useState(false);

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

  const toggleNotification = (id: string) => {
    setNotificationPrefs(
      notificationPrefs.map((n) =>
        n.id === id ? { ...n, enabled: !n.enabled } : n
      )
    );
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const enabledCount = nearbyNeighborhoods.filter((n) => n.enabled).length;
  const categoryCount = postCategories.filter((c) => c.enabled).length;

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
              <p className="text-sm text-[#8f8f8f]">
                Mahalle ve ilgi alanlarını yönetin
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Current Neighborhood */}
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-6 mb-6">
          <h2 className="text-lg font-semibold text-[#333] mb-6">
            Mevcut Mahalle
          </h2>

          {/* Map */}
          <div className="w-full h-48 rounded-lg overflow-hidden border border-[#e0e0e0] mb-6">
            <LeafletMap
              center={[41.0422, 29.0050]}
              zoom={15}
              className="w-full h-full"
              markers={[{ lat: 41.0422, lng: 29.0050, title: 'Mahalleniz', color: 'green' }]}
              showUserLocation={true}
            />
          </div>

          {/* Current Neighborhood Display */}
          <div className="p-4 bg-gradient-to-br from-[#00833e]/10 to-[#00833e]/5 rounded-lg border border-[#00833e]/20 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[#00833e]/20 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-[#00833e]" />
              </div>
              <div>
                <p className="text-sm text-[#8f8f8f] font-medium">
                  Konumunuz
                </p>
                <h3 className="text-lg font-bold text-[#333]">
                  Beşiktaş, İstanbul
                </h3>
                <p className="text-xs text-[#8f8f8f] mt-1">
                  Sıfır Taş Mahallesi
                </p>
              </div>
            </div>
          </div>

          {/* Change Neighborhood Button */}
          <button className="w-full py-3 px-4 bg-[#00833e] text-white font-semibold rounded-lg hover:bg-[#006b32] transition-colors flex items-center justify-center gap-2">
            <MapPin className="w-5 h-5" />
            Mahalle Değiştir
          </button>
        </div>

        {/* Distance Preference */}
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#f0f2f5] rounded-lg">
              <Ruler className="w-5 h-5 text-[#00833e]" />
            </div>
            <h2 className="text-lg font-semibold text-[#333]">
              Yakındaki Mahalleler Mesafesi
            </h2>
          </div>
          <p className="text-sm text-[#8f8f8f] mb-4">
            Gönderilerini görmek istediğiniz mahalleler ne kadar uzak olabilir?
          </p>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-[#333]">
                  Mesafe: {distancePreference} km
                </label>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                value={distancePreference}
                onChange={(e) => setDistancePreference(e.target.value)}
                className="w-full h-2 bg-[#e0e0e0] rounded-lg appearance-none cursor-pointer accent-[#00833e]"
              />
              <div className="flex justify-between text-xs text-[#8f8f8f] mt-2">
                <span>1 km</span>
                <span>15 km</span>
              </div>
            </div>
          </div>
        </div>

        {/* Nearby Neighborhoods */}
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-6 mb-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-[#333] mb-2">
              Yakındaki Mahalleler
            </h2>
            <p className="text-sm text-[#8f8f8f]">
              {enabledCount} mahalle takip ediliyor
            </p>
          </div>

          <div className="space-y-3">
            {nearbyNeighborhoods.map((neighborhood) => (
              <div
                key={neighborhood.id}
                className="flex items-center justify-between p-4 rounded-lg bg-[#f0f2f5] hover:bg-[#e8eaed] transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-[#333]">
                    {neighborhood.name}
                  </h3>
                  <p className="text-sm text-[#8f8f8f]">
                    {neighborhood.distance}
                  </p>
                </div>
                <button
                  onClick={() => toggleNeighborhood(neighborhood.id)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors flex-shrink-0 ${
                    neighborhood.enabled ? "bg-[#00833e]" : "bg-[#e0e0e0]"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                      neighborhood.enabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Neighborhood Feed Preferences */}
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Filter className="w-6 h-6 text-[#00833e]" />
            <div>
              <h2 className="text-lg font-semibold text-[#333]">
                Mahalle Tercihleri
              </h2>
              <p className="text-sm text-[#8f8f8f]">
                {categoryCount} kategori aktif
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {postCategories.map((category) => (
              <label
                key={category.id}
                className="flex items-center gap-3 p-4 rounded-lg hover:bg-[#f0f2f5] cursor-pointer transition-colors border border-transparent hover:border-[#e0e0e0]"
              >
                <input
                  type="checkbox"
                  checked={category.enabled}
                  onChange={() => toggleCategory(category.id)}
                  className="w-4 h-4 accent-[#00833e] cursor-pointer"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{category.icon}</span>
                    <span className="text-[#404040] font-medium">
                      {category.name}
                    </span>
                  </div>
                  <p className="text-sm text-[#8f8f8f] mt-1">
                    {category.description}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Feed Notifications */}
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#f0f2f5] rounded-lg">
              <Bell className="w-5 h-5 text-[#00833e]" />
            </div>
            <h2 className="text-lg font-semibold text-[#333]">
              Mahalle Feed Bildirimleri
            </h2>
          </div>

          <div className="space-y-4">
            {notificationPrefs.map((pref) => (
              <div
                key={pref.id}
                className="flex items-center justify-between p-3 rounded-lg bg-[#f0f2f5]"
              >
                <div className="flex-1">
                  <p className="font-medium text-[#333]">{pref.label}</p>
                  <p className="text-sm text-[#8f8f8f]">{pref.description}</p>
                </div>
                <button
                  onClick={() => toggleNotification(pref.id)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors flex-shrink-0 ${
                    pref.enabled ? "bg-[#00833e]" : "bg-[#e0e0e0]"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                      pref.enabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-12">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-900">
                <span className="font-semibold">İpucu:</span> Mahalle ayarlarınız
                hemen uygulanır. Değişiklikleri görmek için feed'inizi yenileyin.
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-3 mb-12">
          <button
            onClick={handleSave}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
              saved
                ? "bg-[#00833e] text-white"
                : "bg-[#00833e] text-white hover:bg-[#006b32]"
            }`}
          >
            {saved ? (
              <span className="flex items-center justify-center gap-2">
                <Check className="w-5 h-5" /> Kaydedildi
              </span>
            ) : (
              "Kaydet"
            )}
          </button>
          <Link
            href="/ayarlar"
            className="py-3 px-4 rounded-lg font-semibold bg-white border border-[#e0e0e0] text-[#333] hover:bg-[#f0f2f5] transition-colors"
          >
            İptal
          </Link>
        </div>
      </div>
    </div>
  );
}
