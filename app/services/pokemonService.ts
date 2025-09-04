// app/services/pokemonService.ts
import type { Database } from '@/types/supabase'

type Pokemon = Database['public']['Tables']['pokemon']['Row']

// API レスポンスの型定義
export interface PokemonCountResponse {
  count: number
}

export interface InitialPokemonResponse {
  data: Pick<Pokemon, 'id' | 'name' | 'japanese_name' | 'sprite_url'>[]
  pagination: {
    page: number
    itemsPerPage: number
    offset: number
    returnedCount: number
  }
}

export interface PokemonDetailResponse extends Pokemon {}

export class PokemonService {
  /**
   * ポケモンの総数を取得
   */
  async getPokemonCount(): Promise<PokemonCountResponse> {
    try {
      const result = await $fetch<PokemonCountResponse>('/api/pokemon-count')
      return result
    } catch (error) {
      console.error('ポケモン総数取得エラー:', error)
      throw new Error('ポケモンの総数を取得できませんでした')
    }
  }

  /**
   * 初期ポケモンデータを取得（ページネーション対応）
   */
  async getInitialPokemon(page: number = 1, limit: number = 30): Promise<InitialPokemonResponse> {
    try {
      const result = await $fetch<InitialPokemonResponse>('/api/initial-pokemon', {
        query: { 
          page, 
          limit 
        }
      })
      return result
    } catch (error) {
      console.error(`ポケモンデータ取得エラー (page: ${page}):`, error)
      throw new Error(`${page}ページ目のポケモンデータを取得できませんでした`)
    }
  }

  /**
   * 指定したページのポケモンデータを取得
   */
  async getPokemonByPage(page: number, limit: number = 30): Promise<InitialPokemonResponse> {
    return this.getInitialPokemon(page, limit)
  }

  /**
   * 特定のポケモンの詳細情報を取得
   */
  async getPokemonById(id: number): Promise<PokemonDetailResponse> {
    try {
      const result = await $fetch<PokemonDetailResponse>(`/api/pokemon/${id}`)
      return result
    } catch (error) {
      console.error(`ポケモン詳細取得エラー (id: ${id}):`, error)
      throw new Error(`ポケモン(ID: ${id})の詳細情報を取得できませんでした`)
    }
  }

  /**
   * 並行してカウントと初期データを取得（Store初期化用）
   */
  async getInitialData(page: number = 1, limit: number = 30): Promise<{
    count: PokemonCountResponse
    pokemon: InitialPokemonResponse
  }> {
    try {
      const [countResult, pokemonResult] = await Promise.all([
        this.getPokemonCount(),
        this.getInitialPokemon(page, limit)
      ])

      return {
        count: countResult,
        pokemon: pokemonResult
      }
    } catch (error) {
      console.error('初期データ取得エラー:', error)
      throw new Error('初期データの取得に失敗しました')
    }
  }
}

// シングルトンインスタンスをエクスポート
export const pokemonService = new PokemonService()