# Öneri: Kademeli Doğrulama ve İşlem Kapıları Sistemi

Tarih: 2026-06-11 · Durum: ✅ **UYGULANDI** (aynı gün, sahip onayı + revizyonuyla)
Hazırlık: 3 paralel kod-keşif ajanı + canlı Supabase şema sorguları.

## ✅ UYGULAMA SONUCU (2026-06-11)

**Sahip revizyonu:** Mahalleli (S1) seviyesi de YALNIZCA gezer/okur — "adres
doğrulamadan etkileşim olmamalı." Buna göre kapı matrisi sadeleşti:
**görüntüleme serbest, HER etkileşim Doğrulanmış Komşu (S2) ister.**

Uygulananlar:
- **Sunucu kapıları (4 migration):** `is_verified_neighbor()` tek doğruluk kaynağı;
  15 INSERT politikası (posts, comments, reactions, events, event_attendees,
  listings, lending_items, donations, help_requests, groups, group_members,
  business_reviews, poll_votes, conversations, messages) + `claim_donation` ve
  `get_or_create_direct_conversation` RPC kapıları. 8 GEVŞEK politika kaldırıldı
  (6 `auth.role()='authenticated'` INSERT + 2 `USING(true)` businesses SELECT —
  permissive OR kapıyı deliyordu).
- **Bonus düzeltme:** Komşuma Yardım "Yardım Et" RLS'te hiç çalışmıyordu
  (donations claim bug'ının aynısı) → atomik `offer_help` RPC + UI bağlandı.
- **UI:** Ortak `VerificationRequiredModal` + `useVerificationGate` hook'u; 12
  yüzeye bağlandı (feed composer/beğeni/yorum, gönderi detayı, etkinlik
  liste/detay RSVP + oluşturma, grup oluşturma, pazar + ödünç ilan-ver, askıda
  bırak/al, komşuma yardım, mesajlar/new, VerifiedMessageButton). Banner yeni
  modeli anlatıyor; middleware'den 7 gün/kilit mantığı kaldırıldı (konum seçimi
  zorunlu kalmaya devam — belgesiz, 1 dk).
- **İşletme:** `verification_status/vkn/business_type` kolonları +
  `business_verifications` kuyruğu + guard trigger (sahip kendini doğrulayamaz)
  + yayın kapısı (doğrulanmamış işletme halka görünmez) + kayıt sihirbazında
  "Doğrulama & Onay" adımı (belge türü + VKN + barkod; belge dosyası saklanmaz)
  + admin onay/ret ekranı + **trial onay anında sunucuda başlar**.
- **Test kanıtı:** SQL JWT simülasyonu (doğrulanmamış→posts RLS reddi,
  claim/mesaj→VERIFICATION_REQUIRED; doğrulanmış→kabul) + gerçek tarayıcı
  (doğrulanmamış Deniz: beğeni/gönderi/askıda → kapı modalı, DB sızıntısı 0;
  doğrulanmış Ayşe: bannersız, kapısız etkileşim; işletme: Zeynep başvuru →
  pending → halka gizli → admin onayı → verified + listede). tsc 0 · 268/268 ·
  build 0.

Bilinen sınırlar / notlar:
- Sahip (Coşkun) ve Arzu hesapları DOĞRULANMAMIŞ — uygulamada ~2 dk'lık
  e-Devlet doğrulaması yapmadan etkileşim kuramazsınız (kapılar herkese eşit).
- Yeni doğrulanmamış test hesabı: `test.dogrulanmamis@mahallemiz.test` (şifre
  diğer test hesaplarıyla aynı).
- İşletme kayıt formunun görselli adımları (1-3) tarayıcıda elle test edilmedi
  (dosya yükleme otomasyonu); adım 4 alanları + RPC sunucuda doğrulandı.
