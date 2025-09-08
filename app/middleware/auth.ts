// middleware/auth.ts
import { useAuthStore } from '@/stores/auth'

export default defineNuxtRouteMiddleware(async (to, from) => {
  // サーバーサイドでは即座にログインページにリダイレクト（リダイレクト先も記録）
  if (import.meta.server) {
    return navigateTo(`/login?redirect=${encodeURIComponent(to.path)}`)
  }

  // クライアントサイドでは認証状態をチェック
  if (import.meta.client) {
    const authStore = useAuthStore()
    
    // 認証状態が初期化されるまで待つ
    while (!authStore.isInitialized) {
      await new Promise(resolve => setTimeout(resolve, 50))
    }

    // 認証状態を確認
    if (!authStore.isAuthenticated) {
      return navigateTo(`/login?redirect=${encodeURIComponent(to.path)}`)
    }
  }
})