"use client"
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import mockData from "../data/mock-Data"
import TrafficHeatmap from "@/components/traffic-heatmap"
import useHeatmapStream from "@/hooks/use-heatmap"
import { Timer, Flame, Lightbulb, Camera, Scan, TrendingDown, Clock, ShoppingCart } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function MetricsCards() {
  // derive values for "Order Count vs POS Orders" tile
  const latest = (mockData as any[])[(mockData as any[]).length - 1] as any
  const posOrders = Number(latest?.orders_per_hour ?? 0)
  // Approximate hand-offs per hour as ~8.5% of POS orders (to mirror screenshot ratio)
  const handOffsPerHr = Math.round(posOrders * 0.085 * 10) / 10
  const maxOrders = Math.max(
    posOrders,
    ...((mockData as any[]) || []).map((d: any) => Number(d?.orders_per_hour ?? 0))
  ) || 1

  // Heatmap demo data (rows x cols) prepared from mock series for future plug-in with your system
  const heatRows = 7
  const heatCols = 12
  const heatmapData: number[][] = Array.from({ length: heatRows }, (_, r) =>
    Array.from({ length: heatCols }, (_, c) => {
      const series = (mockData as any[])
      const base = Number(series[(c * 2) % series.length]?.orders_per_hour ?? 0)
      const modulation = (Math.sin((r + c / heatCols) * Math.PI / 3) + 1) * 0.5 // 0..1
      return Math.round(base * (0.6 + 0.6 * modulation))
    })
  )
  const heatRowLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const heatColLabels = ["9a","10a","11a","12p","1p","2p","3p","4p","5p","6p","7p","8p"]
  const heatOverlay = [
    { points: [ [0.2, 6.5], [2.5, 6.0], [4.8, 5.2], [7.2, 4.2], [10.6, 3.0], [11.8, 2.6] ], color: "#f59e0b", width: 0.2, opacity: 0.9 },
    { points: [ [0.1, 4.8], [2.2, 4.4], [4.2, 3.6], [6.5, 2.8], [9.0, 2.4], [11.7, 2.0] ], color: "#ef4444", width: 0.16, opacity: 0.8 },
    { points: [ [0.3, 6.9], [3.2, 6.4], [5.6, 5.8], [8.0, 5.1], [10.4, 4.3], [11.7, 3.9] ], color: "#22c55e", width: 0.16, opacity: 0.85 },
  ] as const

  // Real-time heatmap stream (if NEXT_PUBLIC_HEATMAP_WS is configured)
  const { connected, grid: liveGrid } = useHeatmapStream({ rows: 32, cols: 48, decay: 0.93, intervalMs: 250, windowMs: 30_000 })

  return (
  <div className="bento-box grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[minmax(160px,auto)] gap-4 px-4 py-6 rounded-3xl">
      {/* 1. Queue Wait Time */}
  <Card className="@container/card flex flex-col overflow-hidden">
        <CardHeader className="pb-2 pt-4 px-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Timer className="size-4 text-primary/80" aria-hidden="true" />
            <CardTitle>Queue Wait Time</CardTitle>
          </div>
        </CardHeader>
        <ChartContainer
          id="queue-wait"
          className="relative w-full flex-1 min-h-[90px] px-2"
          config={{ series: { color: "var(--primary)" } }}
        >
          {/* Queue wait time in minutes, Y axis shows 2min, 5min, 12min markers */}
          <AreaChart data={mockData} margin={{ top: 0, right: 10, left: -30, bottom: 20 }}>
            <XAxis
              dataKey="id"
              type="number"
              domain={[1, 24]}
              ticks={[1, 4, 8, 12, 16, 20, 24]}
              tickFormatter={(v) => `${v}h`}
              axisLine={{ stroke: 'var(--primary)', opacity: 0.2 }}
              tickLine={false}
              allowDataOverflow={true}
            />
            <YAxis
              domain={[0, 720]}
              ticks={[120, 300, 720]}
              width={60}
              tickFormatter={(v) => {
                const mins = Math.round(v / 60)
                return `${mins}m`
              }}
              stroke="var(--primary)"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: 'var(--primary)', opacity: 0.2 }}
              tick={{ fontWeight: 600 }}
            />
            {/* reference lines */}
            <CartesianGrid horizontal vertical={false} strokeDasharray="3 3" stroke="var(--primary)" opacity={0.1} y={120} />
            <CartesianGrid horizontal vertical={false} strokeDasharray="3 3" stroke="var(--primary)" opacity={0.1} y={300} />
            <CartesianGrid horizontal vertical={false} strokeDasharray="3 3" stroke="var(--primary)" opacity={0.1} y={720} />
            <Tooltip
              content={
                <ChartTooltipContent
                  className="!bg-black/90 !text-white border-0 z-50 shadow-lg backdrop-blur-sm [&_.text-muted-foreground]:!text-white [&_.text-foreground]:!text-white"
                  style={{ backgroundColor: 'rgba(0,0,0,0.9)', color: '#fff' }}
                  formatter={(value: any) => `${value}m`}
                  labelFormatter={(value: any, payload: any) => {
                    const item = Array.isArray(payload) && payload.length ? payload[0] : null
                    const key = item?.dataKey || item?.name || "value"
                    return String(key)
                  }}
                />
              }
            />
            <Area type="monotone" dataKey="average_customer_wait" stroke="var(--primary)" strokeOpacity={0.95} fill="var(--primary)" fillOpacity={0.2} strokeWidth={2.5} dot={false} />
          </AreaChart>
        </ChartContainer>
      </Card>

      {/* 2. Cook Time Trend */}
  <Card className="@container/card flex flex-col overflow-hidden">
        <CardHeader className="pb-2 pt-4 px-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Flame className="size-4 text-primary/80" aria-hidden="true" />
            <CardTitle>Cook Time Trend</CardTitle>
          </div>
        </CardHeader>
        <ChartContainer
          id="cook-time"
          className="relative w-full flex-1 min-h-[90px] px-2"
          config={{ series: { color: "var(--primary)" } }}
        >
          <AreaChart data={mockData} margin={{ top: 0, right: 0, left: 0, bottom: 12 }}>
            <XAxis dataKey="id" type="number" tickFormatter={(v) => String(v)} axisLine={{ stroke: 'var(--primary)', opacity: 0.2 }} tickLine={false} />
            <YAxis
              domain={[0, 600]}
              ticks={[120, 240, 360, 480, 600]}
              width={40}
              tickFormatter={(v) => `${Math.round(v / 60)}m`}
              stroke="var(--primary)"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: 'var(--primary)', opacity: 0.2 }}
              tick={{ fontWeight: 600 }}
            />
            <Tooltip
              content={
                <ChartTooltipContent
                  className="bg-black text-white border-0 opacity-100"
                  style={{ backgroundColor: '#000', color: '#fff' }}
                  formatter={(value: any) => String(value)}
                  labelFormatter={(value: any, payload: any) => {
                    const item = Array.isArray(payload) && payload.length ? payload[0] : null
                    const key = item?.dataKey || item?.name || "value"
                    return String(key)
                  }}
                />
              }
            />
            <Area type="monotone" dataKey="cook_time" stroke="var(--primary)" strokeOpacity={0.95} fill="var(--primary)" fillOpacity={0.2} strokeWidth={2.5} dot={false} />
          </AreaChart>
        </ChartContainer>
      </Card>

      {/* 3. Suggestions */}
  <Card className="@container/card flex flex-col overflow-hidden">
        <CardHeader className="pb-2 pt-4 px-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Lightbulb className="size-4 text-primary/80" aria-hidden="true" />
            <CardTitle>Suggestions & Alerts</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="relative z-10 flex-1 text-muted-foreground">
          <div className="w-full h-full min-h-[90px] rounded bg-muted/5 border border-dashed border-muted/20 flex items-center justify-center">
            No suggestions yet
          </div>
        </CardContent>
      </Card>

      {/* 4. Rush Hour Forecast */}
  <Card className="@container/card flex flex-col overflow-hidden">
        <CardHeader className="pb-2 pt-4 px-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="size-4 text-primary/80" aria-hidden="true" />
            <CardTitle>Rush Hour Forecast</CardTitle>
          </div>
        </CardHeader>
        <ChartContainer
          id="rush-hour"
          className="relative w-full flex-1 min-h-[90px] px-2"
          config={{ series: { color: "var(--primary)" } }}
        >
          <AreaChart data={mockData} margin={{ top: 0, right: 0, left: 0, bottom: 12 }}>
            <XAxis dataKey="id" type="number" tickFormatter={(v) => String(v)} axisLine={{ stroke: 'var(--primary)', opacity: 0.2 }} tickLine={false} />
            <YAxis
              domain={[9, 17]}
              ticks={[9, 11, 13, 15, 17]}
              width={40}
              tickFormatter={(v) => `${v}:00`}
              stroke="var(--primary)"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: 'var(--primary)', opacity: 0.2 }}
              tick={{ fontWeight: 600 }}
            />
            <Tooltip
              content={
                <ChartTooltipContent
                  className="bg-black text-white border-0 opacity-100"
                  style={{ backgroundColor: '#000', color: '#fff' }}
                  formatter={(value: any) => String(value)}
                  labelFormatter={(value: any, payload: any) => {
                    const item = Array.isArray(payload) && payload.length ? payload[0] : null
                    const key = item?.dataKey || item?.name || "value"
                    return String(key)
                  }}
                />
              }
            />
            <Area type="monotone" dataKey="orders_per_hour" stroke="var(--primary)" strokeOpacity={0.95} fill="var(--primary)" fillOpacity={0.2} strokeWidth={2.5} dot={false} />
          </AreaChart>
        </ChartContainer>
      </Card>

      {/* 5. Cameras (like Pickup Zone / Front Counter) */}
  <Card className="@container/card flex flex-col overflow-hidden">
        <CardHeader>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Camera className="size-4 text-primary/80" aria-hidden="true" />
            <CardTitle>Cameras</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="relative z-10 flex flex-col gap-3">
          <div className="w-full h-20 rounded bg-muted/10 border border-dashed border-muted/30 flex items-center justify-center">Pickup Zone</div>
          <div className="w-full h-20 rounded bg-muted/10 border border-dashed border-muted/30 flex items-center justify-center">Front Counter</div>
        </CardContent>
      </Card>

      

      {/* 5. Traffic Heatmap */}
  <Card className="@container/card flex flex-col overflow-hidden">
        <CardHeader>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Scan className="size-4 text-primary/80" aria-hidden="true" />
            <CardTitle>Traffic Heatmap</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="relative z-10 flex-1">
          <div className="relative w-full h-full min-h-[90px] rounded bg-muted/5 border border-border/30 overflow-hidden">
            <TrafficHeatmap
              className="absolute inset-0"
              data={(liveGrid && liveGrid.length && liveGrid[0]?.length) ? (liveGrid as any) : heatmapData}
              rowLabels={heatRowLabels}
              colLabels={heatColLabels}
              baseColor="#3b82f6"
              overlayPaths={heatOverlay as any}
              fit="cover"
              showLegend
              legendLabel="Traffic intensity"
            />
          </div>
        </CardContent>
      </Card>

      {/* 6. Abandon Rate */}
  <Card className="@container/card flex flex-col overflow-hidden">
        <CardHeader className="pb-2 pt-4 px-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingDown className="size-4 text-primary/80" aria-hidden="true" />
            <CardTitle>Abandon Rate</CardTitle>
          </div>
        </CardHeader>
        <ChartContainer
          id="abandon-rate"
          className="relative w-full flex-1 min-h-[90px] px-2"
          config={{ series: { color: "var(--primary)" } }}
        >
          <AreaChart data={mockData} margin={{ top: 0, right: 0, left: 0, bottom: 12 }}>
            <XAxis dataKey="id" type="number" tickFormatter={(v) => `${v}h`} axisLine={{ stroke: 'var(--primary)', opacity: 0.2 }} tickLine={false} />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              width={40}
              tickFormatter={(v) => `${v}%`}
              stroke="var(--primary)"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: 'var(--primary)', opacity: 0.2 }}
              tick={{ fontWeight: 600 }}
            />
            <Tooltip
              content={
                <ChartTooltipContent
                  className="bg-black text-white border-0 opacity-100"
                  style={{ backgroundColor: '#000', color: '#fff' }}
                  formatter={(value: any) => String(value)}
                  labelFormatter={(value: any, payload: any) => {
                    const item = Array.isArray(payload) && payload.length ? payload[0] : null
                    const key = item?.dataKey || item?.name || "value"
                    return String(key)
                  }}
                />
              }
            />
            <Area type="monotone" dataKey="abandon_rate" stroke="var(--primary)" strokeOpacity={0.95} fill="var(--primary)" fillOpacity={0.2} strokeWidth={2.5} dot={false} />
          </AreaChart>
        </ChartContainer>
      </Card>

      {/* 7. Sandwich Count vs POS */}
  <Card className="@container/card flex flex-col overflow-hidden">
        <CardHeader>
          <div className="flex items-center gap-2 text-muted-foreground">
            <ShoppingCart className="size-4 text-primary/80" aria-hidden="true" />
            <CardTitle>Sandwich Count vs POS Orders</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="relative z-10 flex-1">
          <div className="space-y-4">
            {/* Hand-offs/hr */}
            <div className="text-center">
              <div className="text-muted-foreground text-xs">Hand-offs/hr</div>
              <div className="font-mono tabular-nums text-base md:text-lg">{handOffsPerHr.toFixed(1)}</div>
            </div>
            <div className="h-3 w-full rounded bg-muted/20 overflow-hidden mx-auto">
              <div
                className="h-full rounded bg-amber-400"
                style={{ width: `${Math.min(100, (handOffsPerHr / maxOrders) * 100)}%` }}
              />
            </div>

            {/* POS Orders/hr */}
            <div className="text-center pt-1">
              <div className="text-muted-foreground text-xs">POS Orders/hr</div>
              <div className="font-mono tabular-nums text-base md:text-lg">{posOrders}</div>
            </div>
            <div className="h-3 w-full rounded bg-muted/20 overflow-hidden mx-auto">
              <div
                className="h-full rounded"
                style={{
                  width: `${Math.min(100, (posOrders / maxOrders) * 100)}%`,
                  background: 'var(--primary)'
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      
    </div>
  )
}