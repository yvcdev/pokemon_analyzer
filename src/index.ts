const inquirer = require("inquirer");

import { getAverages, getPokemonPointers, getPokemons, getAveragesByType } from "./controllers/pokemons";

async function getLimit(): Promise<number> {
    let answer = { limit: NaN };

    while (isNaN(answer.limit) || !Number.isInteger(answer.limit)) {
        answer = await inquirer.prompt({
            type: "number",
            name: "limit",
            message: "Please enter a valid limit (positive integer): "
        });
    }
    return answer.limit;
}

async function getOffset(): Promise<number> {
    let answer = { offset: NaN };

    while (isNaN(answer.offset) || !Number.isInteger(answer.offset)) {
        answer = await inquirer.prompt({
            type: "number",
            name: "offset",
            message: "Please enter a valid offset (positive integer):"
        });
    }
    return answer.offset;

}

async function promptuser() {
    console.time("\tComplete service");
    console.clear();
    let limit = await getLimit();
    let offset = await getOffset();

    console.time("Complete service execution time");

    console.log("");
    console.time("Time getting pokemon pointers");
    let pokemonPointers = await getPokemonPointers(limit, offset);
    console.timeEnd("Time getting pokemon pointers");

    console.time("Time getting pokemons");
    let pokemons = await getPokemons(pokemonPointers == null ? [] : pokemonPointers);
    console.timeEnd("Time getting pokemons");
    console.log("");

    let [averageHeight, averageWeight] = getAverages(pokemons == null ? [] : pokemons);

    console
        .log(`Showing information of ${pokemons == null ? 0 : pokemons.length} ${pokemons?.length != 1 ? "pokemons" : "pokemon"}`);
    console.log("Average Height: " + averageHeight);
    console.log("Average Weight: " + averageWeight + "\n");

    let averagesByType = getAveragesByType(pokemons == null ? [] : pokemons);

    averagesByType.forEach((type)=>{
        console
        .log(
            `Averages for ${type.name}:
            Height: ${type.heightAverage}
            Weight: ${type.weightAverage}
            `);
        
    });

    console.timeEnd("Complete service execution time");
    console.log("");
};

promptuser();


