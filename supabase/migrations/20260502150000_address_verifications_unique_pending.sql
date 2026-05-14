-- =============================================================================
-- address_verifications: aynı kullanıcı + aynı barkod için tek pending kayıt
-- (verify-document fallback upsert'ünün idempotency garantisi)
-- =============================================================================

CREATE UNIQUE INDEX IF NOT EXISTS address_verifications_user_barcode_unique
  ON public.address_verifications (user_id, barcode_value)
  WHERE barcode_value IS NOT NULL;
