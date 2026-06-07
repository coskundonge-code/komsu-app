# YAPILACAKLAR — Yayına Kadar Kalan İşler

> Bu dosya, uygulamanın canlıya/mağazaya çıkması için **kalan tüm işlerin** sade
> listesidir. "Kim yapacak" ve "ne zaman" ölçütüne göre üçe ayrıldı.
> Teknik ayrıntılar: `TECH_DEBT.md` · Operasyon: `RUNBOOK.md`
> Son güncelleme: 2026-06-07

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
- ⬜ **Sentry DSN** (hata izlemeyi aktif etmek için — opsiyonel ama şiddetle önerilir).
- ⬜ **Supabase yedek planı:** Pro plan + PITR (anlık geri yükleme) açık mı doğrula.

---

## B) TEKNİK — YAYIN ÖNCESİ (ben/teknik yaparım, Faz 1)

- ⬜ **AI görsel moderasyonu** (`TECH_DEBT #11`): `/api/moderate-media` ucu yok →
  şu an görseller AI ön-filtresinden geçmeden onaylanıyor (insan şikâyet hattı var).
  Bir AI vision sağlayıcısıyla (sağlayıcı + anahtar **sahip kararı**) inşa edilecek.
- ⬜ **Tanrı-dosyaları böl** (`TECH_DEBT #6`, görev #12): `kayit` (~1272 satır) ve
  `pazar/ilan-ver` (~1130). Kayıt/eDevlet hunisi en riskli — **sahip başındayken**
  çalışma-zamanı testi gerektirir.
- ⬜ **Tip güvenliği borcu** (`TECH_DEBT #4`): kalan tip uyarılarını erit.
- ⬜ **Kalan mock/sahte veri kalıntıları** (`TECH_DEBT #12`): büyük kısmı temizlendi;
  birkaç düşük-riskli son-kullanıcı sayfası kademeli temizlenecek (her biri test ister).
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
- ✅ Sahte/mock veri yüzeylerinin büyük kısmı gerçeğe bağlandı (`TECH_DEBT #12`).
- ✅ İçerik şikâyet akışı gerçeğe bağlandı (`TECH_DEBT #13`).
- ✅ Hesap silme FK zinciri düzeltildi (`TECH_DEBT #14`).
- ✅ Kritik akışlara testler eklendi (194 test), CI kapıları sıkılaştırıldı (`#7`).
- ✅ Ödeme callback + kimlik doğrulama mantığı sertleştirilip test edildi (`#3, #14`).

> Detaylı gerekçe + kanıt için her madde yanındaki `TECH_DEBT #N`'e bak.
