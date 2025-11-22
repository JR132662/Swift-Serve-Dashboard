"use client"

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Timer, Flame, Wrench, Users, Clock, Activity } from "lucide-react"

import { AreaChart, Area } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { AnalyticsRealtime, formatDuration, buildAnalyticsSeries } from "@/lib/utils"

interface SectionCardsProps {
  analytics?: AnalyticsRealtime | null
  history?: AnalyticsRealtime[] | null
}

export function SectionCards({ analytics, history }: SectionCardsProps) {
  // Derive display strings with graceful fallbacks
  const queueWait = formatDuration(analytics?.queue_p50_wait_ms)
  // Optionally show p90 wait if available: choose representation (e.g., tooltip or second line)
  const queueWaitP90 = formatDuration(analytics?.queue_p90_wait_ms)
  const cookTime = formatDuration(analytics?.cook_p50_ms)
  const assemblyTime = formatDuration(analytics?.assembly_p50_ms)
  const totalCustomerWait = formatDuration(analytics?.total_customer_wait_p50_ms)
  const afterOrderAvg = formatDuration(analytics?.after_order_avg_ms)
  const ordersPerHour = analytics?.orders_last_hour ?? null

  const series = buildAnalyticsSeries(history)
  const ordersSeries = series.length ? series : [{ id: 1, orders_per_hour: ordersPerHour ?? 0 }]

  return (
    <div className="*:data-[slot=card]:from-primary/6 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-6">
      {/* Queue Wait Time */}
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Timer className="size-4 text-primary/80" aria-hidden="true" />
            <CardDescription>Queue Wait Time</CardDescription>
          </div>
          <CardTitle className="text-xl font-semibold tabular-nums @[150px]/card:text-3xl flex flex-col">
            <span>{queueWait}</span>
            {analytics?.queue_p90_wait_ms != null && analytics.queue_p90_wait_ms > 0 && (
              <span className="text-xs font-normal text-muted-foreground">P90: {queueWaitP90}</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm" />
      </Card>

      {/* Cook Time */}
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Flame className="size-4 text-primary/80" aria-hidden="true" />
            <CardDescription>Cook Time</CardDescription>
          </div>
          <CardTitle className="text-xl font-semibold tabular-nums @[150px]/card:text-3xl">
            {cookTime}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm" />
      </Card>

      {/* Assembly Time */}
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Wrench className="size-4 text-primary/80" aria-hidden="true" />
            <CardDescription>Assembly Time</CardDescription>
          </div>
          <CardTitle className="text-xl font-semibold tabular-nums @[150px]/card:text-3xl">
            {assemblyTime}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm" />
      </Card>

      {/* Total Customer Wait */}
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="size-4 text-primary/80" aria-hidden="true" />
            <CardDescription>Total Customer Wait</CardDescription>
          </div>
          <CardTitle className="text-xl font-semibold tabular-nums @[150px]/card:text-3xl">
            {totalCustomerWait}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm" />
      </Card>

      {/* Avg Dwell After */}
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="size-4 text-primary/80" aria-hidden="true" />
            <CardDescription>Avg Dwell After</CardDescription>
          </div>
          <CardTitle className="text-xl font-semibold tabular-nums @[150px]/card:text-3xl">
            {afterOrderAvg}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm" />
      </Card>

      {/* Orders per Hour sparkline (real history fallback to single point) */}
      <Card className="@container/card relative overflow-hidden">
        <ChartContainer
          id="orders-spark"
          className="pointer-events-none absolute inset-0 aspect-auto h-full [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.5),rgba(0,0,0,0.9))]"
          config={{ series: { color: "hsl(var(--primary))" } }}
        >
          <AreaChart data={ordersSeries} margin={{ top: 18, right: 8, left: 8, bottom: 18 }}>
            <Area
              type="monotone"
              dataKey="orders_per_hour"
              stroke="var(--primary)"
              strokeWidth={2.5}
              strokeOpacity={0.95}
              fill="var(--primary)"
              fillOpacity={0.2}
              dot={false}
            />
          </AreaChart>
        </ChartContainer>

        <CardHeader className="relative">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Activity className="size-4 text-primary/80" aria-hidden="true" />
            <CardDescription>Orders (Last Hour)</CardDescription>
          </div>
          <CardTitle className="text-xl font-semibold tabular-nums @[150px]/card:text-3xl">
            {ordersPerHour ?? "—"}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm" />
      </Card>
    </div>
  )
}
