import React, { useState, useEffect } from 'react';

import genetic, { Map, Population } from 'genetic'
import { MapSvg } from 'components/MapSvg';

const init = { w: 500, h: 500, x: 40, n: 100, i: 10 }

const nextn = (population: Population, i: number): Promise<Population> => {
    return new Promise((resolve) => setTimeout(() => {
        let tmp = population
        for (let j = 0; j < i; j++) tmp = genetic.next(tmp)
        resolve(tmp)
    }, 100))
}

const App: React.FC = () => {
    const [w, setW] = useState<number>(init.w)
    const [h, setH] = useState<number>(init.h)
    const [x, setX] = useState<number>(init.x)
    const [n, setN] = useState<number>(init.n)
    const [i, setI] = useState<number>(init.i)
    const [map, setMap] = useState<Map>(genetic.map(init.w, init.h, init.x))
    const [population, setPopulation] = useState<Population>(genetic.population(map, init.n))
    const [processing, setProcessing] = useState<boolean>(false)

    const mapIsValid = true
        && w >= 100 && w <= 1000
        && h >= 100 && h <= 1000
        && x >= 10 && x <= 100

    const populationIsValid = mapIsValid && n >= 10 && n <= 100

    const generationIsValid = populationIsValid && i >= 1 && i <= 1000

    useEffect(() => {
        if (mapIsValid) setMap(genetic.map(w, h, x))
    }, [mapIsValid, w, h, x])

    useEffect(() => {
        if (populationIsValid) setPopulation(genetic.population(map, n))
    }, [populationIsValid, map, n])

    const newMap = () => {
        if (mapIsValid) setMap(genetic.map(h, w, x))
    }

    const newPopulation = () => {
        if (populationIsValid) setPopulation(genetic.population(map, n))
    }

    const newGeneration = () => {
        if (!generationIsValid) return;
        setProcessing(true)
        nextn(population, i).then(population => {
            setPopulation(population)
            setProcessing(false)
        })
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-4">
                    <form onSubmit={e => e.preventDefault()}>
                        <fieldset>
                            <legend>Map</legend>
                            <div className="form-group">
                                <label>Width:</label>
                                <input
                                    type="number"
                                    min="100"
                                    max="1000"
                                    value={w}
                                    disabled={processing}
                                    className="form-control"
                                    onChange={e => setW(parseInt(e.target.value))}
                                />
                            </div>
                            <div className="form-group">
                                <label>Height:</label>
                                <input
                                    type="number"
                                    min="100"
                                    max="1000"
                                    value={h.toString()}
                                    disabled={processing}
                                    className="form-control"
                                    onChange={(e) => setH(parseInt(e.target.value))}
                                />
                            </div>
                            <div className="form-group">
                                <label>NB cities:</label>
                                <input
                                    type="number"
                                    min="10"
                                    max="100"
                                    value={x.toString()}
                                    disabled={processing}
                                    className="form-control"
                                    onChange={(e) => setX(parseInt(e.target.value))}
                                />
                            </div>
                            <button
                                type="button"
                                className="btn btn-block btn-primary"
                                onClick={newMap}
                                disabled={processing || !mapIsValid}
                            >
                                New map
                            </button>
                        </fieldset>
                        <hr />
                        <fieldset>
                            <legend>Population</legend>
                            <div className="form-group">
                                <label>Nb individuals</label>
                                <input
                                    type="number"
                                    min="10"
                                    max="1000"
                                    step="2"
                                    value={n.toString()}
                                    disabled={processing}
                                    className="form-control"
                                    onChange={(e) => setN(parseInt(e.target.value))}
                                />
                            </div>
                            <button
                                type="button"
                                className="btn btn-block btn-primary"
                                onClick={newPopulation}
                                disabled={processing || !populationIsValid}
                            >
                                New population
                            </button>
                        </fieldset>
                        <hr />
                        <fieldset>
                            <legend>Generation</legend>
                            <div className="form-group">
                                <label>Nb iterations</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="1000"
                                    value={i.toString()}
                                    className="form-control"
                                    onChange={(e) => setI(parseInt(e.target.value))}
                                />
                            </div>
                            <button
                                type="button"
                                className="btn btn-block btn-primary"
                                onClick={newGeneration}
                                disabled={processing || !generationIsValid}
                            >
                                New generation
                            </button>
                        </fieldset>
                        <hr />
                        <p>
                            {processing
                                ? 'Processing...'
                                : `Distance: ${genetic.fitness(population[0]).toFixed(0)}`
                            }
                        </p>
                    </form>
                </div>
                <div className="col">
                    <MapSvg w={w} h={h} map={population[0]} />
                </div>
            </div>
        </div>
    );
}

export default App;
