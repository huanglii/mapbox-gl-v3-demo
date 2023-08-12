import useMapStore from '@/components/MapboxMap/useMapStore'
import Widget from '@/layout/Widget'
import { FC, useEffect } from 'react'

const layerId = 'maine'

const Slot: FC = () => {
  const { map } = useMapStore()

  useEffect(() => {
    if (map) {
      map.flyTo({
        center: [107.744809, 30.180706],
        zoom: 6,
      })
      map.addSource('dem', {
        type: 'raster',
        tiles: [
          // 或 geoserver rest 服务
          'http://localhost:8600/geoserver/gwc/service/wmts/rest/test:dem/EPSG:900913/EPSG:900913:{z}/{y}/{x}?format=image/png',
        ],
      })
      map.addLayer({
        id: 'dem',
        type: 'raster',
        source: 'dem',
        paint: {
          // @ts-ignore
          'raster-color-mix': [1/3, 1/3, 1/3, 0],
          'raster-color-range': [0, 1],
          'raster-color': [
            'interpolate',
            ['linear'],
            ['raster-value'],
            0,
            'rgb(255, 0, 0)',
            0.5,
            'rgb(0, 255, 0)',
            1,
            'rgb(0, 0, 255)',
          ],
        },
      })
    }
    return () => {
      if (map) {
      }
    }
  }, [map])

  return <Widget>123</Widget>
}

export default Slot
