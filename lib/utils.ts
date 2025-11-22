import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface AnalyticsRealtime {
  id: number
  ts: string
  jetson_id: number
  queue_p50_wait_ms: number
  queue_p90_wait_ms?: number // optional until populated
  cook_p50_ms: number
  assembly_p50_ms: number
  total_customer_wait_p50_ms: number
  after_order_avg_ms: number | null
  abandon_rate_pct: number | null
  avg_queue_dwell_ms?: number | null // new field (may be null)
  queue_current_count: number
  orders_last_hour: number
  sessions_active: number
}

export function formatDuration(ms: number | null | undefined) {
  if (ms == null || ms < 0) return "—"
  const secs = Math.round(ms / 1000)
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return m ? `${m}m ${String(s).padStart(2,'0')}s` : `${s}s`
}

// Build chart-friendly points
export function buildAnalyticsSeries(rows: AnalyticsRealtime[] | null | undefined) {
  const list = rows && rows.length ? rows : []
  // If no data yet, return empty array (caller will fallback)
  return list.map((r, idx) => {
    const date = new Date(r.ts)
    const hour = date.getHours() // 0-23 local
    return {
      // sequential index for X axes expecting "id"
      id: idx + 1,
      ts: r.ts,
      hour,
      queue_minutes: r.queue_p50_wait_ms / 60000,
      cook_minutes: r.cook_p50_ms / 60000,
      abandon_pct: r.abandon_rate_pct ?? 0,
      orders_per_hour: r.orders_last_hour,
      // keep raw for other needs
      raw: r,
    }
  })
}

// Compute averages over last N rows for requested metrics.
// Null/undefined are skipped; 0 counts as a value.
export function computeAnalyticsAverages(rows: AnalyticsRealtime[] | null | undefined) {
  const metrics = [
    'queue_p50_wait_ms',
    'queue_p90_wait_ms',
    'cook_p50_ms',
    'assembly_p50_ms',
    'total_customer_wait_p50_ms',
    'after_order_avg_ms',
    'avg_queue_dwell_ms',
    'abandon_rate_pct',
    'queue_current_count'
  ] as const

  type Key = typeof metrics[number]
  const acc: Record<Key, number> = {
    queue_p50_wait_ms: 0,
    queue_p90_wait_ms: 0,
    cook_p50_ms: 0,
    assembly_p50_ms: 0,
    total_customer_wait_p50_ms: 0,
    after_order_avg_ms: 0,
    avg_queue_dwell_ms: 0,
    abandon_rate_pct: 0,
    queue_current_count: 0,
  }
  const counts: Record<Key, number> = {
    queue_p50_wait_ms: 0,
    queue_p90_wait_ms: 0,
    cook_p50_ms: 0,
    assembly_p50_ms: 0,
    total_customer_wait_p50_ms: 0,
    after_order_avg_ms: 0,
    avg_queue_dwell_ms: 0,
    abandon_rate_pct: 0,
    queue_current_count: 0,
  }
  const list = rows || []
  list.forEach(r => {
    metrics.forEach(k => {
      const v = r[k as keyof AnalyticsRealtime] as unknown as number | null | undefined
      if (v !== null && v !== undefined) {
        acc[k] += v
        counts[k] += 1
      }
    })
  })
  const averages: Record<Key, number | null> = {} as any
  metrics.forEach(k => {
    averages[k] = counts[k] ? acc[k] / counts[k] : null
  })
  return averages
}
