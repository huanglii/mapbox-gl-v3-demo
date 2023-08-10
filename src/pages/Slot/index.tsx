import useMapStore from '@/components/MapboxMap/useMapStore'
import Widget from '@/layout/Widget'
import { Button, Form, Radio } from 'antd'
import { FC, useEffect } from 'react'

const layerId = 'maine'

const Slot: FC = () => {
  const { map } = useMapStore()

  useEffect(() => {
    if (map) {
      map.flyTo({
        center: [-68.137343, 45.137451], // starting position
        zoom: 5.5, // starting zoom
      })
    }
    return () => {
      if (map) {
        map.getLayer(layerId) && map.removeLayer(layerId)
        map.getSource(layerId) && map.removeSource(layerId)
        map.flyTo({
          center: [0, 0],
          zoom: 1.8,
        })
      }
    }
  }, [map])

  const onAddLayer = (slot: string) => {
    if (map) {
      map.getLayer(layerId) && map.removeLayer(layerId)
      map.getSource(layerId) && map.removeSource(layerId)

      map.addLayer({
        id: 'maine',
        // @ts-ignore
        slot: slot,
        source: {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [-67.13734, 45.13745],
                  [-66.96466, 44.8097],
                  [-68.03252, 44.3252],
                  [-69.06, 43.98],
                  [-70.11617, 43.68405],
                  [-70.64573, 43.09008],
                  [-70.75102, 43.08003],
                  [-70.79761, 43.21973],
                  [-70.98176, 43.36789],
                  [-70.94416, 43.46633],
                  [-71.08482, 45.30524],
                  [-70.66002, 45.46022],
                  [-70.30495, 45.91479],
                  [-70.00014, 46.69317],
                  [-69.23708, 47.44777],
                  [-68.90478, 47.18479],
                  [-68.2343, 47.35462],
                  [-67.79035, 47.06624],
                  [-67.79141, 45.70258],
                  [-67.13734, 45.13745],
                ],
              ],
            },
          },
        },
        type: 'fill',
        paint: {
          'fill-color': '#0080ff', // blue color fill
          'fill-opacity': 0.5,
        },
      })
    }
  }

  return (
    <Widget>
      <Form>
        <Form.Item label="添加图层">
          <Radio.Group
            onChange={(e) => {
              onAddLayer(e.target.value)
            }}
          >
            <Radio value="bottom">面上方(bottom)</Radio>
            <Radio value="middle">线上方(middle)</Radio>
            <Radio value="none">最上方(none)</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Widget>
  )
}

export default Slot
