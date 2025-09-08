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
</template>