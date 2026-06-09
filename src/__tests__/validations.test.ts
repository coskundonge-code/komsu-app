import { describe, it, expect } from 'vitest'
import {
  loginSchema,
  registerSchema,
  validateRegisterStep1,
  validateRegisterStep2,
} from '@/lib/validations/auth'

/**
 * Auth doğrulama şeması testleri (giriş + kayıt şifre kuralları).
 */
describe('loginSchema', () => {
  it('geçerli email + şifre kabul edilir', () => {
    expect(loginSchema.safeParse({ email: 'a@b.com', password: 'secret1' }).success).toBe(true)
  })
  it('geçersiz email reddedilir', () => {
    expect(loginSchema.safeParse({ email: 'notanemail', password: 'secret1' }).success).toBe(false)
  })
  it('6 karakterden kısa şifre reddedilir', () => {
    expect(loginSchema.safeParse({ email: 'a@b.com', password: '123' }).success).toBe(false)
  })
})

describe('registerSchema şifre/alan kuralları', () => {
  const base = {
    tcKimlikNo: '10000000078', // algoritmaya uygun test no
    fullName: 'Ahmet Yılmaz',
    email: 'a@b.com',
    password: 'Password1',
    confirmPassword: 'Password1',
  }

  it('tüm kurallar sağlanınca geçerli', () => {
    expect(registerSchema.safeParse(base).success).toBe(true)
  })
  it('büyük harf içermeyen şifre reddedilir', () => {
    expect(registerSchema.safeParse({ ...base, password: 'password1', confirmPassword: 'password1' }).success).toBe(false)
  })
  it('rakam içermeyen şifre reddedilir', () => {
    expect(registerSchema.safeParse({ ...base, password: 'Passwordx', confirmPassword: 'Passwordx' }).success).toBe(false)
  })
  it('8 karakterden kısa şifre reddedilir', () => {
    expect(registerSchema.safeParse({ ...base, password: 'Pass1', confirmPassword: 'Pass1' }).success).toBe(false)
  })
  it('eşleşmeyen şifreler reddedilir', () => {
    expect(registerSchema.safeParse({ ...base, confirmPassword: 'Different1' }).success).toBe(false)
  })
})

/**
 * Kayıt formu adım doğrulaması — SÖZLEŞME testleri.
 *
 * Üretim: src/app/(auth)/kayit/page.tsx bu saf fonksiyonları çağırıp sonucu
 * alan hatalarına yazar. Adım 1 yalnız kimlik/ad/e-posta'yı kapıda tutar
 * (telefon/şifre adım 1'i ETKİLEMEZ); adım 2 tüm şemayı doğrular. Davranış
 * burada kilitli — refactor sessizce kayıt hunisini değiştirmesin.
 */
describe('validateRegisterStep1 — adım 1 (kimlik/ad/e-posta)', () => {
  const valid = {
    tcKimlikNo: '10000000078',
    fullName: 'Ahmet Yılmaz',
    email: 'a@b.com',
  }

  it('geçerli kimlik/ad/e-posta → valid, hata yok', () => {
    const r = validateRegisterStep1(valid)
    expect(r.valid).toBe(true)
    expect(r.errors).toEqual({})
  })

  it('geçersiz TC → valid:false + tcKimlikNo hatası', () => {
    const r = validateRegisterStep1({ ...valid, tcKimlikNo: '12345678901' })
    expect(r.valid).toBe(false)
    expect(r.errors.tcKimlikNo).toBeTruthy()
  })

  it('tek kelimelik ad → valid:false + fullName hatası', () => {
    const r = validateRegisterStep1({ ...valid, fullName: 'Ahmet' })
    expect(r.valid).toBe(false)
    expect(r.errors.fullName).toBeTruthy()
  })

  it('geçersiz e-posta → valid:false + email hatası', () => {
    const r = validateRegisterStep1({ ...valid, email: 'notanemail' })
    expect(r.valid).toBe(false)
    expect(r.errors.email).toBeTruthy()
  })

  it('telefon adım 1 doğrulamasını etkilemez (geçersiz telefon → yine valid)', () => {
    const r = validateRegisterStep1({ ...valid, phone: '123' })
    expect(r.valid).toBe(true)
    expect(r.errors).toEqual({})
  })
})

describe('validateRegisterStep2 — adım 2 (tam form, şifre/telefon)', () => {
  const valid = {
    tcKimlikNo: '10000000078',
    fullName: 'Ahmet Yılmaz',
    email: 'a@b.com',
    phone: '',
    password: 'Password1',
    confirmPassword: 'Password1',
  }

  it('geçerli tam form → valid, hata yok', () => {
    const r = validateRegisterStep2(valid)
    expect(r.valid).toBe(true)
    expect(r.errors).toEqual({})
  })

  it('eşleşmeyen şifreler → valid:false + confirmPassword hatası', () => {
    const r = validateRegisterStep2({ ...valid, confirmPassword: 'Different1' })
    expect(r.valid).toBe(false)
    expect(r.errors.confirmPassword).toBeTruthy()
  })

  it('zayıf şifre (büyük harfsiz) → valid:false + password hatası', () => {
    const r = validateRegisterStep2({ ...valid, password: 'password1', confirmPassword: 'password1' })
    expect(r.valid).toBe(false)
    expect(r.errors.password).toBeTruthy()
  })

  it('geçersiz telefon → valid:false + phone hatası', () => {
    const r = validateRegisterStep2({ ...valid, phone: '123' })
    expect(r.valid).toBe(false)
    expect(r.errors.phone).toBeTruthy()
  })

  it('boş telefon → valid (telefon opsiyonel)', () => {
    const r = validateRegisterStep2({ ...valid, phone: '' })
    expect(r.valid).toBe(true)
    expect(r.errors).toEqual({})
  })
})
