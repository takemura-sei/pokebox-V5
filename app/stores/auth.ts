// app/stores/auth.ts
import { defineStore } from 'pinia'
import { authService } from '@/services/authService'

interface AuthState {
  user: any | null
  session: any | null
  isLoading: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    session: null,
    isLoading: false
  }),

  getters: {
    // ログインしているかどうか
    isAuthenticated: (state): boolean => {
      return !!(state.user && state.session)
    },

    // ユーザーのメールアドレス
    userEmail: (state): string | null => {
      return state.user?.email || null
    }
  },

  actions: {
    /**
     * ログイン
     */
    async signIn(email: string, password: string) {
      try {
        this.isLoading = true
        const data = await authService.signIn(email, password)
        this.user = data.user
        this.session = data.session
        return { success: true }
      } catch (error) {
        console.error('ログインエラー:', error)
        return { success: false, error: (error as Error).message }
      } finally {
        this.isLoading = false
      }
    },

    /**
     * サインアップ
     */
    async signUp(email: string, password: string) {
      try {
        this.isLoading = true
        const data = await authService.signUp(email, password)
        
        this.user = data.user
        this.session = data.session
        
        return { 
          success: true, 
          needsConfirmation: !data.session // セッションがない場合はメール確認が必要
        }
      } catch (error) {
        console.error('サインアップエラー:', error)
        return { success: false, error: (error as Error).message }
      } finally {
        this.isLoading = false
      }
    },

    /**
     * ログアウト
     */
    async signOut() {
      try {
        this.isLoading = true
        await authService.signOut()
        this.user = null
        this.session = null
        return { success: true }
      } catch (error) {
        console.error('ログアウトエラー:', error)
        return { success: false, error: (error as Error).message }
      } finally {
        this.isLoading = false
      }
    },

    /**
     * 認証状態の初期化（ページ読み込み時）
     */
    async initialize() {
      try {
        // 現在のセッションを取得
        const session = await authService.getCurrentSession()
        if (session) {
          this.session = session
          this.user = session.user
        }

        // 認証状態変更の監視
        authService.onAuthStateChange((event, session) => {
          console.log('認証状態変更:', event)
          
          if (event === 'SIGNED_IN' && session) {
            this.session = session
            this.user = session.user
          } else if (event === 'SIGNED_OUT') {
            this.session = null
            this.user = null
          }
        })
      } catch (error) {
        console.error('認証初期化エラー:', error)
      }
    }
  }
})