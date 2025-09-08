<!-- app/pages/profile.vue -->
<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

// 認証ミドルウェアを適用
definePageMeta({
  middleware: 'auth'
})

const authStore = useAuthStore()

// ログアウト処理
const handleLogout = async () => {
  const result = await authStore.signOut()
  if (result.success) {
    await navigateTo('/login')
  }
}
</script>

<template>
  <div class="container mx-auto p-4 max-w-2xl">
    <!-- ヘッダー -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">プロフィール</h1>
      <NuxtLink 
        to="/" 
        class="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        ← ホームに戻る
      </NuxtLink>
    </div>

    <!-- ユーザー情報 -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">ユーザー情報</h2>
      
      <ClientOnly>
        <div class="space-y-3">
          <div>
            <label class="block text-sm font-medium text-gray-700">メールアドレス</label>
            <p class="mt-1 text-sm text-gray-900">{{ authStore.userEmail }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">ログイン状態</label>
            <p class="mt-1 text-sm text-green-600">ログイン中</p>
          </div>
        </div>
        
        <!-- 読み込み中の表示 -->
        <template #fallback>
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700">メールアドレス</label>
              <p class="mt-1 text-sm text-gray-500">読み込み中...</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">ログイン状態</label>
              <p class="mt-1 text-sm text-gray-500">確認中...</p>
            </div>
          </div>
        </template>
      </ClientOnly>
    </div>

    <!-- アクション -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold mb-4">アクション</h2>
      
      <div class="space-y-3">
        <button 
          @click="handleLogout"
          :disabled="authStore.isLoading"
          class="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
        >
          {{ authStore.isLoading ? 'ログアウト中...' : 'ログアウト' }}
        </button>
        
        <p class="text-xs text-gray-500">
          ログアウトすると、ログインページに戻ります。
        </p>
      </div>
    </div>
  </div>
</template>