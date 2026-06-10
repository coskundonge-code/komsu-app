// conversations.type için izin verilen değerler — DB'deki `conversations_type_check`
// CHECK kısıtıyla BİREBİR aynı olmalıdır. İstemci bu kümenin dışında bir değer
// gönderirse INSERT 23514 (check_violation) ile patlar.
//
// Regresyon notu (2026-06-10): VerifiedMessageButton eskiden ilan sohbetleri için
// 'marketplace' gönderiyordu; CHECK bunu reddediyor → "Mesaj Gönder" sessizce
// başarısız oluyor, satıcıya ulaşma akışı tamamen kırıktı. Doğru değer 'listing'.
export const CONVERSATION_TYPES = ['direct', 'group', 'listing'] as const

export type ConversationType = (typeof CONVERSATION_TYPES)[number]

/** İlan bağlamı varsa 'listing', yoksa kişiler arası 'direct' sohbet türü. */
export function conversationTypeFor(listingId?: string | null): ConversationType {
  return listingId ? 'listing' : 'direct'
}
