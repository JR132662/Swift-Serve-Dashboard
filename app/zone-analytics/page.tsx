import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { createClient } from '@/utils/supabase/server'
import { AnalyticsFeed } from '@/components/dashboard-component/supabase-realtime'
import { AnalyticsRealtime } from '@/lib/utils'

export const revalidate = 0 // ensure dynamic

export default async function Page() {
  // Optional: SSR initial snapshot (not strictly needed)
  const supabase = await createClient()
  const { data: rows } = await supabase
    .from('analytics_realtime')
    .select('*')
    .order('ts', { ascending: true })

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
            <h1>Zone Analytics</h1>
          {/* <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <AnalyticsFeed initialHistory={rows as AnalyticsRealtime[] | null} />
            </div>
          </div> */}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
