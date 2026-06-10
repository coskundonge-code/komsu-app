import { describe, it, expect } from 'vitest'
import { CONVERSATION_TYPES, conversationTypeFor } from '@/lib/utils/conversation'

// Regresyon: E2E tarayıcı testinde (2026-06-10) ilandan "Mesaj Gönder" her
// seferinde 400 dönüyordu çünkü istemci conversations.type='marketplace'
// gönderiyordu, ama DB CHECK yalnızca 'direct'|'group'|'listing' kabul ediyor.
// Bu testler türün DB ile senkron kalmasını ve 'marketplace'in geri gelmemesini
// garanti eder.
describe('conversationTypeFor / CONVERSATION_TYPES', () => {
  it('ilan bağlamında DB-geçerli "listing" döndürür', () => {
    expect(conversationTypeFor('listing-123')).toBe('listing')
    expect(CONVERSATION_TYPES as readonly string[]).toContain(conversationTypeFor('listing-123'))
  })

  it('ilan yoksa "direct" döndürür', () => {
    expect(conversationTypeFor()).toBe('direct')
    expect(conversationTypeFor(null)).toBe('direct')
    expect(conversationTypeFor(undefined)).toBe('direct')
  })

  it('izin verilen türler DB conversations_type_check ile birebir aynı', () => {
    expect([...CONVERSATION_TYPES].sort()).toEqual(['direct', 'group', 'listing'])
  })

  it('"marketplace" izinli DEĞİL (eski bug: ilandan mesajlaşmayı tamamen kırıyordu)', () => {
    expect(CONVERSATION_TYPES as readonly string[]).not.toContain('marketplace')
  })
})
