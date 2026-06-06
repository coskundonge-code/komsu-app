import { describe, it, expect } from 'vitest'
import { loginSchema, registerSchema } from '@/lib/validations/auth'

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
