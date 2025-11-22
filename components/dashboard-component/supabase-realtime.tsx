'use client'
import { useEffect, useState, useCallback } from 'react'
import { SectionCards } from '@/components/section-cards'
import { MetricsCards } from '@/components/metrics-cards'
import { createClient } from '@/utils/supabase/client'
import { AnalyticsRealtime } from '@/lib/utils' // move interface there, or adjust import
import { buildAnalyticsSeries } from '@/lib/utils'

interface AnalyticsFeedProps {
  initialHistory?: AnalyticsRealtime[] | null
  averagedAnalytics?: AnalyticsRealtime | null // aggregated averages for tiles
}

export function AnalyticsFeed({ initialHistory, averagedAnalytics }: AnalyticsFeedProps) {
  const supabase = createClient()
  const [history, setHistory] = useState<AnalyticsRealtime[]>(initialHistory || [])
  const [loading, setLoading] = useState(!initialHistory?.length)
  const [error, setError] = useState<string | null>(null)

  // Fetch last 7 days snapshot history (no realtime channel needed unless enabled)
  const refresh = useCallback(async () => {
    try {
      const sevenDaysAgoIso = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      const { data, error } = await supabase
        .from('analytics_snapshot_minute')
        .select('*')
        .gte('ts', sevenDaysAgoIso)
        .order('ts', { ascending: true })
      if (error) throw error
      if (data) setHistory(data as AnalyticsRealtime[])
      setError(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  // Initial fetch if none passed
  useEffect(() => {
    if (!initialHistory?.length) {
      void refresh()
    }
  }, [initialHistory?.length, refresh])

  // (Realtime subscription removed for snapshot table; enable if table has realtime.)

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

  // If average object provided, prefer it for tile display; otherwise latest row.
  const latest = averagedAnalytics || (history.length ? history[history.length - 1] : null)

  return (
    <>
      {error && (
        <div className="px-4 text-xs text-red-500">
          Data error: {error} (retrying passively)
        </div>
      )}
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