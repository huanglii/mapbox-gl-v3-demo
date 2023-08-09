import useMapStore from '@/components/MapboxMap/useMapStore'
import { Cascader } from 'antd'
import { FC } from 'react'

interface Option {
  value: string | number | boolean
  label: string
  children?: Option[]
}

const options: Option[] = [
  {
    value: 'showPlaceLabels',
    label: '注记',
    children: [
      {
        value: true,
        label: '开启',
      },
      {
        value: false,
        label: '关闭',
      },
    ],
  },
  {
    value: 'showRoadLabels',
    label: '道路',
    children: [
      {
        value: true,
        label: '开启',
      },
      {
        value: false,
        label: '关闭',
      },
    ],
  },
  {
    value: 'lightPreset',
    label: '灯光',
    children: [
      {
        value: 'dusk',
        label: 'dusk',
      },
      {
        value: 'dawn',
        label: 'dawn',
      },
      {
        value: 'day',
        label: 'day',
      },
      {
        value: 'night',
        label: 'night',
      },
    ],
  },
]

const Home: FC = () => {
  const { map } = useMapStore()

  const onChange = (value: string[]) => {
    console.log(value)
    map?.setConfigProperty('basemap', value[0], value[1])
  }

  return (
    <div className="widget">
      <Cascader options={options} onChange={onChange} placeholder="Please select" />
    </div>
  )
}

export default Home
