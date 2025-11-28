"use client"

import { IconCirclePlusFilled, type Icon } from "@tabler/icons-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

interface NavItem {
  title: string
  url: string
  icon?: Icon
}

export function NavMain({ items }: { items: NavItem[] }) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        {/* Quick action (turn into link to /dashboard or keep as button if it opens something) */}
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            {(() => {
              const dashActive = pathname === "/dashboard"
              return (
                <SidebarMenuButton
                  asChild
                  tooltip="Dashboard"
                  isActive={dashActive}
                  className="min-w-8 duration-200 ease-linear"
                  style={
                    dashActive
                      ? ({ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" } as React.CSSProperties)
                      : undefined
                  }
                >
                  <Link href="/dashboard">
                    <IconCirclePlusFilled />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              )
            })()}
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Main nav items */}
        <SidebarMenu>
          {items.map((item) => {
            const active = pathname === item.url
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={active}
                  style={
                    active
                      ? ({ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" } as React.CSSProperties)
                      : undefined
                  }
                >
                  <Link href={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
