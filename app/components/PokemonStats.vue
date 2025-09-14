<!-- app/components/PokemonStats.vue -->
<script setup lang="ts">
interface Props {
  totalCount: number
  displayedCount: number
  typeCount: number
  currentPage: number
  totalPages: number
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

// 統計データの計算
const stats = computed(() => [
  {
    value: props.totalCount,
    label: '総数',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    icon: '🔥'
  },
  {
    value: props.typeCount,
    label: 'タイプ',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    icon: '⚡'
  },
  {
    value: props.displayedCount,
    label: '表示中',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    icon: '👁️'
  }
])

// 進捗率の計算
const progressPercentage = computed(() => {
  if (props.totalPages === 0) return 0
  return Math.round((props.currentPage / props.totalPages) * 100)
})
</script>

<template>
  <div class="mb-4 p-3 sm:p-4 bg-gradient-to-r from-blue-50 via-purple-50 to-green-50 rounded-lg border border-gray-200">
    <!-- 統計情報グリッド -->
    <div class="grid grid-cols-3 gap-2 sm:gap-3 mb-3">
      <div 
        v-for="stat in stats" 
        :key="stat.label"
        :class="[stat.bgColor, { 'opacity-75': loading }]"
        class="relative overflow-hidden rounded-md p-2 sm:p-3 text-center"
      >
        <!-- ローディングオーバーレイ -->
        <div 
          v-if="loading"
          class="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10"
        >
          <div class="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
        </div>

        <div class="flex flex-col items-center space-y-1">
          <div class="text-lg sm:text-xl opacity-50">{{ stat.icon }}</div>
          <p :class="stat.color" class="text-lg sm:text-xl font-bold leading-none">
            {{ loading ? '---' : stat.value.toLocaleString() }}
          </p>
          <p class="text-xs text-gray-600 font-medium leading-none">{{ stat.label }}</p>
        </div>
      </div>
    </div>

    <!-- 進捗バー -->
    <div class="pt-2 border-t border-gray-200">
      <div class="flex justify-between items-center mb-1">
        <span class="text-xs font-medium text-gray-700">進捗</span>
        <span class="text-xs text-gray-600">
          {{ currentPage }}/{{ totalPages }}
          <span v-if="!loading" class="text-gray-400">
            ({{ progressPercentage }}%)
          </span>
        </span>
      </div>
      
      <!-- プログレスバー -->
      <div class="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
        <div 
          :class="{ 'animate-pulse': loading }"
          class="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-500 ease-out"
          :style="{ width: loading ? '0%' : `${progressPercentage}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ホバー効果の微調整 */
.hover\:shadow-md:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* アニメーション効果 */
@keyframes shimmer {
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
}

.animate-shimmer {
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
}
</style>