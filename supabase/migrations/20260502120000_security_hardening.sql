-- =============================================================================
-- Security Hardening Migration
-- Tarih: 2026-05-02
-- Amaç: AUDIT_REPORT.md K2 maddesinde tespit edilen RLS açıklarını kapatmak
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Permissive INSERT/UPDATE politikalarını sıkılaştır
-- -----------------------------------------------------------------------------

-- conversations: WITH CHECK (true) → en azından authenticated'e sınırla
-- (created_by kolonu yok; daha sıkı kontrol için ileride trigger eklenmeli)
DROP POLICY IF EXISTS "Users can create conversations" ON public.conversations;
CREATE POLICY "Authenticated can create conversations" ON public.conversations
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- conversation_participants: kullanıcı sadece kendisini katılımcı olarak ekleyebilir
DROP POLICY IF EXISTS "Users can add participants" ON public.conversation_participants;
CREATE POLICY "Users add self to conversation" ON public.conversation_participants
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- notifications UPDATE: kullanıcı sadece kendi bildirimlerini değiştirebilir
DROP POLICY IF EXISTS "rls_notif_u" ON public.notifications;
CREATE POLICY "Users update own notifications" ON public.notifications
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- polls INSERT: sadece ilişkili post'un sahibi anket oluşturabilir
DROP POLICY IF EXISTS "Users can create polls" ON public.polls;
CREATE POLICY "Post authors create polls" ON public.polls
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.posts
      WHERE posts.id = polls.post_id
        AND posts.author_id = auth.uid()
    )
  );

-- poll_options INSERT: anketin sahibi (post sahibi) seçenek ekleyebilir
DROP POLICY IF EXISTS "Users can create options" ON public.poll_options;
CREATE POLICY "Poll owners create options" ON public.poll_options
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.polls p
      JOIN public.posts po ON po.id = p.post_id
      WHERE p.id = poll_options.poll_id
        AND po.author_id = auth.uid()
    )
  );

-- user_badges INSERT: sadece service_role (rozet kazanma sunucu tarafından)
DROP POLICY IF EXISTS "User badges insert by service role" ON public.user_badges;
CREATE POLICY "Only service role inserts badges" ON public.user_badges
  FOR INSERT TO service_role
  WITH CHECK (true);

-- -----------------------------------------------------------------------------
-- 2. Duplicate INSERT politikalarını temizle
--    (rls_*_i politikaları auth.role() = 'authenticated' kullanıyor → impersonation riski)
-- -----------------------------------------------------------------------------

-- posts: "Members can create posts" (auth.uid() = author_id) yeterli
DROP POLICY IF EXISTS "rls_posts_i" ON public.posts;

-- listings: "Users can create listings" (auth.uid() = seller_id) yeterli
DROP POLICY IF EXISTS "rls_listings_i" ON public.listings;

-- profiles INSERT duplicate: profiles_insert (auth.uid() = id) yeterli
DROP POLICY IF EXISTS "rls_profiles_i" ON public.profiles;

-- profiles UPDATE duplicate: 3 tane aynı politika var, 1 yeterli
DROP POLICY IF EXISTS "rls_profiles_u" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update" ON public.profiles;
-- "Users can update own profile" politikası kalır

-- profiles SELECT: 3 tane USING (true) → KVKK için anon erişimini engelle, tek bir politika
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
DROP POLICY IF EXISTS "rls_profiles_r" ON public.profiles;
CREATE POLICY "Authenticated users view profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (true);

-- user_addresses: "Users can manage own addresses" ALL policy zaten her şeyi kapsıyor
DROP POLICY IF EXISTS "user_addresses_select" ON public.user_addresses;
DROP POLICY IF EXISTS "user_addresses_insert" ON public.user_addresses;
DROP POLICY IF EXISTS "user_addresses_update" ON public.user_addresses;
DROP POLICY IF EXISTS "Users can view own addresses" ON public.user_addresses;

-- -----------------------------------------------------------------------------
-- 3. Function search_path mutable warnings (advisor 0011)
-- -----------------------------------------------------------------------------

ALTER FUNCTION public.update_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION public.handle_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION public.update_post_comment_count() SET search_path = public, pg_temp;
ALTER FUNCTION public.check_max_donation_products() SET search_path = public, pg_temp;
ALTER FUNCTION public.get_user_profile_with_badges(p_user_id uuid) SET search_path = public, pg_temp;
ALTER FUNCTION public.check_and_award_badges(p_user_id uuid) SET search_path = public, pg_temp;
ALTER FUNCTION public.handle_new_user() SET search_path = public, pg_temp;
ALTER FUNCTION public.update_help_requests_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION public.update_neighborhood_member_count() SET search_path = public, pg_temp;

-- -----------------------------------------------------------------------------
-- 4. SECURITY DEFINER fonksiyonların anon erişimini kaldır (advisor 0028)
--    handle_new_user trigger fonksiyonu — RPC olarak çağrılmamalı
-- -----------------------------------------------------------------------------

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.check_and_award_badges(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_user_profile_with_badges(uuid) FROM anon;

-- -----------------------------------------------------------------------------
-- 5. spatial_ref_sys (PostGIS sistem tablosu): RLS açıp public read policy ekle
--    (advisor 0013 ERROR — sistem tablosu olduğu için içerik public read olabilir)
-- -----------------------------------------------------------------------------

ALTER TABLE public.spatial_ref_sys ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "spatial_ref_sys_public_read" ON public.spatial_ref_sys;
CREATE POLICY "spatial_ref_sys_public_read" ON public.spatial_ref_sys
  FOR SELECT USING (true);

-- -----------------------------------------------------------------------------
-- Migration sonu
-- -----------------------------------------------------------------------------
