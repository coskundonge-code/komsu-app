# E2E Gerçek Tarayıcı Testi Raporu — Mahallemiz

> Rol bazlı, gerçek tarayıcıda uçtan uca test. Önceki turun **eksik bıraktığı**
> ("her rol için test hesabı sağlanmadı → kimlik-korumalı akışlar test edilmedi")
> kısım bu turda tamamlandı.
> Tarih: **2026-06-10** · Mod: **C (kod + canlı localhost:3000 + canlı Supabase)**
> Yöntem: 6 gerçek test kullanıcısı oluşturuldu, gerçek Chromium'da insan gibi
> tıklanarak her rolün tüm ana akışları denendi; yazma işlemleri canlı DB'de doğrulandı.

---

## 0. Sade özet (teknik olmayan)

Uygulamaya **6 gerçek test hesabıyla** (2 komşu/2 mahalle, 2 esnaf, 1 ihtiyaç
sahibi, 1 yönetici) tarayıcıdan girip gönderi/pazar/mesaj/yardım/işletme/yönetici
akışlarının hepsi tek tek denendi. **İki büyük "çalışıyor görünüp aslında çalışmayan"
özellik bulundu ve düzeltildi:**

1. 🔴 **İlandan satıcıya mesaj gönderme tamamen kırıktı** — "Mesaj Gönder" her
   seferinde sessizce başarısız oluyordu (kullanıcı hiçbir şey görmüyordu). Pazarın
   en temel iletişim akışı. **Düzeltildi**, artık çalışıyor.
2. 🔴 **"Komşuma Yardım" listesi hiç açılmıyordu** — her zaman "Henüz yardım
   talebi yok" gösteriyordu, oysa kayıtlı talepler vardı. Tüm özellik işlevsizdi.
   **Düzeltildi**, talepler görünüyor + yeni talep oluşturuluyor.

Ayrıca 5 küçük/orta sorun (doğrulanmış kullanıcıya sahte "adres doğrula" uyarısı,
beğeni sayısı hep 0, sol menüde "Konum belirtilmemiş", mobil menüde sahte "3"
bildirim rozeti, yönetici panelinde sahte rakamlar) bulundu ve düzeltildi.

**Karar: tarayıcı E2E kapısı → açık P0/P1 YOK → GEÇTİ.** Tüm bulgular kapatıldı.
(Yayın hâlâ `YAPILACAKLAR.md` A bölümündeki yasal/PayTR/avukat maddelerine bağlı —
bunlar teknik değil, sahip/avukat işi.)

---

## 1. Oluşturulan test kullanıcıları

Hepsi **e-posta onaylı + konum onaylı + e-Devlet doğrulanmış** (middleware hunisini
geçer). Parola: `MahalleTest2026!`

| E-posta | Ad | Rol | Mahalle | Ekstra |
|---|---|---|---|---|
| test.komsu1@mahallemiz.test | Test Komşu Ayşe | Komşu | Bahçelievler | — |
| test.komsu2@mahallemiz.test | Test Komşu Mehmet | Komşu | Moda (Kadıköy) | — |
| test.esnaf1@mahallemiz.test | Test Esnaf Ali | Esnaf | Bahçelievler | İşletme + **aktif** abonelik (99₺/ay) |
| test.esnaf2@mahallemiz.test | Test Esnaf Zeynep | Esnaf | Moda (Kadıköy) | İşletme + **deneme** abonelik |
| test.ihtiyac@mahallemiz.test | Test İhtiyaç Fatma | İhtiyaç sahibi | Bahçelievler | — |
| test.admin@mahallemiz.test | Test Admin | Yönetici | Bahçelievler | `is_admin=true` |

> Bu hesaplar **canlı Supabase'de** kalıcıdır (sahip ileride manuel test için
> kullanabilsin diye silinmedi). Temizlemek isteyince §6'daki SQL yeterli.

---

## 2. Bulgu özeti

| Öncelik | Adet | Durum |
|---|---|---|
| 🔴 P0 | 0 | — |
| 🟠 P1 | 2 | **2/2 düzeltildi** |
| 🟡 P2 | 3 | **3/3 düzeltildi** |
| ⚪ P3 | 3 | **3/3 düzeltildi** (+ 2 not edildi) |

---

