'use client'
import { useEffect, useState, useCallback } from 'react'
import { SectionCards } from '@/components/section-cards'
import { MetricsCards } from '@/components/metrics-cards'
import { createClient } from '@/utils/supabase/client'
import { AnalyticsRealtime, computeAnalyticsAverages } from '@/lib/utils'
import { TimeRangeControls } from './time-range-controls'

interface AnalyticsFeedProps {
  initialHistory?: AnalyticsRealtime[] | null
}

export function AnalyticsFeed({ initialHistory }: AnalyticsFeedProps) {
  const supabase = createClient()
  const nowIso = new Date().toISOString()
  const defaultFromIso = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const [rangeStart, setRangeStart] = useState<string>(defaultFromIso)
  const [rangeEnd, setRangeEnd] = useState<string>(nowIso)
  const [history, setHistory] = useState<AnalyticsRealtime[]>(initialHistory || [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [averagedAnalytics, setAveragedAnalytics] = useState<AnalyticsRealtime | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('analytics_snapshot_minute')
        .select('*')
        .gte('ts', rangeStart)
        .lte('ts', rangeEnd)
        .order('ts', { ascending: true })
      if (error) throw error
      const rows = (data || []) as AnalyticsRealtime[]
      setHistory(rows)
      const avg = computeAnalyticsAverages(rows)
      const averaged: AnalyticsRealtime | null = rows.length ? {
        id: -1,
        ts: rangeEnd,
        jetson_id: rows[rows.length - 1].jetson_id,
        queue_p50_wait_ms: avg.queue_p50_wait_ms ?? 0,
        queue_p90_wait_ms: avg.queue_p90_wait_ms ?? 0,
        cook_p50_ms: avg.cook_p50_ms ?? 0,
        assembly_p50_ms: avg.assembly_p50_ms ?? 0,
        total_customer_wait_p50_ms: avg.total_customer_wait_p50_ms ?? 0,
        after_order_avg_ms: avg.after_order_avg_ms ?? 0,
        abandon_rate_pct: avg.abandon_rate_pct ?? 0,
        avg_queue_dwell_ms: avg.avg_queue_dwell_ms ?? 0,
        queue_current_count: avg.queue_current_count ?? 0,
        orders_last_hour: 0,
        sessions_active: 0,
      } : null
      setAveragedAnalytics(averaged)
      setError(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [supabase, rangeStart, rangeEnd])

  // Initial fetch if none passed
  useEffect(() => { void refresh() }, [refresh])

  // Re-fetch every 30s only if viewing near real-time (end within last 2 min)
  const nearRealTime = new Date(rangeEnd).getTime() > Date.now() - 120000
  useEffect(() => {
    if (!nearRealTime) return
    const id = setInterval(() => refresh(), 30000)
    return () => clearInterval(id)
  }, [nearRealTime, refresh])

  // Optional fallback polling if realtime disconnects
  useEffect(() => {
    let alive = true
    const POLL_MS = 30000 // occasional resilience poll
    const id = setInterval(() => {
      if (alive) void refresh()
    }, POLL_MS)
    return () => {
      alive = false
      clearInterval(id)
    }
  }, [refresh])

  const latest = averagedAnalytics || (history.length ? history[history.length - 1] : null)

  function handleRangeChange(start: string, end: string) {
    setRangeStart(start)
    setRangeEnd(end)
  }

  return (
    <>
      <TimeRangeControls
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        onChange={handleRangeChange}
        loading={loading}
      />
      {error && <div className="px-4 text-xs text-red-500">Data error: {error}</div>}
      <SectionCards analytics={latest} history={history} />
      <div className="px-4 lg:px-6">
        <MetricsCards analytics={latest} history={history} />
      </div>
      {loading && (
        <div className="px-4 py-2 text-xs text-muted-foreground">
          Loading analytics…
        </div>
      )}
    </>
  )
}