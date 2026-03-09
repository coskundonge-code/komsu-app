'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Shield,
  ShoppingBag,
  Calendar,
  Users,
  MessageSquare,
  MapPin,
  Heart,
  Star,
  Menu,
  X,
  ArrowRight,
  Building2,
  Bell,
  Search,
  Home,
  Megaphone,
  HandHeart,
  Dog,
  Wrench,
  TreePine,
} from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'Güvenlik Uyarıları',
    description: 'Mahallenizdeki güvenlik olaylarından anında haberdar olun.',
    color: 'bg-red-100 text-red-600',
  },
  {
    icon: ShoppingBag,
    title: 'Pazar Yeri',
    description: 'Komşularınızla güvenle alışveriş yapın, ilan verin.',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: Calendar,
    title: 'Etkinlikler',
    description: 'Mahallenizdeki etkinlikleri keşfedin ve düzenleyin.',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    icon: Users,
    title: 'Gruplar',
    description: 'Ortak ilgi alanlarınıza göre gruplara katılın.',
    color: 'bg-amber-100 text-amber-600',
  },
  {
    icon: Building2,
    title: 'Yerel İşletmeler',
    description: 'Mahallenizdeki güvenilir işletmeleri bulun ve değerlendirin.',
    color: 'bg-emerald-100 text-emerald-600',
  },
  {
    icon: MessageSquare,
    title: 'Özel Mesajlaşma',
    description: 'Komşularınızla güvenli bir şekilde mesajlaşın.',
    color: 'bg-cyan-100 text-cyan-600',
  },
]

const categories = [
  { icon: Megaphone, label: 'Duyurular', count: '2.4K' },
  { icon: Shield, label: 'Güvenlik', count: '890' },
  { icon: HandHeart, label: 'Yardımlaşma', count: '1.2K' },
  { icon: Dog, label: 'Kayıp & Buluntu', count: '456' },
  { icon: Wrench, label: 'Tavsiyeler', count: '3.1K' },
  { icon: TreePine, label: 'Çevre', count: '678' },
]

const testimonials = [
  {
    name: 'Ayşe K.',
    neighborhood: 'Kadıköy, İstanbul',
    text: 'Kayıp kedimi KomşuApp sayesinde 2 saat içinde buldum! Komşularım hemen paylaştı.',
    avatar: 'AK',
  },
  {
    name: 'Mehmet Y.',
    neighborhood: 'Çankaya, Ankara',
    text: 'Mahallemizdeki güvenlik sorunlarını hep birlikte çözüyoruz. Muhtar bile kullanıyor!',
    avatar: 'MY',
  },
  {
    name: 'Zeynep D.',
    neighborhood: 'Bornova, İzmir',
    text: 'Pazar yerinden harika fırsatlar buluyorum. Komşularla alışveriş yapmak çok güvenli.',
    avatar: 'ZD',
  },
]

