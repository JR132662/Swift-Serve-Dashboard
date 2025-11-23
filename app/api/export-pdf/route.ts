import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import jsPDF from 'jspdf'
import { computeAnalyticsAverages } from '@/lib/utils'

// GET /api/export-pdf?date=YYYY-MM-DD
// Generates PDF with daily averages for all tiles.
export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const dateParam = url.searchParams.get('date') // expected format YYYY-MM-DD

    const baseDate = dateParam ? new Date(dateParam + 'T00:00:00Z') : new Date()
    if (isNaN(baseDate.getTime())) {
      return new NextResponse('Invalid date parameter', { status: 400 })
    }

    // Normalize to UTC start of day
    const start = new Date(Date.UTC(baseDate.getUTCFullYear(), baseDate.getUTCMonth(), baseDate.getUTCDate(), 0, 0, 0))
    const end = new Date(start.getTime() + 24 * 60 * 60 * 1000)

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! // service key needed if table is restricted
    )

    const { data, error } = await supabase
      .from('analytics_snapshot_minute')
      .select('*')
      .gte('ts', start.toISOString())
      .lt('ts', end.toISOString())
      .order('ts', { ascending: true })

    if (error) {
      console.error('Export PDF query error', error)
      return new NextResponse('Query error', { status: 500 })
    }

    const rows = data || []

    // Compute averages
    const averages = computeAnalyticsAverages(rows)

    // Generate PDF
    const doc = new jsPDF()
    doc.setFontSize(20)
    doc.text(`SwiftServe Daily Report - ${start.toISOString().slice(0, 10)}`, 20, 30)

    doc.setFontSize(14)
    let y = 50
    const lineHeight = 10

    const metrics = [
      { label: 'Queue P50 Wait', value: averages.queue_p50_wait_ms, unit: 'ms' },
      { label: 'Queue P90 Wait', value: averages.queue_p90_wait_ms, unit: 'ms' },
      { label: 'Cook P50', value: averages.cook_p50_ms, unit: 'ms' },
      { label: 'Assembly P50', value: averages.assembly_p50_ms, unit: 'ms' },
      { label: 'Total Customer Wait P50', value: averages.total_customer_wait_p50_ms, unit: 'ms' },
      { label: 'After Order Avg', value: averages.after_order_avg_ms, unit: 'ms' },
      { label: 'Abandon Rate', value: averages.abandon_rate_pct, unit: '%' },
      { label: 'Avg Queue Dwell', value: averages.avg_queue_dwell_ms, unit: 'ms' },
      { label: 'Queue Current Count', value: averages.queue_current_count, unit: '' },
    ]

    metrics.forEach(metric => {
      const displayValue = metric.value !== null && metric.value !== undefined ? `${metric.value}${metric.unit}` : 'N/A'
      doc.text(`${metric.label}: ${displayValue}`, 20, y)
      y += lineHeight
    })

    const pdfBuffer = doc.output('arraybuffer')

    const filenameDate = start.toISOString().slice(0, 10)
    const res = new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="report-${filenameDate}.pdf"`,
        'Cache-Control': 'no-store'
      }
    })
    return res
  } catch (err) {
    console.error('Unexpected export error', err)
    return new NextResponse('Internal error', { status: 500 })
  }
}