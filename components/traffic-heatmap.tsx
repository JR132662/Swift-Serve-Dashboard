"use client"
import * as React from "react"
import { resolveCssColor } from '@/utils/theme-colors'

export type TrafficHeatmapProps = {
  /** Provide a pre-binned matrix (rows x cols). If omitted, you can pass `points` and specify rows/cols for binning. */
  data?: number[][]
  /** Alternatively, provide normalized points (x,y in 0..1) with optional value to be binned into a matrix. */
  points?: Array<{ x: number; y: number; value?: number }>
  /** Desired grid size when using `points`. Defaults to 32x32. */
  rows?: number
  cols?: number
  rowLabels?: string[]
  colLabels?: string[]
  /** Minimum value for scaling (defaults to 0) */
  min?: number
  /** Maximum value for scaling (computed from data if not provided) */
  max?: number
  /** Base color for cells; opacity will scale with value */
  baseColor?: string
  /** Optional overlay polylines in grid units (x in [0..cols], y in [0..rows]) */
  overlayPaths?: Array<{
    points: Array<[number, number]>
    color?: string
    width?: number
    opacity?: number
  }>
  /** Fit mode of the SVG inside the container. */
  fit?: 'stretch' | 'contain' | 'cover'
  /** Optional floorplan image to render behind the heatmap, sized with the same fit mode. */
  backgroundImageUrl?: string
  /** Apply simple box blur iterations to soften the binned points heatmap. */
  blur?: number
  /** Show a small legend bottom-left */
  showLegend?: boolean
  legendLabel?: string
  /** Extra class for the wrapping SVG */
  className?: string
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function toRGBA(hexOrCss: string, alpha: number) {
  let hex = hexOrCss
  if (!hex || hex.startsWith('var(') || /[a-zA-Z()]/.test(hex) && !hex.startsWith('#')) {
    try {
      hex = resolveCssColor(hexOrCss)
    } catch (e) {
      hex = '#3b82f6'
    }
  }
  const sanitized = hex.replace('#', '')
  const bigint = parseInt(sanitized.length === 3
    ? sanitized.split('').map((c) => c + c).join('')
    : sanitized, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function boxBlurPass(matrix: number[][]): number[][] {
  const r = matrix.length
  const c = r ? matrix[0].length : 0
  if (!r || !c) return matrix
  const out = Array.from({ length: r }, () => Array(c).fill(0))
  for (let i = 0; i < r; i++) {
    for (let j = 0; j < c; j++) {
      let sum = 0
      let count = 0
      for (let di = -1; di <= 1; di++) {
        for (let dj = -1; dj <= 1; dj++) {
          const ii = i + di
          const jj = j + dj
          if (ii >= 0 && ii < r && jj >= 0 && jj < c) {
            sum += matrix[ii][jj]
            count++
          }
        }
      }
      out[i][j] = count ? sum / count : matrix[i][j]
    }
  }
  return out
}

function binPointsToMatrix(points: Array<{ x: number; y: number; value?: number }>, rows: number, cols: number): number[][] {
  const grid = Array.from({ length: rows }, () => Array(cols).fill(0))
  for (const p of points) {
    const rr = clamp(Math.round(p.y * (rows - 1)), 0, rows - 1)
    const cc = clamp(Math.round(p.x * (cols - 1)), 0, cols - 1)
    grid[rr][cc] += p.value ?? 1
  }
  return grid
}

export function TrafficHeatmap({
  data,
  points,
  rows: rowsProp,
  cols: colsProp,
  rowLabels,
  colLabels,
  min = 0,
  max,
  baseColor = "var(--color-series, var(--primary))", // theme-aware: series fallback to primary
  overlayPaths,
  fit = 'cover',
  backgroundImageUrl,
  blur = 0,
  showLegend = true,
  legendLabel = "Traffic intensity",
  className,
}: TrafficHeatmapProps) {
  let grid: number[][] = []
  if (data && data.length) {
    grid = data
  } else if (points && points.length) {
    const r = rowsProp ?? 32
    const c = colsProp ?? 32
    grid = binPointsToMatrix(points, r, c)
  }
  const rows = grid.length
  const cols = rows ? grid[0].length : 0

  // Optional blur to smooth binned points
  if (blur && rows && cols) {
    let tmp = grid
    for (let i = 0; i < blur; i++) tmp = boxBlurPass(tmp)
    grid = tmp
  }

  const computedMax = React.useMemo(() => {
    if (typeof max === 'number') return max
    let m = Number.NEGATIVE_INFINITY
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        m = Math.max(m, grid[r][c] ?? 0)
      }
    }
    return m === Number.NEGATIVE_INFINITY ? 1 : m
  }, [grid, rows, cols, max])

  // Normalize value into [0..1] then map to opacity range [0.12..0.9]
  const cellOpacity = (v: number) => {
    const t = computedMax === min ? 0 : (v - min) / (computedMax - min)
    return 0.12 + 0.78 * clamp(t, 0, 1)
  }

  // Use a viewBox in grid units so it scales responsively to parent
  // Each rect is 1x1 with a small inner padding to show grid lines
  const pad = 0.12

  if (!rows || !cols) {
    return (
      <div className={`flex items-center justify-center text-xs text-muted-foreground ${className ?? ''}`}>
        No data
      </div>
    )
  }

  const hasRowLabels = Array.isArray(rowLabels) && rowLabels.length === rows
  const hasColLabels = Array.isArray(colLabels) && colLabels.length === cols

  const par = fit === 'contain' ? 'xMidYMid meet' : fit === 'cover' ? 'xMidYMid slice' : 'none'

  return (
    <div className="relative h-full w-full">
      <svg viewBox={`0 0 ${cols} ${rows}`} preserveAspectRatio={par} className={`absolute inset-0 h-full w-full ${className ?? ''}`}>
        {/* light grid */}
        <defs>
          <filter id="heatGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.12" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Optional background floorplan */}
        {backgroundImageUrl && (
          <image href={backgroundImageUrl} x={0} y={0} width={cols} height={rows} preserveAspectRatio={par} opacity={0.35} />
        )}
        {/* Grid background lines by drawing faint rect borders via strokes */}
        <g>
          {Array.from({ length: rows }).map((_, r) => (
            Array.from({ length: cols }).map((__, c) => (
              <rect key={`g-${r}-${c}`} x={c} y={r} width={1} height={1} fill="none" stroke="currentColor" strokeOpacity={0.06} strokeWidth={0.02} />
            ))
          ))}
        </g>

        {/* Cells */}
        <g>
          {grid.map((row, r) => (
            row.map((v, c) => (
              <rect
                key={`c-${r}-${c}`}
                x={c + pad}
                y={r + pad}
                width={1 - 2 * pad}
                height={1 - 2 * pad}
                fill={toRGBA(baseColor, cellOpacity(v))}
                rx={0.12}
                ry={0.12}
              />
            ))
          ))}
        </g>

        {/* Optional overlays */}
        {overlayPaths?.map((p, i) => (
          <polyline
            key={`p-${i}`}
            points={p.points.map(([x, y]) => `${x},${y}`).join(' ')}
            fill="none"
            stroke={p.color || baseColor}
            strokeWidth={p.width || 0.12}
            opacity={p.opacity ?? 0.85}
            filter="url(#heatGlow)"
          />
        ))}
      </svg>

      {/* Axes labels */}
      {(hasRowLabels || hasColLabels) && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Column labels at bottom */}
          {hasColLabels && (
            <div className="absolute bottom-1 left-0 right-0 flex justify-between px-2 text-[10px] text-muted-foreground">
              {colLabels!.map((l, i) => (
                <span key={`cl-${i}`}>{l}</span>
              ))}
            </div>
          )}
          {/* Row labels at left */}
          {hasRowLabels && (
            <div className="absolute top-0 bottom-0 left-1 flex flex-col justify-between py-2 text-[10px] text-muted-foreground">
              {rowLabels!.map((l, i) => (
                <span key={`rl-${i}`}>{l}</span>
              ))}
            </div>
          )}
        </div>
      )}

      {showLegend && (
        <div className="absolute left-2 bottom-1 flex items-center gap-2 text-[10px] text-muted-foreground bg-background/60 backdrop-blur-sm px-1.5 py-0.5 rounded-md">
          <div className="h-2 w-14 rounded-sm overflow-hidden relative">
            <div className="absolute inset-0" style={{
              background: `linear-gradient(90deg, ${toRGBA(baseColor, 0.15)} 0%, ${toRGBA(baseColor, 0.9)} 100%)`
            }} />
          </div>
          <span>{legendLabel}</span>
        </div>
      )}
    </div>
  )
}

export default TrafficHeatmap
