import { describe, it, expect } from 'vitest'
import {
  formatNumber,
  formatCurrency,
  formatPhone,
  formatFileSize,
  formatRelativeTime,
  truncateText,
} from '@/lib/utils/format'

/**
 * format.ts — format.test.ts'te kapsanmayan KENAR durumları.
 * (0, negatif, çok büyük, boş string, byte sınırları, "az önce"/saniye vb.)
 */

describe('formatNumber — kenar durumlar', () => {
  it('0 → "0"', () => {
    expect(formatNumber(0)).toBe('0')
  })
  it('negatif binlik ayraçlı', () => {
    expect(formatNumber(-1234567)).toBe('-1.234.567')
  })
  it('tam 1000 sınırı ayraç ekler', () => {
    expect(formatNumber(1000)).toBe('1.000')
  })
  it('999 ayraç eklemez', () => {
    expect(formatNumber(999)).toBe('999')
  })
  it('ondalık yuvarlama (1.999 → 2,00)', () => {
    // 3. ondalık 9 olduğu için yön belirsizliği yok; her durumda 2,00
    expect(formatNumber(1.999, 2)).toBe('2,00')
  })
  it('negatif sayı 0 ondalıkla', () => {
    expect(formatNumber(-42)).toBe('-42')
  })
})

describe('formatCurrency — kenar durumlar', () => {
  it('0 → "₺0,00"', () => {
    expect(formatCurrency(0)).toBe('₺0,00')
  })
  it('negatif tutar', () => {
    expect(formatCurrency(-99.5)).toBe('₺-99,50')
  })
  it('çok büyük tutar binlik ayraçlı', () => {
    expect(formatCurrency(1234567.89)).toBe('₺1.234.567,89')
  })
  it('sembolsüz + 0 ondalık', () => {
    expect(formatCurrency(2500, 0, false)).toBe('2.500')
  })
  it('ondalık kesme (3 → 2 basamak)', () => {
    expect(formatCurrency(10.501)).toBe('₺10,50')
  })
})

describe('formatPhone — kenar durumlar', () => {
  it('11 haneli (başında 0) farklı gruplanır', () => {
    expect(formatPhone('05551234567')).toBe('0 555 123 4567')
  })
  it('geçersiz uzunluk olduğu gibi döner', () => {
    expect(formatPhone('123')).toBe('123')
  })
  it('boş string boş döner', () => {
    expect(formatPhone('')).toBe('')
  })
  it('harf + sembol temizlenir, 10 hane kalırsa biçimlenir', () => {
    expect(formatPhone('(555) 123 45 67')).toBe('555 123 4567')
  })
})

describe('formatFileSize — birim sınırları', () => {
  it('0 byte → "0 B"', () => {
    expect(formatFileSize(0)).toBe('0 B')
  })
  it('1023 byte hâlâ B', () => {
    expect(formatFileSize(1023)).toBe('1.023,00 B')
  })
  it('1024 byte → 1,00 KB', () => {
    expect(formatFileSize(1024)).toBe('1,00 KB')
  })
  it('ondalık basamak ayarı (0): 2048 byte → 2 KB', () => {
    expect(formatFileSize(2048, 0)).toBe('2 KB')
  })
  it('1,5 KB (2 ondalık)', () => {
    expect(formatFileSize(1536)).toBe('1,50 KB')
  })
})

describe('formatRelativeTime — kenar durumlar', () => {
  it('şimdi → "az önce"', () => {
    expect(formatRelativeTime(new Date())).toBe('az önce')
  })
  it('30 saniye önce', () => {
    expect(formatRelativeTime(new Date(Date.now() - 30_000))).toBe('30 saniye önce')
  })
  it('1 dakika (tekil)', () => {
    expect(formatRelativeTime(new Date(Date.now() - 60_000))).toBe('1 dakika önce')
  })
  it('1 saat (tekil)', () => {
    expect(formatRelativeTime(new Date(Date.now() - 3_600_000))).toBe('1 saat önce')
  })
  it('1 gün (tekil)', () => {
    expect(formatRelativeTime(new Date(Date.now() - 86_400_000))).toBe('1 gün önce')
  })
  it('1 hafta', () => {
    expect(formatRelativeTime(new Date(Date.now() - 7 * 86_400_000))).toBe('1 hafta önce')
  })
  it('1 ay (~30 gün)', () => {
    expect(formatRelativeTime(new Date(Date.now() - 30 * 86_400_000))).toBe('1 ay önce')
  })
  it('1 yıl (~365 gün)', () => {
    expect(formatRelativeTime(new Date(Date.now() - 365 * 86_400_000))).toBe('1 yıl önce')
  })
})

describe('truncateText — kenar durumlar', () => {
  it('boş metin boş döner', () => {
    expect(truncateText('', 10)).toBe('')
  })
  it('tam sınır uzunluğu kesilmez', () => {
    expect(truncateText('1234567890', 10)).toBe('1234567890')
  })
  it('varsayılan suffix "..." ile keser', () => {
    expect(truncateText('Uzun bir metin örneği', 10)).toBe('Uzun bi...')
  })
  it('negatif maxLength boş döner', () => {
    expect(truncateText('herhangi', -5)).toBe('')
  })
})
