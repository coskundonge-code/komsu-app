/**
 * PayTR merchant_oid ayrıştırma — saf, bağımlılıksız domain mantığı.
 *
 * Üretim noktası (tek kaynak): `src/app/api/payment/route.ts`
 *   const merchantOid = `${paymentType}_${userId}_${Date.now()}`
 * burada paymentType ∈ {'mahalle_card', 'listing_fee', 'business_membership'}
 * (route.ts'teki ALLOWED_PAYMENT_TYPES allowlist'i) ve userId bir UUID'dir.
 *
 * Callback (`src/app/api/payment/callback/route.ts`) bu OID'i geri ayrıştırıp
 * (a) `payments.payment_type` kolonuna ne yazılacağını, (b) hangi kullanıcının
 * kartının/üyeliğinin aktive edileceğini belirler. Buradaki bir hata = YANLIŞ
 * kullanıcıya üyelik/kart tanımlanması veya yanlış gelir bucket'ı. Bu yüzden
 * mantık route'tan çıkarılıp saf/test edilebilir kılındı (K1: ince route).
 *
 * Dikkat — örtük bağ: paymentType iki kelimeli olduğunda (mahalle_CARD,
 * listing_FEE, business_MEMBERSHIP) ikinci kelime `_` ile ayrıldığı için OID'in
 * 2. token'ı ('card' | 'fee' | 'membership') geri-birleştirme allowlist'ini
 * oluşturur. userId UUID olduğundan (tire içerir, alt-çizgi içermez) `split('_')`
 * userId'yi tek parça olarak korur ve daima son token'dan (timestamp) bir
 * öncekidir. Yeni bir iki-kelimeli payment type eklenirse allowlist GÜNCELLENMELİ
 * — bu testler (paytr-oid.test.ts) o senkronizasyonu kilitler.
 */

const TWO_WORD_SECOND_TOKENS = ['card', 'fee', 'membership'] as const;

export interface ParsedMerchantOid {
  /** payments.payment_type'a yazılan değer: mahalle_card | listing_fee | business_membership | <tek-kelime>. */
  paymentType: string;
  /** Aktive edilecek kullanıcının id'si (UUID). Ayrıştırılamazsa ''. */
  userId: string;
}

/**
 * `${paymentType}_${userId}_${timestamp}` biçimindeki PayTR merchant_oid'i
 * (paymentType, userId)'ye ayrıştırır. route.ts:50-52'deki satır içi mantığın
 * birebir aynısıdır (davranış korunarak çıkarıldı).
 */
export function parseMerchantOid(merchantOid: string): ParsedMerchantOid {
  const parts = (merchantOid ?? '').split('_');
  const paymentType =
    parts[0] +
    ((TWO_WORD_SECOND_TOKENS as readonly string[]).includes(parts[1])
      ? '_' + parts[1]
      : '');
  const userId = parts.length >= 3 ? parts[parts.length - 2] : '';
  return { paymentType, userId };
}
