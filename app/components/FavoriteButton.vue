<!-- app/components/FavoriteButton.vue -->
<script setup lang="ts">
import { useFavoriteStore } from '@/stores/favorite'

interface Props {
  pokemonId: number
}

const props = defineProps<Props>()

const favoriteStore = useFavoriteStore()

const loading = ref(false)
const errorMessage = ref('')

// エラーメッセージの自動消去タイマー
let errorTimeout: NodeJS.Timeout | null = null

// エラーメッセージを表示する関数
const showError = (message: string) => {
  errorMessage.value = message
  
  // 既存のタイマーがあればクリア
  if (errorTimeout) {
    clearTimeout(errorTimeout)
  }
  
  // 5秒後に自動で消去
  errorTimeout = setTimeout(() => {
    errorMessage.value = ''
  }, 1000)
}

// エラーメッセージを手動でクリア
const clearError = () => {
  errorMessage.value = ''
  if (errorTimeout) {
    clearTimeout(errorTimeout)
    errorTimeout = null
  }
}

// コンポーネント破棄時にタイマーをクリア
onUnmounted(() => {
  if (errorTimeout) {
    clearTimeout(errorTimeout)
  }
})

// お気に入り状態の確認
const isFavorite = computed(() => favoriteStore.isFavorite(props.pokemonId))

// お気に入り切り替え
const handleToggle = async () => {
  if (loading.value) return

  try {
    loading.value = true
    clearError() // エラーをクリア
    
    const result = await favoriteStore.toggleFavorite(props.pokemonId)
    console.log(`お気に入りを${result.action === 'added' ? '追加' : '削除'}しました`)
    
  } catch (error) {
    showError((error as Error).message)
    console.error('お気に入り切り替えエラー:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="relative">
    <!-- ハートボタン -->
    <button
      @click="handleToggle"
      :disabled="loading"
      :class="[
        'w-8 h-8 rounded-full transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-1',
        'disabled:opacity-50',
        isFavorite 
          ? 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500' 
          : 'bg-gray-200 text-gray-500 hover:bg-red-100 hover:text-red-500 focus:ring-gray-400'
      ]"
      :title="isFavorite ? 'お気に入りから削除' : 'お気に入りに追加'"
    >
      <!-- ローディング中 -->
      <div
        v-if="loading"
        class="w-4 h-4 mx-auto border-2 border-current border-t-transparent rounded-full animate-spin"
      />
      
      <!-- ハートアイコン -->
      <svg
        v-else
        class="w-4 h-4 mx-auto"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    </button>

    <!-- エラーメッセージ -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="errorMessage"
        class="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 px-3 py-2 bg-red-500 text-white text-xs rounded whitespace-nowrap z-10 shadow-lg max-w-xs"
      >
        <div class="flex items-center gap-2">
          <span>{{ errorMessage }}</span>
          <!-- 手動クリアボタン -->
          <button
            @click="clearError"
            class="text-white hover:text-gray-200 focus:outline-none"
            :title="'エラーを消去'"
          >
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* プログレスバーのアニメーション */
@keyframes shrink {
  from { width: 100%; }
  to { width: 0%; }
}

.animate-shrink {
  animation: shrink 1s linear forwards;
}
</style>