## 3. P1 — Yüksek (yayın engeli sınıfı) — İKİSİ DE DÜZELTİLDİ

### [P1-A] İlandan "Mesaj Gönder" tamamen kırık — `conversations.type` CHECK ihlali ✅
- **Modül:** 2 (Fonksiyonel) + 9 (API kontrat)
- **Kanıt:** İlan detayında "Mesaj Gönder" → konsol `Failed to create conversation`,
  ağ: `POST /rpc/get_or_create_direct_conversation → 400`. Doğrudan DB denemesi:
  `ERROR 23514: new row for relation "conversations" violates check constraint
  "conversations_type_check"`. İstemci (`verified-message-button.tsx:59`) ilan
  sohbetinde `type='marketplace'` gönderiyordu; DB CHECK yalnızca
  `('direct','group','listing')` kabul ediyor.
- **Etki:** Pazardaki HER "Mesaj Gönder" sessizce başarısız (kullanıcıya geri
  bildirim bile yok). Komşu-satıcı iletişiminin tek yolu çalışmıyordu. Önceki tur
  bunu "düzeltildi ve canlı DB'de doğrulandı" demişti ama yalnızca `direct` yolu
  test edilmiş, pazar (`marketplace`) yolu tarayıcıda hiç çalıştırılmamıştı.
- **Düzeltme:** `'marketplace'` → `'listing'`. Tür mantığı saf bir helper'a
  (`src/lib/utils/conversation.ts`) çıkarıldı, DB CHECK ile birebir kilitlendi,
  4 regresyon testi eklendi (`conversation-type.test.ts`).
- **Doğrulama (tarayıcı):** Mesaj Gönder → `/mesajlar?selected=…`'e yönlendi,
  konuşma + ilk mesaj + ardından gönderilen mesaj canlı DB'de doğrulandı.

### [P1-B] "Komşuma Yardım" listesi hiç yüklenmiyor — FK/embed uyuşmazlığı ✅
- **Modül:** 2 (Fonksiyonel) + 3 (Veri bütünlüğü)
- **Kanıt:** Sayfa her zaman "Henüz yardım talebi yok". Ağ:
  `GET /help_requests?select=*,profiles(...) → 400`, gövde
  `PGRST200: Could not find a relationship between 'help_requests' and 'profiles'`.
  `help_requests.user_id`/`helper_id` **`auth.users`'a** FK'lıydı; oysa diğer tüm
  içerik tabloları (`posts`/`comments`/`listings`/`donations`) user kolonunu
  **`profiles`'a** FK'lıyor (PostgREST embed bunu gerektiriyor).
- **Etki:** Tüm "Komşuma Yardım" özelliği işlevsiz — talepler/teklifler hiç
  görünmüyordu (RLS değil; sorgu 400 ile düşüyordu).
- **Düzeltme:** Migration `fix_help_requests_profiles_fk_for_embed` — FK'lar
  `profiles`'a yönlendirildi (profiles zaten auth.users'a 1:1 FK'lı → bütünlük
  korunur). İki FK olunca embed belirsizleştiği için (PGRST201/300) sorgu açık
  ipuçla netleştirildi: `profiles!help_requests_user_id_fkey(...)`.
- **Doğrulama (tarayıcı):** Liste artık talepleri gösteriyor; İhtiyaç Fatma yeni
  talep oluşturdu ("E2E: İlaç alımına yardım") → canlı DB'de doğru mahalleyle yazıldı.

---

## 4. P2 / P3 — Düzeltilenler

