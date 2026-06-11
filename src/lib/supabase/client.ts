import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/lib/database.types";

// Client para uso no browser (Client Components).
// Usa apenas a anon key publica; nunca a service_role.
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
