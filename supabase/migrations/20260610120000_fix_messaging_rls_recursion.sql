-- E2E Son Kontrol — P0: Mesajlaşma tamamen kırıktı.
--
-- İKİ HATA:
--  (1) conversation_participants SELECT politikası kendi tablosunu alt-sorguda
--      sorguluyordu → Postgres "infinite recursion detected in policy" (42P17).
--      Bu, conversations + messages politikalarına da yayılıyordu (ikisi de
--      conversation_participants'ı sorgular). Yani her okuma 500.
--  (2) Sohbet oluştururken istemci İKİ katılımcıyı tek insert'te ekliyordu, ama
--      INSERT politikası WITH CHECK (user_id = auth.uid()) karşı tarafın satırını
--      reddediyordu → sohbet hiç oluşmuyordu.
--
-- ÇÖZÜM:
--  - Özyinelemeyi kıran SECURITY DEFINER yardımcı fonksiyon (kendi iç okumasında
--    RLS'i baypas eder) ve SELECT politikalarını bununla yeniden yaz.
--  - Sohbet oluşturmayı atomik + güvenli yapan SECURITY DEFINER RPC; istemci artık
--    katılımcı satırlarını doğrudan yazmaz.
--
-- Tablolar BOŞ (0 satır) → veri kaybı riski yok.

-- ============================================================================
-- 1) Özyinelemeyi kıran yardımcı
-- ============================================================================
create or replace function public.is_conversation_participant(p_conversation_id uuid)
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1
    from public.conversation_participants cp
    where cp.conversation_id = p_conversation_id
      and cp.user_id = auth.uid()
  );
$$;

revoke execute on function public.is_conversation_participant(uuid) from anon, public;
grant execute on function public.is_conversation_participant(uuid) to authenticated;

-- ============================================================================
-- 2) Özyinelemeli SELECT/INSERT politikalarını yardımcıyla yeniden yaz
-- ============================================================================
drop policy if exists "Participants can view" on public.conversation_participants;
create policy "Participants can view" on public.conversation_participants
  for select to public
  using (public.is_conversation_participant(conversation_id));

drop policy if exists "Participants can view conversations" on public.conversations;
create policy "Participants can view conversations" on public.conversations
  for select to public
  using (public.is_conversation_participant(id));

drop policy if exists "Participants can view messages" on public.messages;
create policy "Participants can view messages" on public.messages
  for select to public
  using (public.is_conversation_participant(conversation_id));

-- messages INSERT de conversation_participants'ı alt-sorguluyordu (özyineleme).
drop policy if exists "Participants can send messages" on public.messages;
create policy "Participants can send messages" on public.messages
  for insert to public
  with check (
    auth.uid() = sender_id
    and public.is_conversation_participant(conversation_id)
  );

-- ============================================================================
-- 3) Güvenli atomik sohbet oluşturma (karşı katılımcıyı eklemenin tek yolu)
-- ============================================================================
create or replace function public.get_or_create_direct_conversation(
  p_other_user uuid,
  p_listing_id uuid default null,
  p_title text default null,
  p_type text default 'direct'
)
returns table(conversation_id uuid, created boolean)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_me uuid := auth.uid();
  v_conv uuid;
begin
  if v_me is null then
    raise exception 'Yetkisiz: oturum bulunamadi.' using errcode = '42501';
  end if;
  if p_other_user is null or p_other_user = v_me then
    raise exception 'Gecersiz alici.' using errcode = '22023';
  end if;

  -- İki kullanıcının ortak olduğu mevcut sohbeti yeniden kullan (eski istemci
  -- davranışıyla uyumlu).
  select cp.conversation_id into v_conv
  from public.conversation_participants cp
  join public.conversation_participants cp2
    on cp2.conversation_id = cp.conversation_id
   and cp2.user_id = p_other_user
  where cp.user_id = v_me
  limit 1;

  if v_conv is not null then
    conversation_id := v_conv;
    created := false;
    return next;
    return;
  end if;

  insert into public.conversations (type, title, listing_id)
  values (coalesce(p_type, 'direct'), p_title, p_listing_id)
  returning id into v_conv;

  insert into public.conversation_participants (conversation_id, user_id)
  values (v_conv, v_me), (v_conv, p_other_user);

  conversation_id := v_conv;
  created := true;
  return next;
end;
$$;

revoke execute on function public.get_or_create_direct_conversation(uuid, uuid, text, text) from anon, public;
grant execute on function public.get_or_create_direct_conversation(uuid, uuid, text, text) to authenticated;