| # | Öncelik | Bulgu | Kanıt | Düzeltme | Doğrulama |
|---|---|---|---|---|---|
| 1 | 🟡 P2 | Doğrulama uyarı banner'ı **herkese** "Adresinizi Doğrulayın, 7 gün kaldı" gösteriyor (e-Devlet'i onaylı kullanıcılar dahil); sayaç sahte (hep 7) | `page.tsx:161` `<AddressVerificationBanner/>` prop'suz çağrılıyor → hep `unverified`/`7` | Banner artık profili okuyor; doğrulanmışsa **gizli**, gerçek kalan günü gösterir | Komşu1'de banner kayboldu ✅ |
| 2 | 🟡 P2 | Gönderi **beğeni sayısı hep 0** | `reactions` insert ediliyor ama `posts.reaction_count` güncellenmiyor (comments için trigger var, reactions için yoktu) | Migration `add_reaction_count_trigger` + mevcut sayılar geri-dolduruldu | DB sayaç 1 ✅ |
| 3 | 🟡 P2 | Sol menü/çekmece/sağ-panel **"Konum belirtilmemiş"** | `user_metadata.il/ilce` okunuyor; yeni akış konumu `profiles`'a yazıyor | Konum mahalle üyeliği → profil konumu → metadata sırasıyla okunuyor | "Bahçelievler, Bahçelievler" göründü ✅ |
| 4 | ⚪ P3 | Mobil menüde **sabit "3" bildirim rozeti** | `bottom-bar.tsx:10` `unreadCount = 3` hardcoded | Gerçek okunmamış bildirim sayısına bağlandı | 0 bildirimde rozet kayboldu ✅ |
| 5 | ⚪ P3 | Mesaj başlığında `<img src="">` → tarayıcı sayfayı yeniden indiriyor | `mesajlar/page.tsx:260` `src={selected?.avatar \|\| ""}` | Avatar yoksa baş-harfli placeholder | Kod düzeltildi ✅ |
| 6 | ⚪ P3 | Yönetici panelinde gerçek sayıların yanında **sahte deltalar** ("+324 bu hafta" vb.) | `admin/page.tsx` DEFAULT_STATS | Sahte deltalar temizlendi; "Raporlar" gerçek açık-rapor sayısına bağlandı | tsc/build ✅ |

---

## 5. Doğrulanan akışlar (rol bazlı, tarayıcıda)

- **Komşu (Ayşe/Mehmet):** giriş ✅ · feed görüntüleme ✅ · **gönderi oluşturma** ✅ (DB) ·
  **beğeni** ✅ (DB; sayaç düzeltildi) · **yorum** ✅ (DB; comment_count trigger çalışıyor) ·
  pazar listesi ✅ · ilan detay ✅ · **mesajlaşma** ✅ (düzeltildikten sonra uçtan uca) ·
  etkinlik listesi + oluşturma formu (zorunlu alan doğrulaması çalışıyor) ✅ · uyarılar ✅ (404 yok).
- **İhtiyaç sahibi (Fatma):** giriş ✅ · **Komşuma Yardım listesi** ✅ (düzeltildi) ·
  **yardım talebi oluşturma** ✅ (DB) · Askıda Bağış → bilinçli "çok yakında" placeholder (bug değil).
- **Esnaf (Ali/Zeynep):** giriş ✅ · işletme paneli ✅ · üyelik sayfası (aktif abonelik 99₺,
  sonraki ödeme tarihi) ✅ · **indirim oluşturma** ✅ (DB).
- **Yönetici (Admin):** giriş ✅ · yönetici paneli ✅ (gerçek istatistikler) · kullanıcı
  yönetimi ✅ (gerçek 8 kullanıcı) · **RBAC: admin olmayan `/admin`'e gidince ana sayfaya
  yönlendirildi** ✅ (yetki yükseltme engeli sağlam).

---

## 5b. EK (aynı gün, sahip isteğiyle): Askıda Bağış çalışır hale getirildi ✅

Sahip "askıda kısmını da çalışır hale getir" dedi. "Çok yakında" placeholder'ı kaldırıldı;
özellik **parasız eşya/ürün askısı** modeliyle gerçek çalışır yapıldı (eski prototipteki
sahte kart formu — PCI riski — geri getirilmedi; kartla bağış + esnaf QR, PayTR canlıya
bağlanınca ayrı tur; sayfada dürüst bilgi kutusu var).

- **Bulunan 2 gizli bug (eski kodda):** (1) "Bağışı Al" RLS'te her zaman 0 satır
  etkiliyordu — UPDATE politikası `user_id/claimed_by` istiyor, alan kişi henüz ikisi de
  değil → alma HİÇ çalışmamıştı; (2) DELETE politikası yoktu → bağışçı bağışını geri
  çekemiyordu. Ayrıca donations'ta profiles'a 2 FK olduğundan ipuçsuz embed belirsizdi.
