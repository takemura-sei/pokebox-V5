// server/api/secure-pokemon.get.ts
import { serverUsePokemon } from '../../server/utils/usePokemon'

export default defineEventHandler(async (event) => {
  const { getPokemonById } = serverUsePokemon(event)
  const result = await getPokemonById(1)
  return result
})

