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

// Export types
export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type ResetPasswordEmailData = z.infer<typeof resetPasswordSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordFormSchema>
