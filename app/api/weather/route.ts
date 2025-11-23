import { NextResponse } from 'next/server'

// Weather proxy supporting providers in priority order:
// 1. Aeris/XWeather (requires XWEATHER_APP_ID & XWEATHER_APP_SECRET)
// 2. OpenWeather (requires OPENWEATHER_API_KEY)
// 3. Open-Meteo (no key, lat/lon required - defaults to NYC)
// Returns normalized shape: { provider, location, tempF, condition, icon, ts }
export async function GET(req: Request) {
  const url = new URL(req.url)
  const loc = url.searchParams.get('loc') || 'newyork,ny'
  const owCity = url.searchParams.get('city') || 'New York'
  const owCountry = url.searchParams.get('country') || 'US'
  const lat = url.searchParams.get('lat') || '40.7128'
  const lon = url.searchParams.get('lon') || '-74.0060'

  const aerisId = process.env.XWEATHER_APP_ID
  const aerisSecret = process.env.XWEATHER_APP_SECRET
  const openKey = process.env.OPENWEATHER_API_KEY

  try {
    // Aeris first
    if (aerisId && aerisSecret) {
      const upstream = `https://api.aerisapi.com/observations/${encodeURIComponent(loc)}?client_id=${aerisId}&client_secret=${aerisSecret}&format=json`
      const r = await fetch(upstream, { next: { revalidate: 300 } })
      const rawBody = await r.text()
      if (r.ok) {
        let json: any; try { json = JSON.parse(rawBody) } catch { json = {} }
        const ob = json?.response?.ob || {}
        return NextResponse.json({
          provider: 'aeris',
          location: loc,
          tempF: ob.tempF ?? null,
          condition: ob.weatherPrimary ?? ob.weather ?? null,
          icon: ob.icon ?? null,
          ts: ob.dateTimeISO ?? null,
        }, { headers: { 'Cache-Control': 'public, max-age=300' } })
      }
      // Log diagnostic details but continue to fallback providers
      console.warn('Aeris upstream failure', r.status, rawBody)
    }

    // OpenWeather fallback
    if (openKey) {
      const upstream = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(owCity)},${owCountry}&units=imperial&appid=${openKey}`
      const r = await fetch(upstream, { next: { revalidate: 300 } })
      const rawBody = await r.text()
      if (r.ok) {
        let json: any; try { json = JSON.parse(rawBody) } catch { json = {} }
        return NextResponse.json({
          provider: 'openweather',
          location: json.name || owCity,
          tempF: json?.main?.temp ?? null,
          condition: json?.weather?.[0]?.description ?? null,
          icon: json?.weather?.[0]?.icon ?? null,
          ts: new Date().toISOString(),
        }, { headers: { 'Cache-Control': 'public, max-age=300' } })
      }
      console.warn('OpenWeather upstream failure', r.status, rawBody)
    }

    // Open-Meteo (keyless) final fallback
    const mapOpenMeteoCode = (code: number): string => {
      if (code === 0) return 'Clear'
      if ([1,2,3].includes(code)) return 'Cloudy'
      if ([45,48].includes(code)) return 'Fog'
      if ([51,53,55].includes(code)) return 'Drizzle'
      if ([61,63,65].includes(code)) return 'Rain'
      if ([66,67].includes(code)) return 'Freezing Rain'
      if ([71,73,75].includes(code)) return 'Snow'
      if (code === 77) return 'Snow Grains'
      if ([80,81,82].includes(code)) return 'Showers'
      if ([85,86].includes(code)) return 'Snow Showers'
      if (code === 95) return 'Thunderstorm'
      if ([96,99].includes(code)) return 'Severe Thunderstorm'
      return `Weather Code ${code}`
    }
    const omUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=fahrenheit`
    const om = await fetch(omUrl, { next: { revalidate: 300 } })
    const omBody = await om.text()
    if (om.ok) {
      let json: any; try { json = JSON.parse(omBody) } catch { json = {} }
      const cw = json.current_weather || {}
      return NextResponse.json({
        provider: 'open-meteo',
        location: `${lat},${lon}`,
        tempF: cw.temperature ?? null,
        condition: cw.weathercode != null ? mapOpenMeteoCode(cw.weathercode) : null,
        icon: null, // Open-Meteo does not supply icons directly
        ts: cw.time ?? null,
      }, { headers: { 'Cache-Control': 'public, max-age=300' } })
    }

    return NextResponse.json({ error: 'All weather providers failed' }, { status: 502 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Weather fetch failed' }, { status: 500 })
  }
}
