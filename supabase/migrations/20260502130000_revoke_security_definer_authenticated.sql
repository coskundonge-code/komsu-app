-- =============================================================================
-- Revoke SECURITY DEFINER fonksiyonları authenticated'den de
-- =============================================================================
-- check_and_award_badges ve get_user_profile_with_badges fonksiyonları
-- SECURITY DEFINER ile tanımlı; sunucu tarafından (service_role) çağrılmalı,
-- end-user RPC çağrısıyla değil. Bu nedenle authenticated rolünden de REVOKE.
-- =============================================================================

REVOKE EXECUTE ON FUNCTION public.check_and_award_badges(uuid) FROM authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_user_profile_with_badges(uuid) FROM authenticated, PUBLIC;
