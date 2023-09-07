import useMapStore from '@/components/MapboxMap/useMapStore'
import Widget from '@/layout/Widget'
import { Divider, Form, Radio, Select } from 'antd'
import { FC, useEffect } from 'react'

const initialValues = {
  showPlaceLabels: true,
  showRoadLabels: true,
  showPointOfInterestLabels: true,
  showTransitLabels: true,
  lightPreset: 'day',
}

const id = 'maine'

const StandardStyle: FC = () => {
  const { map, addGroupLayer, removeGroupLayers } = useMapStore()

  useEffect(() => {
    if (map) {
      map.flyTo({
        center: [-68.137343, 45.137451],
        zoom: 6.5,
      })
    }
    return () => {
      removeGroupLayers()
    }
  }, [map])

  const onValuesChange = (changedValues: any) => {
    const key = Object.keys(changedValues)[0]
    // @ts-ignore
    map?.setConfigProperty('basemap', key, changedValues[key])
  }

  const onAddLayer = (slot: string) => {
    removeGroupLayers()
    addGroupLayer(id, {
      sources: {
        [id]: {
          type: 'geojson',
          data: './data/maine.geojson',
        },
      },
      layers: [
        {
          id: id,
          // @ts-ignore
          slot: slot,
          source: id,
          type: 'fill',
          paint: {
            'fill-color': '#0080ff', // blue color fill
            'fill-opacity': 0.5,
          },
        },
      ],
    })
  }

  return (
    <Widget className="w-[380px]">
      <Form
        initialValues={initialValues}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 19 }}
        onValuesChange={onValuesChange}
      >
        <Form.Item label="地名注记" name="showPlaceLabels">
          <Radio.Group>
            <Radio value={true}>开启</Radio>
            <Radio value={false}>关闭</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="道路注记" name="showRoadLabels">
          <Radio.Group>
            <Radio value={true}>开启</Radio>
            <Radio value={false}>关闭</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="POI 注记" name="showPointOfInterestLabels">
          <Radio.Group>
            <Radio value={true}>开启</Radio>
            <Radio value={false}>关闭</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="交通注记" name="showTransitLabels">
          <Radio.Group>
            <Radio value={true}>开启</Radio>
            <Radio value={false}>关闭</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="预设灯光" name="lightPreset">
          <Radio.Group>
            <Radio value="day">白天</Radio>
            <Radio value="night">晚上</Radio>
            <Radio value="dusk">黄昏</Radio>
            <Radio value="dawn">黎明</Radio>
          </Radio.Group>
        </Form.Item>
        {/* <Form.Item label="字体" name="font">
          <Select mode="multiple">
            <Select.Option value="League Mono">League Mono</Select.Option>
            <Select.Option value="Source Code Pro">Source Code Pro</Select.Option>
          </Select>
        </Form.Item> */}
      </Form>
      <Divider style={{ margin: '6px 0' }} />
      <Form labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
        <Form.Item label="图层插槽">
          <Radio.Group
            onChange={(e) => {
              onAddLayer(e.target.value)
            }}
          >
            <Radio value="bottom">面上方</Radio>
            <Radio value="middle">线上方</Radio>
            <Radio value="none">最上方</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Widget>
  )
}

export default StandardStyle
