import useMapStore from '@/components/MapboxMap/useMapStore'
import Widget from '@/layout/Widget'
import WindFieldLayer from '@/utils/WindFieldLayer'
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
        center: [106.579747, 29.56365],
        zoom: 15.4,
        bearing: -119.4,
        pitch: 67,
      })
      map.on('click', (e) => {
        console.log(map.getBounds()?.toArray())
      })
      onAddLayer()
    }
    return () => {
      removeGroupLayers()
    }
  }, [map])

  const onValuesChange = (changedValues: any) => {
    const key = Object.keys(changedValues)[0]
    map?.setConfigProperty('basemap', key, changedValues[key])
  }

  const onAddLayer = () => {
    removeGroupLayers()
    addGroupLayer(id, {
      sources: {
        [id]: {
          type: 'vector',
          tiles: [
            'https://fw.cqzhitian.cn/geoserver/gwc/service/wmts/rest/other:building_footprint_cq/EPSG:900913/EPSG:900913:{z}/{y}/{x}?format=application/vnd.mapbox-vector-tile',
          ],
          bounds: [106.209511, 29.212572, 106.821617, 29.83123],
        },
      },
      layers: [
        {
          id: id,
          type: 'fill-extrusion',
          metadata: { 'mapbox:group': '3d buildings' },
          source: id,
          'source-layer': 'building_footprint_cq',
          minzoom: 14,
          layout: { 'fill-extrusion-edge-radius': 1, visibility: 'visible' },
          paint: {
            'fill-extrusion-ambient-occlusion-intensity': 0.15,
            'fill-extrusion-color': 'hsl(23, 100%, 97%)',
            // 'fill-extrusion-color': [
            //   'interpolate',
            //   ['linear'],
            //   ['*', ['get', 'floor'], 3.3],
            //   0,
            //   'hsl(40, 43%, 93%)',
            //   200,
            //   'hsl(23, 100%, 97%)',
            // ],
            'fill-extrusion-ambient-occlusion-ground-radius': ['step', ['zoom'], 0, 17, 5],
            'fill-extrusion-height': ['*', ['get', 'floor'], 3.3],
            'fill-extrusion-opacity': ['interpolate', ['linear'], ['zoom'], 15, 0, 15.3, 1],
            'fill-extrusion-flood-light-intensity': [
              'interpolate',
              ['linear'],
              ['measure-light', 'brightness'],
              0.015,
              0.3,
              0.026,
              0,
            ],
            'fill-extrusion-vertical-scale': ['interpolate', ['linear'], ['zoom'], 15, 0, 15.3, 1],
            'fill-extrusion-flood-light-wall-radius': [
              'case',
              ['>', ['number', ['*', ['get', 'floor'], 3.3]], 200],
              ['/', ['number', ['*', ['get', 'floor'], 3.3]], 3],
              0,
            ],
            'fill-extrusion-flood-light-ground-radius': [
              'step',
              ['number', ['*', ['get', 'floor'], 3.3]],
              0,
              30,
              ['random', 30, 100, ['id']],
            ],
            'fill-extrusion-flood-light-color': 'hsl(30, 79%, 81%)',
          },
        },
      ],
    })

    if (map) {
      map.getLayer('wind-layer') && map.removeLayer('wind-layer')
      fetch('/data/wind.json')
        .then((res) => res.json())
        .then((data) => {
          const layer = new WindFieldLayer('wind-layer', data, {
            fieldOptions: {
              wrapX: true,
            },
          })

          map.addLayer(layer)
        })
    }
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
      {/* <Divider style={{ margin: '6px 0' }} />
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
      </Form> */}
    </Widget>
  )
}

export default StandardStyle
