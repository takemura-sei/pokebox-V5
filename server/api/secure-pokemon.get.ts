import { usePokemon } from "@/composables/useSupaPokemon";

const { getPokemonById } = usePokemon();

export default defineEventHandler(async () => {
  const result = await getPokemonById(1);
  return result;
})