"use client"
import { useMemo } from "react"
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import mockData from "../data/mock-Data"
import TrafficHeatmap from "@/components/traffic-heatmap"
import useHeatmapStream from "@/hooks/use-heatmap"
import {
  Timer,
  Flame,
  Lightbulb,
  Camera,
  Scan,
  TrendingDown,
  Clock,
  ShoppingCart,
  AlertTriangle,
  Info,
  ShieldCheck,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AnalyticsRealtime, formatDuration, buildAnalyticsSeries } from "@/lib/utils"
import {
  generateOperationalSuggestions,
  type SuggestionSeverity,
} from "@/lib/suggestions"
import { useSuggestionPanelState } from "@/hooks/use-suggestions-panel"

interface MetricsCardsProps {
  analytics?: AnalyticsRealtime | null
  history?: AnalyticsRealtime[] | null
}

const severityStyles: Record<
  SuggestionSeverity,
  { label: string; badgeClass: string; textClass: string; icon: LucideIcon }
> = {
  critical: {
    label: "Critical",
    badgeClass: "border-red-500/40 bg-red-500/5",
    textClass: "text-red-500",
    icon: AlertTriangle,
  },
  warning: {
    label: "Watch",
    badgeClass: "border-amber-500/40 bg-amber-500/5",
    textClass: "text-amber-500",
    icon: Info,
  },
  info: {
    label: "Info",
    badgeClass: "border-emerald-500/30 bg-emerald-500/5",
    textClass: "text-emerald-500",
    icon: ShieldCheck,
  },
}

