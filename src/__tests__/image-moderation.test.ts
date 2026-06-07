import { describe, it, expect } from 'vitest'
import { decideSafeSearch, type SafeSearchAnnotation } from '@/lib/services/image-moderation'

/**
 * Görsel moderasyonu — GÖRSEL GÜVENLİK KAPISI sözleşmesi.
 *
 * Üretim: src/app/api/moderate-media/route.ts kullanıcı yüklemelerini Google
 * Vision SafeSearch'e gönderir; decideSafeSearch dönen olasılığı blok kararına
 * çevirir. Eşik gevşerse uygunsuz görsel GEÇER (mağaza/itibar riski); sıkılaşırsa
 * normal fotoğraf (mayo/plaj/spor) yanlışlıkla REDDEDİLİR. Bu yüzden eşikleri
 * burada açıkça kilitliyoruz — gelecekte biri sessizce değiştirmesin.
 */

describe('decideSafeSearch — eşik kararları', () => {
  it('temiz görseli (her şey VERY_UNLIKELY) onaylar', () => {
    const a: SafeSearchAnnotation = {
      adult: 'VERY_UNLIKELY',
      violence: 'VERY_UNLIKELY',
      racy: 'VERY_UNLIKELY',
      medical: 'VERY_UNLIKELY',
      spoof: 'VERY_UNLIKELY',
    }
    expect(decideSafeSearch(a)).toEqual({ approved: true, flags: [] })
  })

  it('boş annotation (alan yok) onaylar', () => {
    expect(decideSafeSearch({})).toEqual({ approved: true, flags: [] })
  })

  it('adult = LIKELY → nudity ile blokla', () => {
    const r = decideSafeSearch({ adult: 'LIKELY' })
    expect(r.approved).toBe(false)
    expect(r.flags).toEqual(['nudity'])
  })

  it('adult = VERY_LIKELY → nudity ile blokla', () => {
    const r = decideSafeSearch({ adult: 'VERY_LIKELY' })
    expect(r.approved).toBe(false)
    expect(r.flags).toContain('nudity')
  })

  it('adult = POSSIBLE (eşik altı) → onayla', () => {
    expect(decideSafeSearch({ adult: 'POSSIBLE' })).toEqual({ approved: true, flags: [] })
  })

  it('violence = LIKELY → violence ile blokla', () => {
    const r = decideSafeSearch({ violence: 'LIKELY' })
    expect(r.approved).toBe(false)
    expect(r.flags).toEqual(['violence'])
  })

  it('racy = LIKELY (yalnız LIKELY, VERY değil) → onayla (aşırı engellemeyi önle)', () => {
    expect(decideSafeSearch({ racy: 'LIKELY' })).toEqual({ approved: true, flags: [] })
  })

  it('racy = VERY_LIKELY → nudity ile blokla', () => {
    const r = decideSafeSearch({ racy: 'VERY_LIKELY' })
    expect(r.approved).toBe(false)
    expect(r.flags).toEqual(['nudity'])
  })

  it('adult LIKELY + racy VERY_LIKELY → nudity mükerrer eklenmez', () => {
    const r = decideSafeSearch({ adult: 'LIKELY', racy: 'VERY_LIKELY' })
    expect(r.approved).toBe(false)
    expect(r.flags).toEqual(['nudity'])
  })

  it('adult + violence ikisi de LIKELY → iki bayrak', () => {
    const r = decideSafeSearch({ adult: 'LIKELY', violence: 'LIKELY' })
    expect(r.approved).toBe(false)
    expect(r.flags).toEqual(['nudity', 'violence'])
  })

  it('medical = VERY_LIKELY → onayla (tıbbi içerik bloklanmaz)', () => {
    expect(decideSafeSearch({ medical: 'VERY_LIKELY' })).toEqual({ approved: true, flags: [] })
  })

  it('spoof = VERY_LIKELY → onayla (spoof bloklanmaz)', () => {
    expect(decideSafeSearch({ spoof: 'VERY_LIKELY' })).toEqual({ approved: true, flags: [] })
  })

  it('UNKNOWN değerler eşik altı sayılır → onayla', () => {
    expect(decideSafeSearch({ adult: 'UNKNOWN', violence: 'UNKNOWN' })).toEqual({
      approved: true,
      flags: [],
    })
  })
})
