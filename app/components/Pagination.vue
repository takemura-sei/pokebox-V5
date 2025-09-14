<script setup lang="ts">
interface Props {
  currentPage: number
  totalPages: number
  loading?: boolean
}

interface Emits {
  (event: 'page-change', page: number): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<Emits>()

// ページ変更処理
const changePage = (page: number) => {
  if (page < 1 || page > props.totalPages || props.loading || page === props.currentPage) {
    return
  }
  emit('page-change', page)
}

// 表示するページ番号の配列を計算
const visiblePages = computed(() => {
  const current = props.currentPage
  const total = props.totalPages
  const pages = []
  
  if (total <= 7) {
    // 総ページ数が7以下なら全て表示
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // 現在のページを中心に最大5ページを表示
    let start = Math.max(1, current - 2)
    let end = Math.min(total, current + 2)
    
    // 端に寄りすぎた場合の調整
    if (end - start < 4) {
      if (start === 1) {
        end = Math.min(total, start + 4)
      } else {
        start = Math.max(1, end - 4)
      }
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
  }
  
  return pages
})

// 最初のページを表示するか
const showFirstPage = computed(() => {
  return props.totalPages > 7 && (visiblePages.value[0] ?? 0) > 1
})

// 最後のページを表示するか
const showLastPage = computed(() => {
  const lastVisiblePage = visiblePages.value[visiblePages.value.length - 1] ?? 0
  return props.totalPages > 7 && lastVisiblePage < props.totalPages
})

// 省略記号を表示するか（前）
const showStartEllipsis = computed(() => {
  return showFirstPage.value && (visiblePages.value[0] ?? 0) > 2
})

// 省略記号を表示するか（後）
const showEndEllipsis = computed(() => {
  const lastVisiblePage = visiblePages.value[visiblePages.value.length - 1] ?? 0
  return showLastPage.value && lastVisiblePage < props.totalPages - 1
})
</script>

<template>
  <div class="flex justify-center items-center gap-2 flex-wrap">
    <!-- 前のページボタン -->
    <button
      :disabled="currentPage === 1 || loading"
      @click="changePage(currentPage - 1)"
      class="px-3 py-2 rounded-md bg-blue-500 text-white text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 active:bg-blue-700 transition-colors duration-200focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
    >
      <span class="sr-only">前のページ</span>
      ← 前
    </button>

    <!-- 最初のページ -->
    <button
      v-if="showFirstPage"
      @click="changePage(1)"
      :disabled="loading"
      class="px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-700 text-sm font-mediumhover:bg-gray-50 active:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowedtransition-colors duration-200focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
    >
      1
    </button>
    
    <!-- 省略記号（前） -->
    <span 
      v-if="showStartEllipsis" 
      class="px-2 py-2 text-gray-500 text-sm"
      aria-hidden="true"
    >
      ...
    </span>

    <!-- 表示するページ番号 -->
    <button
      v-for="page in visiblePages"
      :key="page"
      @click="changePage(page)"
      :disabled="loading"
      :class="{
        'bg-blue-500 text-white border-blue-500': page === currentPage,
        'bg-white text-gray-700 border-gray-300 hover:bg-gray-50': page !== currentPage
      }"
      class="px-3 py-2 rounded-md border text-sm font-mediumactive:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowedtransition-colors duration-200focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
    >
      {{ page }}
    </button>

    <!-- 省略記号（後） -->
    <span 
      v-if="showEndEllipsis" 
      class="px-2 py-2 text-gray-500 text-sm"
      aria-hidden="true"
    >
      ...
    </span>

    <!-- 最後のページ -->
    <button
      v-if="showLastPage"
      @click="changePage(totalPages)"
      :disabled="loading"
      class="px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-700 text-sm font-mediumhover:bg-gray-50 active:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowedtransition-colors duration-200focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
    >
      {{ totalPages }}
    </button>

    <!-- 次のページボタン -->
    <button
      :disabled="currentPage === totalPages || loading"
      @click="changePage(currentPage + 1)"
      class="px-3 py-2 rounded-md bg-blue-500 text-white text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 active:bg-blue-700 transition-colors duration-200focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
    >
      <span class="sr-only">次のページ</span>
      次 →
    </button>
  </div>

  <!-- ページ情報表示 -->
  <div class="text-center mt-4 text-sm text-gray-600">
    {{ currentPage }} / {{ totalPages }} ページ
    <span v-if="loading" class="ml-2 text-blue-600">
      読み込み中...
    </span>
  </div>
</template>