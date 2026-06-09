-- E2E güvenlik taraması — RLS sertleştirme paketi.
--
-- Bu migration, istemci (anon/authenticated) rolünün anon key arkasından
-- doğrudan yazabildiği FORGE EDİLEBİLİR sütun/satırları kapatır. Tek doğruluk
-- kaynağı sunucu (service_role) veya yönetici olmalı; service_role RLS'i baypas
-- ettiği için sunucu kodu (callback, verify-document vb.) etkilenmez.
--
-- Etkilenen tablolar şu an BOŞ (payments/card_transactions/mahallem_cards/
-- notifications: 0 satır) — veri kaybı riski yok.

-- ============================================================================
-- 1) notifications — KULLANICILAR ARASI BİLDİRİM SIZINTISI
-- ============================================================================
-- 'rls_notif_r' politikası USING(true) ile TÜM kullanıcıların bildirimlerini
-- herkese okutuyordu (PII sızıntısı). Doğru politika ("Users can view own
-- notifications", auth.uid() = user_id) zaten mevcut; bu açık olanı kaldırıyoruz.
drop policy if exists "rls_notif_r" on public.notifications;

-- Çift UPDATE politikası vardı: biri (public) WITH CHECK içermiyordu → kullanıcı
-- kendi bildirimini güncellerken user_id'yi başkasına taşıyabilirdi. WITH CHECK'li
-- ("Users update own notifications", authenticated) sürüm korunuyor; eksikli olanı
-- kaldırıyoruz. markAsRead (authenticated istemci) korunan politikayla çalışmaya
-- devam eder.
drop policy if exists "Users can update own notifications" on public.notifications;

-- ============================================================================
-- 2) payments — ÖDEME SAHTECİLİĞİ
-- ============================================================================
-- 'pay_insert_own' (istemci kendi ödeme satırını ekleyebilir → status='completed'
-- ile sahte "ödendi" kaydı) ve 'pay_update_own' (kendi ödemesini completed yapma)
-- istemciye açıktı. Canlı akışta ödeme satırlarını YALNIZCA PayTR callback'i
-- (service_role) yazar; istemcideki payment.ts yazma fonksiyonları çağrılmıyor
-- (ölü kod). Bu yüzden istemci yazımını tamamen kapatıyoruz. Okuma korunuyor
-- (pay_select_own + pay_select_admin).
drop policy if exists "pay_insert_own" on public.payments;
drop policy if exists "pay_update_own" on public.payments;

-- Callback idempotent olabilsin (aynı bildirim iki kez gelirse mükerrer
-- "completed" satırı / mükerrer üyelik aktivasyonu olmasın) diye merchant_oid'e
-- tekillik şartı ekliyoruz. Böylece callback upsert(onConflict: merchant_oid)
-- kullanabilir. NULL merchant_oid'ler çakışmaz (Postgres standart davranışı).
alter table public.payments
  add constraint payments_merchant_oid_key unique (merchant_oid);

-- ============================================================================
-- 3) card_transactions — EKONOMİK SAHTECİLİK (puan/indirim üretimi)
-- ============================================================================
-- 'users_can_insert_own_transactions' istemcinin kendi adına keyfi points_change
-- / amount ile işlem ekleyip kendine puan/indirim basmasına izin veriyordu.
-- Mahalle Kart akışı henüz YOK (tablo boş); işlemler ileride yalnızca sunucu/RPC
-- tarafından oluşturulmalı. İstemci INSERT'i kaldırıyoruz. Okuma korunuyor.
drop policy if exists "users_can_insert_own_transactions" on public.card_transactions;

-- ============================================================================
-- 4) mahallem_cards — EKONOMİK SAHTECİLİK (bakiye/seviye)
-- ============================================================================
-- 'users_can_update_own_card' kullanıcının kendi kartında points / total_savings
-- / level alanlarını keyfi ayarlamasına izin veriyordu. 'users_can_insert_own_card'
-- da oluştururken bu alanları forge etmeye açıktı. Akış henüz yok (tablo boş);
-- kart ve bakiye yalnızca sunucu tarafından yönetilmeli. İstemci yazımını
-- kapatıyoruz. Okuma korunuyor.
drop policy if exists "users_can_update_own_card" on public.mahallem_cards;
drop policy if exists "users_can_insert_own_card" on public.mahallem_cards;
