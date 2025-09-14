// app/composables/useSupabase.ts
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

let supabaseClient: ReturnType<typeof createClient<Database>> | null = null

export const useSupabase = () => {
  if (!supabaseClient) {
    const config = useRuntimeConfig()
    supabaseClient = createClient<Database>(
      config.public.supabaseUrl,
      config.public.supabaseAnonKey
    )
  }
  return supabaseClient
}