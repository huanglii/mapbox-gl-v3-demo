import useMapStore from '@/components/MapboxMap/useMapStore'
import Widget from '@/layout/Widget'
import WindFieldLayer from '@/utils/WindFieldLayer'
import { Button, Checkbox, CheckboxProps, Divider, Form, Radio, Select, Space } from 'antd'
import { FC, useEffect } from 'react'

const initialValues = {
  showPlaceLabels: true,
  showRoadLabels: false,
  showPointOfInterestLabels: false,
  showTransitLabels: false,
  lightPreset: 'night',
}

const LowAltitude: FC = () => {
  const { map, addGroupLayer, removeGroupLayer, removeGroupLayers } = useMapStore()

  useEffect(() => {
    if (map) {
      map.setConfigProperty('basemap', 'lightPreset', 'night')
      map.setConfigProperty('basemap', 'showRoadLabels', false)
      map.setConfigProperty('basemap', 'showPointOfInterestLabels', false)
      map.setConfigProperty('basemap', 'showTransitLabels', false)
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
    const id = 'building'
    removeGroupLayer(id)
    addGroupLayer(id, {
      sources: {
        building: {
          type: 'vector',
          tiles: [
            'https://fw.cqzhitian.cn/geoserver/gwc/service/wmts/rest/other:building_footprint_cq/EPSG:900913/EPSG:900913:{z}/{y}/{x}?format=application/vnd.mapbox-vector-tile',
          ],
          bounds: [106.209511, 29.212572, 106.821617, 29.83123],
        },
        point: {
          type: 'vector',
          url: 'mapbox://huanglii.6otli0cq',
        },
        line: {
          type: 'vector',
          url: 'mapbox://huanglii.1rmek3pl',
        },
        grid: {
          type: 'vector',
          url: 'mapbox://huanglii.30eo9eac',
        },
      },
      layers: [
        {
          id: 'building',
          type: 'fill-extrusion',
          metadata: { 'mapbox:group': '3d buildings' },
          source: 'building',
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
            'fill-extrusion-opacity': ['interpolate', ['linear'], ['zoom'], 14, 0, 15.3, 1],
            'fill-extrusion-flood-light-intensity': [
              'interpolate',
              ['linear'],
              ['measure-light', 'brightness'],
              0.015,
              0.3,
              0.026,
              0,
            ],
            'fill-extrusion-vertical-scale': ['interpolate', ['linear'], ['zoom'], 14, 0, 15.3, 1],
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
        {
          id: 'grid',
          type: 'fill',
          source: 'grid',
          'source-layer': 'la_grid-49kui3',
          layout: {
            visibility: 'none',
          },
          paint: {
            // 'fill-z-offset': 500,
            'fill-emissive-strength': 1,
            'fill-color': 'rgba(100, 100, 100, 0.25)',
            'fill-outline-color': 'rgba(255, 255, 255, 0.25)',
          },
        },
        {
          id: 'line',
          type: 'line',
          source: 'line',
          'source-layer': 'la_line-56zykj',
          filter: ['==', ['get', 'fid'], 1],
          layout: {
            'line-cap': 'round',
            'line-join': 'round',
            visibility: 'none',
          },
          paint: {
            'line-emissive-strength': 1,
            'line-width': 10,
            'line-color': '#1890ff',
            'line-opacity': 0.65,
          },
        },
        {
          id: 'line-arrow',
          type: 'symbol',
          source: 'line',
          'source-layer': 'la_line-56zykj',
          filter: ['==', ['get', 'fid'], 1],
          layout: {
            'symbol-placement': 'line',
            'symbol-spacing': 3,
            'icon-image': 'arrow',
            'icon-size': 0.4,
            visibility: 'none',
          },
          paint: {
            'icon-color': '#fff',
            'icon-opacity': 0.5,
          },
        },
        {
          id: 'point',
          type: 'symbol',
          source: 'point',
          'source-layer': 'la_point-78w37p',
          layout: {
            'icon-image': 'marker',
            'icon-size': 0.2,
            'icon-anchor': 'bottom',
            'icon-offset': [0, 24],
            'icon-allow-overlap': true,
            'icon-ignore-placement': true,
            visibility: 'none',
          },
          paint: {
            'icon-color': '#1890ff',
          },
        },
      ],
    })
  }

  const fitBounds = () => {
    map?.fitBounds([106.54911, 29.54589, 106.59044, 29.58105], {
      padding: 50,
      duration: 2000,
    })
  }

  const onCheckWindLayer: CheckboxProps['onChange'] = (e) => {
    if (map?.getLayer('wind-layer')) {
      map.removeLayer('wind-layer')
    } else {
      fetch('/data/wind.json')
        .then((res) => res.json())
        .then((data) => {
          const layer = new WindFieldLayer('wind-layer', data, {
            fieldOptions: {
              wrapX: true,
            },
          })

          map?.addLayer(layer)
        })
    }
  }

  const onAddAreaLayer = () => {
    if (!map) return
    fitBounds()
    map.setLayoutProperty('grid', 'visibility', 'visible')
    map.setPaintProperty('grid', 'fill-color', 'rgba(100, 100, 100, 0.25)')
    map.setLayoutProperty('line', 'visibility', 'none')
    map.setLayoutProperty('line-arrow', 'visibility', 'none')
    map.setLayoutProperty('point', 'visibility', 'none')
  }

  const onAddRouteLayer = () => {
    if (!map) return
    fitBounds()
    map.fitBounds([106.54911, 29.54589, 106.59044, 29.58105], {
      padding: 50,
    })
    map.setFilter('line', ['==', ['get', 'fid'], 1])
    map.setFilter('line-arrow', ['==', ['get', 'fid'], 1])
    map.setLayoutProperty('line', 'visibility', 'visible')
    map.setLayoutProperty('line-arrow', 'visibility', 'visible')
    map.setLayoutProperty('point', 'visibility', 'visible')
    map.setLayoutProperty('grid', 'visibility', 'visible')
    map.setPaintProperty('grid', 'fill-color', [
      'case',
      ['==', ['get', 'route'], true],
      'rgba(46, 173, 131, 0.6)',
      'rgba(100, 102, 115, 0.5)',
    ])
  }

  const onAddRiskLayer = () => {
    if (!map) return
    fitBounds()
    map.setLayoutProperty('grid', 'visibility', 'visible')
    map.setLayoutProperty('line', 'visibility', 'visible')
    map.setLayoutProperty('line-arrow', 'visibility', 'visible')
    map.setLayoutProperty('point', 'visibility', 'visible')
    map.setFilter('line', ['==', ['get', 'fid'], 2])
    map.setFilter('line-arrow', ['==', ['get', 'fid'], 2])
    map.setPaintProperty('grid', 'fill-color', [
      'match',
      ['get', 'risk'],
      0,
      'rgba(17, 172, 125, 0.5)',
      [1],
      'rgba(247, 196, 94, 0.5)',
      [2],
      'rgba(250, 10, 10, 0.5)',
      'rgba(100, 102, 115, 0.5)',
    ])
  }

  const onReset = () => {
    if (map) {
      map.flyTo({
        center: [106.579747, 29.56365],
        zoom: 15.4,
        bearing: -119.4,
        pitch: 67,
      })
      map.setLayoutProperty('grid', 'visibility', 'none')
      map.setLayoutProperty('line', 'visibility', 'none')
      map.setLayoutProperty('line-arrow', 'visibility', 'none')
      map.setLayoutProperty('point', 'visibility', 'none')
    }
  }

  const onAddTestLayer = () => {
    const id = 'test'
    removeGroupLayer(id)

    addGroupLayer(id, {
      sources: {
        test: {
          type: 'vector',
          url: 'mapbox://huanglii.30eo9eac',
        },
      },
      layers: [
        {
          id: 'test',
          type: 'fill-extrusion',
          source: 'test',
          'source-layer': 'la_grid-49kui3',
          layout: {
            'fill-extrusion-edge-radius': 1,
          },
          paint: {
            'fill-extrusion-emissive-strength': 1,
            'fill-extrusion-opacity': 0.5,
            'fill-extrusion-color': [
              'match',
              ['get', 'risk'],
              0,
              'rgba(17, 172, 125, 0.72)',
              [1],
              'rgba(247, 196, 94, 0.49)',
              [2],
              'rgba(250, 10, 10, 0.49)',
              'rgba(100, 102, 115, 0.49)',
            ],
            'fill-extrusion-height': 500,
            'fill-extrusion-base': 400,
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
        <Form.Item label="气象要素">
          <Space>
            <Checkbox onChange={onCheckWindLayer}>风场</Checkbox>
          </Space>
        </Form.Item>
      </Form>
      <Form labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
        <Form.Item label="路径规划">
          <Space size={5}>
            <Button type="primary" size="small" onClick={onAddAreaLayer}>
              飞行区域
            </Button>
            <Button type="primary" size="small" onClick={onAddRouteLayer}>
              路径规划
            </Button>
            <Button type="primary" size="small" onClick={onAddRiskLayer}>
              天气风险
            </Button>
            <Button size="small" onClick={onReset}>
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Widget>
  )
}

export default LowAltitude
