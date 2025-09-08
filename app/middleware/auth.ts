// middleware/auth.ts
import { useAuthStore } from '@/stores/auth'

export default defineNuxtRouteMiddleware(async (to, from) => {
  // サーバーサイドでは認証が必要なページかどうかのみチェック
  if (import.meta.server) {
    // 公開ページは通す（ログインページなど）
    const publicRoutes = ['/login', '/']
    if (publicRoutes.includes(to.path)) {
      return
    }
    return navigateTo(`/login?redirect=${encodeURIComponent(to.path)}`)
  }

  // クライアントサイドでの詳細な認証チェック
  if (import.meta.client) {
    const authStore = useAuthStore()
    
    // より効率的な初期化待機
    if (!authStore.isInitialized) {
      await authStore.waitForInitialization()
    }

    if (!authStore.isAuthenticated) {
      return navigateTo(`/login?redirect=${encodeURIComponent(to.path)}`)
    }
  }
})