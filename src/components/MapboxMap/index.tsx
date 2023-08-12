import mapboxgl, { GeolocateControl, NavigationControl } from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import NaiveMap from '@naivemap/mapbox-gl-naive-map'
import React, { FC, useEffect, useRef, useState } from 'react'
import useMapStore from './useMapStore'

export type MapboxOptions = Omit<mapboxgl.MapboxOptions, 'container'>

export interface MapboxMapProps {
  /**
   * 样式类名
   */
  className?: string
  /**
   * MapboxOptions: (https://docs.mapbox.com/mapbox-gl-js/api/map/#map-parameters)
   * @default { center: [104.28817, 28.48424], zoom: 2 }
   */
  mapboxOptions?: MapboxOptions
  /**
   * 雪碧图图标，样式之外另外添加的图标，key为图标id，value为图标地址。
   * 注意：已存在的图标不会覆盖，会跳过
   * @example { 'school': 'https://a.example.com/school.ong' }
   */
  sprites?: Record<string, string>
  /**
   * 地图加载完成事件
   */
  onMapLoaded?: (map: NaiveMap) => void
}

const MapboxMap: FC<MapboxMapProps> = (props) => {
  const { setMap, removeMap } = useMapStore()
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerId] = useState(Math.random().toString(16).substring(2))
  mapboxgl.accessToken = 'pk.eyJ1IjoiY3F5aiIsImEiOiJja3d2cXcydTYyMnY1Mm5vMmh6N3d2a2s2In0.A4I9DmsUsrdbZuMRr922MQ'
  const defaultOptions: mapboxgl.MapboxOptions = {
    style: './data/standard-beta.json',
    container: containerId,
    center: [0, 0],
    zoom: 1.8,
    locale: {
      'NavigationControl.ResetBearing': '指北',
      'NavigationControl.ZoomIn': '放大',
      'NavigationControl.ZoomOut': '缩小',
      'GeolocateControl.FindMyLocation': '定位',
      'GeolocateControl.LocationNotAvailable': '定位不可用',
    },
  }
  const options = Object.assign({}, defaultOptions, props.mapboxOptions)

  // Initialize map when component mounts
  useEffect(() => {
    const map = new NaiveMap(options)
    map.addControl(
      new NavigationControl({
        visualizePitch: true,
      })
    )
    map.addControl(
      new GeolocateControl({
        trackUserLocation: true,
        showUserHeading: true,
      })
    )

    map.on('load', () => {
      setMap(map)
      if (props.onMapLoaded) {
        props.onMapLoaded(map)
      }
      // 向雪碧图中添加图标
      if (props.sprites) {
        for (const imageId in props.sprites) {
          const imageUrl = props.sprites[imageId]

          map.loadImage(imageUrl, (error, image) => {
            if (error) throw error
            if (image && !map.hasImage(imageId)) map.addImage(imageId, image)
          })
        }
      }
    })

    map.on('remove', () => {
      removeMap()
    })

    // Clean up on unmount
    return () => map.remove()
  }, [])

  return (
    <div id={containerId} className={props.className} style={{ width: '100%', height: '100%' }} ref={containerRef} />
  )
}

export default MapboxMap
