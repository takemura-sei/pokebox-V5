// server/api/pokemon/[id].get.ts
export default defineEventHandler(async (event) => {
  try {
    // URLパラメータからIDを取得
    const id = getRouterParam(event, 'id')
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Pokemon ID is required'
      })
    }

    const pokemonId = Number(id)
    
    if (isNaN(pokemonId) || pokemonId <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid Pokemon ID format'
      })
    }

    // supabaseクライアントを取得
    const supabase = event.context.supabase
    
    if (!supabase) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Database connection not available'
      })
    }

    // 指定されたIDのポケモンを取得
    const { data: pokemon, error } = await supabase
      .from('pokemon')
      .select('*')
      .eq('id', pokemonId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // データが見つからない場合
        throw createError({
          statusCode: 404,
          statusMessage: `Pokemon with ID ${pokemonId} not found`
        })
      }
      throw error
    }

    if (!pokemon) {
      throw createError({
        statusCode: 404,
        statusMessage: `Pokemon with ID ${pokemonId} not found`
      })
    }

    return pokemon
    
  } catch (error: any) {
    console.error(`Pokemon detail API error (ID: ${getRouterParam(event, 'id')}):`, error)
    
    // 既にcreateErrorで作成されたエラーはそのまま投げる
    if (error.statusCode) {
      throw error
    }
    
    // その他のエラーは500として処理
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})