// server/plugins/supabase.ts
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

export default defineNitroPlugin((nitroApp) => {
  const config = useRuntimeConfig()
  
  const supabase = createClient<Database>(
    config.public.supabaseUrl,
    config.public.supabaseAnonKey
  )

  // 【重要】Nitroのコンテキストにsupabaseを追加
  nitroApp.hooks.hook('request', (event) => {
    event.context.supabase = supabase
  })
})

// 型定義を拡張
declare module 'h3' {
  interface H3EventContext {
    supabase: ReturnType<typeof createClient<Database>>
  }
}