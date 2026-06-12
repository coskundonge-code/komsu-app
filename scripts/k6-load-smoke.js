/* eslint-disable */
/**
 * E2E Son Kontrol (2026-06-12) — k6 yük testi ŞABLONU.
 *
 * ⚠️ YALNIZCA STAGING/TEST ortamına karşı çalıştırın — prod'a ve gerçek
 *    kullanıcı verisine karşı yük testi YAPMAYIN.
 *
 * Kurulum: https://k6.io/docs/get-started/installation/
 * Çalıştırma:
 *   k6 run -e BASE_URL=https://staging-adresiniz scripts/k6-load-smoke.js
 *
 * Eşikler (pazara hazırlık kriteri):
 *   p95 < 2sn, hata oranı < %1 (3x normal yükte)
 */
import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  stages: [
    { duration: '1m', target: 10 }, // ısınma
    { duration: '3m', target: 30 }, // ~3x beklenen eşzamanlı kullanıcı
    { duration: '1m', target: 0 },  // soğuma
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    http_req_failed: ['rate<0.01'],
  },
}

const BASE = __ENV.BASE_URL || 'http://localhost:3000'

export default function () {
  // Herkese açık yüzey — login istemez, yıkıcı değildir
  const giris = http.get(`${BASE}/giris`)
  check(giris, { 'giris 200': (r) => r.status === 200 })

  const health = http.get(`${BASE}/api/health`)
  check(health, { 'health 200': (r) => r.status === 200 })

  const hakkinda = http.get(`${BASE}/hakkinda`)
  check(hakkinda, { 'hakkinda 200': (r) => r.status === 200 })

  sleep(1)
}
