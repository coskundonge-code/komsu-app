import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * Health Check Endpoint
 * GET /api/health
 *
 * Returns application health status including:
 * - Application status
 * - Database connectivity + latency
 * - External service status (PayTR, Supabase Auth)
 * - Memory usage
 * - Uptime information
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const startTime = Date.now()

type HealthStatus = 'healthy' | 'degraded' | 'unhealthy' | 'configured' | 'unconfigured'

interface HealthCheck {
  status: HealthStatus
  latency?: number
  error?: string
  details?: Record<string, unknown>
}

export async function GET(request: NextRequest) {
  // Halka açık varsayılan = SADECE canlılık (liveness): süreç ayakta mı?
  // Ayrıntılı teşhis (DB/auth gecikmesi, bellek, sürüm, env, sağlayıcı durumu)
  // bilgi sızıntısıdır ve her anonim istekte DB'ye vurmak DoS amplifikasyonudur.
  // Bu yüzden ayrıntı yalnızca HEALTH_CHECK_TOKEN sırrını bilen çağırana açılır.
  const token = process.env.HEALTH_CHECK_TOKEN || ''
  const provided = request.headers.get('x-health-token') || ''
  const authorized = token.length > 0 && provided === token

  if (!authorized) {
    return NextResponse.json(
      { status: 'ok', timestamp: new Date().toISOString() },
      { status: 200, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    )
  }

  const checks: Record<string, HealthCheck> = {}
  const checkStartTime = Date.now()

  // ---- Database connectivity check ----
  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    const dbStart = Date.now()
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
      const { error } = await supabase.from('profiles').select('id').limit(1)
      const latency = Date.now() - dbStart
      checks.database = {
        status: error ? 'degraded' : latency > 2000 ? 'degraded' : 'healthy',
        latency,
        ...(error && { error: error.message }),
        ...(latency > 2000 && { details: { warning: 'High latency detected' } }),
      }
    } catch {
      checks.database = {
        status: 'unhealthy',
        latency: Date.now() - dbStart,
        error: 'Database connection failed',
      }
    }
  } else {
    checks.database = { status: 'unconfigured' }
  }

  // ---- Supabase Auth check ----
  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    const authStart = Date.now()
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
      const { error } = await supabase.auth.getSession()
      checks.auth = {
        status: error ? 'degraded' : 'healthy',
        latency: Date.now() - authStart,
        ...(error && { error: error.message }),
      }
    } catch {
      checks.auth = {
        status: 'unhealthy',
        latency: Date.now() - authStart,
        error: 'Auth service unreachable',
      }
    }
  } else {
    checks.auth = { status: 'unconfigured' }
  }

  // ---- PayTR configuration check ----
  checks.payment = {
    status: process.env.PAYTR_MERCHANT_ID ? 'configured' : 'unconfigured',
    details: {
      testMode: process.env.PAYTR_TEST_MODE === 'true',
    },
  }

  // ---- Environment configuration check ----
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ]
  const optionalEnvVars = [
    'SUPABASE_SERVICE_ROLE_KEY',
    'PAYTR_MERCHANT_ID',
    'PAYTR_MERCHANT_KEY',
    'PAYTR_MERCHANT_SALT',
    'CSRF_SECRET',
  ]

  const missingRequired = requiredEnvVars.filter(v => !process.env[v])
  const missingOptional = optionalEnvVars.filter(v => !process.env[v])

  checks.configuration = {
    status: missingRequired.length > 0 ? 'degraded' : 'healthy',
    // Don't expose specific variable names in production
    ...(process.env.NODE_ENV === 'development' && {
      details: {
        missingRequired: missingRequired.length > 0 ? missingRequired : undefined,
        missingOptional: missingOptional.length > 0 ? missingOptional : undefined,
      },
    }),
  }

  // ---- Memory usage ----
  if (typeof process !== 'undefined' && process.memoryUsage) {
    const mem = process.memoryUsage()
    const heapUsedMB = Math.round(mem.heapUsed / 1024 / 1024)
    const heapTotalMB = Math.round(mem.heapTotal / 1024 / 1024)
    const rssMB = Math.round(mem.rss / 1024 / 1024)

    checks.memory = {
      status: heapUsedMB > 400 ? 'degraded' : 'healthy',
      details: {
        heapUsedMB,
        heapTotalMB,
        rssMB,
        heapUtilization: `${Math.round((mem.heapUsed / mem.heapTotal) * 100)}%`,
      },
    }
  }

  // ---- Overall status ----
  const statuses = Object.values(checks).map(c => c.status)
  const hasUnhealthy = statuses.includes('unhealthy')
  const hasDegraded = statuses.includes('degraded')
  const overallStatus = hasUnhealthy ? 'unhealthy' : hasDegraded ? 'degraded' : 'healthy'

  const totalLatency = Date.now() - checkStartTime

  return NextResponse.json(
    {
      status: overallStatus,
      version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || 'local',
      environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'development',
      uptime: Math.floor((Date.now() - startTime) / 1000),
      timestamp: new Date().toISOString(),
      responseTime: totalLatency,
      checks,
    },
    {
      status: overallStatus === 'healthy' ? 200 : 503,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    }
  )
}
