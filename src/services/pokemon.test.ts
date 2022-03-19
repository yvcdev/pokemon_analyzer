import { Pokemon, getPokemon } from "./pokemon";

test("should sum the numbers", async () => {
    let pokemon : Pokemon = await getPokemon();

    expect(pokemon).toBe(30);
});