import fetch from "node-fetch";

interface Pokemon {
    id: number,
    name: string,
    weight: number,
    height: number
}

async function getPokemon() : Promise<Pokemon> {
    let result = await fetch("https://pokeapi.co/api/v2/pokemon/1");

    let data = result.json();

    console.log(data);

    let pokemon : Pokemon = {id: 1, name: 'name', weight: 20, height: 20};

    return pokemon;
}

export {getPokemon, Pokemon};