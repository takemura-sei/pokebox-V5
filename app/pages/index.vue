<script setup lang="ts">
import { usePokemonStore } from '@/stores/pokemon'
import AppHeader from '@/components/AppHeader.vue'
import PokemonGrid from '@/components/PokemonGrid.vue'
import  Pagination from '@/components/Pagination.vue'

// Storeから初期データを取得（SSRで既に格納済み）
const pokemonStore = usePokemonStore()
const { totalCount, initialPokemon, types, isInitialized, pagination } = storeToRefs(pokemonStore)

// ローディング状態管理
const isLoadingPage = ref(false)

// ページ変更処理
const handlePageChange = async (page: number) => {
  if (isLoadingPage.value) return
  
  try {
    isLoadingPage.value = true
    await pokemonStore.loadPage(page)
  } catch (error) {
    console.error('ページ変更エラー:', error)
    // TODO: エラートーストを表示するなど
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
      <div class="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="text-center">
            <p class="text-2xl font-bold text-blue-600">{{ totalCount }}</p>
            <p class="text-sm text-gray-600">総ポケモン数</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold text-purple-600">{{ types.length }}</p>
            <p class="text-sm text-gray-600">タイプ数</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold text-green-600">{{ initialPokemon.length }}</p>
            <p class="text-sm text-gray-600">表示中</p>
          </div>
        </div>
      </div>
      
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
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
}
</style>