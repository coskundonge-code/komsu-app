import { describe, it, expect } from 'vitest'
import {
  analyzeContent,
  getContentTypeLabel,
  getPriorityColor,
  getStatusColor,
  getStatusLabel,
} from '@/lib/services/content-moderation'

/**
 * İçerik moderasyonu saf-mantık testleri.
 * analyzeContent tamamen saftır (DB/ağ yok): skor, kategori, autoAction, priority.
 * Bu testler küfür/scam/kişisel-bilgi tespitinin ve karar mantığının
 * regresyonunu yakalar. Etiket/renk yardımcıları da saftır.
 */

describe('analyzeContent — temiz içerik', () => {
  it('zararsız, yeterli uzunluktaki metin tam puan ve onay alır', () => {
    const r = analyzeContent('Bugün mahallede güzel bir yürüyüş yaptım, herkese iyi günler.')
    expect(r.score).toBe(100)
    expect(r.categories).toEqual(['clean'])
    expect(r.autoAction).toBe('approve')
    expect(r.priority).toBe('low')
    expect(r.reasoning).toBe('İçerik temiz görünüyor')
  })

  it('kategoriler boşsa "clean" eklenir', () => {
    const r = analyzeContent('Komşumuzdan taze ekmek aldık, çok teşekkürler.')
    expect(r.categories).toContain('clean')
  })
})

describe('analyzeContent — küfür', () => {
  it('küfür tespit edilince profanity kategorisi ve puan düşüşü', () => {
    const r = analyzeContent('Bu adam tam bir salak ve aptal.')
    expect(r.categories).toContain('profanity')
    expect(r.score).toBeLessThan(100)
  })
})

describe('analyzeContent — scam (otomatik red + kritik)', () => {
  it('scam anahtar kelimeleri otomatik reddedilir ve critical olur', () => {
    const r = analyzeContent('Kolay para kazan, garantili gelir, hemen kazan!')
    expect(r.categories).toContain('scam')
    expect(r.autoAction).toBe('reject')
    expect(r.priority).toBe('critical')
    expect(r.score).toBeLessThan(85)
  })

  it('tek scam kelimesi bile scam kategorisini tetikler', () => {
    const r = analyzeContent('Yeni bir bitcoin fırsatı var, kaçırmayın arkadaşlar.')
    expect(r.categories).toContain('scam')
    expect(r.autoAction).toBe('reject')
  })
})

describe('analyzeContent — kişisel bilgi (her zaman inceleme)', () => {
  it('11 haneli numara (kişisel bilgi) incelemeye düşer ve high olur', () => {
    // Not: scam anahtar kelimelerinden (ör. "tc kimlik") kaçınıldı; aksi halde
    // determineAction scam'i önceleyip "reject" döndürürdü.
    const r = analyzeContent('Başvuru numaram 12345678901 ile kaydoldum.')
    expect(r.categories).toContain('personal_info')
    expect(r.autoAction).toBe('review')
    expect(r.priority).toBe('high')
  })

  it('IBAN tespiti personal_info kategorisini tetikler', () => {
    const r = analyzeContent('Ödeme için IBAN: TR330006100519786457841326 numarasını kullanın.')
    expect(r.categories).toContain('personal_info')
    expect(r.autoAction).toBe('review')
  })
})

describe('analyzeContent — alert (acil durum) daha sıkı', () => {
  it('alert içeriği her zaman incelemeye düşer', () => {
    const r = analyzeContent(
      'Mahallede su kesintisi var, belediye ekipleri çalışma yapıyor lütfen dikkatli olun.',
      undefined,
      'alert',
    )
    expect(r.autoAction).toBe('review')
    expect(r.priority).toBe('high')
  })

  it('temiz alert bile tam puan altına iner (-10 ek denetim)', () => {
    const r = analyzeContent(
      'Mahallede su kesintisi var, belediye ekipleri çalışma yapıyor lütfen dikkatli olun.',
      undefined,
      'alert',
    )
    expect(r.score).toBeLessThan(100)
    expect(r.reasoning).toContain('Acil durum')
  })

  it('çok kısa alert açıklaması ek ceza alır', () => {
    const r = analyzeContent('Yangın var', undefined, 'alert')
    expect(r.reasoning).toContain('yetersiz açıklama')
  })
})

