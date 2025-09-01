// server/api/pokemon-count.get.ts
import { serverUsePokemon } from '../../server/utils/usePokemon'

export default defineEventHandler(async (event) => {
  try {
    const supabase = event.context.supabase
    
    const { count, error } = await supabase
      .from('pokemon')
      .select('*', { count: 'exact', head: true })
    
    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: 'ポケモンの総数取得に失敗しました'
      })
    }
    
    return { count: count || 0 }
  } catch (error) {
    console.error('Pokemon count API error:', error)
    throw error
  }
})