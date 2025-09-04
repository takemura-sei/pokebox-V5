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
    }
  }
}