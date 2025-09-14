<!-- app/components/PokemonGrid.vue -->
<script setup lang="ts">
import type { Database } from '@/types/supabase'
import FavoriteButton from '@/components/FavoriteButton.vue'

type Pokemon = Pick<Database['public']['Tables']['pokemon']['Row'], 'id' | 'name' | 'japanese_name' | 'sprite_url'>

interface Props {
  pokemon: Pokemon[]
  loading?: boolean
  columns?: {
    sm: number
    md: number
    lg: number
  }
}

interface Emits {
  (event: 'pokemon-click', pokemonId: number): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  columns: () => ({
    sm: 2,
    md: 4,
    lg: 6
  })
})

const emit = defineEmits<Emits>()

// ポケモンクリック処理
const handlePokemonClick = (pokemonId: number) => {
  if (props.loading) return
  emit('pokemon-click', pokemonId)
}

// グリッドのCSSクラスを動的に生成
const gridClasses = computed(() => {
  const { sm, md, lg } = props.columns
  
  const getGridCols = (cols: number) => {
    const gridMap: Record<number, string> = {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6',
      7: 'grid-cols-7',
      8: 'grid-cols-8'
    }
    return gridMap[cols] || 'grid-cols-4'
  }
  
  const getMdGridCols = (cols: number) => {
    const gridMap: Record<number, string> = {
      1: 'md:grid-cols-1',
      2: 'md:grid-cols-2',
      3: 'md:grid-cols-3',
      4: 'md:grid-cols-4',
      5: 'md:grid-cols-5',
      6: 'md:grid-cols-6',
      7: 'md:grid-cols-7',
      8: 'md:grid-cols-8'
    }
    return gridMap[cols] || 'md:grid-cols-4'
  }
  
  const getLgGridCols = (cols: number) => {
    const gridMap: Record<number, string> = {
      1: 'lg:grid-cols-1',
      2: 'lg:grid-cols-2',
      3: 'lg:grid-cols-3',
      4: 'lg:grid-cols-4',
      5: 'lg:grid-cols-5',
      6: 'lg:grid-cols-6',
      7: 'lg:grid-cols-7',
      8: 'lg:grid-cols-8'
    }
    return gridMap[cols] || 'lg:grid-cols-6'
  }
  
  return [
    'grid gap-4',
    getGridCols(sm),
    getMdGridCols(md),
    getLgGridCols(lg)
  ].join(' ')
})
</script>

<template>
  <div 
    :class="[gridClasses, { 'opacity-60 pointer-events-none': loading }]"
    class="mb-8"
  >
    <!-- 空の状態 -->
    <div 
      v-if="pokemon.length === 0 && !loading"
      class="col-span-full text-center py-12"
    >
      <div class="text-gray-400 mb-4">
        <svg class="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
      </div>
      <p class="text-lg text-gray-600">ポケモンが見つかりませんでした</p>
      <p class="text-sm text-gray-500">検索条件を変更してみてください</p>
    </div>

    <!-- ポケモンカード -->
    <div 
      v-for="pokemon in pokemon" 
      :key="pokemon.id"
      class="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 relative group"
    >
      <!-- ローディング中のオーバーレイ -->
      <div 
        v-if="loading"
        class="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center rounded-lg z-10"
      >
        <div class="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>

      <!-- お気に入りボタン -->
      <div class="absolute top-2 right-2 z-10">
        <FavoriteButton :pokemon-id="pokemon.id" />
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

  <!-- ローディング中の追加表示 -->
  <div v-if="loading" class="text-center mt-4">
    <div class="inline-flex items-center gap-2 text-blue-600">
      <div class="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <span class="text-sm">読み込み中...</span>
    </div>
  </div>
</template>

<style scoped>
/* テキストを2行に制限 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* カードの最小高さを設定 */
.bg-white {
  min-height: 140px;
}
</style>