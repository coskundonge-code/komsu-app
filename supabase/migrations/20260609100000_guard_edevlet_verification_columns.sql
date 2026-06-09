-- Açık 1: e-Devlet doğrulama kapısını forge edilemez yap.
--
-- SORUN: middleware doğrulama durumunu (edevlet_verified_at / deadline)
-- user_metadata'dan okuyordu. user_metadata istemci tarafından
-- supabase.auth.updateUser({data}) ile yazılabilir → kullanıcı kendini
-- "doğrulanmış" ilan edip kapıyı geçebilirdi (is_admin açığıyla aynı sınıf).
-- Tek doğruluk kaynağı artık public.profiles; bu trigger o sütunları istemci
-- yazımına karşı kilitler. (is_admin/account_locked koruması aynen korunuyor.)

create or replace function public.guard_profile_privileged_columns()
returns trigger
language plpgsql
set search_path to ''
as $function$
begin
  -- Backend/privileged roles bypass (dashboard SQL = postgres, server code = service_role);
  -- only the client roles are constrained.
  if current_user not in ('authenticated', 'anon') then
    return new;
  end if;

  -- is_admin / account_locked: yalnızca yöneticiler değiştirebilir.
  if (tg_op = 'INSERT'
        and (coalesce(new.is_admin, false) or coalesce(new.account_locked, false)))
     or (tg_op = 'UPDATE'
        and (new.is_admin is distinct from old.is_admin
             or new.account_locked is distinct from old.account_locked)) then
    if not public.is_current_user_admin() then
      raise exception 'Yetkisiz islem: is_admin/account_locked yalnizca yoneticiler tarafindan degistirilebilir.'
        using errcode = '42501';
    end if;
  end if;

  -- edevlet_verified_at / edevlet_verification_deadline: e-Devlet doğrulama rozeti
  -- ve son tarihi mahalle-güven modelinin GÜVENLİK KAPISIDIR. Kullanıcı kendi
  -- rozetini yazamaz; bunları yalnızca sunucu (service_role — verify-document API)
  -- veya yönetici ayarlayabilir.
  if (tg_op = 'INSERT'
        and (new.edevlet_verified_at is not null
             or new.edevlet_verification_deadline is not null))
     or (tg_op = 'UPDATE'
        and (new.edevlet_verified_at is distinct from old.edevlet_verified_at
             or new.edevlet_verification_deadline is distinct from old.edevlet_verification_deadline)) then
    if not public.is_current_user_admin() then
      raise exception 'Yetkisiz islem: e-Devlet dogrulamasi yalnizca sunucu tarafindan ayarlanabilir.'
        using errcode = '42501';
    end if;
  end if;

  return new;
end;
$function$;

-- Geriye dönük doldurma: middleware artık location_confirmed_at'i profiles'tan
-- okuyacak. Daha önce konumunu user_metadata'ya yazmış kullanıcıların yeniden
-- /konum-secimi'ne düşmemesi için metadata'daki değeri profiles'a taşı.
-- (edevlet_verified_at BİLEREK taşınmıyor: metadata forge edilebilir olduğundan
--  oradaki "doğrulanmış" değeri kalıcı/forge-proof sütuna laundering etmeyiz.)
update public.profiles p
set location_confirmed_at = (u.raw_user_meta_data->>'location_confirmed_at')::timestamptz
from auth.users u
where u.id = p.id
  and p.location_confirmed_at is null
  and u.raw_user_meta_data->>'location_confirmed_at' is not null
  and pg_input_is_valid(u.raw_user_meta_data->>'location_confirmed_at', 'timestamptz');
