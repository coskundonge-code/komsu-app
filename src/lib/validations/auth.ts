import { z } from 'zod'

// Turkish email regex for basic validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Turkish phone number regex (supports +90 format and variations)
const turkishPhoneRegex = /^(\+90|0)?[1-9]\d{9}$/

// TC Kimlik No validation (11 digits, specific algorithm)
function isValidTCKimlik(tc: string): boolean {
  if (tc.length !== 11 || tc[0] === '0' || !/^\d{11}$/.test(tc)) return false
  const d = tc.split('').map(Number)
  const c10 = ((d[0]+d[2]+d[4]+d[6]+d[8])*7 - (d[1]+d[3]+d[5]+d[7])) % 10
  if ((c10 < 0 ? c10+10 : c10) !== d[9]) return false
  return d.slice(0,10).reduce((a,b)=>a+b,0) % 10 === d[10]
}

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'E-posta adresi gereklidir')
    .email('Geçerli bir e-posta adresi girin')
    .refine((val) => emailRegex.test(val), 'Geçerli bir e-posta adresi girin'),
  password: z
    .string()
    .min(1, 'Şifre gereklidir')
    .min(6, 'Şifre en az 6 karakter olmalıdır'),
})

export const registerSchema = z
  .object({
    tcKimlikNo: z
      .string()
      .min(1, 'TC Kimlik No gereklidir')
      .length(11, 'TC Kimlik No 11 haneli olmalıdır')
      .refine((val) => /^\d{11}$/.test(val), 'TC Kimlik No sadece rakamlardan oluşmalıdır')
      .refine((val) => isValidTCKimlik(val), 'Geçersiz TC Kimlik No'),
    fullName: z
      .string()
      .min(1, 'Ad ve soyadınız gereklidir')
      .min(2, 'Ad ve soyad en az 2 karakter olmalıdır')
      .refine(
        (val) => val.trim().split(' ').length >= 2,
        'Lütfen ad ve soyadınızı girin'
      ),
    email: z
      .string()
      .min(1, 'E-posta adresi gereklidir')
      .email('Geçerli bir e-posta adresi girin')
      .refine((val) => emailRegex.test(val), 'Geçerli bir e-posta adresi girin'),
    phone: z
      .string()
      .optional()
      .refine(
        (val) => !val || turkishPhoneRegex.test(val),
        'Geçerli bir Türk telefon numarası girin'
      ),
    password: z
      .string()
      .min(1, 'Şifre oluşturun')
      .min(8, 'Şifre en az 8 karakterden oluşmalıdır')
      .refine((val) => /[A-Z]/.test(val), 'Şifrede en az bir büyük harf olmalıdır')
      .refine((val) => /[0-9]/.test(val), 'Şifrede en az bir rakam olmalıdır'),
    confirmPassword: z
      .string()
      .min(1, 'Şifrenizi tekrar girin'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Şifreler eşleşmiyor',
    path: ['confirmPassword'],
  })

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'E-posta adresi gereklidir')
    .email('Geçerli bir e-posta adresi girin')
    .refine((val) => emailRegex.test(val), 'Geçerli bir e-posta adresi girin'),
})

export const resetPasswordFormSchema = z
  .object({
    password: z
      .string()
      .min(1, 'Şifre oluşturun')
      .min(8, 'Şifre en az 8 karakterden oluşmalıdır')
      .refine((val) => /[A-Z]/.test(val), 'Şifrede en az bir büyük harf olmalıdır')
      .refine((val) => /[0-9]/.test(val), 'Şifrede en az bir rakam olmalıdır'),
    confirmPassword: z
      .string()
      .min(1, 'Şifrenizi tekrar girin'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Şifreler eşleşmiyor',
    path: ['confirmPassword'],
  })

// ——— Kayıt formu adım doğrulaması (SAF — kayit/page.tsx bunları çağırır) ———
//
// İki aşamalı kayıt formu (1: kimlik/ad/e-posta, 2: şifre/telefon) için saf
// doğrulama. Sayfa yalnız bu sonuçları state'e yazar; doğrulama kuralları burada
// testle kilitlenir (K1). Auth signUp çağrısı bu fonksiyonlardan bağımsızdır.

export interface RegisterStep1Input {
  tcKimlikNo: string
  fullName: string
  email: string
  phone?: string
}

export interface StepValidationResult<K extends string> {
  valid: boolean
  errors: Partial<Record<K, string>>
}

/**
 * Adım 1: yalnız kimlik/ad/e-posta. Şifre henüz girilmediği için şema geçici bir
 * şifreyle çalıştırılır ve yalnız bu üç alanın hataları yüzeye çıkarılır
 * (orijinal sayfa davranışı birebir korunur).
 */
export function validateRegisterStep1(
  input: RegisterStep1Input
): StepValidationResult<'tcKimlikNo' | 'fullName' | 'email'> {
  const errors: Partial<Record<'tcKimlikNo' | 'fullName' | 'email', string>> = {}
  const result = registerSchema.safeParse({
    tcKimlikNo: input.tcKimlikNo,
    fullName: input.fullName,
    email: input.email,
    phone: input.phone || undefined,
    password: 'temppass1',
    confirmPassword: 'temppass1',
  })
  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors
    if (fieldErrors.tcKimlikNo?.[0]) errors.tcKimlikNo = fieldErrors.tcKimlikNo[0]
    if (fieldErrors.fullName?.[0]) errors.fullName = fieldErrors.fullName[0]
    if (fieldErrors.email?.[0]) errors.email = fieldErrors.email[0]
  }
  return { valid: Object.keys(errors).length === 0, errors }
}

/**
 * Adım 2 (tam form): şema tümünü doğrular, yalnız şifre/şifre-tekrar/telefon
 * hatalarını yüzeye çıkarır (kimlik/ad/e-posta adım 1'de doğrulandı). `valid`
 * doğrudan şema sonucudur — orijinal `return result.success` davranışı.
 */
export function validateRegisterStep2(
  input: RegisterFormData
): StepValidationResult<'password' | 'confirmPassword' | 'phone'> {
  const errors: Partial<Record<'password' | 'confirmPassword' | 'phone', string>> = {}
  const result = registerSchema.safeParse(input)
  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors
    if (fieldErrors.password?.[0]) errors.password = fieldErrors.password[0]
    if (fieldErrors.confirmPassword?.[0]) errors.confirmPassword = fieldErrors.confirmPassword[0]
    if (fieldErrors.phone?.[0]) errors.phone = fieldErrors.phone[0]
  }
  return { valid: result.success, errors }
}

// Export types
export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type ResetPasswordEmailData = z.infer<typeof resetPasswordSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordFormSchema>
