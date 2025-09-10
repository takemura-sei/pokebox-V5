<!-- app/components/AppHeader.vue -->
<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

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
      <h1 class="text-xl sm:text-3xl font-bold text-center text-gray-800">
        <span class="hidden sm:inline"></span>
        <span class="sm:hidden"></span>
      </h1>
      
      <!-- 認証エリア - モバイル対応 -->
      <div class="flex items-center">
        <ClientOnly>
          <!-- ログイン済み -->
          <div v-if="authStore.isAuthenticated" class="flex items-center gap-2 sm:gap-3">
            <!-- ユーザー名表示（モバイルでは短縮） -->
            <span class="text-xs sm:text-sm text-gray-600 max-w-[80px] sm:max-w-none truncate">
              <span class="hidden sm:inline">こんにちは、</span>{{ authStore.userEmail }}<span class="hidden sm:inline">さん</span>
            </span>
            
            <!-- ログアウトボタン -->
            <button 
              @click="handleLogout"
              :disabled="authStore.isLoading"
              class="px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 transition-colors"
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