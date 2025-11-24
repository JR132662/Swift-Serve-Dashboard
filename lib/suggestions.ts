import { AnalyticsRealtime, computeAnalyticsAverages } from "./utils"

export type SuggestionSeverity = "critical" | "warning" | "info"

export interface OperationalSuggestion {
  id: string
  severity: SuggestionSeverity
  title: string
  description: string
  metricSummary: string
}

interface SuggestionInput {
  latest?: AnalyticsRealtime | null
  history?: AnalyticsRealtime[] | null
}

type TrendResult = {
  recent: number | null
  delta: number | null
}

const MS_IN_MINUTE = 60000

const minutes = (ms?: number | null) => {
  if (typeof ms !== "number" || Number.isNaN(ms)) return null
  return ms / MS_IN_MINUTE
}

const avg = (values: Array<number | null | undefined>) => {
  const filtered = values.filter(
    (value): value is number => typeof value === "number" && !Number.isNaN(value)
  )
  if (!filtered.length) return null
  return filtered.reduce((sum, value) => sum + value, 0) / filtered.length
}

const metricTrend = (
  rows: AnalyticsRealtime[],
  getter: (row: AnalyticsRealtime) => number | null,
  windowSize = 6
): TrendResult => {
  if (!rows.length) return { recent: null, delta: null }
  const recentValues = rows.slice(-windowSize).map(getter)
  const previousValues = rows.slice(-windowSize * 2, -windowSize).map(getter)
  const recent = avg(recentValues)
  const previous = avg(previousValues)
  return {
    recent,
    delta: recent != null && previous != null ? recent - previous : null,
  }
}

const formatDelta = (delta: number | null) => {
  if (delta == null || Math.abs(delta) < 0.25) return ""
  const sign = delta > 0 ? "+" : ""
  return `${sign}${delta.toFixed(1)}m vs prev`
}

export function generateOperationalSuggestions({
  latest = null,
  history = null,
}: SuggestionInput): OperationalSuggestion[] {
  const rows = history ?? []
  if (!latest && !rows.length) return []

  const snapshot = latest ?? rows[rows.length - 1]
  if (!snapshot) return []

  const baselines = computeAnalyticsAverages(rows)
  const ordersBaseline = avg(rows.map((row) => row.orders_last_hour))

  const queueMinutes = minutes(snapshot.queue_p50_wait_ms) ?? minutes(baselines.queue_p50_wait_ms) ?? 0
  const cookMinutes = minutes(snapshot.cook_p50_ms) ?? minutes(baselines.cook_p50_ms) ?? 0
  const abandonRate = snapshot.abandon_rate_pct ?? baselines.abandon_rate_pct ?? null
  const queueCount = snapshot.queue_current_count ?? baselines.queue_current_count ?? 0
  const ordersPerHour =
    snapshot.orders_last_hour ?? ordersBaseline ?? null

  const queueTrend = metricTrend(rows, (row) => minutes(row.queue_p50_wait_ms))
  const cookTrend = metricTrend(rows, (row) => minutes(row.cook_p50_ms))

  const suggestions: OperationalSuggestion[] = []

  // Queue wait time heuristics
  if (queueMinutes >= 7 || (queueTrend.delta ?? 0) > 1.25) {
    const severity: SuggestionSeverity = queueMinutes >= 11 ? "critical" : "warning"
    const waitDelta = formatDelta(queueTrend.delta)
    suggestions.push({
      id: "queue-time",
      severity,
      title:
        severity === "critical"
          ? "Queue wait exceeds promise"
          : "Queue wait trending up",
      description: `Median wait is ${queueMinutes.toFixed(1)}m for ${queueCount} guests. Shift a runner to take drinks/mobile hand-offs and open a second pickup point to bleed the line. ${waitDelta}`.trim(),
      metricSummary: `${queueMinutes.toFixed(1)}m median wait`,
    })
  }

  // Cook line heuristics
  if (cookMinutes >= 6) {
    const severity: SuggestionSeverity = cookMinutes >= 8 ? "critical" : "warning"
    const cookDelta = formatDelta(cookTrend.delta)
    suggestions.push({
      id: "cook-line",
      severity,
      title: severity === "critical" ? "Cook line is bottlenecked" : "Stage hot items earlier",
      description: `Cook time sits at ${cookMinutes.toFixed(1)}m. Batch top sellers or drop proteins ahead to recover ${cookDelta || "1-2m"}.`,
      metricSummary: `${cookMinutes.toFixed(1)}m cook time`,
    })
  }

  // Abandon rate heuristics
  if (abandonRate != null && (abandonRate >= 6 || (abandonRate >= 4 && queueMinutes >= 7))) {
    const severity: SuggestionSeverity = abandonRate >= 7 ? "critical" : "warning"
    suggestions.push({
      id: "abandon-rate",
      severity,
      title: "Guests are bailing in line",
      description: `Abandon rate is ${abandonRate.toFixed(1)}%. Have a floor lead walk the queue with updated ETAs and offer drink samples to keep guests engaged.`,
      metricSummary: `${abandonRate.toFixed(1)}% abandon`,
    })
  }

  // Low throughput / prep ahead suggestion
  const ordersSlackThreshold = ordersBaseline != null ? 0.6 * ordersBaseline : 20
  if (
    ordersPerHour != null &&
    ordersPerHour <= ordersSlackThreshold &&
    queueMinutes < 5
  ) {
    suggestions.push({
      id: "prep-ahead",
      severity: "info",
      title: "Use lull to prep ahead",
      description: `Throughput is ${ordersPerHour.toFixed(0)} orders/hr with low waits. Restock sauces and pre-portion fries so you are ready for the next push.`,
      metricSummary: `${ordersPerHour.toFixed(0)} orders/hr`,
    })
  }

  if (!suggestions.length && queueMinutes != null && cookMinutes != null) {
    suggestions.push({
      id: "healthy-line",
      severity: "info",
      title: "Line is flowing",
      description: `Wait (${queueMinutes.toFixed(1)}m) and cook (${cookMinutes.toFixed(1)}m) are under targets. Keep staging mobile orders to maintain the pace.`,
      metricSummary: `${queueMinutes.toFixed(1)}m / ${cookMinutes.toFixed(1)}m`,
    })
  }

  return suggestions
}
