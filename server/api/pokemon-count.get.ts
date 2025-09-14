// server/api/pokemon-count.get.ts
import { serverUsePokemon } from '../../server/utils/usePokemon'

export default defineEventHandler(async (event) => {
  const { getCountPokemon } = serverUsePokemon(event)

  try {
    const count = await getCountPokemon()
    
    return { count: count || 0 }
  } catch (error) {
    console.error('Pokemon count API error:', error)
    throw error
  }
})