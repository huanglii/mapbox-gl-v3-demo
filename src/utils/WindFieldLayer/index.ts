import mapboxgl from 'mapbox-gl'
import type { IField, IOptions } from './WindCore'
import { Field, WindCore, defaultOptions } from './WindCore'
import { formatData } from './WindCore/utils'

interface WindDataHeader {
  dx: number
  dy: number
  nx: number
  ny: number
  lo1: number
  lo2: number
  la1: number
  la2: number
  parameterCategory: 1
  parameterNumber: 2 | 3 // U or V
}

interface WindDataItem {
  data: number[]
  header: WindDataHeader
}

type WindData = [WindDataItem, WindDataItem]

const defaultVelocityScales: Record<number, number> = {
  0: 0.05,
  1: 0.05,
  2: 0.04,
  3: 0.03,
  4: 0.02,
  5: 0.01,
  6: 0.005,
  7: 0.003,
  8: 0.002,
  9: 0.001,
  10: 0.0005,
  11: 0.0003,
  12: 0.00015,
  13: 0.0001,
  14: 0.00005,
  15: 0.000025,
  16: 0.00001,
  17: 0.000005,
  18: 0.000002,
  19: 0.000001,
  20: 0.0000005,
  21: 0.0000002,
  22: 0.0000001,
}

const defaultPaths: Record<number, number> = {
  0: 2000,
  1: 1800,
  2: 1600,
  3: 1400,
  4: 1200,
  5: 800,
  6: 600,
  7: 400,
  8: 200,
  9: 180,
  10: 170,
  11: 160,
  12: 150,
  13: 140,
  14: 130,
  15: 120,
  16: 110,
  17: 100,
  18: 90,
  19: 80,
  20: 70,
  21: 60,
  22: 50,
}

export interface WindFieldLayerOptions {
  windOptions?: Partial<IOptions>
  fieldOptions?: Pick<IField, 'wrapX'>
}

function linearZoomValue(zoom: number, config: Record<number, number>): number {
  const z = Math.floor(zoom)

  if (config[zoom]) {
    // 整数直接返回
    return config[zoom]
  } else if (z > 22) {
    // 大于 22，返回最后一个
    return config[22]
  } else {
    const v = zoom % 1 // 小数部分
    const min = config[z]
    const max = config[z + 1]
    // 线性插值
    const val = min + (max - min) * v

    return val
  }
}

export default class WindFieldLayer implements mapboxgl.CustomLayerInterface {
  id: string
  type: 'custom'
  renderingMode: '2d' | '3d'
  private map: mapboxgl.Map | null
  private windOptions: IOptions
  private canvas: HTMLCanvasElement | null
  private devicePixelRatio: number
  private wind: WindCore | null
  private field: Field | undefined

  constructor(id: string, data: WindData, options?: WindFieldLayerOptions) {
    this.id = id
    this.type = 'custom'
    this.renderingMode = '2d'
    this.map = null
    // velocityScale & paths: 999999 覆盖默认的 1 / 25，便于初始化时根据地图 zoom 调整，也可以指定
    this.windOptions = Object.assign(
      {},
      defaultOptions,
      // { velocityScale: 999999, paths: 999999 },
      options?.windOptions
    )
    this.canvas = null

    this.devicePixelRatio = window.devicePixelRatio
    this.wind = null
    this.field = formatData(data, options?.fieldOptions)

    this.handleResize = this.handleResize.bind(this)
    this.handleZoomEnd = this.handleZoomEnd.bind(this)
  }

  onAdd(map: mapboxgl.Map) {
    this.map = map
    this.canvas = this.initializeCanvas()

    if (this.windOptions.velocityScale === 999999) {
      this.windOptions.velocityScale = () => {
        const zoom = map.getZoom()
        return linearZoomValue(zoom, defaultVelocityScales)
      }
    }
    if (this.windOptions.paths === 999999) {
      this.windOptions.paths = () => {
        const zoom = map.getZoom()
        return linearZoomValue(zoom, defaultPaths)
      }
    }

    this.map.on('zoomend', this.handleZoomEnd)
    this.map.on('resize', this.handleResize)
    this.render()
  }

  onRemove() {
    if (this.wind) {
      this.wind.stop()
    }
    if (this.canvas) {
      if (this.canvas && this.canvas.parentNode) {
        this.canvas.parentNode.removeChild(this.canvas)
      }
      this.canvas = null
    }

    this.map?.off('zoomend', this.handleZoomEnd)
    this.map?.off('resize', this.handleResize)
  }

  private handleZoomEnd() {
    this.wind?.prerender()
  }

  private handleResize() {
    if (this.map && this.canvas) {
      const mapboxCanvas = this.map.getCanvas()
      const { width, height } = this.map.transform
      const pixel = this.devicePixelRatio

      this.canvas.width = width * pixel
      this.canvas.height = height * pixel
      this.canvas.style.width = mapboxCanvas.style.width
      this.canvas.style.height = mapboxCanvas.style.height
    }
    this.render()
  }

  stop() {
    if (this.wind) {
      this.wind.clearCanvas()
    }
  }

  render() {
    if (!this.map || !this.canvas) return

    if (!this.wind) {
      const ctx = this.canvas.getContext('2d')

      if (!ctx) {
        throw new Error('create canvas context failed')
      }
      this.wind = new WindCore(ctx, this.windOptions, this.field)

      this.wind.project = this.project.bind(this) as any
      this.wind.unproject = this.unproject.bind(this) as any
      this.wind.intersectsCoordinate = this.intersectsCoordinate.bind(this)
      this.wind.postrender = () => {
        // this.setCanvasUpdated();
      }
      this.wind.prerender()
      this.wind.render()
    }
  }

  private initializeCanvas() {
    if (!this.map) return null

    const canvasContainer = this.map.getCanvasContainer()
    const mapboxCanvas = this.map.getCanvas()
    const canvasOverlay = document.createElement('canvas')

    const { width, height } = this.map.transform
    const pixel = this.devicePixelRatio

    canvasOverlay.width = width * pixel
    canvasOverlay.height = height * pixel
    canvasOverlay.style.position = 'absolute'
    canvasOverlay.className = 'maplibre-overlay-canvas'
    canvasOverlay.style.width = mapboxCanvas.style.width
    canvasOverlay.style.height = mapboxCanvas.style.height
    canvasContainer.appendChild(canvasOverlay)

    return canvasOverlay
  }

  private project(coordinates: [number, number]) {
    if (this.map !== undefined) {
      const lnglat = this.map!.project(new mapboxgl.LngLat(coordinates[0], coordinates[1]))
      const x = lnglat.x
      const y = lnglat.y

      return [x * this.devicePixelRatio, y * this.devicePixelRatio]
    }
    return coordinates
  }

  private unproject(pixel: [number, number]) {
    if (this.map) {
      const lnglat: mapboxgl.LngLat = this.map.unproject(new mapboxgl.Point(pixel[0], pixel[1]))

      return [lnglat.lng, lnglat.lat]
    }
    return pixel
  }

  private intersectsCoordinate(coordinate: [number, number]) {
    if (this.map) {
      const bounds = this.map!.getBounds()
      // @ts-ignore
      const latRange: [number, number] = this.map.transform.latRange

      if (latRange) {
        if (coordinate[1] > latRange[1] || coordinate[1] < latRange[0]) return false
      }
      return bounds!.contains(new mapboxgl.LngLat(coordinate[0], coordinate[1]))
    }
    return false
  }
}
