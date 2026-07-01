import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// DANGER: this client bypasses Row Level Security entirely.
// Only import this file from server-only code that has already
// verified the caller is authorized (webhook signature, admin check, etc).
// Never import this into a Client Component or expose SUPABASE_SERVICE_ROLE_KEY
// to the browser.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
