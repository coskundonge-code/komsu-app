# YAPILACAKLAR — Yayına Kadar Kalan İşler

> Bu dosya, uygulamanın canlıya/mağazaya çıkması için **kalan tüm işlerin** sade
> listesidir. "Kim yapacak" ve "ne zaman" ölçütüne göre üçe ayrıldı.
> Teknik ayrıntılar: `TECH_DEBT.md` · Operasyon: `RUNBOOK.md`
> Son güncelleme: 2026-06-09

İşaretler: ⬜ yapılacak · ✅ yapıldı · 🔴 yayın engeli (bu olmadan canlıya çıkılmaz)

---

## A) SADECE SAHİP / AVUKAT YAPABİLİR (ben yapamam — yayın öncesi zorunlu)

- 🔴 ⬜ **Şirket sicil bilgileri** yasal metinlere işlenecek: tam ticari unvan,
  **açık adres**, **MERSİS no**, **VERBİS kayıt no**, **KEP adresi**.
  (Şu an `/kvkk` sayfasında sarı "yayın öncesi tamamlanacak" notuyla bekliyor.)
- 🔴 ⬜ **Avukat onayı:** `/kvkk`, `/gizlilik`, `/kosullar` üç metni bir avukat
  gözden geçirip onaylamalı.
- 🔴 ⬜ **VERBİS kaydı** (veri sorumlusu sicili — yasal eşik aşılıyorsa zorunlu).
- 🔴 ⬜ **PayTR canlı anahtarları:** Merchant ID / Key / Salt girilecek,
  `PAYTR_TEST_MODE=false` yapılacak ve **küçük bir tutarla uçtan uca test** edilecek.
  (Anahtar girilene kadar ödeme "simülasyon modunda" — hiçbir şey tahsil etmez.)
- ⬜ **Ürün kararı (para modeli):** İlan vermek / öne çıkarmak ücretli mi olacak,
  yoksa yalnızca işletme aboneliği mi? (İlan şu an ücretsiz yayınlanıyor.)
- ✅ **Blog içerik kararı (2026-06-09 — sahip "içerik kararı senin, tamamla" dedi):** Liste 3 gerçek
  yazıya indirildi (sahte 9 başlık + ölü `#post-<id>` çapaları kaldırıldı). Sonradan yeni yazı yazmak
  isterseniz `blog/[slug]/page.tsx` içine ekleyip liste + `allArticles`'a bir satır eklemek yeterli.
- ⬜ **"deploy et" kararı:** `main`'e geçiş = canlıya çıkış. Yalnızca siz deyince.
- ⬜ **Google Vision API anahtarı** (AI görsel moderasyonunu açmak için — şiddetle önerilir):
  Google Cloud Console'da Vision API'yi etkinleştir → API key oluştur → `GOOGLE_CLOUD_VISION_API_KEY`
  olarak ENV'e gir (lokal `.env.local` + Vercel). Uç hazır; anahtar girilince otomatik devreye girer.
- ⬜ **Google ile giriş (OAuth):** Supabase Panel → Authentication → Providers → **Google**'ı aç +
  Google Cloud Console'dan OAuth Client ID/Secret gir. Yetkili yönlendirme adresi:
  `https://dogjnzcofvpsqbepdaek.supabase.co/auth/v1/callback`. Açılana kadar "Google ile kaydol/giriş"
  butonu `provider is not enabled` hatası verir (kod doğru — yalnızca ayar eksik). (2026-06-08 tespit edildi)
- ⬜ **Sentry DSN** (hata izlemeyi aktif etmek için — opsiyonel ama şiddetle önerilir).
- ⬜ **Supabase yedek planı:** Pro plan + PITR (anlık geri yükleme) açık mı doğrula.

---

## B) TEKNİK — YAYIN ÖNCESİ (ben/teknik yaparım, Faz 1)

- ✅ **GÜVENLİK — yetki yükseltme açığı KAPATILDI (KRİTİK, 2026-06-09 sahip onayıyla uygulandı):**
  Eskiden herhangi bir kayıtlı kullanıcı kendi profilinde `is_admin` / `account_locked` kolonunu
  doğrudan değiştirip **kendini yönetici yapabiliyordu** (ya da kendi kilidini açabiliyordu).
  Uygulanan düzeltme (canlı DB migration): (1) kullanıcının kendi `is_admin`/`account_locked`
  alanını değiştirmesini engelleyen `BEFORE UPDATE` trigger (`guard_profile_privileged_columns`,
  SECURITY INVOKER); (2) admin panelinin başkalarını kilitleyip yetkilendirebilmesi için "adminler
  tüm profilleri güncelleyebilir" RLS politikası; RLS özyinelemesini önlemek için
  `is_current_user_admin()` (SECURITY DEFINER, pinned `search_path`). Ek sertleştirme: RPC `EXECUTE`
  yetkisi `public`/`anon`'dan alındı, yalnızca `authenticated`'a verildi. `get_advisors`(security)
  ile doğrulandı — açık kapandı.
