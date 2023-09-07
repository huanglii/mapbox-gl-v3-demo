import { create } from 'zustand'
import NaiveMap, { GroupLayer } from '@naivemap/mapbox-gl-naive-map'

interface ClearOptions {
  groupLayerIds?: string[]
  layerIds?: string[]
  sourceIds?: string[]
}

interface MapState {
  map?: NaiveMap
  setMap: (m: NaiveMap) => void
  removeMap: () => void
  addGroupLayer: (id: string, groupLayer: GroupLayer) => void
  removeGroupLayer: (id: string, deleteSource?: boolean) => void
  removeGroupLayers: (deleteSources?: boolean) => void
  getSource: (id: string) => mapboxgl.AnySourceImpl | undefined
  addSource: (id: string, source: mapboxgl.AnySourceData) => void
  removeSource: (id: string) => void
  getLayer: (id: string) => mapboxgl.AnyLayer | undefined
  addLayer: (layer: mapboxgl.AnyLayer, before?: string) => void
  removeLayer: (id: string) => void
  setBasemapStyle: (
    style: mapboxgl.Style | string,
    restoreGroupLayers?: boolean,
    styleOptions?: {
      diff?: boolean
      localIdeographFontFamily?: string
    }
  ) => void
  clear: (options: ClearOptions | string[]) => void
}

const useMapStore = create<MapState>()((set, get) => ({
  map: undefined,
  setMap: (m) => set({ map: m }),
  removeMap: () => {
    set({ map: undefined })
  },
  addGroupLayer(id, groupLayer) {
    const m = get().map
    if (m) {
      m.addGroupLayer(id, groupLayer)
    }
  },
  removeGroupLayer(id, deleteSource) {
    const m = get().map
    if (m) {
      m.removeGroupLayer(id, deleteSource)
    }
  },
  removeGroupLayers() {
    const m = get().map
    if (m) {
      m.removeGroupLayers()
    }
  },
  getSource(id) {
    const m = get().map
    if (m) {
      return m.getSource(id)
    }
  },
  addSource(id, source) {
    const m = get().map
    if (m) {
      m.addSource(id, source)
    }
  },
  removeSource(id) {
    const m = get().map
    if (m) {
      m.removeSource(id)
    }
  },
  getLayer(id) {
    const m = get().map
    if (m) {
      return m.getLayer(id)
    }
  },
  addLayer(layer, before) {
    const m = get().map
    if (m) {
      m.addLayer(layer, before)
    }
  },
  removeLayer(id) {
    const m = get().map
    if (m) {
      m.removeLayer(id)
    }
  },
  setBasemapStyle(style, restoreGroupLayers, styleOptions) {
    const m = get().map
    if (m) {
      m.setBasemapStyle(style, restoreGroupLayers, styleOptions)
    }
  },
  clear: (options) => {
    const m = get().map
    if (m && m.getStyle()) {
      if (Array.isArray(options)) {
        for (let i = 0, len = options.length; i < len; i++) {
          const id = options[i]
          m.removeGroupLayer(id)
          m.getLayer(id) && m.removeLayer(id)
          m.getSource(id) && m.removeSource(id)
        }
      } else {
        if (options.groupLayerIds) {
          for (let i = 0, len = options.groupLayerIds.length; i < len; i++) {
            m.removeGroupLayer(options.groupLayerIds[i])
          }
        }
        if (options.layerIds) {
          for (let i = 0, len = options.layerIds.length; i < len; i++) {
            m.removeLayer(options.layerIds[i])
          }
        }
        if (options.sourceIds) {
          for (let i = 0, len = options.sourceIds.length; i < len; i++) {
            m.removeSource(options.sourceIds[i])
          }
        }
      }
    }
  },
}))

export default useMapStore
