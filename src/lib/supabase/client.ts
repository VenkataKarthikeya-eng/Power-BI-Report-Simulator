import { createBrowserClient } from '@supabase/ssr';

export interface SupabaseConfigStatus {
  hasUrl: boolean;
  hasKey: boolean;
  isReady: boolean;
}

/**
 * Returns safe configuration status indicating whether required variables
 * are set, without ever logging or exposing secret/key values.
 */
export function getSupabaseConfigStatus(): SupabaseConfigStatus {
  const hasUrl = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL?.trim());
  const hasKey = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  );

  return {
    hasUrl,
    hasKey,
    isReady: hasUrl && hasKey,
  };
}

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabasePublishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    '';

  return createBrowserClient(supabaseUrl, supabasePublishableKey);
}
