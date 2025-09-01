// server/utils/usePokemon.ts
import type { H3Event } from 'h3'

export const serverUsePokemon = (event: H3Event) => {
  const supabase = event.context.supabase

  const getAllPokemon = async () => {
    const { data, error } = await supabase
      .from('pokemon')
      .select('id, name, sprite_url, types')
      .order('id') 
    
    if (error) throw error
    return data || []
  }

  const getPokemonById = async (id: number) => {
    const { data, error } = await supabase
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