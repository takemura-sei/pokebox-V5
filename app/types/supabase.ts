// app/types/supabase.ts
import type { User, Session } from '@supabase/supabase-js'

export interface Database {
  public: {
    Tables: {
      pokemon: {
        Row: {
          id: number
          name: string
          japanese_name: string | null
          height: number
          weight: number
          sprite_url: string | null
          types: string[]
          stats: {
            hp: number
            attack: number
            defense: number
          }
          created_at: string
        }
        Insert: {
          id: number
          name: string
          japanese_name?: string | null
          height: number
          weight: number
          sprite_url?: string | null
          types: string[]
          stats: {
            hp: number
            attack: number
            defense: number
          }
        }
        Update: {
          id?: number
          name?: string
          japanese_name?: string | null
          height?: number
          weight?: number
          sprite_url?: string | null
          types?: string[]
          stats?: {
            hp: number
            attack: number
            defense: number
          }
        }
      }
      profiles: {
        Row: {
          id: string
          username: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          avatar_url?: string | null
          updated_at?: string
        }
      }
      user_favorites: {
        Row: {
          id: string
          user_id: string
          pokemon_id: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          pokemon_id: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          pokemon_id?: number
        }
      }
    }
  }
}

// 認証関連の型定義
export type SupabaseUser = User
export type SupabaseSession = Session

// プロフィール型
export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

// お気に入り型
export type UserFavorite = Database['public']['Tables']['user_favorites']['Row']
export type UserFavoriteInsert = Database['public']['Tables']['user_favorites']['Insert']

// ポケモン型（既存）
export type Pokemon = Database['public']['Tables']['pokemon']['Row']
export type PokemonInsert = Database['public']['Tables']['pokemon']['Insert']
export type PokemonUpdate = Database['public']['Tables']['pokemon']['Update']