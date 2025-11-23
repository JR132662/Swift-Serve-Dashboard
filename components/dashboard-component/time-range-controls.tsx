"use client"
import { useState, useEffect } from "react"

interface TimeRangeControlsProps {
  rangeStart: string
  rangeEnd: string
  onChange: (startIso: string, endIso: string) => void
  loading?: boolean
}

type Preset = { label: string; hours: number; truncateDay?: boolean }
const PRESETS: Preset[] = [
  { label: "Last 1h", hours: 1 },
  { label: "Last 4h", hours: 4 },
  { label: "Today", hours: 24, truncateDay: true },
  { label: "Last 24h", hours: 24 },
  { label: "Last 7d", hours: 24 * 7 },
]

function isoToLocalInput(iso: string) {
  // datetime-local expects 'YYYY-MM-DDTHH:MM'
  return iso.slice(0,16)
}

export function TimeRangeControls({ rangeStart, rangeEnd, onChange, loading }: TimeRangeControlsProps) {
  const [startLocal, setStartLocal] = useState(isoToLocalInput(rangeStart))
  const [endLocal, setEndLocal] = useState(isoToLocalInput(rangeEnd))

  useEffect(() => {
    setStartLocal(isoToLocalInput(rangeStart))
    setEndLocal(isoToLocalInput(rangeEnd))
  }, [rangeStart, rangeEnd])

  function applyCustom() {
    // If user typed shorter string, skip
    if (startLocal.length < 16 || endLocal.length < 16) return
    const startIso = new Date(startLocal).toISOString()
    const endIso = new Date(endLocal).toISOString()
    if (new Date(startIso) >= new Date(endIso)) return
    onChange(startIso, endIso)
  }

  function applyPreset(p: Preset) {
    const now = new Date()
      const end = now
      let start: Date
    if (p.truncateDay) {
      const dayStart = new Date(now)
      dayStart.setHours(0,0,0,0)
        start = dayStart
    } else {
      start = new Date(now.getTime() - p.hours * 3600_000)
    }
      onChange(start.toISOString(), end.toISOString())
  }

  return (
    <div className="flex flex-wrap gap-2 items-end px-4 lg:px-6 py-2 border-b border-muted/20">
      {PRESETS.map(p => (
        <button
          key={p.label}
          onClick={() => applyPreset(p)}
          className="rounded px-2 py-1 text-xs bg-muted hover:bg-muted/70 transition disabled:opacity-50"
          disabled={loading}
          type="button"
        >
          {p.label}
        </button>
      ))}
      <div className="flex gap-2 items-end text-xs">
        <label className="flex flex-col">
          <span className="mb-1">Start</span>
          <input
            type="datetime-local"
            value={startLocal}
            onChange={e => setStartLocal(e.target.value)}
            className="rounded border bg-background px-1 py-0.5"
            max={endLocal}
          />
        </label>
        <label className="flex flex-col">
          <span className="mb-1">End</span>
          <input
            type="datetime-local"
            value={endLocal}
            onChange={e => setEndLocal(e.target.value)}
            className="rounded border bg-background px-1 py-0.5"
            min={startLocal}
            max={isoToLocalInput(new Date().toISOString())}
          />
        </label>
        <button
          onClick={applyCustom}
          className="h-[30px] px-3 rounded bg-primary text-primary-foreground font-medium disabled:opacity-50"
          disabled={loading}
          type="button"
        >
          Apply
        </button>
      </div>
      {loading && <span className="text-muted-foreground text-xs">Loading…</span>}
    </div>
  )
}