- ✅ **Mesajlar sayfası iki bug DÜZELTİLDİ (`mesajlar/page.tsx`, 2026-06-09):** (1) sohbet listesi +
  sohbet ekranı ana bileşenin içinde tanımlıydı → her tuş vuruşunda yeniden kuruluyor, imleç/odak
  kayıyordu; alt bileşenler modül seviyesine taşındı (props ile). (2) `?selected=` parametresi
  `useSearchParams` ile okunup doğru sohbet otomatik açılıyor; Next 16 gereği sayfa `<Suspense>` ile
  sarıldı. tsc + 254 test + `next build` geçti.

- ✅ **AI görsel moderasyonu — uç inşa edildi** (`TECH_DEBT #11`): `/api/moderate-media`
  Google Vision SafeSearch ile yazıldı, eşikleri test edildi (13 test). **Kalan tek adım
  sahipte** (A bölümüne taşındı): Vision API anahtarını girmek. Anahtar girilene kadar
  moderasyon dürüstçe "kapalı" — yükleme engellenmez, insan şikâyet hattı yedek.
- ⬜ **Tanrı-dosyaları böl** (`TECH_DEBT #6`): Riskli iş mantığı ✅ çıkarıldı + test edildi
  — `kayit` doğrulaması → `validations/auth.ts` (commit `16039c5`), `pazar/ilan-ver`
  form/medya/kota mantığı → `services/listing-form.ts` (commit `8971ccf`); +47 test eşikleri
  kilitledi. **Kalan:** iki sayfa hâlâ uzun (1049/1057 satır, çoğu JSX) — uzun JSX'i
  alt-bileşenlere bölme + `kayit` auth/eDevlet runtime yolu **sahip başındayken** yapılır.
- ✅ **Tip güvenliği** (`TECH_DEBT #4`): tip HATASI borcu kapandı — taze
  `tsc --noEmit --incremental false` 0 hata + `next build` (`ignoreBuildErrors:false`)
  geçiyor. Kalan `any` **lint** uyarıları ayrı + informational (aşağıda, `TECH_DEBT #5`).
- ⬜ **Kalan mock/sahte veri kalıntıları** (`TECH_DEBT #12`): büyük kısmı temizlendi —
  işletme paneli istatistik/performans/QR-tara sayfaları da bu turda dürüst "yakında"ya
  çevrildi; geriye yalnızca birkaç düşük-riskli son-kullanıcı fallback'i kaldı.
- ✅ **Ödünç/kiralık ilan formu fotoğraf + mahalle bug'ı DÜZELTİLDİ** (`TECH_DEBT #16`, 2026-06-09):
  `odunc-kirala/ilan-ver` artık fotoğrafları `uploadMultipleMedia` ile `listing-images` kovasına
  gerçekten yüklüyor (eskiden blob: önizleme kaydedip ölü bağlantı bırakıyordu); mahalle sabit id
  yerine `neighborhood_members`'tan kullanıcıya göre çözülüyor (mahallesiz kullanıcı uyarılıp
  engelleniyor); depozito + azami süre alanları da doğru kaydediliyor. **Kalan tek doğrulama:**
  tarayıcıda uçtan uca fotoğraf yükleme denemesi (sahip başındayken bir kez bakılması iyi olur).
- ⬜ **Lint borcu** (`TECH_DEBT #5`): kalan `any` kullanımı kademeli azaltılacak.

---

## C) TEKNİK — SONRAYA (Faz 2, aciliyeti yok)

- ⬜ **vitest@4 + rolldown** yükseltme (`TECH_DEBT #1`): test aracındaki 2 dev-only
  açık için; ekosistem olgunlaşınca.
- ⬜ **postcss zinciri** açıkları (`TECH_DEBT #2`): yeni Next sürümü çıkınca.
- ⬜ **Grup altyapısı** (`TECH_DEBT #12`): `groups.rules` kolonu, `group-images`
  depolama alanı, `group_posts` yazma politikası → grup gönderisi/kapak yükleme.
