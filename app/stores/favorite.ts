// app/stores/favorite.ts
import { defineStore } from 'pinia'
import { favoriteService } from '@/services/favoriteService'
import { useAuthStore } from '@/stores/auth'

interface FavoriteState {
  favorites: Set<number> // お気に入りポケモンのIDセット（高速検索用）
  loading: boolean
}

export const useFavoriteStore = defineStore('favorite', {
  state: (): FavoriteState => ({
    favorites: new Set(),
    loading: false
  }),

  getters: {
    // ポケモンがお気に入りかどうか
    isFavorite: (state) => (pokemonId: number) => {
      return state.favorites.has(pokemonId)
    },

    // お気に入りの総数
    count: (state) => state.favorites.size
  },

  actions: {
    // ユーザーのお気に入り一覧を読み込み
    async loadFavorites() {
      const authStore = useAuthStore()
      if (!authStore.user?.id) return

      try {
        this.loading = true
        const favoriteIds = await favoriteService.getFavorites(authStore.user.id)
        this.favorites = new Set(favoriteIds)
      } catch (error) {
        console.error('お気に入り読み込みエラー:', error)
      } finally {
        this.loading = false
      }
    },

    // お気に入り切り替え
    async toggleFavorite(pokemonId: number) {
      const authStore = useAuthStore()
      if (!authStore.user?.id) {
        throw new Error('ログインしてください')
      }

      const isFavorite = this.favorites.has(pokemonId)
      const userId = authStore.user.id

      try {
        if (isFavorite) {
          // 削除
          await favoriteService.removeFavorite(userId, pokemonId)
          this.favorites.delete(pokemonId)
          return { action: 'removed' }
        } else {
          // 追加
          await favoriteService.addFavorite(userId, pokemonId)
          this.favorites.add(pokemonId)
          return { action: 'added' }
        }
      } catch (error) {
        console.error('お気に入り切り替えエラー:', error)
        throw error
      }
    },

    // リセット（ログアウト時など）
    reset() {
      this.favorites = new Set()
      this.loading = false
    }
  }
})