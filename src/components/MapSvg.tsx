import React from 'react'

import { Map } from 'genetic'

type Props = {
    w: number
    h: number
    map: Map
}

export const MapSvg: React.FC<Props> = ({ w, h, map }) => {
    return (
        <svg viewBox={`0 0 ${w} ${h}`}>
            {
                map.map((_, i) => {
                    return i === map.length - 1
                        ? (
                            <line
                                key={map.length}
                                x1={map[map.length - 1].x}
                                y1={map[map.length - 1].y}
                                x2={map[0].x}
                                y2={map[0].y}
                                style={{ 'stroke': 'rgb(220,220,220)' }}
                            />
                        ) : (
                            <line
                                key={i}
                                x1={map[i].x}
                                y1={map[i].y}
                                x2={map[i + 1].x}
                                y2={map[i + 1].y}
                                style={{ 'stroke': 'rgb(220,220,220)' }}
                            />
                        )
                })
            }
            {
                map.map((city, i) => (
                    <circle
                        key={i}
                        cx={city.x}
                        cy={city.y}
                        r="2"
                        style={{ 'fill': 'rgb(135,206,235)', 'stroke': 'rgb(220,220,220)' }}
                    />
                ))
            }
        </svg>
    )
}
