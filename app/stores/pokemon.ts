// stores/pokemon.ts
import { defineStore } from 'pinia'
import type { Database } from '@/types/supabase'

type Pokemon = Database['public']['Tables']['pokemon']['Row']

interface PokemonState {
  totalCount: number
  initialPokemon: Pick<Pokemon, 'id' | 'name' | 'japanese_name' | 'sprite_url'>[]
  types: string[]
  pagination: {
    itemsPerPage: number
    currentPage: number
    totalPages: number
  }
  isInitialized: boolean

}

export const usePokemonStore = defineStore('pokemon', {
  state: (): PokemonState => ({
    totalCount: 0,
    initialPokemon: [],
    types: [
      'ノーマル', 'ほのお', 'みず', 'でんき', 'くさ', 'こおり', 
      'かくとう', 'どく', 'じめん', 'ひこう', 'エスパー', 'むし', 
      'いわ', 'ゴースト', 'ドラゴン', 'あく', 'はがね', 'フェアリー'
    ],
    pagination: {
      itemsPerPage: 30,
      currentPage: 1,
      totalPages: 0
    },
    isInitialized: false
  }),

  getters: {
    getPokemonById: (state) => (id: number) => {
      return state.initialPokemon.find(pokemon => pokemon.id === id)
    },
    getTotalPages: (state) => {
      return Math.ceil(state.totalCount / state.pagination.itemsPerPage)
    }
  },

  actions: {
    async initializeStore() {
      if (this.isInitialized) return
      
      try {
        // 総数と初期データ（1ページ目）を並行取得
        const [countResult, pokemonResult] = await Promise.all([
          $fetch<{ count: number }>('/api/pokemon-count'),
          $fetch<{
            data: Pick<Pokemon, 'id' | 'name' | 'japanese_name' | 'sprite_url'>[]
            pagination: { page: number, itemsPerPage: number, offset: number, returnedCount: number }
          }>('/api/initial-pokemon', {
            query: { 
              page: this.pagination.currentPage, 
              limit: this.pagination.itemsPerPage 
            }
          })
        ])
        
        this.totalCount = countResult.count
        this.initialPokemon = pokemonResult.data
        this.pagination.totalPages = Math.ceil(this.totalCount / this.pagination.itemsPerPage)
        this.isInitialized = true
        
        console.log(
          `初期化完了: 総数${this.totalCount}、` +
          `${this.pagination.currentPage}ページ目 ${pokemonResult.data.length}件、` +
          `全${this.pagination.totalPages}ページ`
        )
      } catch (error) {
        console.error('Store初期化エラー:', error)
        throw error
      }
    },

    async loadPage(page: number) {
      try {
        const result = await $fetch<{
          data: Pick<Pokemon, 'id' | 'name' | 'japanese_name' | 'sprite_url'>[]
          pagination: { page: number, itemsPerPage: number, offset: number, returnedCount: number }
        }>('/api/initial-pokemon', {
          query: { 
            page, 
            limit: this.pagination.itemsPerPage 
          }
        })

        this.initialPokemon = result.data
        this.pagination.currentPage = page
        
        console.log(`${page}ページ目読み込み完了: ${result.data.length}件`)
        return result.data
      } catch (error) {
        console.error(`${page}ページ目の読み込みエラー:`, error)
        throw error
      }
    }
  }
})