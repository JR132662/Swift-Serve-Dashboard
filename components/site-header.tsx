import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/ui/mode-toggle"
import LogoutButton from "@/components/logout-button"
import { ThemeSelector } from "./theme-selector"
import { ExportPdfButton } from './export-pdf-button'
import { WeatherWidget } from './weather-widget'

export function SiteHeader() {
  return (
    <header className="flex h-auto md:h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear flex-wrap px-2 md:px-0">
      <div className="flex w-full items-center gap-1 px-2 md:px-4 lg:gap-2 lg:px-6 flex-wrap">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-sm md:text-base font-medium mr-2 truncate max-w-[40%]">SwiftServe</h1>
        <div className="ml-auto flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <ExportPdfButton />
          <WeatherWidget />
          <div className="hidden sm:block">
            <ThemeSelector />
          </div>
          <ModeToggle />
          <LogoutButton />
        </div>
      </div>
    </header>
  )
}