const stats = [
  { label: 'Aktif Mahalle', value: '12,500+' },
  { label: 'Kayıtlı Komşu', value: '2.1M+' },
  { label: 'Aylık Paylaşım', value: '850K+' },
  { label: 'Yerel İşletme', value: '45K+' },
]

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-white text-lg font-bold">K</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                Komşu<span className="text-emerald-600">App</span>
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#ozellikler" className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors">Özellikler</a>
              <a href="#nasil-calisir" className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors">Nasıl Çalışır</a>
              <a href="#yorumlar" className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors">Yorumlar</a>
              <Link href="/giris" className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors">Giriş Yap</Link>
              <Link href="/kayit" className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold rounded-full hover:from-emerald-600 hover:to-teal-700 transition-all shadow-md shadow-emerald-500/25">
                Ücretsiz Kaydol
              </Link>
            </div>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-3">
            <a href="#ozellikler" className="block py-2 text-gray-700 font-medium">Özellikler</a>
            <a href="#nasil-calisir" className="block py-2 text-gray-700 font-medium">Nasıl Çalışır</a>
            <a href="#yorumlar" className="block py-2 text-gray-700 font-medium">Yorumlar</a>
            <div className="pt-3 space-y-2 border-t border-gray-100">
              <Link href="/giris" className="block w-full text-center py-2.5 border border-gray-300 rounded-full font-medium text-gray-700">Giriş Yap</Link>
              <Link href="/kayit" className="block w-full text-center py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full font-semibold">Ücretsiz Kaydol</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-teal-200/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 lg:pt-24 lg:pb-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-emerald-100/80 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium">
                <MapPin size={16} />
                <span>Türkiye&apos;nin en büyük mahalle ağı</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Mahallende{' '}
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">birlikte</span>{' '}
                daha güzel
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 max-w-lg leading-relaxed">
                KomşuApp ile komşularınızı tanıyın, haberleşin, alışveriş yapın ve mahallenizdeki etkinliklere katılın. Güvenli ve sıcak bir topluluk sizi bekliyor.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/kayit" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-lg font-semibold rounded-full hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:-translate-y-0.5">
                  Hemen Başla <ArrowRight size={20} />
                </Link>
                <a href="#ozellikler" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 text-lg font-semibold rounded-full border-2 border-gray-200 hover:border-emerald-300 hover:text-emerald-600 transition-all">
                  Daha Fazla Bilgi
                </a>
              </div>

              <div className="flex flex-wrap gap-8 pt-4">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* App Preview */}
            <div className="relative">
              <div className="relative bg-white rounded-2xl shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs font-bold">K</span>
                    </div>
                    <span className="font-semibold text-sm text-gray-900">KomşuApp</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center"><Search size={14} className="text-gray-500" /></div>
                    <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center"><Bell size={14} className="text-gray-500" /></div>
                    <div className="w-7 h-7 bg-emerald-100 rounded-full flex items-center justify-center"><span className="text-emerald-700 text-xs font-bold">A</span></div>
                  </div>
                </div>

                <div className="p-4 space-y-3 bg-gray-50">
                  <div className="bg-white rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 bg-amber-100 rounded-full flex items-center justify-center"><span className="text-amber-700 text-sm font-bold">AK</span></div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Ayşe Kaya</p>
                        <p className="text-xs text-gray-500">Nişantaşı • 2 saat önce</p>
                      </div>
                      <span className="ml-auto px-2.5 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">Güvenlik</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">Mahallede yeni güvenlik kameraları kuruldu. Emeği geçen herkese teşekkürler!</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Heart size={14} className="text-red-500" /> 24</span>
                      <span className="flex items-center gap-1"><MessageSquare size={14} /> 8 yorum</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center"><span className="text-blue-700 text-sm font-bold">MY</span></div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Mehmet Yıldız</p>
                        <p className="text-xs text-gray-500">Nişantaşı • 4 saat önce</p>
                      </div>
                      <span className="ml-auto px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">Etkinlik</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">Cumartesi mahalle temizlik günü! Katılmak isteyen komşularımız buluşma noktasına gelsin.</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Heart size={14} className="text-red-500" /> 18</span>
                      <span className="flex items-center gap-1"><MessageSquare size={14} /> 12 yorum</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 bg-purple-100 rounded-full flex items-center justify-center"><span className="text-purple-700 text-sm font-bold">ZD</span></div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Zeynep Demir</p>
                        <p className="text-xs text-gray-500">Nişantaşı • 6 saat önce</p>
                      </div>
                      <span className="ml-auto px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">Pazar</span>
                    </div>
                    <p className="text-sm text-gray-700">Satılık bisiklet - az kullanılmış, uygun fiyat. İlgilenen komşular mesaj atabilir.</p>
                  </div>
                </div>

                <div className="bg-white border-t border-gray-100 px-6 py-3 flex items-center justify-around">
                  <div className="flex flex-col items-center gap-1"><Home size={18} className="text-emerald-600" /><span className="text-[10px] text-emerald-600 font-medium">Ana Sayfa</span></div>
                  <div className="flex flex-col items-center gap-1"><Search size={18} className="text-gray-400" /><span className="text-[10px] text-gray-400">Keşfet</span></div>
                  <div className="flex flex-col items-center gap-1"><ShoppingBag size={18} className="text-gray-400" /><span className="text-[10px] text-gray-400">Pazar</span></div>
                  <div className="flex flex-col items-center gap-1"><MessageSquare size={18} className="text-gray-400" /><span className="text-[10px] text-gray-400">Mesajlar</span></div>
                </div>
              </div>

              <div className="absolute -left-4 top-24 bg-white rounded-xl shadow-lg border border-gray-100 p-3 flex items-center gap-3 animate-pulse">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0"><Bell size={16} className="text-emerald-600" /></div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">Yeni bildirim</p>
                  <p className="text-[10px] text-gray-500">3 komşu sizi etiketledi</p>
                </div>
              </div>

              <div className="absolute -right-4 bottom-24 bg-white rounded-xl shadow-lg border border-gray-100 p-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0"><Star size={16} className="text-amber-600" /></div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">4.9 / 5.0</p>
                    <p className="text-[10px] text-gray-500">2.1M kullanıcı</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Mahallende neler oluyor?</h2>
            <p className="text-gray-600 mt-3">Her gün binlerce paylaşım, yüzlerce farklı konu</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon
              return (
                <div key={cat.label} className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-gray-50 hover:bg-emerald-50 border border-gray-100 hover:border-emerald-200 transition-all cursor-pointer group">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                    <Icon size={24} className="text-gray-600 group-hover:text-emerald-600 transition-colors" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-emerald-700">{cat.label}</span>
                  <span className="text-xs text-gray-400">{cat.count} paylaşım</span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="ozellikler" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full mb-4">Özellikler</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Mahalle yaşamı için her şey bir arada</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg">Komşularınızla bağlantı kurun, güvenliği artırın ve mahallenizi daha yaşanılır hale getirin.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className="group p-6 bg-white rounded-2xl border border-gray-100 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100/50 transition-all duration-300">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color}`}><Icon size={24} /></div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="nasil-calisir" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-teal-100 text-teal-700 text-sm font-medium rounded-full mb-4">Nasıl Çalışır</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">3 adımda mahallene bağlan</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: '01', title: 'Kaydol', description: 'E-mail adresinle ücretsiz kaydol ve mahalleni seç.', icon: '📝' },
              { step: '02', title: 'Komşularını Bul', description: 'Mahallendeki komşuları keşfet ve bağlantı kur.', icon: '🏘️' },
              { step: '03', title: 'Paylaş & Etkileşim', description: 'Gönderiler paylaş, etkinliklere katıl, pazar yerini kullan.', icon: '🎉' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center text-3xl mb-5">{item.icon}</div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Adım {item.step}</span>
                <h3 className="text-xl font-bold text-gray-900 mt-2 mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="yorumlar" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-amber-100 text-amber-700 text-sm font-medium rounded-full mb-4">Kullanıcı Yorumları</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Komşuların ne diyor?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (<Star key={i} size={16} className="text-amber-400 fill-amber-400" />))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">{t.avatar}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.neighborhood}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Mahalleni keşfetmeye hazır mısın?</h2>
          <p className="text-emerald-100 text-lg mb-10 max-w-2xl mx-auto">Binlerce komşu seni bekliyor. Hemen ücretsiz kaydol ve mahalle yaşamına katıl.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/kayit" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-emerald-600 text-lg font-semibold rounded-full hover:bg-gray-50 transition-all shadow-lg">
              Ücretsiz Kaydol <ArrowRight size={20} />
            </Link>
            <Link href="/giris" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-white text-lg font-semibold rounded-full border-2 border-white/30 hover:border-white/60 transition-all">
              Giriş Yap
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">K</span>
                </div>
                <span className="text-lg font-bold text-white">Komşu<span className="text-emerald-400">App</span></span>
              </div>
              <p className="text-sm leading-relaxed">Komşularınızla bağlantı kurun, güvenli bir topluluk oluşturun.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Ürün</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Özellikler</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Pazar Yeri</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">İşletmeler</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Etkinlikler</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Şirket</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Hakkımızda</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Kariyer</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">İletişim</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Destek</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Yardım Merkezi</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Gizlilik Politikası</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Kullanım Şartları</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Güvenlik</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm">&copy; 2026 KomşuApp. Tüm hakları saklıdır.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-emerald-400 transition-colors">Twitter</a>
              <a href="#" className="hover:text-emerald-400 transition-colors">Instagram</a>
              <a href="#" className="hover:text-emerald-400 transition-colors">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
