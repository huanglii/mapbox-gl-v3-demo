import type { IField } from './Field'
import Field from './Field'

const hasOwnProperty = Object.prototype.hasOwnProperty
const symToStringTag = typeof Symbol !== 'undefined' ? Symbol.toStringTag : undefined

function baseGetTag(value: any) {
  if (value === null) {
    return value === undefined ? '[object Undefined]' : '[object Null]'
  }
  if (!(symToStringTag && symToStringTag in Object(value))) {
    return toString.call(value)
  }
  const isOwn = hasOwnProperty.call(value, symToStringTag)
  const tag = value[symToStringTag]
  let unmasked = false
  try {
    value[symToStringTag] = undefined
    unmasked = true
  } catch (e) {
    //
  }

  const result = Object.prototype.toString.call(value)
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag
    } else {
      delete value[symToStringTag]
    }
  }
  return result
}

/**
 * 判断是否为函数
 * @param value
 * @returns {boolean}
 */
export function isFunction(value: any): value is (...args: any[]) => any {
  if (!isObject(value)) {
    return false
  }
  const tag = baseGetTag(value)
  return (
    tag === '[object Function]' ||
    tag === '[object AsyncFunction]' ||
    tag === '[object GeneratorFunction]' ||
    tag === '[object Proxy]'
  )
}

/**
 * 判断是否为合法字符串
 * @param value
 * @returns {boolean}
 */
export function isString(value: any): boolean {
  if (value === null) {
    return false
  }
  return typeof value === 'string' || (value.constructor !== null && value.constructor === String)
}

/**
 * 判断是否为对象
 * @param value
 * @returns {boolean}
 */
export function isObject(value: any) {
  const type = typeof value
  return value !== null && (type === 'object' || type === 'function')
}

/**
 * 判断是否为数字
 * @param value
 * @returns {boolean}
 */
export function isNumber(value: any) {
  return Object.prototype.toString.call(value) === '[object Number]' && !isNaN(value)
}

/**
 * 打印⚠️信息
 * @param msg
 * @param n
 */
export function warnLog(msg: string, n?: string) {
  console.warn(`${n || 'wind-layer'}: ${msg}`)
}

const warnings: Record<string, boolean> = {}

/**
 * 在程序运行时只打印同类型警告一次
 * @param namespaces
 * @param msg
 */
export function warnOnce(namespaces: string, msg: string) {
  if (!warnings[msg]) {
    warnLog(msg, namespaces)
    warnings[msg] = true
  }
}

/**
 * Get floored division
 * @param a
 * @param n
 * @returns {Number} returns remainder of floored division,
 * i.e., floor(a / n). Useful for consistent modulo of negative numbers.
 * See http://en.wikipedia.org/wiki/Modulo_operation.
 */
export function floorMod(a: number, n: number) {
  return a - n * Math.floor(a / n)
}

/**
 * 检查值是否合法
 * @param val
 * @returns {boolean}
 */
export function isValide(val: any) {
  return val !== undefined && val !== null && !isNaN(val)
}

export interface IGFSItem {
  header: {
    parameterCategory: number | string
    parameterNumber: number | string
    dx: number
    dy: number
    nx: number
    ny: number
    lo1: number
    lo2: number
    la1: number
    la2: number
    [key: string]: any
  }
  data: number[]
}

/**
 * format gfs json to vector
 * @param data
 * @param options
 */
export function formatData(data: IGFSItem[], options: Partial<IField> = {}) {
  let uComp: IGFSItem = undefined as unknown as IGFSItem
  let vComp: IGFSItem = undefined as unknown as IGFSItem

  console.time('format-data')

  data.forEach(function (record: IGFSItem) {
    switch (record.header.parameterCategory + ',' + record.header.parameterNumber) {
      case '1,2':
      case '2,2':
        uComp = record
        break
      case '1,3':
      case '2,3':
        vComp = record
        break
    }
  })

  if (!vComp || !uComp) {
    return undefined
  }

  const header = uComp.header
  const vectorField = new Field({
    xmin: header.lo1, // 一般格点数据是按照矩形范围来切割，所以定义其经纬度范围
    ymin: header.la1,
    xmax: header.lo2,
    ymax: header.la2,
    deltaX: header.dx, // x（经度）增量
    deltaY: header.dy, // y（维度）增量
    cols: header.nx, // 列（可由 `(xmax - xmin) / deltaX` 得到）
    rows: header.ny, // 行
    us: uComp.data, // U分量
    vs: vComp.data, // V分量
    ...options,
  })

  console.timeEnd('format-data')

  return vectorField
}
