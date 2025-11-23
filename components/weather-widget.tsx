"use client"
import { useEffect, useState } from 'react'

interface WeatherDataSimple {
  provider: string
  location: string
  tempF: number | null
  condition: string | null
  icon: string | null
  ts: string | null
}

export function WeatherWidget() {
  const [data, setData] = useState<WeatherDataSimple | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch('/api/weather?loc=miami,fl&city=Miami&country=US&lat=25.7617&lon=-80.1918')
        if (!res.ok) throw new Error(`Weather ${res.status}`)
        const json: WeatherDataSimple = await res.json()
        if (!cancelled) setData(json)
      } catch (e: any) {
        if (!cancelled) setError(e.message || 'Weather fetch failed')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    const interval = setInterval(load, 300000) // refresh every 5 min
    return () => { cancelled = true; clearInterval(interval) }
  }, [])

  if (loading) return <div className="text-xs text-muted-foreground">Loading weather…</div>
  if (error || !data) return <div className="text-xs text-red-500">Weather unavailable</div>

  const tempDisplay = data.tempF != null ? `${Math.round(data.tempF)}°F` : '—'
  const iconUrl = data.icon ? `https://cdn.aerisapi.com/wxicons/v2/${data.icon}` : null
  const condition = data.condition || 'N/A'
  const provider = data.provider
  const ts = data.ts ? new Date(data.ts).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : ''

  return (
    <div className="flex items-center gap-2 text-xs md:text-sm">
      {iconUrl && <img src={iconUrl} alt={condition} className="w-6 h-6" />}
      <span>{tempDisplay} {condition}</span>
    </div>
  )
}