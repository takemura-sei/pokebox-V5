// app/services/favoriteService.ts
import { createClient } from '@supabase/supabase-js'

interface UserFavoriteInsert {
  user_id: string
  pokemon_id: number
}

export class FavoriteService {
  private supabase: any = null

  private getSupabase() {
    if (!this.supabase) {
      const config = useRuntimeConfig()
      this.supabase = createClient(
        config.public.supabaseUrl,
        config.public.supabaseAnonKey
      )
    }
    return this.supabase
  }

  // お気に入りかどうかを確認
  async isFavorite(userId: string, pokemonId: number): Promise<boolean> {
    try {
      const { data } = await this.getSupabase()
        .from('user_favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('pokemon_id', pokemonId)
        .single()

      return !!data
    } catch {
      return false
    }
  }

  // お気に入りに追加
  async addFavorite(userId: string, pokemonId: number): Promise<void> {
    const { error } = await this.getSupabase()
      .from('user_favorites')
      .insert({
        user_id: userId,
        pokemon_id: pokemonId
      } as UserFavoriteInsert)
    
    if (error) {
      throw error
    }
  }

  // お気に入りから削除
  async removeFavorite(userId: string, pokemonId: number): Promise<void> {
    const { error } = await this.getSupabase()
      .from('user_favorites')
      .delete()
      .eq('user_id', userId)
      .eq('pokemon_id', pokemonId)
    
    if (error) {
      throw error
    }
  }

  // ユーザーのお気に入り一覧を取得
  async getFavorites(userId: string): Promise<number[]> {
    try {
      const { data, error } = await this.getSupabase()
        .from('user_favorites')
        .select('pokemon_id')
        .eq('user_id', userId)

      if (error) {
        throw error
      }

      return data?.map((item: { pokemon_id: number }) => item.pokemon_id) || []
    } catch {
      return []
    }
  }
}

export const favoriteService = new FavoriteService()