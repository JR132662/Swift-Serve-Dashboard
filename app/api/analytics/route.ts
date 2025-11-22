import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // or anon key if only reading public data
  );

  const { data, error } = await supabase
    .from("analytics_realtime")
    .select("*");

  if (error) return NextResponse.json({ error }, { status: 500 });

  console.log("Analytics Data:", data); // <-- LOGS ON SERVER

  return NextResponse.json({ data });
}