describe('analyzeContent — kalite / uzunluk', () => {
  it('çok kısa (post) içerik puan kaybeder', () => {
    const r = analyzeContent('kısa')
    expect(r.score).toBeLessThan(100)
    expect(r.reasoning).toContain('çok kısa')
  })

  it('başlıksız ilan ceza alır', () => {
    const r = analyzeContent('Satılık ikinci el bisiklet, az kullanılmış durumda.', undefined, 'listing')
    expect(r.reasoning).toContain('başlığı eksik')
  })

  it('çok kısa yorum (comment) reddi tetikleyebilir', () => {
    const r = analyzeContent('ab', undefined, 'comment')
    expect(r.reasoning).toContain('Çok kısa yorum')
  })
})

describe('analyzeContent — sonuç sözleşmesi (contract)', () => {
  it('skor her zaman 0..100 aralığında kalır (clamp)', () => {
    // Birden çok ihlal: küfür + scam + kişisel bilgi → toplam ceza 100ü aşar
    const r = analyzeContent(
      'salak orospu çocuğu kolay para garantili gelir bitcoin forex 12345678901 TR330006100519786457841326',
    )
    expect(r.score).toBeGreaterThanOrEqual(0)
    expect(r.score).toBeLessThanOrEqual(100)
  })

  it('autoAction yalnızca geçerli değerlerden biridir', () => {
    const r = analyzeContent('Normal bir mahalle paylaşımı yazısı burada yer alıyor.')
    expect(['approve', 'reject', 'review']).toContain(r.autoAction)
  })

  it('priority yalnızca geçerli değerlerden biridir', () => {
    const r = analyzeContent('Normal bir mahalle paylaşımı yazısı burada yer alıyor.')
    expect(['low', 'medium', 'high', 'critical']).toContain(r.priority)
  })

  it('title metne dahil edilir (başlıktaki scam yakalanır)', () => {
    const r = analyzeContent('Detaylar açıklamada.', 'Kolay para kazan garantili gelir', 'post')
    expect(r.categories).toContain('scam')
  })
})

describe('getContentTypeLabel', () => {
  it('bilinen tipler Türkçe etikete çevrilir', () => {
    expect(getContentTypeLabel('post')).toBe('Paylaşım')
    expect(getContentTypeLabel('listing')).toBe('İlan')
    expect(getContentTypeLabel('alert')).toBe('Acil Durum')
    expect(getContentTypeLabel('business_review')).toBe('İşletme Yorumu')
    expect(getContentTypeLabel('story')).toBe('Hikaye')
  })
})

describe('getPriorityColor', () => {
  it('her öncelik için bir hex renk döner', () => {
    expect(getPriorityColor('low')).toBe('#22c55e')
    expect(getPriorityColor('medium')).toBe('#f59e0b')
    expect(getPriorityColor('high')).toBe('#ef4444')
    expect(getPriorityColor('critical')).toBe('#dc2626')
  })
})

describe('getStatusColor / getStatusLabel', () => {
  it('published yeşil tonunda ve "Yayında" etiketli', () => {
    expect(getStatusColor('published')).toBe('#00833e')
    expect(getStatusLabel('published')).toBe('Yayında')
  })
  it('admin_rejected kırmızı ve "Admin Reddetti"', () => {
    expect(getStatusColor('admin_rejected')).toBe('#ef4444')
    expect(getStatusLabel('admin_rejected')).toBe('Admin Reddetti')
  })
  it('pending_ai gri ve "AI İncelemede"', () => {
    expect(getStatusColor('pending_ai')).toBe('#6b7280')
    expect(getStatusLabel('pending_ai')).toBe('AI İncelemede')
  })
})
