<script setup lang="ts">
import { usePokemonStore } from '@/stores/pokemon'
import { useFavoriteStore } from '@/stores/favorite'
import { useAuthStore } from '@/stores/auth'
import AppHeader from '@/components/AppHeader.vue'
import PokemonStats from '@/components/PokemonStats.vue'
import PokemonGrid from '@/components/PokemonGrid.vue'
import  Pagination from '@/components/Pagination.vue'

const isDev = process.env.NODE_ENV === 'development'

// Storeから初期データを取得（SSRで既に格納済み）
const pokemonStore = usePokemonStore()
const favoriteStore = useFavoriteStore()
const authStore = useAuthStore()
const { totalCount, initialPokemon, types, isInitialized, pagination } = storeToRefs(pokemonStore)

// ローディング状態管理
const isLoadingPage = ref(false)

// 認証状態が変わったらお気に入りを読み込み
watch(() => authStore.isAuthenticated, async (isAuthenticated) => {
  if (isAuthenticated) {
    await favoriteStore.loadFavorites()
  } else {
    favoriteStore.reset()
  }
}, { immediate: true })

// クライアントサイドでの初期化
onMounted(async () => {
  // 認証済みの場合は、お気に入りを読み込み
  if (authStore.isAuthenticated) {
    await favoriteStore.loadFavorites()
  }
})

// ページ変更処理
const handlePageChange = async (page: number) => {
  if (isLoadingPage.value) return
  
  try {
    isLoadingPage.value = true
    await pokemonStore.loadPage(page)
    
    // ページ変更後に画面を一番上にスクロール
    if (import.meta.client) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  } catch (error) {
    console.error('ページ変更エラー:', error)
  } finally {
    isLoadingPage.value = false
  }
}

// ポケモンクリック処理（将来的に詳細ページに遷移）
const handlePokemonClick = (pokemonId: number) => {
  console.log('Pokemon clicked:', pokemonId)
  // TODO: navigateTo(`/pokemon/${pokemonId}`)
}
</script>

<template>
  <div class="container mx-auto p-4">
    <!-- ヘッダー -->
    <AppHeader />

    <h1 class="text-3xl font-bold mb-6 text-center">ポケモン図鑑</h1>
    
    <!-- 初期化後の表示 -->
    <div v-if="isInitialized">
      <!-- 基本情報表示 -->
      <PokemonStats
        :total-count="totalCount"
        :displayed-count="initialPokemon.length"
        :type-count="types.length"
        :current-page="pagination.currentPage"
        :total-pages="pagination.totalPages"
        :loading="isLoadingPage"
      />
      
      <!-- ポケモン一覧グリッド -->
      <PokemonGrid
        :pokemon="initialPokemon"
        :loading="isLoadingPage"
        @pokemon-click="handlePokemonClick"
      />

      <!-- ページネーション -->
      <div class="mt-8 mb-4">
        <Pagination
          :current-page="pagination.currentPage"
          :total-pages="pagination.totalPages"
          :loading="isLoadingPage"
          @page-change="handlePageChange"
        />
      </div>
    </div>

    <!-- 初期化中の表示 -->
    <div v-else class="text-center py-16">
      <div class="inline-flex items-center justify-center w-16 h-16 mb-4">
        <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p class="text-lg text-gray-600">ポケモンデータを読み込み中...</p>
      <p class="text-sm text-gray-500 mt-2">しばらくお待ちください</p>
    </div>

    <!-- デバッグ情報（開発時のみ） -->
    <div v-if="isDev" class="fixed bottom-4 right-4 bg-black text-white text-xs p-2 rounded opacity-75">
      お気に入り数: {{ favoriteStore.count }}
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
}
</style>