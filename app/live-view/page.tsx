import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { createClient } from '@/utils/supabase/server'
import VideoPlayer from '@/components/video-player'

export const revalidate = 0 // ensure dynamic

export default async function Page() {
  // Optional: SSR initial snapshot (not strictly needed)
  const supabase = await createClient()
  const { data: rows } = await supabase
    .from('analytics_realtime')
    .select('*')
    .order('ts', { ascending: true })

  
  const HLS_URL =
    "https://rytjsfbyuamtmorciyka.supabase.co/storage/v1/object/public/hls-streams/jetson_1/front/index.m3u8";

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
        <div className="flex flex-1 flex-col p-8">
            <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
          <VideoPlayer
            src={HLS_URL}
            className="w-full h-full object-contain"
            autoPlay
            muted
            controls
          />
        </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
