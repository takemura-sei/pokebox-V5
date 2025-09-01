// supabase.client.ts
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  
  const supabaseUrl = config.public.supabaseUrl as string
  const supabaseAnonKey = config.public.supabaseAnonKey as string
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and Anon Key are required')
  }
  
  const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

  return {
    provide: {
      supabase
    }
  }
})