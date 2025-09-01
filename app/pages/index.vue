<script setup lang="ts">
import { usePokemonStore } from '@/stores/pokemon';

// Storeから初期データを取得（SSRで既に格納済み）
const pokemonStore = usePokemonStore()
const { totalCount, initialPokemon, types, isInitialized } = storeToRefs(pokemonStore)
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">ポケモン図鑑</h1>
    
    <!-- 初期化後の表示 -->
    <div v-if="isInitialized">
      <!-- 基本情報表示 -->
      <div class="mb-6 p-4 bg-gray-100 rounded">
        <p class="text-lg">総ポケモン数: <span class="font-bold">{{ totalCount }}</span></p>
        <p class="text-sm text-gray-600">タイプ数: {{ types.length }}種類</p>
      </div>
      
      <!-- ポケモン一覧グリッド -->
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div 
          v-for="pokemon in initialPokemon" 
          :key="pokemon.id"
          class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
          @click="console.log('Pokemon clicked:', pokemon.id)"
        >
          <img 
            :src="pokemon.sprite_url || ''" 
            :alt="pokemon.japanese_name || pokemon.name"
            class="w-full h-24 object-contain mb-2"
          >
          <p class="text-sm font-semibold text-center">
            No.{{ pokemon.id.toString().padStart(3, '0') }}
          </p>
          <p class="text-xs text-center text-gray-600">
            {{ pokemon.japanese_name || pokemon.name }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
}
</style>