- Grup "katıl" butonu zaten yalnızca görseldi (DB'ye yazmıyor) — sunucu kapısı
  hazır, UI bağlantısı ayrı iş.
- Eski mock /isletmeler liste verisi DB'den geliyorsa bile artık yalnız
  doğrulanmış işletmeler döner; donations kartlarında doğrulanmamış işletme
  adı null görünebilir (kabul edildi).

---

## 0. Sahibin istediği

1. Kayıtta e-Devlet adres doğrulaması **zorunlu olmasın** (çok kullanıcı alabilmek için).
2. Satma / alma / kiralama / ödünç / askıda bağış verme-alma / **mesajlaşma** için
   adres doğrulaması **şart olsun** — yapmayan sistemde gezebilsin ama bu işlemleri yapamasın.
3. İşletmeler için doğrulama **kesin zorunlu**; şirket üzerine adres doğrulama sistemi kurulsun.

## 1. Mevcut durumun özeti (keşif bulguları)

**İyi haber: altyapının ~%70'i zaten hazır.**

| Bulgu | Detay |
|---|---|
| e-Devlet zaten fiilen opsiyonel | `edevlet_verification_deadline` hiçbir yerde otomatik set edilmiyor; banner görünüyor ama kimse kilitlenmiyor. İstenen model #1 fiilen mevcut — sadece bilinçli hale getirilmeli. |
| Kişi doğrulama motoru çalışıyor | e-Devlet "Yerleşim Yeri Belgesi" barkod+TC → turkiye.gov.tr üzerinden teyit → `profiles.edevlet_verified_at`. Belge/TC kalıcı saklanmıyor (KVKK uyumlu). Başarısızlar `address_verifications` admin kuyruğuna düşüyor. |
| UI'da kapı var, SUNUCUDA YOK | `VerifiedMessageButton` mesaj öncesi kontrol yapıyor ama RPC'de tekrar yok → teknik bilen biri kapıyı atlayabilir. İlan verme, askıda, yardım, etkinlikte hiç kapı yok. |
| Kapı kaynağı tutarsız | UI `neighborhood_members` tablosuna bakıyor; asıl doğruluk kaynağı `profiles.edevlet_verified_at` olmalı. Tek kaynağa indirilmeli. |
| İşletme tarafı zayıf | Tek alan: `is_verified` (admin elle basıyor). VKN yok, belge yok, adres kanıtı yok. Doğrulanmamış işletme de listede yayında. Kayıt sonrası 3 ay trial otomatik başlıyor. |
| Admin ekranları çalışıyor | admin/dogrulama (kişi adres kuyruğu) + admin/isletmeler (elle doğrula/kaldır) işlevsel — işletme belge kuyruğu eklenebilir temel var. |

Not: Ajanların migration dosyalarından işaretlediği "slug yok / neighborhood_id zorunlu" tarzı
uyarılar canlı DB'de DOĞRU DURUMDA (canlı şema sorgulandı; kod canlıyla uyumlu, repo'daki
migration dosyaları eski). Tek gerçek tutarsızlık yukarıdaki kapı-kaynağı meselesi.

## 2. Önerilen model: 3 seviyeli güven sistemi

```
Seviye 0 — KAYITLI        e-posta onayı           → gez, oku, izle
Seviye 1 — MAHALLELİ      mahalle seçimi (1 dk,   → feed'e yaz, yorum yap,
                          belgesiz; bugün zaten      etkinliğe katıl, grup üyeliği
                          zorunlu olan adım)
Seviye 2 — DOĞRULANMIŞ    e-Devlet yerleşim yeri  → TÜM İŞLEMLER: ilan ver/al,
KOMŞU ✓ (rozet)           belgesi (mevcut motor)     kirala, ödünç, askıda ver/al,
                                                     yardım iste/et, MESAJLAŞ,
                                                     etkinlik OLUŞTUR
İŞLETME ✓✓ (rozet)        Seviye 2 sahip + işletme → işletme profili YAYINA girer,
                          belgeleri + admin onayı    panel/ilan/reklam hakları
```

### Kapı matrisi (önerilen)

