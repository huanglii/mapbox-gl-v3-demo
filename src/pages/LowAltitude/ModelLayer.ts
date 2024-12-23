import { ProjectionSpecification } from 'mapbox-gl'
import { Threebox } from 'threebox-plugin'

export type Coordinate = [number, number, number]

class ModelLayer implements mapboxgl.CustomLayerInterface {
  id: string
  type: 'custom' = 'custom'
  renderingMode?: '2d' | '3d' = '3d'
  private tb: any
  private model: any
  private coordinate: Coordinate
  constructor(id: string, coordinate: Coordinate) {
    this.id = id
    this.coordinate = coordinate
  }

  onAdd(map: mapboxgl.Map, gl: WebGL2RenderingContext) {
    const tb = new Threebox(map, gl, { defaultLights: true })

    const scale = 0.5
    const options = {
      obj: './models/camcopter_s_100_gltf/scene.gltf',
      type: 'gltf',
      // obj: './models/drone_fab_v1_fbx/drone_fab_fbx_v1.Fbx',
      // type: 'fbx',
      anchor: 'center',
      scale: { x: scale, y: scale, z: scale },
      units: 'meters',
      rotation: { x: 90, y: 0, z: 0 },
    }

    tb.loadObj(options, (model: any) => {
      model.setCoords(this.coordinate)
      // model.setAnchor('center')
      // model.translateX(0.4)
      // model.translateY(1.3)
      model.setRotation({ x: 0, y: 0, z: 121.32693805664039 })
      tb.add(model)
      this.model = model
    })
    this.tb = window.tb = tb
  }

  render(
    gl: WebGL2RenderingContext,
    matrix: Array<number>,
    projection?: ProjectionSpecification,
    projectionToMercatorMatrix?: Array<number>,
    projectionToMercatorTransition?: number,
    centerInMercator?: Array<number>,
    pixelsPerMeterRatio?: number
  ) {
    this.tb.update()
  }

  flyTo(coords: Coordinate, rotationZ?: number) {
    this.model.setCoords(coords)
    if (rotationZ) {
      this.model.setRotation({ x: 0, y: 0, z: rotationZ })
    }
    // this.tb.update()
  }
}

export default ModelLayer
