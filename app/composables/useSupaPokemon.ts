// app/composables/useSupaPokemon.ts
import type { Database } from "@/types/supabase"
import type { SupabaseClient } from '@supabase/supabase-js'

type Pokemon = Database['public']['Tables']['pokemon']['Row']

declare module '#app' {
  interface NuxtApp {
    $supabase: SupabaseClient<Database>
  }
}

export const usePokemon = () => {
  const { $supabase } = useNuxtApp()

  const getAllPokemon = async () => {
    const { data, error } = await $supabase
      .from('pokemon')
      .select('id, name, sprite_url, types')
      .order('id') 
    
    if (error) throw error
    return data || []
  }

  const getPokemonById = async (id: number): Promise<Pokemon> => {
    const { data, error } = await $supabase
      .from('pokemon')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  return {
    getAllPokemon,
    getPokemonById
  }
}