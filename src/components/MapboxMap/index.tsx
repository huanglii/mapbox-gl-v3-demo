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
  mapboxgl.accessToken = 'pk.eyJ1IjoiaHVhbmdsaWkiLCJhIjoiY201MHQ3eXRuMWY3dDJrcXZsMTNoYXE2cCJ9.WBA9MWTHiAh2TTVnLjzboQ'
  const defaultOptions: mapboxgl.MapOptions = {
    style: './data/standard-beta.json',
    // style: 'mapbox://styles/huanglii/cm4xxuwxu007p01srd6bmbb80',
    container: containerId,
    center: [106.576247, 29.56087], // starting position [lng, lat]
    zoom: 9, // starting zoom
    attributionControl: false,
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
    // map.addControl(
    //   new NavigationControl({
    //     visualizePitch: true,
    //   })
    // )
    // map.addControl(
    //   new GeolocateControl({
    //     trackUserLocation: true,
    //     showUserHeading: true,
    //   })
    // )
    // map.addControl(
    //   new mapboxgl.AttributionControl({
    //     customAttribution: `v${mapboxgl.version}`,
    //   })
    // )

    map.loadImage('./i-marker.png', (error, image) => {
      if (error) throw error
      if (image && !map.hasImage('marker')) map.addImage('marker', image, { sdf: true })
    })
    map.loadImage('./i-arrow.png', (error, image) => {
      if (error) throw error
      if (image && !map.hasImage('arrow')) map.addImage('arrow', image, { sdf: true })
    })

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
