<!-- app/pages/login.vue -->
<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// フォームデータ
const email = ref('')
const password = ref('')
const isSignUp = ref(false) // ログイン/サインアップの切り替え
const errorMessage = ref('')
const successMessage = ref('')

// ログイン処理
const handleSignIn = async () => {
  errorMessage.value = ''
  
  const result = await authStore.signIn(email.value, password.value)
  
  if (result.success) {
    // リダイレクト先があればそこに、なければホームに遷移
    const route = useRoute()
    const redirectTo = route.query.redirect as string || '/'
    await navigateTo(redirectTo)
  } else {
    errorMessage.value = result.error || 'ログインに失敗しました'
  }
}

// サインアップ処理
const handleSignUp = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  
  const result = await authStore.signUp(email.value, password.value)
  
  if (result.success) {
    if (result.needsConfirmation) {
      successMessage.value = '確認メールを送信しました。メールをご確認ください。'
    } else {
      // リダイレクト先があればそこに、なければホームに遷移
      const route = useRoute()
      const redirectTo = route.query.redirect as string || '/'
      await navigateTo(redirectTo)
    }
  } else {
    errorMessage.value = result.error || 'アカウント作成に失敗しました'
  }
}

// フォーム送信
const handleSubmit = () => {
  if (isSignUp.value) {
    handleSignUp()
  } else {
    handleSignIn()
  }
}

// 既にログインしている場合はリダイレクト
onMounted(async () => {
  // 認証状態の初期化を待つ
  if (import.meta.client) {
    // 認証状態が初期化されるまで待つ
    while (!authStore.isInitialized) {
      await new Promise(resolve => setTimeout(resolve, 50))
    }
    
    if (authStore.isAuthenticated) {
      // リダイレクト先があればそこに、なければホームに遷移
      const route = useRoute()
      const redirectTo = route.query.redirect as string || '/'
      await navigateTo(redirectTo)
    }
  }
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <ClientOnly>
        <!-- ヘッダー -->
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {{ isSignUp ? 'アカウント作成' : 'ログイン' }}
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            ポケモン図鑑アプリへようこそ
          </p>
        </div>

        <!-- フォーム -->
        <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
          <!-- メールアドレス -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              メールアドレス
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="email@example.com"
            />
          </div>

          <!-- パスワード -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              パスワード
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              class="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="パスワード（6文字以上）"
            />
          </div>

          <!-- エラーメッセージ -->
          <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-md p-3">
            <p class="text-sm text-red-600">{{ errorMessage }}</p>
          </div>

          <!-- 成功メッセージ -->
          <div v-if="successMessage" class="bg-green-50 border border-green-200 rounded-md p-3">
            <p class="text-sm text-green-600">{{ successMessage }}</p>
          </div>

          <!-- 送信ボタン -->
          <div>
            <button
              type="submit"
              :disabled="authStore.isLoading"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="authStore.isLoading" class="mr-2">
                <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </span>
              {{ authStore.isLoading ? '処理中...' : (isSignUp ? 'アカウント作成' : 'ログイン') }}
            </button>
          </div>

          <!-- モード切り替え -->
          <div class="text-center">
            <button
              type="button"
              @click="isSignUp = !isSignUp"
              class="text-sm text-blue-600 hover:text-blue-500"
            >
              {{ isSignUp ? 'すでにアカウントをお持ちですか？ログインする' : 'アカウントを作成する' }}
            </button>
          </div>
        </form>

        <!-- ホームに戻るリンク -->
        <div class="text-center">
          <NuxtLink 
            to="/" 
            class="text-sm text-gray-500 hover:text-gray-700"
          >
            ← ホームに戻る
          </NuxtLink>
        </div>
        
        <!-- 読み込み中の表示 -->
        <template #fallback>
          <div class="text-center py-8">
            <div class="inline-flex items-center justify-center w-16 h-16 mb-4">
              <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p class="text-lg text-gray-600">読み込み中...</p>
          </div>
        </template>
      </ClientOnly>
    </div>
  </div>
</template>