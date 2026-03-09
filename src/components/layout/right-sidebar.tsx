'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  ChevronRight,
  Edit3,
  ChevronUp,
  Building2,
  Sun,
  Cloud,
  Droplets,
  Wind,
  TrendingUp,
  Calendar,
  Shield,
  AlertCircle,
} from 'lucide-react'

export function RightSidebar() {
  return (
    <div className="w-[300px] flex-shrink-0 hidden xl:block py-4 px-2 space-y-4">
      {/* Neighborhood Card */}
      <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] overflow-hidden">
        <div className="p-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#00833e] rounded-full" />
            <div>
              <p className="text-[15px] font-bold text-[#333]">Kadıköy, Moda</p>
              <p className="text-xs text-[#8f8f8f]">İstanbul</p>
            </div>
          </div>
        </div>
        <Link
          href="/uyarilar"
          className="flex items-center justify-between px-4 py-3 border-t border-[#e0e0e0] hover:bg-[#f9f9f9] transition-colors"
        >
          <span className="text-sm font-medium text-[#404040]">Tüm uyarıları gör</span>
          <ChevronRight className="w-4 h-4 text-[#8f8f8f]" />
        </Link>
      </div>

      {/* Weather Widget */}
      <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] overflow-hidden">
        <div className="p-4">
          <p className="text-sm font-semibold text-[#333] mb-4 flex items-center gap-2">
            <Sun className="w-4 h-4 text-[#00833e]" />
            Mahalle Hava Durumu
          </p>
          <div className="space-y-3">
            {/* Location & Temp */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-medium text-[#333]">İstanbul, Kadıköy</p>
                <p className="text-[12px] text-[#8f8f8f]">Kısmen Bulutlu</p>
              </div>
              <div className="flex items-center">
                <Cloud className="w-8 h-8 text-[#404040]" />
                <p className="text-xl font-bold text-[#333] ml-1">18°</p>
              </div>
            </div>

            {/* Weather Details */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#e0e0e0]">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-[#8f8f8f]" />
                <div>
                  <p className="text-[10px] text-[#8f8f8f]">Nem</p>
                  <p className="text-xs font-medium text-[#333]">65%</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-[#8f8f8f]" />
                <div>
                  <p className="text-[10px] text-[#8f8f8f]">Rüzgar</p>
                  <p className="text-xs font-medium text-[#333]">12 km/h</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Topics */}
      <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] overflow-hidden">
        <div className="p-4 border-b border-[#e0e0e0]">
          <p className="text-sm font-semibold text-[#333] flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#00833e]" />
            Gündem Konuları
          </p>
        </div>
        <div className="divide-y divide-[#e0e0e0]">
          {[
            { title: 'Park Yenileme Projesi', posts: 24 },
            { title: 'Hafta Sonu Pazarı', posts: 18 },
            { title: 'Yeni Kafe Açılışı', posts: 12 },
            { title: 'Komşu Sosyal Etkinliği', posts: 9 },
            { title: 'Kat Sahipleri Toplantısı', posts: 7 },
            { title: 'Trafik Sorunu Çözümü', posts: 5 },
          ].map((topic, idx) => (
            <Link
              key={idx}
              href={`/konu/${topic.title.toLowerCase().replace(/\s+/g, '-')}`}
              className="px-4 py-3 hover:bg-[#f9f9f9] transition-colors flex justify-between items-center"
            >
              <span className="text-sm text-[#333]">{topic.title}</span>
              <span className="text-xs text-[#8f8f8f] bg-[#f0f2f5] px-2 py-1 rounded">
                {topic.posts}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] overflow-hidden">
        <div className="p-4 border-b border-[#e0e0e0]">
          <p className="text-sm font-semibold text-[#333] flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#00833e]" />
            Yaklaşan Etkinlikler
          </p>
        </div>
        <div className="space-y-3 p-4">
          {[
            { date: '14 Mar', title: 'Mahalle Piknik', attendees: 24 },
            { date: '18 Mar', title: 'Yoga Sınıfı', attendees: 12 },
            { date: '21 Mar', title: 'Sosyal Buluşma', attendees: 18 },
          ].map((event, idx) => (
            <Link
              key={idx}
              href={`/etkinlikler`}
              className="flex gap-3 p-2 rounded-lg hover:bg-[#f0f2f5] transition-colors"
            >
              <div className="flex flex-col items-center justify-center w-10 h-10 bg-[#f0f2f5] rounded-lg flex-shrink-0">
                <p className="text-xs text-[#8f8f8f]">{event.date.split(' ')[0]}</p>
                <p className="text-sm font-semibold text-[#00833e]">
                  {event.date.split(' ')[1]}
                </p>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#333] truncate">{event.title}</p>
                <p className="text-xs text-[#8f8f8f]">{event.attendees} katılımcı</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Safety Status */}
      <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] overflow-hidden">
        <div className="p-4">
          <p className="text-sm font-semibold text-[#333] flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-[#00833e]" />
            Güvenlik Durumu
          </p>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-[#00833e] rounded-full animate-pulse" />
            <div className="flex-1">
              <p className="text-sm font-medium text-[#333]">Mahalle Güvenli</p>
              <p className="text-xs text-[#8f8f8f]">Son uyarı: 3 gün önce</p>
            </div>
          </div>
          <Link
            href="/uyarilar"
            className="mt-3 text-xs text-[#00833e] font-medium hover:text-[#006b32] flex items-center gap-1"
          >
            <AlertCircle className="w-3 h-3" />
            Tüm uyarıları görüntüle
          </Link>
        </div>
      </div>

      {/* Sponsored Business */}
      <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] overflow-hidden hover:shadow-md transition-shadow">
        <div className="relative h-32 bg-gradient-to-br from-[#00833e] to-[#006b32] overflow-hidden">
          <Image
            src="https://picsum.photos/300/128?random=1"
            alt="Moda Kafe & Bistro"
            fill
            unoptimized
            className="object-cover opacity-40"
          />
        </div>
        <div className="p-4">
          <p className="text-xs text-[#8f8f8f] font-semibold mb-2 uppercase">Sponsorlu</p>
          <p className="text-sm font-semibold text-[#333]">Moda Kafe & Bistro</p>
          <p className="text-xs text-[#8f8f8f] mt-1 mb-3">Kahvaltı ve brunch menüsü</p>
          <Link
            href="/isletme/moda-kafe"
            className="text-xs font-medium text-[#00833e] hover:text-[#006b32] flex items-center gap-1"
          >
            Sayfayı ziyaret et
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Business Promo Card */}
      <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] overflow-hidden">
        <div className="h-[160px] bg-gradient-to-br from-[#00833e] to-[#006b32] flex items-center justify-center">
          <Building2 className="w-16 h-16 text-white/40" />
        </div>
        <div className="p-4">
          <p className="text-[15px] font-bold text-[#333]">İşletme sahibi misiniz?</p>
          <p className="text-sm text-[#8f8f8f] mt-1">
            İşletme sayfanızı oluşturun, komşularınızla bağlantı kurun ve yeni müşteriler kazanın.
          </p>
        </div>
        <Link
          href="/isletme-ekle"
          className="flex items-center justify-between px-4 py-3 border-t border-[#e0e0e0] hover:bg-[#f9f9f9] transition-colors"
        >
          <span className="text-sm font-medium text-[#00833e]">Sayfa oluştur</span>
          <ChevronRight className="w-4 h-4 text-[#00833e]" />
        </Link>
      </div>

      {/* Footer links */}
      <div className="px-2 pt-2">
        <div className="flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-[#8f8f8f]">
          <Link href="/gizlilik" className="hover:text-[#404040]">
            Gizlilik
          </Link>
          <span>·</span>
          <Link href="/kosullar" className="hover:text-[#404040]">
            Koşullar
          </Link>
          <span>·</span>
          <Link href="/hakkinda" className="hover:text-[#404040]">
            Hakkında
          </Link>
        </div>
        <p className="text-[11px] text-[#8f8f8f] mt-1">© 2026 KomşuApp</p>
      </div>

      {/* Chats Widget - Bottom Right */}
      <div className="fixed bottom-0 right-4 w-[300px] z-40">
        <button className="w-full flex items-center justify-between px-4 py-3 bg-white border border-[#e0e0e0] border-b-0 rounded-t-lg shadow-lg hover:bg-[#f9f9f9] transition-colors">
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-bold text-[#333]">Sohbetler</span>
          </div>
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-[#404040]" />
            <ChevronUp className="w-4 h-4 text-[#404040]" />
          </div>
        </button>
      </div>
    </div>
  )
}
