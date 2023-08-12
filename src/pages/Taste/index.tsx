import useMapStore from '@/components/MapboxMap/useMapStore'
import Widget from '@/layout/Widget'
import { Divider, Radio } from 'antd'
import { FC } from 'react'

const options = [
  {
    id: '1',
    title: '朝天门',
    camera: {
      center: [106.583, 29.5667],
      zoom: 15.78,
      bearing: -41.38,
      pitch: 45.12,
    },
  },
  {
    id: '2',
    title: '东方明珠',
    camera: {
      center: [121.4968, 31.2402],
      zoom: 16.06,
      bearing: 137.6,
      pitch: 63.5,
    },
  },
  {
    id: '3',
    title: 'Statue of Liberty',
    camera: {
      center: [-74.04546645789205, 40.68964503655931],
      zoom: 17,
      bearing: -60,
      pitch: 70,
    },
  },
  {
    id: '4',
    title: 'New York',
    camera: {
      center: [-74.00825, 40.70836],
      zoom: 14.6523,
      bearing: 63,
      pitch: 62,
    },
  },
]

const Slot: FC = () => {
  const { map } = useMapStore()

  return (
    <Widget>
      <Radio.Group
        onChange={(e) => {
          const value = e.target.value
          // @ts-ignore
          map?.setConfigProperty('basemap', 'lightPreset', value)
        }}
      >
        <Radio value="day">白天</Radio>
        <Radio value="night">晚上</Radio>
        <Radio value="dusk">黄昏</Radio>
        <Radio value="dawn">黎明</Radio>
      </Radio.Group>
      <Divider style={{ margin: '6px 0' }} />
      <Radio.Group
        onChange={(e) => {
          const item = e.target.value
          map?.flyTo(item.camera)
        }}
      >
        {options.map((item) => (
          <Radio key={item.id} value={item}>
            {item.title}
          </Radio>
        ))}
      </Radio.Group>
    </Widget>
  )
}

export default Slot
