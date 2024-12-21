/* eslint-disable no-param-reassign */
import { floorMod, warnOnce } from './utils'
import Vector from './Vector'

export interface IField {
  /* 一般格点数据是按照矩形范围来切割，所以定义其经纬度范围 */

  /**
   * 经度最小值
   */
  xmin: number

  /**
   * 纬度最小值
   */
  ymin: number

  /**
   * 经度最大值
   */
  xmax: number

  /**
   * 纬度最大值
   */
  ymax: number

  /**
   * x（经度）增量
   */
  deltaX: number

  /**
   * y（纬度）增量 (默认我们采用的数据和格点原始数据方向保持一致，数据从左上到右下) 但是需要注意的是此时 deltaY为 -(ymax-ymin) / rows
   */
  deltaY: number

  /**
   * 列（可由 `(xmax - xmin) / deltaX` 得到）
   */
  cols: number

  /**
   * 行
   */
  rows: number

  /**
   * U分量
   */
  us: number[]

  /**
   * V分量
   */
  vs: number[]

  /**
   * 因为grib2json的问题，我们需要翻转 Y 轴数据
   */
  flipY?: boolean

  /**
   * 是否实现跨世界渲染
   */
  wrapX?: boolean

  /**
   * 当数据范围时按照 [0, 360] 时需要对x方向进行切割转换为 [-180, 180]，即将废弃
   */
  wrappedX?: boolean

  /**
   * 当数据范围时按照 [0, 360] 时需要对x方向进行切割转换为 [-180, 180]
   */
  translateX?: boolean
}

export interface IPosition {
  age?: number
  x?: number
  y?: number
  xt?: number
  yt?: number
  m?: number
}

export default class Field {
  private readonly xmin: number
  private readonly xmax: number
  private readonly ymin: number
  private readonly ymax: number
  private readonly cols: number
  private readonly rows: number
  private readonly us: number[]
  private readonly vs: number[]
  private readonly isContinuous: boolean
  private readonly deltaY: number
  private readonly deltaX: number
  private readonly translateX: undefined | boolean
  private readonly isFields: boolean
  private readonly flipY: boolean
  public grid: (Vector | null)[][]
  public range: (number | undefined)[] | undefined
  private wrapX: boolean

  constructor(params: IField) {
    this.grid = []

    this.xmin = params.xmin
    this.xmax = params.xmax

    this.ymin = params.ymin
    this.ymax = params.ymax

    this.cols = params.cols // 列数
    this.rows = params.rows // 行数

    this.us = params.us //
    this.vs = params.vs

    this.deltaX = params.deltaX // x 方向增量
    this.deltaY = params.deltaY // y方向增量
    this.flipY = Boolean(params.flipY)

    // 由于数据组织方式和deltaY的默认处理，那么在正常情况下我们需要交换 ymin 和 ymax 得到数据真实的 bbox（todo：我们需要按照真实数据来组织吗？）
    this.ymin = Math.min(params.ymax, params.ymin)
    this.ymax = Math.max(params.ymax, params.ymin)

    // 当 deltaY < 0 时，但是数据组织是由左上到右下此时说明数据 Y 轴是反的
    if (!(this.deltaY < 0 && this.ymin < this.ymax)) {
      if (params.flipY === undefined) {
        this.flipY = true
      }
      console.warn('[wind-core]: The data is flipY')
    }

    /**
     *
     */
    this.isFields = true

    const cols = Math.ceil((this.xmax - this.xmin) / params.deltaX) // 列
    const rows = Math.ceil((this.ymax - this.ymin) / params.deltaY) // 行

    if (cols !== this.cols || rows !== this.rows) {
      console.warn('[wind-core]: The data grid not equal')
    }

    // 部分数据可能并不是连续的，其经度范围可能是 -180 - 179.5（比如 GFS 0.5 分辨率的）我们需要补齐最后一位
    this.isContinuous = Math.floor(this.cols * params.deltaX) >= 360
    this.translateX = 'translateX' in params ? params.translateX : this.xmax > 180 // [0, 360] --> [-180, 180];
    if ('wrappedX' in params) {
      warnOnce('[wind-core]: ', '`wrappedX` namespace will deprecated please use `translateX` instead！')
    }

    this.wrapX = Boolean(params.wrapX)

    this.grid = this.buildGrid()
    this.range = this.calculateRange()
  }

