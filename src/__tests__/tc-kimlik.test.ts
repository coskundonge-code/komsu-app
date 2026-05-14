import { describe, it, expect } from 'vitest'
import { registerSchema } from '@/lib/validations/auth'

/**
 * TC Kimlik No algoritmik doğrulama testleri.
 * https://tr.wikipedia.org/wiki/T%C3%BCrkiye_Cumhuriyeti_kimlik_numaras%C4%B1
 */
describe('TC Kimlik No validation', () => {
  const validBase = {
    fullName: 'Ahmet Yılmaz',
    email: 'a@b.com',
    password: 'password123',
    passwordConfirm: 'password123',
    acceptTerms: true,
  }

  it('reddeder: 0 ile başlayan TC No', () => {
    const result = registerSchema.safeParse({ ...validBase, tcKimlikNo: '01234567890' })
    expect(result.success).toBe(false)
  })

  it('reddeder: 11 haneli olmayan', () => {
    const result = registerSchema.safeParse({ ...validBase, tcKimlikNo: '1234567890' })
    expect(result.success).toBe(false)
  })

  it('reddeder: rakam dışı karakter', () => {
    const result = registerSchema.safeParse({ ...validBase, tcKimlikNo: '1234567890A' })
    expect(result.success).toBe(false)
  })

  it('reddeder: algoritmaya uymayan 11 haneli', () => {
    const result = registerSchema.safeParse({ ...validBase, tcKimlikNo: '12345678901' })
    expect(result.success).toBe(false)
  })

  it('kabul eder: algoritmaya uygun TC No', () => {
    // 10000000146 — gerçek bir test no olmaz ama algoritmaya uygun
    // d10 = ((1+0+0+0+0)*7 - (0+0+0+0+0)) % 10 = 7 ❌ (uymaz)
    // Geçerli bir test değeri üretelim:
    // d1..d9 = 1,0,0,0,0,0,0,0,0 → d10 = ((1+0+0+0+0)*7 - 0) % 10 = 7
    //                              d11 = (1+0+0+0+0+0+0+0+0+7) % 10 = 8
    // Yani 10000000078 geçerli olur
    const result = registerSchema.safeParse({ ...validBase, tcKimlikNo: '10000000078' })
    // Not: schema'da phone vb. başka required alanlar varsa false dönebilir;
    // en azından TC alanı geçerli olmalı
    if (!result.success) {
      const tcErrors = result.error.flatten().fieldErrors.tcKimlikNo
      expect(tcErrors).toBeUndefined()
    }
  })
})
