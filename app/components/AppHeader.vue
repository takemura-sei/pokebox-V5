<!-- app/components/AppHeader.vue -->
<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useFavoriteStore } from '@/stores/favorite'

const authStore = useAuthStore()
const favoriteStore = useFavoriteStore()
const route = useRoute()

// 現在のページがお気に入りページかどうか
const isFavoritesPage = computed(() => route.path === '/favorites')

const handleLogout = async () => {
  const result = await authStore.signOut()
  if (result.success) {
    console.log('ログアウトしました')
  }
}
</script>

<template>
  <header class="mb-4 sm:mb-6">
    <div class="flex justify-between items-center">
      <!-- タイトル - モバイルでコンパクト -->
      <div class="flex items-center">
        <h1 class="text-xl sm:text-3xl font-bold text-center text-gray-800">
          ポケモン図鑑
        </h1>
      </div>
      
      <!-- 認証エリア - お気に入りページでは表示しない -->
      <div v-if="!isFavoritesPage" class="flex items-center gap-2">
        <ClientOnly>
          <!-- ログイン済み -->
          <div v-if="authStore.isAuthenticated" class="flex items-center gap-2 sm:gap-3">
            <!-- お気に入りボタン -->
            <NuxtLink 
              to="/favorites"
              class="relative px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center gap-1"
            >
              <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span class="hidden sm:inline">お気に入り</span>
              <!-- お気に入り数バッジ -->
              <span 
                v-if="favoriteStore.count > 0"
                class="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center"
              >
                {{ favoriteStore.count > 9 ? '9+' : favoriteStore.count }}
              </span>
            </NuxtLink>
            
            <!-- ユーザー名表示（モバイルでは短縮） -->
            <span class="text-xs sm:text-sm text-gray-600 max-w-[60px] sm:max-w-none truncate">
              <span class="hidden sm:inline">こんにちは、</span>{{ authStore.userEmail }}<span class="hidden sm:inline">さん</span>
            </span>
            
            <!-- ログアウトボタン -->
            <button 
              @click="handleLogout"
              :disabled="authStore.isLoading"
              class="px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 transition-colors"
            >
              <span class="sm:hidden">logout</span>
              <span class="hidden sm:inline">ログアウト</span>
            </button>
          </div>
          
          <!-- 未ログイン -->
          <div v-else class="flex items-center">
            <NuxtLink 
              to="/login" 
              class="px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              <span class="sm:hidden">login</span>
              <span class="hidden sm:inline">ログイン</span>
            </NuxtLink>
          </div>
          
          <!-- 読み込み中の表示 -->
          <template #fallback>
            <div class="flex items-center">
              <div class="px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm bg-gray-300 text-gray-600 rounded">
                <span class="sm:hidden">...</span>
                <span class="hidden sm:inline">読み込み中...</span>
              </div>
            </div>
          </template>
        </ClientOnly>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* スムーズなトランジション */
.transition-colors {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* テキスト切り詰め */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>