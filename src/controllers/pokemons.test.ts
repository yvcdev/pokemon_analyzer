import { fetch } from ".";
import { getPokemonPointers, getPokemons, getAverages, getAveragesByType } from "./pokemons";

jest.mock('node-fetch');

beforeEach(() => {
    fetch.mockClear();
});

let pointersMockData: PokemonPointer[] = [
    {
        name: "bulbasaur",
        url: "https://pokeapi.co/api/v2/pokemon/1/"
    },
    {
        name: "ivysaur",
        url: "https://pokeapi.co/api/v2/pokemon/2/"
    },
    {
        name: "venusaur",
        url: "https://pokeapi.co/api/v2/pokemon/3/"
    }
];

let pokemonsMockData: Pokemon[] = [
    {
        id: 1,
        name: "bulbasaur",
        height: 7,
        weight: 69,
        types: ["grass", "poison"]
    },
    {
        id: 2,
        name: "ivysaur",
        height: 10,
        weight: 130,
        types: ["grass", "poison"]
    },
    {
        id: 3,
        name: "venusaur",
        height: 20,
        weight: 1000, types: ["grass", "poison"]
    },
]

describe("Get pokemon pointers", () => {
    it("should return a 3 pokemonPointer array", async () => {
        fetch.mockReturnValue(Promise.resolve({
            json: () => Promise.resolve({ results: pointersMockData })
        }));

        let actual = await getPokemonPointers(3, 0);

        expect(actual).toHaveLength(3);
        expect(actual).toEqual(pointersMockData);
    });

    it("should return null if negative params", async () => {
        let actual = await getPokemonPointers(-1, -5);

        expect(actual).toBeNull();
    });

    it("should return empty array if limit 0", async () => {
        let actual = await getPokemonPointers(0, 3);

        expect(actual).toEqual([]);
    });

    it("should return null on exception", async () => {
        fetch.mockReturnValue(Promise.reject("API Failure"));

        let actual = await getPokemonPointers(1, 3);

        expect(fetch).toBeCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith("https://pokeapi.co/api/v2/pokemon?limit=1&offset=3");
        expect(actual).toBeNull();
    });
});

describe("GET - Pokemons array", () => {
    it("should return a 3 pokemon array", async () => {
        fetch.mockReturnValueOnce(Promise.resolve({
            json: () => Promise.resolve({ id: 1, name: "bulbasaur", weight: 69, height: 7, types: [{ type: { name: "grass" } }, { type: { name: "poison" } }] })
        }));
        fetch.mockReturnValueOnce(Promise.resolve({
            json: () => Promise.resolve({ id: 2, name: "ivysaur", weight: 130, height: 10, types: [{ type: { name: "grass" } }, { type: { name: "poison" } }] })
        }));
        fetch.mockReturnValueOnce(Promise.resolve({
            json: () => Promise.resolve({ id: 3, name: "venusaur", weight: 1000, height: 20, types: [{ type: { name: "grass" } }, { type: { name: "poison" } }] })
        }));


        let actual = await getPokemons(pointersMockData);


        expect(actual).toEqual(pokemonsMockData);
        expect(actual).toHaveLength(3);
        expect(fetch).toBeCalledTimes(3);
        expect(fetch).toHaveBeenNthCalledWith(1, pointersMockData[0].url);
        expect(fetch).toHaveBeenNthCalledWith(2, pointersMockData[1].url);
        expect(fetch).toHaveBeenNthCalledWith(3, pointersMockData[2].url);
    });

    it("should return null if pokemon pointers empty", async () => {
        let actual = await getPokemons(pointersMockData);

        expect(actual).toBeNull();
    });


    /*  it("should return null on exception", async () => {
          fetch.mockReturnValue(Promise.reject("API Failure"));
  
          let actual = await getPokemons(pointersMockData);
  
          expect(fetch).toBeCalledTimes(1);
          expect(fetch).toHaveBeenCalledWith("https://pokeapi.co/api/v2/pokemon/1/");
          expect(actual).toBeNull();
      })*/

});

describe("Get average height and weight", () => {
    it("should return a 2-position array with height and weight", () => {
        let [height, weight] = getAverages(pokemonsMockData);

        let mockAverageHeight
            = (pokemonsMockData[0].height + pokemonsMockData[1].height + pokemonsMockData[2].height) / 3;
        let mockAverageWeight
            = (pokemonsMockData[0].weight + pokemonsMockData[1].weight + pokemonsMockData[2].weight) / 3;

        expect(height).toBeCloseTo(mockAverageHeight);
        expect(weight).toBeCloseTo(mockAverageWeight);
    });

    it("should return a 2-position array with 0 and 0 if no pokemons", () => {
        let [averageHeight, averageWeight] = getAverages([]);

        expect(averageHeight).toBe(0);
        expect(averageWeight).toBe(0);
    });
});

describe("Get average per type", () => {
    it("should return averages for grass and poison",()=>{
        let averages = getAveragesByType(pokemonsMockData);
        
        expect(averages).toHaveLength(2);
        expect(averages[0].name).toEqual("grass");
        expect(averages[0].heightAverage).toBeCloseTo(12.33);
        expect(averages[0].weightAverage).toBeCloseTo(399.67);
        expect(averages[1].name).toEqual("poison");
        expect(averages[1].heightAverage).toBeCloseTo(12.33);
        expect(averages[1].weightAverage).toBeCloseTo(399.67);
    });

    it("should return empty array if no pokemons",()=>{
        let averages = getAveragesByType([]);
        
        expect(averages).toEqual([]);
    });
});