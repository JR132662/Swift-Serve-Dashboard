This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Daily PDF Export

Endpoint: `GET /api/export-pdf?date=YYYY-MM-DD`

If `date` is omitted, the current UTC day is used. The dashboard header includes an `Export PDF` button that downloads a PDF report with daily averages.

The PDF includes averages for:
- Queue P50 Wait
- Queue P90 Wait
- Cook P50
- Assembly P50
- Total Customer Wait P50
- After Order Avg
- Abandon Rate
- Avg Queue Dwell
- Queue Current Count

### Automating End-of-Day Archive

Use a scheduler to call the endpoint shortly after midnight (UTC or local store close). Options:
- Vercel Cron Job hitting `/api/export-pdf` (no date needed if just after midnight)
- GitHub Action or external cron saving response to artifact / storage
- Supabase Edge Function to invoke and persist to Supabase Storage

To store automatically, adapt the route to write the PDF buffer to a storage bucket and return its public URL instead of a download attachment.

## Weather Integration

The dashboard header displays current weather for New York (hardcoded for demo). It shows temperature, condition, and an icon.

To enable:
1. Sign up for a free API key at [OpenWeatherMap](https://openweathermap.org/api).
2. Add `NEXT_PUBLIC_OPENWEATHER_API_KEY=your_key_here` to `.env.local`.
3. Restart the dev server.

For dynamic location, integrate geolocation or user settings.