export function MetricsCards({ analytics, history }: MetricsCardsProps) {
  const series = useMemo(() => {
    const built = buildAnalyticsSeries(history)
    if (built.length) return built
    return (mockData as any[]).map((d: any, idx: number) => ({
      id: d.id ?? idx + 1,
      queue_minutes: d.average_customer_wait ? d.average_customer_wait / 60 : 0,
      cook_minutes: d.cook_time ? d.cook_time / 60 : 0,
      abandon_pct: d.abandon_rate ?? 0,
      orders_per_hour: d.orders_per_hour ?? 0,
      // fallback hour sequence (10 + idx) just to show something
      hour: 10 + idx,
      raw: d,
    }))
  }, [history])

  // Hourly aggregation for Rush Hour (10a–12a)
  const hourlyBuckets = useMemo(() => {
    // map hour -> array of counts
    const map: Record<number, number[]> = {}
    series.forEach((p) => {
      if (!p.raw) return
      let h = new Date(p.raw.ts ?? "").getHours()
      // treat midnight (0) as 24 to place at end of day
      if (h === 0) h = 24
      if (h < 10 || h > 24) return
      map[h] = map[h] || []
      map[h].push(p.orders_per_hour || 0)
    })
    // ensure every hour slot exists 10..24
    return Array.from({ length: 15 }, (_, i) => {
      const hour = 10 + i // 10..24
      const arr = map[hour] || []
      const avg = arr.length
        ? arr.reduce((a, b) => a + b, 0) / arr.length
        : 0
      return { hour, avg_orders: Number(avg.toFixed(2)) }
    })
  }, [series])

  const maxHourly = Math.max(1, ...hourlyBuckets.map((h) => h.avg_orders))

  // Hour label formatter
  const formatHour = (h: number) => {
    if (h === 24) return "12a"
    if (h < 12) return `${h}a`
    if (h === 12) return "12p"
    const pm = h - 12
    return `${pm}p`
  }

  const queueWaitStr = formatDuration(analytics?.queue_p50_wait_ms)
  const cookTimeStr = formatDuration(analytics?.cook_p50_ms)
  const abandonRatePct =
    analytics?.abandon_rate_pct != null
      ? `${analytics.abandon_rate_pct.toFixed(0)}%`
      : "—"
  const ordersLastHour = analytics?.orders_last_hour ?? null

  const posOrders = ordersLastHour ?? 0
  const handOffsPerHr = Math.round(posOrders * 0.085 * 10) / 10
  const maxOrders = Math.max(
    posOrders,
    ...series.map((d: any) => Number(d.orders_last_hour ?? 0)),
    1
  )

  const { connected, grid: liveGrid } = useHeatmapStream({
    rows: 32,
    cols: 48,
    decay: 0.93,
    intervalMs: 250,
    windowMs: 30_000,
  })

  const suggestions = useMemo(
    () =>
      generateOperationalSuggestions({
        latest: analytics ?? null,
        history: history ?? null,
      }),
    [analytics, history]
  )

  const {
    visibleSuggestions,
    dismissedSuggestions,
    dismissSuggestion,
    restoreSuggestion,
    updateNote,
    getNote,
  } = useSuggestionPanelState(suggestions)

  return (
    <div className="bento-box grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[minmax(160px,auto)] gap-4 px-4 py-6 rounded-3xl">
      {/* Queue Wait Time */}
      <Card className="@container/card flex flex-col overflow-hidden">
        <CardHeader className="pb-2 pt-4 px-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Timer className="size-4 text-primary/80" aria-hidden="true" />
            <CardTitle>Queue Wait Time</CardTitle>
          </div>
          <CardDescription className="font-mono tabular-nums text-sm">
            {queueWaitStr}
          </CardDescription>
        </CardHeader>
        <ChartContainer
          id="queue-wait"
          className="relative w-full flex-1 min-h-[90px] px-2"
          config={{ series: { color: "var(--primary)" } }}
        >
          <AreaChart
            data={series}
            margin={{ top: 0, right: 10, left: -30, bottom: 20 }}
          >
            <XAxis
              dataKey="id"
              type="number"
              ticks={[1, 4, 8, 12, 16, 20, 24].filter((t) => t <= series.length)}
              tickFormatter={(v) => `${v}h`}
              axisLine={{ stroke: "var(--primary)", opacity: 0.2 }}
              tickLine={false}
              allowDataOverflow
            />
            <YAxis
              domain={[0, 12]}
              ticks={[2, 5, 12]}
              width={42}
              tickFormatter={(v) => `${Math.round(v)}m`}
              stroke="var(--primary)"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: "var(--primary)", opacity: 0.2 }}
              tick={{ fontWeight: 600 }}
            />
            <CartesianGrid
              horizontal
              vertical={false}
              strokeDasharray="3 3"
              stroke="var(--primary)"
              opacity={0.1}
            />
            <Tooltip
              content={
                <ChartTooltipContent
                  className="!bg-black/90 !text-white border-0 z-50 shadow-lg backdrop-blur-sm"
                  formatter={(value: any) => `${Math.round(value)}m`}
                  labelFormatter={(value: any) => `Hour ${value}`}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="queue_minutes"
              stroke="var(--primary)"
              strokeOpacity={0.95}
              fill="var(--primary)"
              fillOpacity={0.2}
              strokeWidth={2.5}
              dot={false}
            />
          </AreaChart>
        </ChartContainer>
      </Card>

      {/* Cook Time Trend */}
      <Card className="@container/card flex flex-col overflow-hidden">
        <CardHeader className="pb-2 pt-4 px-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Flame className="size-4 text-primary/80" aria-hidden="true" />
            <CardTitle>Cook Time Trend</CardTitle>
          </div>
          <CardDescription className="font-mono tabular-nums text-sm">
            {cookTimeStr}
          </CardDescription>
        </CardHeader>
        <ChartContainer
          id="cook-time"
          className="relative w-full flex-1 min-h-[90px] px-2"
          config={{ series: { color: "var(--primary)" } }}
        >
          <AreaChart
            data={series}
            margin={{ top: 0, right: 0, left: 0, bottom: 12 }}
          >
            <XAxis
              dataKey="id"
              type="number"
              axisLine={{ stroke: "var(--primary)", opacity: 0.2 }}
              tickLine={false}
            />
            <YAxis
              domain={[0, 10]}
              ticks={[2, 4, 6, 8, 10]}
              width={40}
              tickFormatter={(v) => `${Math.round(v)}m`}
              stroke="var(--primary)"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "var(--primary)", opacity: 0.2 }}
              tick={{ fontWeight: 600 }}
            />
            <Tooltip
              content={
                <ChartTooltipContent
                  className="bg-black text-white border-0 opacity-100"
                  formatter={(value: any) => `${Math.round(value)}m`}
                  labelFormatter={(value: any) => `Pt ${value}`}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="cook_minutes"
              stroke="var(--primary)"
              strokeOpacity={0.95}
              fill="var(--primary)"
              fillOpacity={0.2}
              strokeWidth={2.5}
              dot={false}
            />
          </AreaChart>
        </ChartContainer>
      </Card>

      {/* Suggestions & Alerts */}
      <Card className="@container/card flex flex-col overflow-hidden">
        <CardHeader className="pb-2 pt-4 px-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Lightbulb className="size-4 text-primary/80" aria-hidden="true" />
            <CardTitle>Suggestions & Alerts</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="relative z-10 flex-1">
          {visibleSuggestions.length ? (
            <ul className="flex flex-col gap-3">
              {visibleSuggestions.map((suggestion) => {
                const meta = severityStyles[suggestion.severity]
                const Icon = meta.icon
                return (
                  <li
                    key={suggestion.id}
                    className={`rounded-2xl border px-3 py-3 text-sm ${meta.badgeClass}`}
                  >
                    <div className="flex items-center justify-between gap-2 font-medium">
                      <span className="flex items-center gap-2">
                        <Icon
                          className={`size-4 ${meta.textClass}`}
                          aria-hidden="true"
                        />
                        {suggestion.title}
                      </span>
                      <span
                        className={`text-[11px] font-semibold uppercase tracking-wide ${meta.textClass}`}
                      >
                        {meta.label}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {suggestion.description}
                    </p>
                    <div className="mt-2 text-[11px] font-medium text-muted-foreground/80">
                      {suggestion.metricSummary}
                    </div>
                    <textarea
                      className="mt-3 w-full rounded-2xl border border-muted/30 bg-background/80 p-2 text-xs text-muted-foreground outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/30"
                      rows={2}
                      placeholder="Add a quick shift note (saved locally)"
                      value={getNote(suggestion.id)}
                      onChange={(event) => updateNote(suggestion.id, event.target.value)}
                    />
                    <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>{getNote(suggestion.id) ? "Note saved" : "No note yet"}</span>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-6 px-2 text-[11px] font-semibold text-muted-foreground hover:text-foreground"
                        onClick={() => dismissSuggestion(suggestion.id)}
                      >
                        Dismiss
                      </Button>
                    </div>
                  </li>
                )
              })}
            </ul>
          ) : (
            <div className="w-full h-full min-h-[90px] rounded bg-muted/5 border border-dashed border-muted/20 flex items-center justify-center text-xs text-muted-foreground">
              {suggestions.length
                ? "All caught up — everything dismissed"
                : analytics
                  ? "Line looks healthy — no action needed"
                  : "Waiting for data..."}
            </div>
          )}
          {dismissedSuggestions.length ? (
            <div className="mt-4 rounded-2xl border border-dashed border-muted/30 bg-muted/5 p-3">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Dismissed
              </div>
              <ul className="mt-2 flex flex-col gap-2 text-xs text-muted-foreground">
                {dismissedSuggestions.map((suggestion) => (
                  <li key={suggestion.id} className="flex items-center justify-between gap-2">
                    <span className="truncate">{suggestion.title}</span>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-6 px-2 text-[11px] font-semibold text-muted-foreground hover:text-foreground"
                      onClick={() => restoreSuggestion(suggestion.id)}
                    >
                      Restore
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Rush Hour Forecast (solid theme color bars) */}
      <Card className="@container/card flex flex-col overflow-hidden">
        <CardHeader className="pb-2 pt-4 px-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="size-4 text-primary/80" aria-hidden="true" />
            <CardTitle>Rush Hour Forecast</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Avg orders per hour (10a–12a)
          </CardDescription>
        </CardHeader>
        <ChartContainer
          id="rush-hour"
          className="relative w-full flex-1 min-h-[110px] px-2"
          config={{
            series: { color: "var(--primary)", label: "Orders" },
            now: { color: "var(--primary)", label: "Current" },
          }}
        >
          <BarChart
            data={hourlyBuckets}
            margin={{ top: 4, right: 4, left: 4, bottom: 10 }}
          >
            <XAxis
              dataKey="hour"
              ticks={hourlyBuckets.map(h => h.hour)}
              tickFormatter={formatHour}
              axisLine={{ stroke: "var(--primary)", opacity: 0.15 }}
              tickLine={false}
              fontSize={11}
            />
            <YAxis domain={[0, Math.ceil(maxHourly * 1.15)]} hide />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.05)" }}
              content={
                <ChartTooltipContent
                  className="bg-black text-white border-0 opacity-100"
                  formatter={(value: any) => [`${value} orders`, ""]}
                  labelFormatter={(hour: any) => formatHour(hour)}
                />
              }
            />
            <CartesianGrid
              strokeDasharray="2 4"
              vertical={false}
              stroke="var(--primary)"
              opacity={0.07}
            />
            <Bar
              dataKey="avg_orders"
              radius={[4, 4, 0, 0]}
              isAnimationActive
              animationDuration={500}
              maxBarSize={32}
              label={{ position: "top", fill: "#fff", fontSize: 10 }}
            >
              {hourlyBuckets.map(b => {
                const currentHourLocal = (() => {
                  const h = new Date().getHours()
                  return h === 0 ? 24 : h
                })()
                const isNow = b.hour === currentHourLocal

                // Single theme color; optional opacity scaling:
                // const intensity = maxHourly ? b.avg_orders / maxHourly : 0
                // const opacity = 0.35 + intensity * 0.65  // range ~0.35–1
                // Using CSS var directly keeps hue consistent.
                const fillVar = "var(--color-series)"

                return (
                  <Cell
                    key={b.hour}
                    fill={fillVar}
                    // style={{ opacity }} // UNCOMMENT for tiered opacity instead of solid
                    stroke={isNow ? "var(--color-series)" : "transparent"}
                    strokeWidth={isNow ? 1.5 : 0}
                  />
                )
              })}
            </Bar>
          </BarChart>
        </ChartContainer>
        <div className="relative mt-1 mb-2 px-2 flex gap-3 items-center text-[10px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <span
              className="h-3 w-3 rounded-sm"
              style={{ background: "var(--color-series)" }}
            /> Theme
          </span>
          <span className="inline-flex items-center gap-1">
            <span
              className="h-3 w-3 rounded-sm ring-1 ring-border/40"
              style={{ background: "var(--color-series)" }}
            /> Now
          </span>
        </div>
      </Card>

      {/* Cameras */}
      <Card className="@container/card flex flex-col overflow-hidden">
        <CardHeader>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Camera className="size-4 text-primary/80" aria-hidden="true" />
            <CardTitle>Cameras</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="relative z-10 flex flex-col gap-3">
          <div className="w-full h-20 rounded bg-muted/10 border border-dashed border-muted/30 flex items-center justify-center text-xs">
            Pickup Zone
          </div>
            <div className="w-full h-20 rounded bg-muted/10 border border-dashed border-muted/30 flex items-center justify-center text-xs">
            Front Counter
          </div>
        </CardContent>
      </Card>

      {/* Traffic Heatmap */}
      <Card className="@container/card flex flex-col overflow-hidden">
        <CardHeader>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Scan className="size-4 text-primary/80" aria-hidden="true" />
            <CardTitle>Traffic Heatmap</CardTitle>
          </div>
          <CardDescription className="text-xs">
            {connected ? "Live" : "Simulated"}
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10 flex-1">
          <div className="relative w-full h-full min-h-[90px] rounded bg-muted/5 border border-border/30 overflow-hidden">
            <TrafficHeatmap
              className="absolute inset-0"
              data={
                liveGrid && liveGrid.length && liveGrid[0]?.length
                  ? (liveGrid as any)
                  : Array.from({ length: 7 }, () =>
                      Array.from({ length: 12 }, () => Math.random() * 100)
                    )
              }
              rowLabels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
              colLabels={[
                "9a",
                "10a",
                "11a",
                "12p",
                "1p",
                "2p",
                "3p",
                "4p",
                "5p",
                "6p",
                "7p",
                "8p",
              ]}
              baseColor="#3b82f6"
              fit="cover"
              showLegend
              legendLabel="Traffic intensity"
            />
          </div>
        </CardContent>
      </Card>

      {/* Abandon Rate */}
      <Card className="@container/card flex flex-col overflow-hidden">
        <CardHeader className="pb-2 pt-4 px-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingDown
              className="size-4 text-primary/80"
              aria-hidden="true"
            />
            <CardTitle>Abandon Rate</CardTitle>
          </div>
          <CardDescription className="font-mono tabular-nums text-sm">
            {abandonRatePct}
          </CardDescription>
        </CardHeader>
        <ChartContainer
          id="abandon-rate"
          className="relative w-full flex-1 min-h-[90px] px-2"
          config={{ series: { color: "var(--primary)" } }}
        >
          <AreaChart
            data={series}
            margin={{ top: 0, right: 0, left: 0, bottom: 12 }}
          >
            <XAxis
              dataKey="id"
              type="number"
              tickFormatter={(v) => `${v}h`}
              axisLine={{ stroke: "var(--primary)", opacity: 0.2 }}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              width={40}
              tickFormatter={(v) => `${v}%`}
              stroke="var(--primary)"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "var(--primary)", opacity: 0.2 }}
              tick={{ fontWeight: 600 }}
            />
            <Tooltip
              content={
                <ChartTooltipContent
                  className="bg-black text-white border-0 opacity-100"
                  formatter={(v: any) => `${v.toFixed?.(0) ?? v}%`}
                  labelFormatter={(v: any) => `Hour ${v}`}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="abandon_pct"
              stroke="var(--primary)"
              strokeOpacity={0.95}
              fill="var(--primary)"
              fillOpacity={0.2}
              strokeWidth={2.5}
              dot={false}
            />
          </AreaChart>
        </ChartContainer>
      </Card>

      {/* Sandwich Count vs POS Orders */}
      <Card className="@container/card flex flex-col overflow-hidden">
        <CardHeader>
          <div className="flex items-center gap-2 text-muted-foreground">
            <ShoppingCart
              className="size-4 text-primary/80"
              aria-hidden="true"
            />
            <CardTitle>Sandwich Count vs POS Orders</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Last hour activity
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10 flex-1">
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-muted-foreground text-xs">Hand-offs/hr</div>
              <div className="font-mono tabular-nums text-base md:text-lg">
                {ordersLastHour != null ? handOffsPerHr.toFixed(1) : "—"}
              </div>
            </div>
            <div className="h-3 w-full rounded bg-muted/20 overflow-hidden mx-auto">
              <div
                className="h-full rounded bg-amber-400 transition-all"
                style={{
                  width: `${
                    ordersLastHour
                      ? Math.min(100, (handOffsPerHr / maxOrders) * 100)
                      : 0
                  }%`,
                }}
              />
            </div>
            <div className="text-center pt-1">
              <div className="text-muted-foreground text-xs">POS Orders/hr</div>
              <div className="font-mono tabular-nums text-base md:text-lg">
                {ordersLastHour ?? "—"}
              </div>
            </div>
            <div className="h-3 w-full rounded bg-muted/20 overflow-hidden mx-auto">
              <div
                className="h-full rounded transition-all"
                style={{
                  width: `${
                    ordersLastHour
                      ? Math.min(100, (posOrders / maxOrders) * 100)
                      : 0
                  }%`,
                  background: "var(--primary)",
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}