| İşlem | S0 | S1 | S2 | Gerekçe |
|---|---|---|---|---|
| Feed/ilan/etkinlik GÖRÜNTÜLEME | ✓ | ✓ | ✓ | Büyüme: içerik herkese açık (hassas alanlar hariç) |
| Feed gönderi + yorum | – | ✓ | ✓ | Tutundurma kancası; spam'e karşı hız limiti var |
| Etkinliğe katılım (RSVP) | – | ✓ | ✓ | Kalabalık/açık etkinlik, düşük risk |
| İlan verme (pazar + ödünç/kiralık) | – | – | ✓ | Sahibin isteği |
| Alıcı olarak iletişim / mesajlaşma (başlatma) | – | – | ✓ | Sahibin isteği; dolandırıcılık ana kanalı kapanır |
| Askıda bağış bırakma / alma | – | – | ✓ | Sahibin isteği |
| Komşuma Yardım talep / yardım teklifi | – | – | ✓ | Fiziksel temas içerir |
| Etkinlik OLUŞTURMA | – | – | ✓ | Adres paylaşımı + fiziksel buluşma sorumluluğu |
| İşletme profili yayını + panel hakları | – | – | – | Yalnız İŞLETME ✓✓ |

Mesajlaşma notu: Kapı yalnızca SOHBET BAŞLATMADA değil, sunucuda mesaj yazma anında da
doğrulanır (S2 olmayan birinin eski sohbeti de yazamaz). Görüntüleme serbest kalabilir.

## 3. Uygulama mimarisi — 3 katman (savunma derinliği)

1. **UI (kibar katman):** Kapılı butona basan S2-altı kullanıcıya modal:
   "Bu işlem için adres doğrulaması gerekiyor — ~2 dakika sürer" + [Şimdi Doğrula] →
   /adres-dogrulama?next=geldiği-sayfa. Doğrulanmışlara "Doğrulanmış Komşu ✓" rozeti
   (profilde + ilanlarda + mesajda). Rozet sosyal baskı yaratır, doğrulamayı kendiliğinden artırır.
2. **Middleware (yönlendirme):** Yalnızca tam-kapılı sayfalar (ör. /mesajlar, ilan-ver
   formları) için yumuşak yönlendirme. Mevcut hesap-kilitli/deadline mantığı kişiler
   için TAMAMEN KALKAR (kapı modeli onun yerine geçer).
3. **Sunucu (asıl güvenlik — atlanamaz):** Tek doğruluk kaynağı `profiles.edevlet_verified_at`,
   tek yardımcı: `is_verified_neighbor(uid)` (SECURITY DEFINER). Kapı konacak yerler
   (keşif ajanının dosya:satır tespitleriyle):
   - `get_or_create_direct_conversation` RPC + `messages` INSERT politikası (mesajlaşma)
   - `listings` INSERT politikası (pazar ilanı) — quota RPC'siyle birleşebilir
   - `lending_items` INSERT (ödünç/kiralık)
   - `donations` INSERT + `claim_donation` RPC (askıda ver/al)
   - `help_requests` INSERT + helper UPDATE (yardım)
   - `events` INSERT (etkinlik oluşturma)
   `neighborhood_members` UI kontrolü bu yardımcıya geçirilir (tutarsızlık kapanır).

## 4. İşletme doğrulama tasarımı (sahibin 3. sorusu)

### İlke: kişi + işletme + adres = 3 kanıt zinciri

**Akış (kayıt sihirbazına 5. adım olarak "Doğrulama"):**

1. **Ön koşul — sahip kişisel S2:** İşletme ekleyen kullanıcı önce kendi e-Devlet
   doğrulamasını yapmış olmalı (mevcut motor, ek geliştirme yok).
