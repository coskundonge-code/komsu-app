-- =============================================================================
-- Çift profil tablosunu birleştir: user_profiles → profiles
-- =============================================================================
-- profiles (kimlik: email, phone, full_name) ve user_profiles (lokasyon, eDevlet,
-- gender) iki ayrı tablo olarak duruyordu. Aynı id'leri taşıyorlar ama type-safe
-- değiller, kod 13 yerden 'profiles', 4 yerden 'user_profiles' okuyor → veri
-- çatallanması. Ayrıca konum-secimi/page.tsx user_profiles'a olmayan kolonları
-- (il, ilce, mahalle, user_id) update etmeye çalışıyor → kırık akış.
--
-- Strateji: tüm kolonları profiles'a topla, user_profiles'ı VIEW yap (kodun
-- kırılmaması için), ileride view de drop edilebilir.
-- =============================================================================

-- 1. profiles'a eksik kolonları ekle
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS location_lat double precision,
  ADD COLUMN IF NOT EXISTS location_lng double precision,
  ADD COLUMN IF NOT EXISTS location_province text,
  ADD COLUMN IF NOT EXISTS location_district text,
  ADD COLUMN IF NOT EXISTS location_address text,
  ADD COLUMN IF NOT EXISTS location_confirmed_at timestamptz,
  ADD COLUMN IF NOT EXISTS edevlet_verified_at timestamptz,
  ADD COLUMN IF NOT EXISTS edevlet_verification_deadline timestamptz,
  ADD COLUMN IF NOT EXISTS edevlet_barcode text,
  ADD COLUMN IF NOT EXISTS account_locked boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS gender text;

-- 2. user_profiles'taki extended bilgiyi profiles'a kopyala
UPDATE public.profiles p SET
  location_lat                  = up.location_lat,
  location_lng                  = up.location_lng,
  location_province             = up.location_province,
  location_district             = up.location_district,
  location_address              = up.location_address,
  location_confirmed_at         = up.location_confirmed_at,
  edevlet_verified_at           = up.edevlet_verified_at,
  edevlet_verification_deadline = up.edevlet_verification_deadline,
  edevlet_barcode               = up.edevlet_barcode,
  account_locked                = COALESCE(up.account_locked, false),
  gender                        = up.gender,
  bio                           = COALESCE(p.bio, up.bio),
  avatar_url                    = COALESCE(p.avatar_url, up.avatar_url),
  phone                         = COALESCE(p.phone, up.phone)
FROM public.user_profiles up
WHERE p.id = up.id;

-- 3. user_profiles tablosunu drop et
DROP TABLE IF EXISTS public.user_profiles CASCADE;

-- 4. user_profiles → profiles VIEW (geriye dönük uyumluluk)
CREATE OR REPLACE VIEW public.user_profiles AS
SELECT
  id, full_name, avatar_url, bio, phone,
  location_lat, location_lng, location_province, location_district, location_address,
  location_confirmed_at, edevlet_verified_at, edevlet_verification_deadline,
  edevlet_barcode, is_verified, is_admin, account_locked, created_at, updated_at, gender
FROM public.profiles;

ALTER VIEW public.user_profiles SET (security_invoker = true);
