
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Server Component helper: call with no arguments
export const createClient = () => {
  const cookieStore = cookies();
  return createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        // If cookies() implementation changes to async, adapt accordingly
        return (cookieStore as any).getAll?.() || [];
      },
      setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => (cookieStore as any).set?.(name, value, options));
        } catch {
          // Ignore in RSC contexts where setting isn't allowed.
        }
      },
    },
  });
};
