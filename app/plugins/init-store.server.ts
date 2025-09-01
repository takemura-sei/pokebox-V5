// plugins/init-store.server.ts
import { usePokemonStore } from '@/stores/pokemon'

export default defineNuxtPlugin(async () => {
  const pokemonStore = usePokemonStore()
  
  // SSR時にStore初期化
  if (!pokemonStore.isInitialized) {
    try {
      await pokemonStore.initializeStore()
      console.log('SSR: Store初期化完了')
    } catch (error) {
      console.error('SSR: Store初期化に失敗:', error)
    }
  }
})