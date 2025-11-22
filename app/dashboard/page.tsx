import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { createClient } from '@/utils/supabase/server'
import { AnalyticsFeed } from '@/components/dashboard-component/supabase-realtime'
import { AnalyticsRealtime, computeAnalyticsAverages } from '@/lib/utils'

export const revalidate = 0 // ensure dynamic

export default async function Page() {
  // Optional: SSR initial snapshot (not strictly needed)
  const supabase = await createClient()
  const sevenDaysAgoIso = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const { data: rows } = await supabase
    .from('analytics_snapshot_minute')
    .select('*')
    .gte('ts', sevenDaysAgoIso)
    .order('ts', { ascending: true })

  console.log(rows);

  // Compute averages over last 7 days (null if no values)
  const averages = computeAnalyticsAverages(rows as AnalyticsRealtime[] | null)

  console.log(averages);
  // Build a pseudo latest analytics object for tiles (keep shape expected by components).
  const averagedAnalytics: AnalyticsRealtime | null = rows && rows.length ? {
    id: -1,
    ts: new Date().toISOString(),
    jetson_id: rows[rows.length - 1].jetson_id, // reuse last jetson_id (or 0)
    queue_p50_wait_ms: averages.queue_p50_wait_ms ?? 0,
    queue_p90_wait_ms: averages.queue_p90_wait_ms ?? 0,
    cook_p50_ms: averages.cook_p50_ms ?? 0,
    assembly_p50_ms: averages.assembly_p50_ms ?? 0,
    total_customer_wait_p50_ms: averages.total_customer_wait_p50_ms ?? 0,
    after_order_avg_ms: averages.after_order_avg_ms ?? 0,
    abandon_rate_pct: averages.abandon_rate_pct ?? 0,
    avg_queue_dwell_ms: averages.avg_queue_dwell_ms ?? 0,
    queue_current_count: averages.queue_current_count ?? 0,
    orders_last_hour: 0, // not part of requested averages set for tiles now
    sessions_active: 0,
  } : null

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {/* Pass both raw history (for charts) and averaged snapshot analytics for tiles */}
              <AnalyticsFeed initialHistory={rows as AnalyticsRealtime[] | null} averagedAnalytics={averagedAnalytics} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