2. **İşletme belgesi (zorunlu, türe göre):**
   - Şahıs şirketi / esnaf → **Vergi Levhası** (VKN + unvan + işyeri adresi içerir;
     GİB İnteraktif Vergi Dairesi'nden doğrulanabilir) VEYA e-Devlet barkodlu
     **Esnaf Sicil / Oda Faaliyet Belgesi** (mevcut barkod-doğrulama motoru yeniden kullanılır).
   - Ltd/AŞ → Vergi Levhası + **MERSİS no** (+ imza yetkisi için Ticaret Sicil
     Gazetesi/faaliyet belgesi; sahibin adı yetkili listesinde aranır).
3. **Otomatik çapraz kontroller (OCR + mevcut eşleştirme altyapısı):**
   - Levhadaki unvan ↔ kayıttaki işletme adı (normalize benzerlik)
   - Levhadaki işyeri adresi ↔ formdaki adres + seçilen mahalle (%60+ kelime eşleşmesi
     — kişi tarafındaki compareAddresses mantığı yeniden kullanılır)
   - Şahıs işletmesinde levhadaki ad-soyad ↔ sahibin e-Devlet'li adı
4. **Admin onay kuyruğu:** Otomatik kontroller skor üretir; admin/dogrulama ekranına
   "İşletmeler" sekmesi → belge + skor + Onayla/Reddet (sebep). Düşük hacimde insan
   onayı en güvenli yoldur; otomasyona güven arttıkça eşik gevşetilir.
5. **Sonuç:** `verification_status='verified'` → profil yayına girer + "Doğrulanmış
   İşletme ✓✓" rozeti. Reddedilirse sebep gösterilir, yeniden başvuru açık.

**Yayın politikası (öneri):** Doğrulanmamış işletme profili YAYINLANMAZ (sahibi
panelde "onay bekliyor" görür, halk görmez). Trial süresi admin ONAYINDAN sonra
başlar (bugün kayıt anında başlıyor — onay beklerken deneme süresi yanmasın).

**Opsiyonel güçlendirmeler (başlangıçta gereksiz):** işyeri sabit hattını arama/SMS
kodu; Google tarzı posta-kartı PIN; konumda çekilmiş tabela fotoğrafı. Suistimal
görülürse eklenir.

### Şema değişikliği (öneri)

```sql
-- businesses'a: verification_status text default 'unverified'
--   ('unverified'|'pending'|'verified'|'rejected'), verified_at, vkn (text, UNIQUE),
--   mersis_no (text, null), business_type ('sahis'|'sirket')
-- Yeni tablo: business_verifications (başvuru kuyruğu)
--   id, business_id, document_type, document_barcode, ocr_unvan, ocr_adres,
--   match_score, status, reviewed_by, rejected_reason, created_at
-- Belge DOSYASI saklanmaz (kişi tarafıyla aynı KVKK ilkesi): yalnızca barkod/VKN +
--   OCR özet alanları + sonuç. is_verified kolonu verification_status'tan beslenir.
```

## 5. KVKK notları

- Kişi tarafı bugün İYİ: TC ve belge dosyası kalıcı saklanmıyor; işletme tarafında da
  aynı ilke (belge işle-at; VKN sakla — VKN ticari veri, TC kadar hassas değil).
- Aydınlatma metnine eklenecek: doğrulama amaçlı belge işleme, VKN/MERSİS saklama,
  admin kuyruğundaki bekleyen kayıtların otomatik temizlik süresi (öneri: 30 gün).
- `address_verifications` bekleyen kayıtları için otomatik temizlik bugün YOK → eklenmeli.

## 6. Aşamalı geçiş planı

| Faz | İçerik | Efor | Risk |
|---|---|---|---|
| 1 | Sunucu kapıları: `is_verified_neighbor()` + 6 kapı (RPC/RLS) + UI kaynak birleştirme | ~yarım gün | Düşük — mevcut kullanıcıların 6/8'i zaten doğrulanmış |
| 2 | UI: VerificationGate modal + rozetler + banner metni ("isteğe bağlı, işlemler için gerekli") + hesap-kilitli/deadline kaldırma | ~yarım gün | Düşük |
| 3 | İşletme: şema + kayıt sihirbazına belge adımı + çapraz kontroller + admin sekmesi + yayın kapısı + trial'ı onaya bağlama | 1-2 gün | Orta — mevcut 4 işletme elden geçirilir |
| 4 | İnce ayar: S1 yazma hız limitleri, doğrulama istatistikleri, pending otomatik temizlik | yarım gün | Düşük |

## 7. Sahibin karar vermesi gerekenler

1. **Etkinliğe katılım** S1'de kalsın mı (önerim: evet), oluşturma S2 (önerim: evet)?
2. **Feed'e yazma** S1'de kalsın mı (önerim: evet — büyüme kancası; hız limiti korur)?
3. **Doğrulanmamış işletme** halka hiç görünmesin mi (önerim: görünmesin)?
4. **Mevcut deadline/hesap-kilitli** mekanizması kişiler için tamamen kalksın mı (önerim: kalksın)?
5. Ltd/AŞ için MERSİS/Ticaret Sicil kontrolü ilk sürümde mi (önerim: ilk sürümde sadece
   Vergi Levhası + admin onayı; MERSİS sonra)?
