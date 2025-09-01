// server/api/initial-pokemon.get.ts
import { serverUsePokemon } from '../../server/utils/usePokemon'

export default defineEventHandler(async (event) => {
  const { getInitPokemon } = serverUsePokemon(event)

  try {
    // クエリパラメータから取得、デフォルトは1ページ目
    const query = getQuery(event)
    const page = Number(query.page) || 1
    const itemsPerPage = Number(query.limit) || 30
    
    // ページネーション計算
    const offset = (page - 1) * itemsPerPage
    const limit = offset + itemsPerPage - 1
    
    const data = await getInitPokemon(offset, limit)
    
    return {
      data: data || [],
      pagination: {
        page,
        itemsPerPage,
        offset,
        returnedCount: data?.length || 0
      }
    }
  } catch (error) {
    console.error('Initial pokemon API error:', error)
    throw error
  }
})