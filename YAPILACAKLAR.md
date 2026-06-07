# YAPILACAKLAR — Yayına Kadar Kalan İşler

> Bu dosya, uygulamanın canlıya/mağazaya çıkması için **kalan tüm işlerin** sade
> listesidir. "Kim yapacak" ve "ne zaman" ölçütüne göre üçe ayrıldı.
> Teknik ayrıntılar: `TECH_DEBT.md` · Operasyon: `RUNBOOK.md`
> Son güncelleme: 2026-06-08

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
- ⬜ **Blog içerik kararı:** Liste sayfasında 12 başlık var ama yalnızca 3'ünün
  gerçek yazısı yazılı. Kalan 9'u yazılacak mı, yoksa liste 3'e mi indirilecek?
- ⬜ **"deploy et" kararı:** `main`'e geçiş = canlıya çıkış. Yalnızca siz deyince.
- ⬜ **Google Vision API anahtarı** (AI görsel moderasyonunu açmak için — şiddetle önerilir):
  Google Cloud Console'da Vision API'yi etkinleştir → API key oluştur → `GOOGLE_CLOUD_VISION_API_KEY`
  olarak ENV'e gir (lokal `.env.local` + Vercel). Uç hazır; anahtar girilince otomatik devreye girer.
- ⬜ **Sentry DSN** (hata izlemeyi aktif etmek için — opsiyonel ama şiddetle önerilir).
- ⬜ **Supabase yedek planı:** Pro plan + PITR (anlık geri yükleme) açık mı doğrula.

---

## B) TEKNİK — YAYIN ÖNCESİ (ben/teknik yaparım, Faz 1)

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
- ⬜ **Lint borcu** (`TECH_DEBT #5`): kalan `any` kullanımı kademeli azaltılacak.

---

## C) TEKNİK — SONRAYA (Faz 2, aciliyeti yok)

- ⬜ **vitest@4 + rolldown** yükseltme (`TECH_DEBT #1`): test aracındaki 2 dev-only
  açık için; ekosistem olgunlaşınca.
- ⬜ **postcss zinciri** açıkları (`TECH_DEBT #2`): yeni Next sürümü çıkınca.
- ⬜ **Grup altyapısı** (`TECH_DEBT #12`): `groups.rules` kolonu, `group-images`
  depolama alanı, `group_posts` yazma politikası → grup gönderisi/kapak yükleme.
- ⬜ **SEO:** pazar kategori sayfalarını sunucu-render'a taşı (şu an istemci-fetch).
- ⬜ **Ölü kod temizliği:** kullanılmayan sahte `marketplace/payment-modal` dosyasını sil.

---

## ✅ Bu oturumda biten önemli işler (özet)

- ✅ Yasal metinler (KVKK/gizlilik/koşullar) güncel Türk mevzuatına göre yeniden
  yazıldı (`TECH_DEBT #15`).
- ✅ İşletim Kılavuzu `RUNBOOK.md` oluşturuldu.
- ✅ Sahte/mock veri yüzeylerinin büyük kısmı gerçeğe bağlandı; işletme paneli
  istatistik/performans/QR-tara sayfaları dürüst "yakında"ya çevrildi (`TECH_DEBT #12`).
- ✅ İki canlı tanrı-dosyasının **riskli iş mantığı** saf + test-edilir modüllere çıkarıldı:
  `pazar/ilan-ver` form/medya/kota → `services/listing-form.ts` (+37 test); `kayit`
  doğrulaması → `validations/auth.ts` + yasal modal bileşene (+10 test) (`TECH_DEBT #6`).
- ✅ İçerik şikâyet akışı gerçeğe bağlandı (`TECH_DEBT #13`).
- ✅ Hesap silme FK zinciri düzeltildi (`TECH_DEBT #14`).
- ✅ Kritik akışlara testler eklendi (194 test), CI kapıları sıkılaştırıldı (`#7`).
- ✅ Ödeme callback + kimlik doğrulama mantığı sertleştirilip test edildi (`#3, #14`).

> Detaylı gerekçe + kanıt için her madde yanındaki `TECH_DEBT #N`'e bak.