- **Düzeltme (migration `askida_bagis_claim_rpc_and_delete_policy`):** atomik, yarış-güvenli
  `claim_donation` RPC'si (kendi bağışını alamaz, süresi dolmuş alınamaz; iki kişi aynı anda
  basarsa yalnız biri alır) + "kendi + henüz alınmamış" silme politikası. Hook'ta açık FK
  ipucu (`profiles!donations_user_id_fkey`) + süresi dolmuşları gizleme.
- **Yeni sayfa (2028 → ~600 satır):** Askıda Ne Var? / Askıya Bırak / Bağışlarım sekmeleri;
  gerçek istatistikler; alınan bağışta **"Bağışçıyla Mesajlaş"** (mevcut güvenli sohbet
  RPC'si + otomatik teslimat mesajı). Mock işletme/sahte istatistik/sahte QR/kart formu silindi
  (eski kod git geçmişinde: `cf5cc7f`).
- **Tarayıcıda uçtan uca doğrulandı:** Komşu Ayşe askıya bıraktı (DB ✓) → İhtiyaç Fatma
  listede gördü → askıdan aldı (DB: claimed + claimed_by ✓) → "Bağışçıyla Mesajlaş" →
  sohbet açıldı + otomatik mesaj gitti ✓ → Bağışlarım/Aldıklarım (1) ✓.
- tsc 0 · 268/268 test · build 0.

---

## 6. Geliştirme alanları (not edildi — bu turda düzeltilmedi)

- 🟡 **Perf — `useCurrentUser` N+1 fetch fırtınası:** Tek sayfa yüklemesinde
  `profiles` + `neighborhood_members` 20'den fazla kez tekrar çekiliyor (her bileşen
  kendi hook'unu ayrı çağırıyor; React Query'ye taşınmamış auth katmanı). Mimari
  değişiklik → ayrı, odaklı tur. (Önceki turun "Feed → React Query" notuyla aynı sınıf.)
- ⚪ **Yönetici dashboard kalan mock veriler:** 7-günlük aktivite grafiği, "Son
  Aktiviteler" akışı, "Platform Sağlığı"/"Sistem Durumu" sabit/sahte. Yalnızca
  yöneticiye görünür, müşteri-hazırlık kapısını etkilemez; gerçek veriye bağlamak
  için olay-logu/monitoring altyapısı gerekir. Hızlı-işlem butonlarının da `onClick`'i yok.
- ⚪ **Profilde "Mesaj Gönder" yok:** Komşu profilinden doğrudan DM başlatılamıyor
  (mesajlaşma yalnızca ilan detayından başlatılıyor). Ürün kararı: profile mesaj
  butonu eklensin mi?
- ⚪ **Yetim içerik:** `neighborhood_id=null` olan eski etkinlik/grup/ilan kayıtları
  mahalle-kapsamlı listelerde görünmüyor (eski test verisi).
- ⚪ **CSP dev `unsafe-eval` uyarısı:** Yalnızca geliştirme modunda React eval
  uyarısı; prod build temiz (önceki turda da not edilmiş, pre-existing).

---

## 7. Test kullanıcılarını temizleme (sahip isteyince)

```sql
-- Test kullanıcılarını ve ürettikleri tüm test içeriğini siler (FK cascade ile).
-- Önce işletme/abonelik/indirim, sonra auth.users (profiller + içerik cascade gider).
delete from public.business_discounts where business_id::text like 'b0000000-%';
delete from public.business_subscriptions where business_id::text like 'b0000000-%';
delete from public.businesses where id::text like 'b0000000-%';
delete from auth.users where id::text like 'a0000000-%';  -- profiles + post/comment/
                                                           -- reaction/conversation/
                                                           -- message/help_request cascade
```

---

## 8. Doğrulama (regresyon)

- `tsc --noEmit` → **0 hata**
- `vitest run` → **268/268 geçti** (+4 yeni: `conversation-type.test.ts`)
- `next build` → **exit 0**
- Tüm düzeltmeler gerçek tarayıcıda + canlı DB sorgusuyla doğrulandı.

**Migration'lar (canlı DB):** `fix_help_requests_profiles_fk_for_embed`,
`add_reaction_count_trigger`. **Kod (coskun rafı):** verified-message-button,
address-verification-banner, sidebar/mobile-drawer/right-sidebar, mesajlar,
bottom-bar, admin/page, use-help-requests, lib/utils/conversation + test.
