import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { createClient } from '@/utils/supabase/server'
import { AnalyticsFeed } from '@/components/dashboard-component/supabase-realtime'
import { AnalyticsRealtime } from '@/lib/utils'
import { cookies } from "next/headers"

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

  // Build a pseudo latest analytics object for tiles (keep shape expected by components).
  // Client handles averaging dynamically; keep variable removed
  // Fetch verify route (cookies are forwarded automatically in server components)
  const res = await fetch("http://localhost:8080/user/verify", {
    method: "GET",
    credentials: "include",
    headers: {
      Cookie: cookies().toString(), // ⭐ this magically forwards HttpOnly cookies
    },
    cache: "no-store",
  })

  const data = await res.json()

  console.log("VERIFY RESULT (server):", data)

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
              <AnalyticsFeed initialHistory={rows as AnalyticsRealtime[] | null} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
