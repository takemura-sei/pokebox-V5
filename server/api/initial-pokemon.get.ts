// server/api/initial-pokemon.get.ts
export default defineEventHandler(async (event) => {
  try {
    const supabase = event.context.supabase
    
    // クエリパラメータから取得、デフォルトは1ページ目
    const query = getQuery(event)
    const page = Number(query.page) || 1
    const itemsPerPage = Number(query.limit) || 30
    
    // ページネーション計算
    const offset = (page - 1) * itemsPerPage
    const limit = offset + itemsPerPage - 1
    
    const { data, error } = await supabase
      .from('pokemon')
      .select('id, name, japanese_name, sprite_url')
      .range(offset, limit)
      .order('id')
    
    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `${page}ページ目のポケモンデータ取得に失敗しました`
      })
    }
    
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