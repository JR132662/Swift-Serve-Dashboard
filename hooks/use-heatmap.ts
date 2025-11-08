"use client"
import { useEffect, useMemo, useRef, useState } from "react"

export type HeatmapPoint = { x: number; y: number; value?: number; ts?: number }

export type UseHeatmapOptions = {
  /** WebSocket endpoint; defaults to NEXT_PUBLIC_HEATMAP_WS if present */
  endpoint?: string
  /** Grid resolution for binning */
  rows?: number
  cols?: number
  /** Sliding window in milliseconds for considering points */
  windowMs?: number
  /** How often to recompute the grid (ms) */
  intervalMs?: number
  /** Decay factor per interval (0..1), applied to grid for natural fade */
  decay?: number
}

export function useHeatmapStream(opts?: UseHeatmapOptions) {
  const endpoint = opts?.endpoint ?? (typeof window !== 'undefined' ? (process.env.NEXT_PUBLIC_HEATMAP_WS as string | undefined) : undefined)
  const rows = opts?.rows ?? 32
  const cols = opts?.cols ?? 32
  const windowMs = opts?.windowMs ?? 30_000
  const intervalMs = opts?.intervalMs ?? 300
  const decay = opts?.decay ?? 0.92

  const socketRef = useRef<WebSocket | null>(null)
  const [connected, setConnected] = useState(false)
  const pointsRef = useRef<HeatmapPoint[]>([])
  const gridRef = useRef<number[][]>(Array.from({ length: rows }, () => Array(cols).fill(0)))

  // Helper to bin points
  function binPoints(points: HeatmapPoint[]): number[][] {
    const grid = Array.from({ length: rows }, () => Array(cols).fill(0))
    for (const p of points) {
      const rr = Math.max(0, Math.min(rows - 1, Math.round(p.y * (rows - 1))))
      const cc = Math.max(0, Math.min(cols - 1, Math.round(p.x * (cols - 1))))
      grid[rr][cc] += p.value ?? 1
    }
    return grid
  }

  useEffect(() => {
    if (!endpoint) return
    const ws = new WebSocket(endpoint)
    socketRef.current = ws

    ws.onopen = () => setConnected(true)
    ws.onclose = () => setConnected(false)
    ws.onerror = () => setConnected(false)
    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data)
        const now = Date.now()
        if (Array.isArray(msg?.points)) {
          const pts = msg.points as Array<{ x: number; y: number; value?: number }>
          pointsRef.current.push(...pts.map((p) => ({ x: p.x, y: p.y, value: p.value, ts: now })))
        } else if (Array.isArray(msg?.tracks)) {
          const pts = msg.tracks as Array<{ x: number; y: number; value?: number }>
          pointsRef.current.push(...pts.map((p) => ({ x: p.x, y: p.y, value: p.value ?? 1, ts: now })))
        }
      } catch {
        // ignore malformed
      }
    }

    return () => {
      ws.close()
      socketRef.current = null
    }
  }, [endpoint])

  // periodic update: apply decay and rebuild grid from recent points
  useEffect(() => {
    const id = setInterval(() => {
      const now = Date.now()
      // Keep only points in window
      pointsRef.current = pointsRef.current.filter((p) => (p.ts ?? now) > now - windowMs)

      // Apply decay to existing grid
      const g = gridRef.current
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          g[r][c] *= decay
          if (g[r][c] < 0.001) g[r][c] = 0
        }
      }

      // Bin current points and add to grid
      const binned = binPoints(pointsRef.current)
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          g[r][c] += binned[r][c]
        }
      }
      gridRef.current = g
    }, intervalMs)
    return () => clearInterval(id)
  }, [rows, cols, decay, intervalMs, windowMs])

  const grid = useMemo(() => gridRef.current, [connected, rows, cols])

  return { connected, grid }
}

export default useHeatmapStream
