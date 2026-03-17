# Mahallem - Mahalle Sosyal Agi

Mahallem, mahallenizde yaşayan komşularınızla bağlantı kurmak, ilan paylaşmak, etkinliklere katılmak ve yerel işletmeleri keşfetmek için tasarlanmış bir mahalle sosyal ağı uygulamasıdır. Nextdoor benzeri bir platform olarak, topluluğu bir araya getirmek ve mahalle yaşamını kolaylaştırmayı amaçlar.

## Özellikler

### Ana Özellikler

- **Mahalle Feed** - Komşularınızla yazı paylaşın, beğeni yapın, yorum yazın ve tartışmalara katılın
- **Pazar Yeri** - Eşya satın alın, satın veya kirala. İlanları kolayca oluşturun ve yönetin
- **Etkinlikler** - Mahalle etkinlikleri oluşturun, duyurun ve RSVP yapın
- **Gruplar** - Belirli konular veya çıkarlar etrafında mahalle grupları oluşturun ve yönetin
- **İşletme Rehberi** - Mahallenizdeki yerel işletmeleri keşfedin, yorumlar okuyun ve değerlendirme yapın
- **Mesajlaşma** - Komşularınızla bire bir özel mesajlaşma yapın
- **Bildirimler** - In-app bildirimler ile her zaman güncel kalın
- **Blog** - Önemli duyurular, makaleler ve rehberleri yayınlayın
- **Güvenlik Merkezi** - Mahallenizdeki güvenlik ve sosyal konularını gözden geçirin
- **Admin Paneli** - Kullanıcı yönetimi, moderasyon, raporlar ve site yönetimi
- **İşletme Paneli** - İşletme sahibi paneli, istatistikler, reklam yönetimi ve müşteri yorumlarını yönetin

## Teknoloji Stack

- **Next.js 16** - App Router ve Turbopack ile modern React framework
- **TypeScript** - Tip güvenliği ve geliştirici deneyimi
- **Tailwind CSS** - Responsive ve özelleştirilebilir tasarım
- **Supabase** - Backend as a Service (Authentication, Database, Storage, Realtime)
- **Zustand** - Hafif state management çözümü
- **React Hook Form** - Form yönetimi ve doğrulama
- **TanStack React Query** - Veri fetching ve caching
- **Radix UI** - Erişilebilir UI bileşenleri
- **Lucide React** - SVG icon library
- **Vercel** - Hosting ve deployment

## Kurulum

### Ön Koşullar

- Node.js 18.0 veya üstü
- npm veya yarn paket yöneticisi
- Git

### Adımlar

1. **Projeyi klonlayın:**
   ```bash
   git clone https://github.com/yourusername/mahallem-app-dev.git
   cd mahallem-app-dev
   ```

2. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

3. **Ortam değişkenlerini ayarlayın:**
   ```bash
   cp .env.example .env.local
   ```

4. **.env.local dosyasını düzenleyin:**
   - Supabase URL ve anon key değerlerini doldurun
   - Google Maps API key (isteğe bağlı)
   - E-posta servisi yapılandırması (isteğe bağlı)
   - Firebase konfigürasyonu (isteğe bağlı)

5. **Geliştirme sunucusunu başlatın:**
   ```bash
   npm run dev
   ```

6. **Tarayıcıda açın:**
   ```
   http://localhost:3000
   ```

## Ortam Değişkenleri

`.env.example` dosyasında tüm ortam değişkenlerinin örnekleri bulunmaktadır. Aşağıdaki değişkenleri `.env.local` dosyasında konfigüre etmeniz gerekir:

### Zorunlu Değişkenler

- `NEXT_PUBLIC_SUPABASE_URL` - Supabase proje URL'si
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

### İsteğe Bağlı Değişkenler

- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Google Maps harita özelliği için
- `RESEND_API_KEY` - E-posta gönderimi için
- `NEXT_PUBLIC_FIREBASE_API_KEY` - Push bildirim için
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` - Push bildirim için

## Proje Yapısı

```
mahallem-app-dev/
├── src/
│   ├── app/                    # Next.js App Router uygulaması
│   │   ├── (admin)/            # Admin paneli sayfaları
│   │   ├── (auth)/             # Kimlik doğrulama sayfaları
│   │   ├── (business)/         # İşletme paneli sayfaları
│   │   ├── (main)/             # Ana uygulamaya ait sayfalar
│   │   └── api/                # API route'ları
│   ├── components/             # React bileşenleri
│   │   ├── alerts/             # Uyarı ve toast bileşenleri
│   │   ├── business/           # İşletme rehberi bileşenleri
│   │   ├── events/             # Etkinlik bileşenleri
│   │   ├── feed/               # Mahalle feed bileşenleri
│   │   ├── groups/             # Grup bileşenleri
│   │   ├── layout/             # Layout bileşenleri
│   │   ├── marketplace/        # Pazar yeri bileşenleri
│   │   ├── messaging/          # Mesajlaşma bileşenleri
│   │   ├── notifications/      # Bildirim bileşenleri
│   │   ├── shared/             # Paylaşılan bileşenler
│   │   ├── ui/                 # UI bileşenleri (Radix UI)
│   │   └── widgets/            # Widget bileşenleri
│   ├── lib/                    # Yardımcı kütüphane fonksiyonları
│   │   ├── hooks/              # Custom React hooks
│   │   ├── stores/             # Zustand store'ları
│   │   ├── supabase/           # Supabase client ve utilities
│   │   └── utils/              # Utility fonksiyonları
│   └── public/                 # Statik dosyalar (resimler, svg vb.)
├── .env.example                # Ortam değişkenleri örneği
├── package.json                # Proje bağımlılıkları
├── next.config.ts              # Next.js konfigürasyonu
├── tailwind.config.ts          # Tailwind CSS konfigürasyonu
└── tsconfig.json               # TypeScript konfigürasyonu
```

## Geliştirme

### Kullanılabilir Komutlar

```bash
# Geliştirme sunucusunu başlat (hot reload ile)
npm run dev

# Üretim için inşa et
npm run build

# Üretim sunucusunu başlat
npm start

# ESLint ile kodu kontrol et
npm run lint
```

### Branching Stratejisi

Bu proje aşağıdaki branch yapısını takip eder:

- `main` - Üretim (production) branch'i
- `develop` - Entegrasyon branch'i
- `coskun` - Coşkun'un geliştirme branch'i
- `onur` - Onur'un geliştirme branch'i

### Commit Kuralları

- Anlamlı commit mesajları yazın
- Her commit mantıksal bir değişikliği içermelidir
- Türkçe veya İngilizce kullanabilirsiniz

## Deployment

Proje Vercel'de barındırılmaktadır. Deployment otomatiktir:

1. `main` branch'e push yapıldığında, üretim sitesi otomatik olarak güncellenir
2. `develop` branch'e push yapıldığında, preview ortamı güncellenir

### Manuel Deployment

```bash
# Vercel CLI ile deploy (eğer kuruluysa)
vercel
```

## Supabase Entegrasyonu

Bu proje Supabase kullanmak üzere hazırlanmıştır ancak henüz bağlantı yapılmamıştır. Supabase entegrasyonu için:

1. [Supabase](https://supabase.com) hesabı oluşturun
2. Yeni bir proje oluşturun
3. URL ve anon key'i `.env.local` dosyasına ekleyin
4. Veritabanı migration'larını çalıştırın
5. Authentication'ı konfigüre edin

## Lisans

Bu proje tescilli (proprietary) yazılımdır. Tüm hakları saklıdır. Herhangi bir izin olmadan kopyalanması, dağıtılması veya kullanılması yasaktır.

## İletişim

Sorunlar, öneriler veya soru için lütfen proje yöneticisine başvurun.

---

**Son Güncelleme:** 10 Mart 2026
