// app/plugins/auth.client.ts
import { useAuthStore } from '@/stores/auth'

export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  
  // import.meta.client チェック不要
  console.log('認証プラグイン: 認証状態を初期化中...')
  await authStore.initialize()
  console.log('認証プラグイン: 認証状態初期化完了')
})