- ⬜ **SEO:** pazar kategori sayfalarını sunucu-render'a taşı (şu an istemci-fetch).
- ⬜ **Ölü kod temizliği:** `feed/post-form.tsx` + `feed/comment-section.tsx` ✅ silindi
  (2026-06-08 — ölü bileşenler, hiçbir yerden çağrılmıyordu). **Kalan:** sahte
  `marketplace/payment-modal` — `pazar/odeme` redirect-stub'ının `_PaymentPageLegacy`
  referansından import ediliyor; silmek ödeme alanı + legacy-referans kararı (düşük öncelik).

---

## ✅ Bu oturumda biten önemli işler (özet)

- ✅ **(2026-06-09) Yetki yükseltme güvenlik açığı kapatıldı** (KRİTİK): kullanıcı artık kendini
  yönetici yapamaz / kendi kilidini açamaz. Trigger + RLS politikası + SECURITY DEFINER admin kontrolü
  + RPC yetki sertleştirmesi canlı DB'ye uygulandı; advisor ile doğrulandı. (B bölümü)
- ✅ **(2026-06-09) Mesajlar iki bug düzeltildi:** mesaj yazarken imleç kaçması (gereksiz yeniden
  kurulum) + başka sayfadan gelince doğru sohbetin açılmaması (`?selected`). (B bölümü)
- ✅ **(2026-06-09) Ödünç/kiralık ilan formu** artık fotoğrafları gerçekten yüklüyor + ilanı doğru
  mahalleye yazıyor + depozito/süre kaydediyor. (`TECH_DEBT #16`)
- ✅ **(2026-06-09) Blog** 3 gerçek yazıya indirildi, ölü bağlantılar (`#post-<id>` + var olmayan
  "benzer yazılar") kaldırıldı. (A bölümü içerik kararı)
- ✅ **Admin paneline sunucu-taraflı `is_admin` kapısı eklendi** (`middleware.ts`): eskiden giriş
  yapan HERKES `/admin/*` adresini açıp tüm kullanıcıların kişisel verisini görebiliyordu (ciddi
  KVKK riski). Artık admin olmayan kullanıcı ana sayfaya yönlendiriliyor — sayfa-içi kontrole değil,
  middleware'e dayanan asıl kapı.
- ✅ **Next 16 dinamik sayfa çökmeleri düzeltildi** (`use(params)`): `pazar/kategori/[slug]`
  (açılışta çöküyordu), `odunc-kirala/[id]` ve `blog/[slug]` (her zaman "bulunamadı" diyordu).
- ✅ **Bozuk Türkçe (mojibake) düzeltildi:** `hesap-kilitli`, `(business)/error`, `(admin)/error`
  sayfalarındaki bozuk karakterler ("HesabÄ±nÄ±z" gibi) temiz UTF-8'e çevrildi.
- ✅ Yasal metinler (KVKK/gizlilik/koşullar) güncel Türk mevzuatına göre yeniden
  yazıldı (`TECH_DEBT #15`).
- ✅ İşletim Kılavuzu `RUNBOOK.md` oluşturuldu.
- ✅ Sahte/mock veri yüzeylerinin büyük kısmı gerçeğe bağlandı; işletme paneli
  istatistik/performans/QR-tara sayfaları dürüst "yakında"ya çevrildi (`TECH_DEBT #12`).
- ✅ İki canlı tanrı-dosyasının **riskli iş mantığı** saf + test-edilir modüllere çıkarıldı:
  `pazar/ilan-ver` form/medya/kota → `services/listing-form.ts` (+37 test); `kayit`
  doğrulaması → `validations/auth.ts` + yasal modal bileşene (+10 test) (`TECH_DEBT #6`).
- ✅ İki ölü `feed/` bileşeni (`post-form.tsx`, `comment-section.tsx`) silindi —
  hiçbir yerden tüketilmiyordu; SADELİK temizliği, 254 test geçer (`TECH_DEBT #12`).
- ✅ İçerik şikâyet akışı gerçeğe bağlandı (`TECH_DEBT #13`).
- ✅ Hesap silme FK zinciri düzeltildi (`TECH_DEBT #14`).
- ✅ Kritik akışlara testler eklendi (194 test), CI kapıları sıkılaştırıldı (`#7`).
- ✅ Ödeme callback + kimlik doğrulama mantığı sertleştirilip test edildi (`#3, #14`).

> Detaylı gerekçe + kanıt için her madde yanındaki `TECH_DEBT #N`'e bak.
