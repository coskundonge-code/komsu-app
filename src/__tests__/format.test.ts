import { describe, it, expect } from 'vitest'
import {
  formatDate,
  formatRelativeTime,
  formatNumber,
  formatCurrency,
  truncateText,
  formatPhone,
  formatFileSize,
} from '@/lib/utils/format'

/** format.ts — saf biçimlendirme fonksiyonları (JSDoc örnekleri = beklenen çıktı). */

describe('formatNumber', () => {
  it('binlik ayraç (nokta)', () => {
    expect(formatNumber(1234567)).toBe('1.234.567')
  })
  it('ondalık (virgül) + binlik', () => {
    expect(formatNumber(1234.567, 2)).toBe('1.234,57')
  })
  it('sonsuz/NaN → 0', () => {
    expect(formatNumber(Infinity)).toBe('0')
    expect(formatNumber(NaN)).toBe('0')
  })
})

describe('formatCurrency', () => {
  it('varsayılan: ₺ + 2 ondalık', () => {
    expect(formatCurrency(1234.56)).toBe('₺1.234,56')
    expect(formatCurrency(100)).toBe('₺100,00')
  })
  it('0 ondalık', () => {
    expect(formatCurrency(5000, 0)).toBe('₺5.000')
  })
  it('sembolsüz', () => {
    expect(formatCurrency(99.99, 2, false)).toBe('99,99')
  })
})

describe('formatDate', () => {
  const d = new Date(2026, 2, 10) // 10 Mart 2026 (yerel, TZ-güvenli)
  it('short (varsayılan)', () => {
    expect(formatDate(d)).toBe('10.03.2026')
  })
  it('medium', () => {
    expect(formatDate(d, 'medium')).toBe('10 Mart 2026')
  })
  it('long: tarih kısmını içerir', () => {
    expect(formatDate(d, 'long')).toContain('10 Mart 2026')
  })
  it('geçersiz tarih', () => {
    expect(formatDate('saçma')).toBe('Geçersiz tarih')
  })
})

describe('formatRelativeTime', () => {
  it('dakika/saat/gün', () => {
    expect(formatRelativeTime(new Date(Date.now() - 5 * 60_000))).toBe('5 dakika önce')
    expect(formatRelativeTime(new Date(Date.now() - 2 * 3_600_000))).toBe('2 saat önce')
    expect(formatRelativeTime(new Date(Date.now() - 3 * 86_400_000))).toBe('3 gün önce')
  })
  it('geçersiz tarih', () => {
    expect(formatRelativeTime('saçma')).toBe('Geçersiz tarih')
  })
})

describe('truncateText', () => {
  it('sığan metin değişmez', () => {
    expect(truncateText('Kısa', 10)).toBe('Kısa')
  })
  it('özel suffix ile keser', () => {
    expect(truncateText('Merhaba Dünya', 8, '→')).toBe('Merhaba→')
  })
  it('boş/sıfır sınır → boş', () => {
    expect(truncateText('x', 0)).toBe('')
  })
})

describe('formatPhone', () => {
  it('10 haneli', () => {
    expect(formatPhone('5551234567')).toBe('555 123 4567')
  })
  it('rakam-dışı temizlenir', () => {
    expect(formatPhone('555-123-45-67')).toBe('555 123 4567')
  })
})

describe('formatFileSize', () => {
  it('B/KB/MB', () => {
    expect(formatFileSize(0)).toBe('0 B')
    expect(formatFileSize(1024)).toBe('1,00 KB')
    expect(formatFileSize(1048576)).toBe('1,00 MB')
  })
})