  // from https://github.com/sakitam-fdd/wind-layer/blob/95368f9433/src/windy/windy.js#L110
  public buildGrid(): (Vector | null)[][] {
    const grid: any[] = []
    let p = 0

    const { rows, cols, us, vs } = this

    for (let j = 0; j < rows; j++) {
      const row: any[] = []
      for (let i = 0; i < cols; i++, p++) {
        const u = us[p]
        const v = vs[p]
        const valid = this.isValid(u) && this.isValid(v)
        row[i] = valid ? new Vector(u, v) : null
      }

      if (this.isContinuous) {
        row.push(row[0])
      }

      grid[j] = row
    }
    return grid
  }

  /**
   * release data
   */
  public release() {
    this.grid = []
  }

  /**
   * grib data extent
   * 格点数据范围
   */
  public extent() {
    return [this.xmin, this.ymin, this.xmax, this.ymax]
  }

  /**
   * Bilinear interpolation for Vector
   * 针对向量进行双线性插值
   * https://en.wikipedia.org/wiki/Bilinear_interpolation
   * @param   {Number} x
   * @param   {Number} y
   * @param   {Number[]} g00
   * @param   {Number[]} g10
   * @param   {Number[]} g01
   * @param   {Number[]} g11
   * @returns {Vector}
   */
  private bilinearInterpolateVector(
    x: number,
    y: number,
    g00: { u: number; v: number },
    g10: { u: number; v: number },
    g01: { u: number; v: number },
    g11: { u: number; v: number },
  ) {
    const rx = 1 - x
    const ry = 1 - y

    const a = rx * ry
    const b = x * ry
    const c = rx * y
    const d = x * y
    const u = g00.u * a + g10.u * b + g01.u * c + g11.u * d
    const v = g00.v * a + g10.v * b + g01.v * c + g11.v * d
    return new Vector(u, v)
  }

