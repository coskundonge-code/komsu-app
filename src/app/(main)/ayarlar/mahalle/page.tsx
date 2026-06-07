"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

const GoogleMap = dynamic(() => import("@/components/map/google-map"), { ssr: false });
import {
  MapPin,
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-border sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-2 sm:px-4 py-3 sm:py-4 flex items-center gap-3">
          <Link
            href="/ayarlar"
            className="p-2 hover:bg-background rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-text-primary" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-background rounded-lg">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-primary">Mahalle Ayarları</h1>
              <p className="text-sm text-text-muted">
                Mahalle ve ilgi alanlarını yönetin
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {/* Current Neighborhood */}
        <div className="bg-surface rounded-lg border border-border p-6 mb-6">
          <h2 className="text-lg font-semibold text-text-primary mb-6">
            Mevcut Mahalle
          </h2>

          {/* Map */}
          <div className="w-full h-48 rounded-lg overflow-hidden border border-border mb-6">
            <GoogleMap
              center={[41.0422, 29.0050]}
              zoom={15}
              className="w-full h-full"
              markers={[{ lat: 41.0422, lng: 29.0050, title: 'Mahalleniz', color: 'green' }]}
              showUserLocation={true}
            />
          </div>

          {/* Current Neighborhood Display */}
          <div className="p-4 bg-gradient-to-br from-primary/10 to-[#00833e]/5 rounded-lg border border-primary/20 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-text-muted font-medium">
                  Konumunuz
                </p>
                <h3 className="text-lg font-bold text-text-primary">
                  Beşiktaş, İstanbul
                </h3>
                <p className="text-xs text-text-muted mt-1">
                  Sıfır Taş Mahallesi
                </p>
              </div>
            </div>
          </div>

          {/* Change Neighborhood Button */}
          <button className="w-full py-3 px-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition-colors flex items-center justify-center gap-2">
            <MapPin className="w-5 h-5" />
            Mahalle Değiştir
          </button>
        </div>

        {/* Distance Preference */}
        <div className="bg-surface rounded-lg border border-border p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-background rounded-lg">
              <Ruler className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-text-primary">
              Yakındaki Mahalleler Mesafesi
            </h2>
          </div>
          <p className="text-sm text-text-muted mb-4">
            Gönderilerini görmek istediğiniz mahalleler ne kadar uzak olabilir?
          </p>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-text-primary">
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
              <div className="flex justify-between text-xs text-text-muted mt-2">
                <span>1 km</span>
                <span>15 km</span>
              </div>
            </div>
          </div>
        </div>

        {/* Nearby Neighborhoods */}
        <div className="bg-surface rounded-lg border border-border p-6 mb-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-text-primary mb-2">
              Yakındaki Mahalleler
            </h2>
            <p className="text-sm text-text-muted">
              {enabledCount} mahalle takip ediliyor
            </p>
          </div>

          <div className="space-y-3">
            {nearbyNeighborhoods.map((neighborhood) => (
              <div
                key={neighborhood.id}
                className="flex items-center justify-between p-4 rounded-lg bg-background hover:bg-[#e8eaed] transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-text-primary">
                    {neighborhood.name}
                  </h3>
                  <p className="text-sm text-text-muted">
                    {neighborhood.distance}
                  </p>
                </div>
                <button
                  onClick={() => toggleNeighborhood(neighborhood.id)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors flex-shrink-0 ${
                    neighborhood.enabled ? "bg-primary" : "bg-[#e0e0e0]"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-surface transition-transform ${
                      neighborhood.enabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Neighborhood Feed Preferences */}
        <div className="bg-surface rounded-lg border border-border p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Filter className="w-6 h-6 text-primary" />
            <div>
              <h2 className="text-lg font-semibold text-text-primary">
                Mahalle Tercihleri
              </h2>
              <p className="text-sm text-text-muted">
                {categoryCount} kategori aktif
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {postCategories.map((category) => (
              <label
                key={category.id}
                className="flex items-center gap-3 p-4 rounded-lg hover:bg-background cursor-pointer transition-colors border border-transparent hover:border-border"
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
                    <span className="text-text-secondary font-medium">
                      {category.name}
                    </span>
                  </div>
                  <p className="text-sm text-text-muted mt-1">
                    {category.description}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Feed Notifications */}
        <div className="bg-surface rounded-lg border border-border p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-background rounded-lg">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-text-primary">
              Mahalle Feed Bildirimleri
            </h2>
          </div>

          <div className="space-y-4">
            {notificationPrefs.map((pref) => (
              <div
                key={pref.id}
                className="flex items-center justify-between p-3 rounded-lg bg-background"
              >
                <div className="flex-1">
                  <p className="font-medium text-text-primary">{pref.label}</p>
                  <p className="text-sm text-text-muted">{pref.description}</p>
                </div>
                <button
                  onClick={() => toggleNotification(pref.id)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors flex-shrink-0 ${
                    pref.enabled ? "bg-primary" : "bg-[#e0e0e0]"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-surface transition-transform ${
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
                hemen uygulanır. Değişiklikleri görmek için feed&apos;inizi yenileyin.
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
                ? "bg-primary text-white"
                : "bg-primary text-white hover:bg-primary-hover"
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
            className="py-3 px-4 rounded-lg font-semibold bg-surface border border-border text-text-primary hover:bg-background transition-colors"
          >
            İptal
          </Link>
        </div>
      </div>
    </div>
  );
}
