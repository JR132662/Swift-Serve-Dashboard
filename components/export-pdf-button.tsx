"use client"
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function ExportPdfButton() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const today = new Date()
  const todayStr = today.toISOString().slice(0,10)

  async function handleExport() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/export-pdf?date=${todayStr}`)
      if (!res.ok) throw new Error(`Export failed (${res.status})`)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `report-${todayStr}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" disabled={loading} onClick={handleExport}>
        {loading ? 'Exporting…' : 'Export PDF'}
      </Button>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  )
}