  /**
   * calculate vector value range
   */
  calculateRange() {
    if (!this.grid || !this.grid[0]) return
    const rows = this.grid.length as number
    const cols = this.grid[0].length as number

    // const vectors = [];
    let min
    let max
    // @from: https://stackoverflow.com/questions/13544476/how-to-find-max-and-min-in-array-using-minimum-comparisons
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const vec = this.grid[j][i]

        if (vec !== null) {
          const val = vec.m || vec.magnitude()
          // vectors.push();
          if (min === undefined) {
            min = val
          } else if (max === undefined) {
            max = val
            // update min max
            // 1. Pick 2 elements(a, b), compare them. (say a > b)
            min = Math.min(min, max)
            max = Math.max(min, max)
          } else {
            // 2. Update min by comparing (min, b)
            // 3. Update max by comparing (max, a)
            min = Math.min(val, min)
            max = Math.max(val, max)
          }
        }
      }
    }
    return [min, max]
  }

  /**
   * 检查 uv是否合法
   * @param x
   * @private
   */
  public isValid(x: any) {
    return x !== null && x !== undefined
  }

  private getWrappedLongitudes() {
    let xmin = this.xmin
    let xmax = this.xmax

    if (this.translateX) {
      if (this.isContinuous) {
        xmin = -180
        xmax = 180
      } else {
        // not sure about this (just one particular case, but others...?)
        xmax = this.xmax - 360
        xmin = this.xmin - 360
      }
    }
    return [xmin, xmax]
  }

  public contains(lon: number, lat: number) {
    const [xmin, xmax] = this.getWrappedLongitudes()

    if (xmax > 180 && lon >= -180 && lon <= xmax - 360) {
      lon += 360
    } else if (xmin < -180 && lon <= 180 && lon >= xmin + 360) {
      lon -= 360
    }

    const longitudeIn = lon >= xmin && lon <= xmax
    let latitudeIn
    if (this.deltaY >= 0) {
      latitudeIn = lat >= this.ymin && lat <= this.ymax
    } else {
      latitudeIn = lat >= this.ymax && lat <= this.ymin
    }
    return longitudeIn && latitudeIn
  }

  /**
   * 获取经纬度所在的位置索引
   * @param lon
   * @param lat
   */
  public getDecimalIndexes(lon: number, lat: number) {
    const i = floorMod(lon - this.xmin, 360) / this.deltaX // calculate longitude index in wrapped range [0, 360)
    if (this.flipY) {
      const j = (this.ymax - lat) / this.deltaY // calculate latitude index in direction +90 to -90
      return [i, j]
    } else {
      const j = (this.ymin + lat) / this.deltaY // calculate latitude index in direction +90 to -90
      return [i, j]
    }
  }

  /**
   * Nearest value at lon-lat coordinates
   * 线性插值
   * @param lon
   * @param lat
   */
  public valueAt(lon: number, lat: number) {
    let flag = false

    if (this.wrapX) {
      flag = true
    } else if (this.contains(lon, lat)) {
      flag = true
    }

    if (!flag) return null

    const indexes = this.getDecimalIndexes(lon, lat)
    const ii = Math.floor(indexes[0])
    const jj = Math.floor(indexes[1])

    const ci = this.clampColumnIndex(ii)
    const cj = this.clampRowIndex(jj)

    return this.valueAtIndexes(ci, cj)
  }

  /**
   * Get interpolated grid value lon-lat coordinates
   * 双线性插值
   * @param lon
   * @param lat
   */
  public interpolatedValueAt(lon: number, lat: number) {
    let flag = false

    if (this.wrapX && lat >= this.ymin && lat <= this.ymax) {
      flag = true
    } else if (this.contains(lon, lat)) {
      flag = true
    }

    if (!flag) return null

    const [i, j] = this.getDecimalIndexes(lon, lat)
    return this.interpolatePoint(i, j)
  }

  public hasValueAt(lon: number, lat: number) {
    const value = this.valueAt(lon, lat)
    return value !== null
  }

  /**
   * 基于向量的双线性插值
   * @param i
   * @param j
   */
  private interpolatePoint(i: number, j: number) {
    //         1      2           After converting λ and φ to fractional grid indexes i and j, we find the
    //        fi  i   ci          four points 'G' that enclose point (i, j). These points are at the four
    //         | =1.4 |           corners specified by the floor and ceiling of i and j. For example, given
    //      ---G--|---G--- fj 8   i = 1.4 and j = 8.3, the four surrounding grid points are (1, 8), (2, 8),
    //    j ___|_ .   |           (1, 9) and (2, 9).
    //  =8.3   |      |
    //      ---G------G--- cj 9   Note that for wrapped grids, the first column is duplicated as the last
    //         |      |           column, so the index ci can be used without taking a modulo.
    const indexes = this.getFourSurroundingIndexes(i, j)
    const [fi, ci, fj, cj] = indexes
    const values = this.getFourSurroundingValues(fi, ci, fj, cj)
    if (values) {
      const [g00, g10, g01, g11] = values
      // @ts-ignore
      return this.bilinearInterpolateVector(i - fi, j - fj, g00, g10, g01, g11)
    }

    return null
  }

  /**
   * Check the column index is inside the field,
   * adjusting to min or max when needed
   * @private
   * @param   {Number} ii - index
   * @returns {Number} i - inside the allowed indexes
   */
  private clampColumnIndex(ii: number) {
    let i = ii
    if (ii < 0) {
      i = 0
    }
    const maxCol = this.cols - 1
    if (ii > maxCol) {
      i = maxCol
    }
    return i
  }

  /**
   * Check the row index is inside the field,
   * adjusting to min or max when needed
   * @private
   * @param   {Number} jj index
   * @returns {Number} j - inside the allowed indexes
   */
  private clampRowIndex(jj: number) {
    let j = jj
    if (jj < 0) {
      j = 0
    }
    const maxRow = this.rows - 1
    if (jj > maxRow) {
      j = maxRow
    }
    return j
  }

  /**
   * 计算索引位置周围的数据
   * @private
   * @param   {Number} i - decimal index
   * @param   {Number} j - decimal index
   * @returns {Array} [fi, ci, fj, cj]
   */
  private getFourSurroundingIndexes(i: number, j: number) {
    const fi = Math.floor(i) // 左
    let ci = fi + 1 // 右
    // duplicate colum to simplify interpolation logic (wrapped value)
    if (this.isContinuous && ci >= this.cols) {
      ci = 0
    }
    ci = this.clampColumnIndex(ci)

    const fj = this.clampRowIndex(Math.floor(j)) // 上 纬度方向索引（取整）
    const cj = this.clampRowIndex(fj + 1) // 下

    return [fi, ci, fj, cj]
  }

  /**
   * Get four surrounding values or null if not available,
   * from 4 integer indexes
   * @private
   * @param   {Number} fi
   * @param   {Number} ci
   * @param   {Number} fj
   * @param   {Number} cj
   * @returns {Array}
   */
  private getFourSurroundingValues(fi: number, ci: number, fj: number, cj: number) {
    let row
    if ((row = this.grid[fj])) {
      const g00 = row[fi] // << left
      const g10 = row[ci] // right >>
      if (this.isValid(g00) && this.isValid(g10) && (row = this.grid[cj])) {
        // lower row vv
        const g01 = row[fi] // << left
        const g11 = row[ci] // right >>
        if (this.isValid(g01) && this.isValid(g11)) {
          return [g00, g10, g01, g11] // 4 values found!
        }
      }
    }
    return null
  }

  /**
   * Value for grid indexes
   * @param   {Number} i - column index (integer)
   * @param   {Number} j - row index (integer)
   * @returns {Vector|Number}
   */
  public valueAtIndexes(i: number, j: number) {
    return this.grid[j][i] // <-- j,i !!
  }

  /**
   * Lon-Lat for grid indexes
   * @param   {Number} i - column index (integer)
   * @param   {Number} j - row index (integer)
   * @returns {Number[]} [lon, lat]
   */
  public lonLatAtIndexes(i: number, j: number) {
    const lon = this.longitudeAtX(i)
    const lat = this.latitudeAtY(j)

    return [lon, lat]
  }

  /**
   * Longitude for grid-index
   * @param   {Number} i - column index (integer)
   * @returns {Number} longitude at the center of the cell
   */
  private longitudeAtX(i: number) {
    const halfXPixel = this.deltaX / 2.0
    let lon = this.xmin + halfXPixel + i * this.deltaX
    if (this.translateX) {
      lon = lon > 180 ? lon - 360 : lon
    }
    return lon
  }

  /**
   * Latitude for grid-index
   * @param   {Number} j - row index (integer)
   * @returns {Number} latitude at the center of the cell
   */
  private latitudeAtY(j: number) {
    const halfYPixel = this.deltaY / 2.0
    return this.ymax - halfYPixel - j * this.deltaY
  }

  /**
   * 生成粒子位置
   * @param o
   * @param width
   * @param height
   * @param unproject
   * @return IPosition
   */
  public randomize(
    o: IPosition = {},
    width: number,
    height: number,
    unproject: (a: [number, number]) => [number, number] | null,
  ) {
    const i = (Math.random() * (width || this.cols)) | 0
    const j = (Math.random() * (height || this.rows)) | 0

    const coords = unproject([i, j])
    if (coords !== null) {
      o.x = coords[0]
      o.y = coords[1]
    } else {
      o.x = this.longitudeAtX(i)
      o.y = this.latitudeAtY(j)
    }

    return o
  }

  /**
   * 判断是否是 `Field` 的实例
   * @return boolean
   */
  public checkFields() {
    return this.isFields
  }
}
