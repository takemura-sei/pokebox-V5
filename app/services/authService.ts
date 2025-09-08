// app/services/authService.ts
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

export class AuthService {
  private supabase: ReturnType<typeof createClient<Database>> | null = null

  private getSupabase() {
    if (!this.supabase) {
      const config = useRuntimeConfig()
      this.supabase = createClient<Database>(
        config.public.supabaseUrl,
        config.public.supabaseAnonKey
      )
    }
    return this.supabase
  }

  // ログイン
  async signIn(email: string, password: string) {
    const { data, error } = await this.getSupabase().auth.signInWithPassword({
      email,
      password
    })

    if (error) throw new Error(error.message)
    return data
  }

  // サインアップ
  async signUp(email: string, password: string) {
    const { data, error } = await this.getSupabase().auth.signUp({
      email,
      password
    })

    if (error) throw new Error(error.message)
    return data
  }

  // ログアウト
  async signOut() {
    const { error } = await this.getSupabase().auth.signOut()
    if (error) throw new Error(error.message)
  }

  // 現在のユーザーを取得
  async getCurrentUser() {
    const { data: { user } } = await this.getSupabase().auth.getUser()
    return user
  }

  // 現在のセッションを取得
  async getCurrentSession() {
    const { data: { session } } = await this.getSupabase().auth.getSession()
    return session
  }

  // 認証状態の変更を監視
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return this.getSupabase().auth.onAuthStateChange(callback)
  }
}

// 1つのインスタンスを作成してエクスポート
export const authService = new AuthService()