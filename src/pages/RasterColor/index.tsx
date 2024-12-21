import useMapStore from '@/components/MapboxMap/useMapStore'
import { FC, useEffect } from 'react'

const Slot: FC = () => {
  const { map, addGroupLayer, removeGroupLayers } = useMapStore()

  useEffect(() => {
    const colorScale: [number, string][] = [
      // [0.004, 'rgb(48, 167, 228)'],
      // [0.005, 'rgb(57, 143, 83)'],
      // [0.031, 'rgb(116, 166, 129)'],
      // [0.055, 'rgb(178, 205, 174)'],
      // [0.076, 'rgb(188, 195, 169)'],
      // [0.108, 'rgb(221, 207, 153)'],
      // [0.153, 'rgb(211, 174, 114)'],
      // [0.205, 'rgb(207, 155, 103)'],
      // [0.277, 'rgb(179, 120, 85)'],
      // [0.375, 'rgb(227, 210, 197)'],
      // [0.66, 'rgb(255, 255, 255)'],
      [0, '#f00'],
      [1, '#0f0'],
    ]
    const range = [0.5, 1]
    console.log(...colorScale.map(([pos, col]) => [range[0] + (range[1] - range[0]) * pos, col]))

    addGroupLayer('raster-terrain', {
      sources: {
        'raster-terrain': {
          type: 'raster',
          // tiles: [`https://api.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}.pngraw`],
          tiles: [
            'http://localhost:8600/geoserver/gwc/service/wmts/rest/test:dem/EPSG:900913/EPSG:900913:{z}/{y}/{x}?format=image/png',
          ],
          maxzoom: 14,
          tileSize: 256,
        },
      },
      layers: [
        {
          id: 'raster-terrain',
          type: 'raster',
          // @ts-ignore
          slot: 'bottom',
          source: 'raster-terrain',
          paint: {
            'raster-opacity': 1,
            // @ts-ignore
            // 'raster-color': 'red',
            'raster-color-range': range,
            // 'raster-color-mix': [0.8, 0.1, 0.1, 0],
            // 'raster-color-mix': [256 * 256 * 256 * 0.1, 256 * 256 * 0.1, 256 * 0.1, -10000],
            // 'raster-color-range': [0, 8848],
            'raster-color': [
              'interpolate',
              ['linear'],
              ['raster-value'],
              ...colorScale.map(([pos, col]) => [range[0] + (range[1] - range[0]) * pos, col]).flat(),
            ],
          },
        },
      ],
    })

    return () => {
      removeGroupLayers()
    }
  }, [map])

  return <></>
}

export default Slot
