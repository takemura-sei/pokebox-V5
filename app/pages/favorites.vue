<!-- app/pages/favorites.vue -->
<script setup lang="ts">
import { useFavoriteStore } from '@/stores/favorite'
import { useAuthStore } from '@/stores/auth'
import { pokemonService } from '@/services/pokemonService'
import AppHeader from '@/components/AppHeader.vue'
import FavoriteButton from '@/components/FavoriteButton.vue'
import type { Database } from '@/types/supabase'

// 認証が必要なページ
definePageMeta({
  middleware: 'auth'
})

type Pokemon = Pick<Database['public']['Tables']['pokemon']['Row'], 'id' | 'name' | 'japanese_name' | 'sprite_url'>

const favoriteStore = useFavoriteStore()
const authStore = useAuthStore()

// 状態管理
const loading = ref(false)
const favoritePokemons = ref<Pokemon[]>([])
const error = ref('')

// お気に入りポケモンの詳細情報を取得
const loadFavoritePokemons = async () => {
  if (favoriteStore.count === 0) {
    favoritePokemons.value = []
    return
  }

  try {
    loading.value = true
    error.value = ''

    // お気に入りのポケモンIDからポケモン詳細を取得
    const favoriteIds = Array.from(favoriteStore.favorites)
    const pokemonPromises = favoriteIds.map(id => 
      pokemonService.getPokemonById(id).catch(() => null)
    )
    
    const results = await Promise.all(pokemonPromises)
    
    // nullでない結果のみフィルター
    favoritePokemons.value = results
      .filter((pokemon): pokemon is NonNullable<typeof pokemon> => pokemon !== null)
      .map(pokemon => ({
        id: pokemon.id,
        name: pokemon.name,
        japanese_name: pokemon.japanese_name,
        sprite_url: pokemon.sprite_url
      }))
      .sort((a, b) => a.id - b.id) // ID順でソート

  } catch (err) {
    console.error('お気に入りポケモン取得エラー:', err)
    error.value = 'お気に入りポケモンの読み込みに失敗しました'
  } finally {
    loading.value = false
  }
}

// お気に入り状態の変化を監視
watch(() => favoriteStore.count, () => {
  loadFavoritePokemons()
}, { immediate: true })

// お気に入り削除後のハンドリング
const handleFavoriteChanged = (data: { pokemonId: number, isFavorite: boolean }) => {
  if (!data.isFavorite) {
    // お気に入りから削除された場合、一覧からも削除
    favoritePokemons.value = favoritePokemons.value.filter(
      pokemon => pokemon.id !== data.pokemonId
    )
  }
}

// ポケモンクリック処理
const handlePokemonClick = (pokemonId: number) => {
  console.log('Pokemon clicked:', pokemonId)
  // TODO: navigateTo(`/pokemon/${pokemonId}`)
}

// 初期化時にお気に入りを読み込み
onMounted(async () => {
  // 認証状態とお気に入りが初期化されていない場合は読み込み
  if (authStore.isAuthenticated && favoriteStore.count === 0) {
    await favoriteStore.loadFavorites()
  }
})
</script>

<template>
  <div class="container mx-auto p-4">
    <!-- ヘッダー -->
    <AppHeader />

    <!-- ページタイトル -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">お気に入り</h1>
      <NuxtLink 
        to="/" 
        class="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
      >
        ← ホームに戻る
      </NuxtLink>
    </div>

    <!-- 統計情報 -->
    <div class="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-4 mb-6 border border-red-100">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-semibold text-gray-800">お気に入りポケモン</h2>
            <p class="text-sm text-gray-600">あなたが選んだお気に入りのポケモンたち</p>
          </div>
        </div>
        <div class="text-right">
          <p class="text-2xl font-bold text-red-600">{{ favoriteStore.count }}</p>
          <p class="text-xs text-gray-500">匹</p>
        </div>
      </div>
    </div>

    <!-- エラー表示 -->
    <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div class="flex items-center gap-3">
        <svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <p class="text-red-700">{{ error }}</p>
      </div>
    </div>

    <!-- ローディング中 -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-flex items-center justify-center w-16 h-16 mb-4">
        <div class="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p class="text-lg text-gray-600">お気に入りを読み込み中...</p>
    </div>

    <!-- 空の状態 -->
    <div v-else-if="favoriteStore.count === 0" class="text-center py-16">
      <div class="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
        <svg class="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </div>
      <h3 class="text-xl font-semibold text-gray-700 mb-2">まだお気に入りがありません</h3>
      <p class="text-gray-500 mb-6">気になるポケモンを見つけてハートボタンをクリックしてみましょう</p>
      <NuxtLink 
        to="/" 
        class="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0L2.586 11H14a1 1 0 100-2H2.586l3.707-3.707a1 1 0 00-1.414-1.414l-5.414 5.414a1 1 0 000 1.414l5.414 5.414a1 1 0 001.414 0z" clip-rule="evenodd" />
        </svg>
        ポケモンを探しに行く
      </NuxtLink>
    </div>

    <!-- お気に入り一覧 -->
    <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      <div 
        v-for="pokemon in favoritePokemons" 
        :key="pokemon.id"
        class="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 relative group"
      >
        <!-- お気に入りボタン -->
        <div class="absolute top-2 right-2 z-10">
          <FavoriteButton 
            :pokemon-id="pokemon.id" 
            @favorite-changed="handleFavoriteChanged"
          />
        </div>

        <!-- クリック可能エリア -->
        <div 
          class="p-4 cursor-pointer hover:scale-105 transition-transform duration-200"
          @click="handlePokemonClick(pokemon.id)"
        >
          <!-- ポケモン画像 -->
          <div class="relative mb-3">
            <img 
              :src="pokemon.sprite_url || '/placeholder-pokemon.png'" 
              :alt="pokemon.japanese_name || pokemon.name"
              class="w-full h-24 object-contain"
              loading="lazy"
              @error="($event.target as HTMLImageElement).src = '/placeholder-pokemon.png'"
            >
          </div>

          <!-- ポケモン情報 -->
          <div class="text-center">
            <p class="text-sm font-semibold text-gray-800 mb-1">
              No.{{ pokemon.id.toString().padStart(3, '0') }}
            </p>
            <p class="text-xs text-gray-600 line-clamp-2 min-h-[2rem]">
              {{ pokemon.japanese_name || pokemon.name }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- フッター -->
    <div v-if="favoriteStore.count > 0" class="mt-12 text-center text-sm text-gray-500">
      {{ favoriteStore.count }}匹のお気に入りポケモンを表示中
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
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* スムーズなトランジション */
.transition-colors {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* ホバー効果 */
.group:hover {
  transform: translateY(-2px);
}
</style>