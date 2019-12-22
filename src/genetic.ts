export type City = {
    readonly x: number,
    readonly y: number,
}

export type Map = City[];

export type Population = Map[];

const shuffle = (xs: any[]) => {
    const ys = Object.assign([], xs)
    for (let i = ys.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = ys[i];
        ys[i] = ys[j];
        ys[j] = temp;
    }
    return ys;
}

const city = (width: number, height: number) => {
    return { x: Math.random() * width, y: Math.random() * height }
}

const citycmp = (c1: City, c2: City) => {
    return c1.x === c2.x && c1.y === c2.y
}

const map = (width: number, height: number, n: number): Map => n > 0
    ? [city(width, height), ...map(width, height, n - 1)]
    : []

const mutation = (map: Map) => {
    const i = Math.floor(Math.random() * map.length)

    const s1 = map.slice(0, i)
    const s2 = map.slice(i)

    // reverse the shortest slice of the map
    return s1.length < s2.length
        ? [...s1.reverse(), ...s2]
        : [...s1, ...s2.reverse()]
}

const crossover = (map1: Map, map2: Map) => {
    const i = Math.floor(Math.random() * map1.length)
    const j = Math.floor(Math.random() * map1.length)
    const k = Math.floor(Math.random() * map1.length)

    // get a slice of map1 starting from a random city
    const s1 = [...map1.slice(i), ...map1.slice(0, i)]
        .slice(0, k + 1);

    // get the remaining city from map2 starting from a random position
    const s2 = [...map2.slice(j), ...map2.slice(0, j)]
        .filter(c1 => s1.filter(c2 => citycmp(c1, c2)).length === 0)

    return [...s1, ...s2]
}

const dist = (c1: City, c2: City) => {
    return (Math.abs(c1.x - c2.x) + Math.abs(c1.y - c2.y)) / 2
}

const fitnessN = (map: Map): number => map.length > 1
    ? dist(map[0], map[1]) + fitnessN(map.slice(1))
    : 0

const fitness = (map: Map) => map.length > 1
    ? fitnessN(map) + dist(map[map.length - 1], map[0])
    : 0

const populationN = (map: Map, n: number): Population => n > 0
    ? [shuffle(map), ...populationN(map, n - 1)]
    : []

const population = (map: Map, n: number) => populationN(map, n)
    .sort((a, b) => fitness(a) - fitness(b))

const next = (population: Population) => {
    const thx = Math.floor(population.length / 2) + 2;
    const top = population.slice(0, thx)
    const [fst, snd, ...tail] = top
    const co1 = tail.map(map => crossover(fst, mutation(map)))
    const co2 = tail.map(map => crossover(snd, mutation(map)))
    return [...co1, ...co2].sort((a, b) => fitness(a) - fitness(b));
}

export default { map, population, next, fitness }
