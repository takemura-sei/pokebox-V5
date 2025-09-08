<script setup lang="ts">
import { usePokemonStore } from '@/stores/pokemon'
import { useAuthStore } from '@/stores/auth'
import  Pagination from '@/components/Pagination.vue'

// Storeから初期データを取得（SSRで既に格納済み）
const pokemonStore = usePokemonStore()
const { totalCount, initialPokemon, types, isInitialized, pagination } = storeToRefs(pokemonStore)
const authStore = useAuthStore()

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

// ログアウト処理
const handleLogout = async () => {
  const result = await authStore.signOut()
  if (result.success) {
    console.log('ログアウトしました')
  }
}
</script>

<template>
  <div class="container mx-auto p-4">
    <!-- ヘッダー -->
    <header class="mb-6">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-center">ポケモン図鑑</h1>
        
        <!-- 認証エリア -->
        <div class="flex items-center gap-4">
          <!-- ClientOnlyで囲んでSSRをスキップ -->
          <ClientOnly>
            <div v-if="authStore.isAuthenticated" class="flex items-center gap-3">
              <span class="text-sm text-gray-600">
                こんにちは、{{ authStore.userEmail }}さん
              </span>
              <button 
                @click="handleLogout"
                :disabled="authStore.isLoading"
                class="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
              >
                ログアウト
              </button>
            </div>
            
            <div v-else class="flex items-center gap-3">
              <NuxtLink 
                to="/login" 
                class="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                ログイン
              </NuxtLink>
            </div>
            
            <!-- 読み込み中の表示 -->
            <template #fallback>
              <div class="flex items-center gap-3">
                <div class="px-3 py-1 text-sm bg-gray-300 text-gray-600 rounded">
                  読み込み中...
                </div>
              </div>
            </template>
          </ClientOnly>
        </div>
      </div>
    </header>

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
      <div 
        class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8"
        :class="{ 'opacity-60 pointer-events-none': isLoadingPage }"
      >
        <div 
          v-for="pokemon in initialPokemon" 
          :key="pokemon.id"
          class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer border border-gray-200"
          @click="handlePokemonClick(pokemon.id)"
        >
          <div class="relative">
            <img 
              :src="pokemon.sprite_url || ''" 
              :alt="pokemon.japanese_name || pokemon.name"
              class="w-full h-24 object-contain mb-2"
              loading="lazy"
            >
            <!-- ローディング中のオーバーレイ -->
            <div 
              v-if="isLoadingPage"
              class="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center rounded"
            >
              <div class="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
          <div class="text-center">
            <p class="text-sm font-semibold text-gray-800 mb-1">
              No.{{ pokemon.id.toString().padStart(3, '0') }}
            </p>
            <p class="text-xs text-gray-600 line-clamp-2">
              {{ pokemon.japanese_name || pokemon.name }}
            </p>
          </div>
        </div>
      </div>

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

/* テキストを2行に制限 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>