import React, { useState } from 'react';

import genetic, { Map, Population } from 'genetic'
import { MapSvg } from 'components/MapSvg';

const init = { w: 500, h: 500, x: 40, n: 100, i: 10 }

export const App: React.FC = () => {
    const [x, setX] = useState<number>(init.x)
    const [n, setN] = useState<number>(init.n)
    const [i, setI] = useState<number>(init.i)
    const [map, setMap] = useState<Map>(genetic.map(init.w, init.h, init.x))
    const [population, setPopulation] = useState<Population>(genetic.population(map, init.n))
    const [processing, setProcessing] = useState<boolean>(false)

    const mapIsValid = true
        && init.w >= 100 && init.w <= 1000
        && init.h >= 100 && init.h <= 1000
        && x >= 10 && x <= 100
        && n >= 10 && n <= 100

    const generationIsValid = i >= 1 && i <= 1000

    const newMap = () => {
        if (!mapIsValid) return
        const map = genetic.map(init.w, init.h, x);
        const population = genetic.population(map, n);
        setMap(map)
        setPopulation(population)
    }

    const newGeneration = async () => {
        if (!generationIsValid) return;

        setProcessing(true)

        const newGeneration = await new Promise<Population>(resolve => setTimeout(() => {
            let tmp = population
            for (let j = 0; j < i; j++) {
                tmp = genetic.next(tmp)
            }
            resolve(tmp)
        }, 0))

        setPopulation(newGeneration)
        setProcessing(false)
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-4">
                    <form onSubmit={e => e.preventDefault()}>
                        <fieldset>
                            <legend>Generation</legend>
                            <div className="form-group">
                                <label>Nb iterations</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="1000"
                                    value={i.toString()}
                                    disabled={processing}
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
                        <fieldset>
                            <legend>Instance</legend>
                            <div className="form-group">
                                <label>NB cities</label>
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
                                onClick={newMap}
                                disabled={processing || !mapIsValid}
                            >
                                New map
                            </button>
                        </fieldset>
                    </form>
                </div>
                <div className="col">
                    <div className="card">
                        <div className="card-header">
                            {processing
                                ? 'Processing...'
                                : `Distance: ${genetic.fitness(population[0]).toFixed(0)}`
                            }
                        </div>
                        <div className="card-body">
                            <MapSvg w={init.w} h={init.h} map={population[0]} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
