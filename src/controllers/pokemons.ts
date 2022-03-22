import { fetch } from ".";

async function getPokemonPointers(limit: number, offset: number): Promise<PokemonPointer[] | null> {
    if (limit == 0) return [];
    if (limit < 0 && offset < 0) {
        return null;
    }

    try {
        let result =
            await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);

        let data = await result.json();

        let pokemonPointers: PokemonPointer[] = data.results;

        return pokemonPointers;
    } catch (error) {
        return null;
    }
}

async function getPokemons(pokemonPointers: PokemonPointer[]): Promise<Pokemon[] | null> {
    let pokemons: Pokemon[] = [];
    if (pokemonPointers.length == 0) return pokemons;
    try {

        for (let pointer of pokemonPointers) {
            let result = await fetch(pointer.url);

            let data = await result.json();

            let types: string[] = data.types.map((type: any) => {
                return type.type.name;
            });

            let pokemon: Pokemon
                = { id: data.id, name: data.name, height: data.height, weight: data.weight, types };



            pokemons.push(pokemon);
        }

        return pokemons;
    } catch (error) {
        return null;
    }
}

function getAverages(pokemons: Pokemon[]): [Number, Number] {
    if (pokemons.length == 0) return [0, 0];

    let heightSum = 0;
    let weightSum = 0;

    pokemons.forEach((pokemon) => {
        heightSum += pokemon.height;
        weightSum += pokemon.weight;
    });

    return [heightSum / pokemons.length, weightSum / pokemons.length];
}

interface Type {
    name: string
    heightSum: number,
    weightSum: number,
    pokemonsNumber: number,
}

interface TypeAverage {
    name: string
    heightAverage: number,
    weightAverage: number
}

function getAveragesByType(pokemons: Pokemon[]): TypeAverage[] {
    if (pokemons.length == 0) return [];

    let collectedTypes: Type[] = [];

    pokemons.forEach((pokemon) => {
        pokemon.types.forEach((pokeType) => {
            let existingType = collectedTypes.find((currentType) => {
                return currentType.name == pokeType;
            });

            if (existingType !== undefined) {
                let updatedType = existingType;

                updatedType.pokemonsNumber += 1;
                updatedType.heightSum += pokemon.height;
                updatedType.weightSum += pokemon.weight;
            } else {
                let newType: Type = {
                    name: pokeType,
                    pokemonsNumber: 1,
                    heightSum: pokemon.height,
                    weightSum: pokemon.weight
                }
                collectedTypes.push(newType);
            }
        });

    });

    let result: TypeAverage[] = [];
    collectedTypes.forEach(collectedType => {
        let individual: TypeAverage = {
            name: collectedType.name,
            heightAverage: collectedType.heightSum / collectedType.pokemonsNumber,
            weightAverage: collectedType.weightSum / collectedType.pokemonsNumber
        }

        result.push(individual);
    });
    return result;
}

export { getPokemonPointers, getPokemons, getAverages, getAveragesByType }