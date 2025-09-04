// server/utils/usePokemon.ts
import type { H3Event } from 'h3'

export const serverUsePokemon = (event: H3Event) => {
  const supabase = event.context.supabase

  const getInitPokemon = async (offset: number, limit: number) => {
    const { data, error } = await supabase
      .from('pokemon')
      .select('id, name, japanese_name, sprite_url')
      .range(offset, limit)
      .order('id')
    
    if (error) throw error
    return data || []
  }

  const getCountPokemon = async () => {
    const { count, error } = await supabase
      .from('pokemon')
      .select('*', { count: 'exact', head: true })

    if (error) throw error
    return count || 0
  }

  return {
    getInitPokemon,
    getCountPokemon
  }
}