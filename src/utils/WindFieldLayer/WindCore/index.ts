import type { IField } from './Field'
import Field from './Field'
import Vector from './Vector'
import { isFunction, isNumber, isString, isValide } from './utils'

export const defaultOptions: IOptions = {
  globalAlpha: 0.9, // 全局透明度
  lineWidth: 2, // 线条宽度
  // colorScale: '#fff',
  colorScale: [
    'rgba(0, 213, 255, 1)',
    'rgba(102, 255, 154, 1)',
    'rgba(19, 255, 37, 1)',
    'rgba(127, 255, 0, 1)',
    'rgba(205, 255, 0, 1)',
    'rgba(255, 255, 0, 1)',
    'rgba(232, 213, 5, 1)',
    'rgba(232, 147, 5, 1)',
    'rgba(232, 95, 5, 1)',
    'rgba(200, 32, 12, 1)',
    'rgba(165, 0, 1, 1)',
  ],
  // colorScale: (v: number) => {
  // if (v < 0.1) return 'rgba(0, 213, 255, 1)'
  // if (v < 0.2) return 'rgba(102, 255, 154, 1)'
  // if (v < 0.3) return 'rgba(19, 255, 37, 1)'
  // if (v < 0.4) return 'rgba(127, 255, 0, 1)'
  // if (v < 0.5) return 'rgba(205, 255, 0, 1)'
  // if (v < 0.6) return 'rgba(255, 255, 0, 1)'
  // if (v < 0.7) return 'rgba(232, 213, 5, 1)'
  // if (v < 0.8) return 'rgba(232, 147, 5, 1)'
  // if (v < 0.9) return 'rgba(232, 95, 5, 1)'
  // if (v < 0.1) return 'rgba(200, 32, 12, 1)'
  //   return '#C8EFD4'
  // },
  velocityScale: 0.00001,
  // particleAge: 90,
  maxAge: 90, // alias for particleAge
  // particleMultiplier: 1 / 300, // TODO: PATHS = Math.round(width * height * particleMultiplier);
  paths: 1500,
  frameRate: 20,
  useCoordsDraw: true,
}

type emptyFunc = (v?: any) => number

export interface IOptions {
  /**
   * 全局透明度，主要影响粒子拖尾效果，默认 0.9
   */
  globalAlpha: number // 全局透明度

  /**
   * 线条宽度
   */
  lineWidth: number | emptyFunc

  /**
   * 粒子颜色配置, 默认#fff，当为回调函数时，参数 function(m:对应点风速值) => string
   */
  colorScale: string | string[] | emptyFunc

  /**
   * 对于粒子路径步长的乘积系数，默认 1 / 25
   */
  velocityScale: number | emptyFunc

  /**
   * 粒子路径能够生成的最大帧数，默认是 90
   */
  particleAge?: number // 粒子在重新生成之前绘制的最大帧数

  /**
   * 粒子路径能够生成的最大帧数，默认是 90；他代表的是我们的 `paths` 数量的粒子的消亡控制，最小值是 0，最大值是 `maxAge`，在运行到 age 数时会消失然后进行重启
   */
  maxAge: number // alias for particleAge

  /**
   * 粒子路径数量的系数，不推荐使用（视野宽度 * 高度 * 系数）
   */
  particleMultiplier?: number // TODO: PATHS = Math.round(width * height * that.particleMultiplier);

  /**
   * 生成的粒子数量
   */
  paths: number | emptyFunc

  /**
   * 用户自定义的帧率，默认是 20ms, 大概接近 50fps 帧，我们可能在某些场景需要降低帧率一保证渲染稳定性；注意此配置还会影响粒子运动的速度
   */
  frameRate: number

  /**
   * 用户配置的风速最小值，如果未配置会从传入的数据中计算
   */
  minVelocity?: number

  /**
   * 用户配置的风速最大值，如果未配置会从传入的数据中计算
   */
  maxVelocity?: number

  /**
   * 使用外部传入的坐标系统，默认是 `true`；某些场景下我们可能直接使用像素坐标。
   */
  useCoordsDraw?: boolean
}

function indexFor(m: number, min: number, max: number, colorScale: string[]) {
  // map velocity speed to a style
  return Math.max(0, Math.min(colorScale.length - 1, Math.round(((m - min) / (max - min)) * (colorScale.length - 1))))
}

class WindCore {
  public static Field = Field

  public forceStop: boolean = false
  private ctx: CanvasRenderingContext2D
  private options!: IOptions
  private field?: Field
  private particles: any[] = []
  private animationLoop?: number
  private then: number = Date.now()
  private generated = false

  private starting: boolean = false

  constructor(ctx: CanvasRenderingContext2D, options: Partial<IOptions>, field?: Field) {
    this.ctx = ctx

    if (!this.ctx) {
      throw new Error('ctx error')
    }

    this.animate = this.animate.bind(this)

    this.setOptions(options)

    if (field) {
      this.updateData(field)
    }
  }

  /**
   * 设置配置项
   * @param options
   */
  public setOptions(options: Partial<IOptions>) {
    this.options = { ...defaultOptions, ...options }

    const { width, height } = this.ctx.canvas

    if (options.particleAge && !('maxAge' in options)) {
      this.options.maxAge = options.particleAge
    }

    if (options.particleMultiplier && !('paths' in options)) {
      this.options.paths = Math.round(width * height * options.particleMultiplier)
    }

    this.prerender()
  }

  /**
   * 获取配置项
   */
  public getOptions() {
    return this.options
  }

  /**
   * 更新数据
   * @param field
   */
  public updateData(field: Field) {
    this.field = field
    if (!this.generated) {
      return
    }
    this.particles = this.prepareParticlePaths()
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public project(coordinates: [number, number]): [number, number] | null {
    throw new Error('not implemented')
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public unproject(pixels: [number, number]): [number, number] | null {
    throw new Error('not implemented')
  }

  /**
   * 判断位置是否在当前视窗内
   * @param coordinates
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public intersectsCoordinate(coordinates: [number, number]): boolean {
    throw new Error('not implemented')
  }

  /**
   * 清空当前画布
   */
  public clearCanvas() {
    this.stop()
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
    this.forceStop = false
  }

  isStop() {
    return !this.starting
  }

  /**
   * 启动粒子动画
   */
  public start() {
    this.starting = true
    this.forceStop = false
    this.then = Date.now()
    this.animate()
  }

  /**
   * 停止粒子动画
   */
  public stop() {
    this.animationLoop && cancelAnimationFrame(this.animationLoop)
    this.starting = false
    this.forceStop = true
  }

  public animate() {
    if (this.animationLoop) {
      cancelAnimationFrame(this.animationLoop)
    }
    this.animationLoop = requestAnimationFrame(this.animate)
    const now = Date.now()
    const delta = now - this.then
    if (delta > this.options.frameRate) {
      this.then = now - (delta % this.options.frameRate)
      this.render()
    }
  }

  /**
   * 渲染前处理
   */
  public prerender() {
    this.generated = false
    if (!this.field) {
      return
    }
    this.particles = this.prepareParticlePaths()
    this.generated = true

    if (!this.starting && !this.forceStop) {
      this.starting = true
      this.then = Date.now()
      this.animate()
    }
  }

  /**
   * 开始渲染
   */
  public render() {
    this.moveParticles()
    this.drawParticles()
    this.postrender()
  }

  /**
   * each frame render end
   */
  public postrender() {
    //
  }

  private moveParticles() {
    if (!this.field) {
      return
    }
    const { width, height } = this.ctx.canvas
    const particles = this.particles
    // 清空组
    const maxAge = this.options.maxAge
    const velocityScale = isFunction(this.options.velocityScale)
      ? this.options.velocityScale()
      : this.options.velocityScale

    let i = 0
    const len = particles.length
    for (; i < len; i++) {
      const particle = particles[i]

      if (particle.age > maxAge) {
        particle.age = 0
        // restart, on a random x,y
        this.field.randomize(particle, width, height, this.unproject)
      }

      // lon, lat
      const x = particle.x
      const y = particle.y

      const vector = this.field.interpolatedValueAt(x, y)

      if (vector === null) {
        particle.age = maxAge
      } else {
        const xt = x + vector.u * velocityScale
        const yt = y + vector.v * velocityScale

        if (this.field.hasValueAt(xt, yt)) {
          // Path from (x,y) to (xt,yt) is visible, so add this particle to the appropriate draw bucket.
          particle.xt = xt
          particle.yt = yt
          particle.m = vector.m
        } else {
          // Particle isn't visible, but it still moves through the field.
          particle.x = xt
          particle.y = yt
          particle.age = maxAge
        }
      }

      particle.age++
    }
  }

  private fadeIn() {
    const prev = this.ctx.globalCompositeOperation // lighter
    this.ctx.globalCompositeOperation = 'destination-in'
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
    this.ctx.globalCompositeOperation = prev
  }

  private drawParticles() {
    const particles = this.particles
    this.fadeIn()
    this.ctx.globalAlpha = this.options.globalAlpha

    this.ctx.fillStyle = `rgba(0, 0, 0, ${this.options.globalAlpha})`
    this.ctx.lineWidth = (isNumber(this.options.lineWidth) ? this.options.lineWidth : 1) as number
    this.ctx.strokeStyle = (isString(this.options.colorScale) ? this.options.colorScale : '#fff') as string

    let i = 0
    const len = particles.length
    if (this.field && len > 0) {
      let min: number
      let max: number
      // 如果配置了风速范围
      if (isValide(this.options.minVelocity) && isValide(this.options.maxVelocity)) {
        min = this.options.minVelocity as number
        max = this.options.maxVelocity as number
      } else {
        // 未配置风速范围取格点数据中的最大风速和最小风速
        ;[min, max] = this.field.range as [number, number]
      }
      for (; i < len; i++) {
        this[this.options.useCoordsDraw ? 'drawCoordsParticle' : 'drawPixelParticle'](particles[i], min, max)
      }
    }
  }

  /**
   * 用于绘制像素粒子
   * @param particle
   * @param min
   * @param max
   */
  private drawPixelParticle(particle: any, min: number, max: number) {
    // TODO 需要判断粒子是否超出视野
    // this.ctx.strokeStyle = color;
    const pointPrev: [number, number] = [particle.x, particle.y]
    // when xt isn't exit
    const pointNext: [number, number] = [particle.xt, particle.yt]

    if (
      pointNext &&
      pointPrev &&
      isValide(pointNext[0]) &&
      isValide(pointNext[1]) &&
      isValide(pointPrev[0]) &&
      isValide(pointPrev[1]) &&
      particle.age <= this.options.maxAge
    ) {
      this.ctx.beginPath()
      this.ctx.moveTo(pointPrev[0], pointPrev[1])
      this.ctx.lineTo(pointNext[0], pointNext[1])

      if (isFunction(this.options.colorScale)) {
        // @ts-ignore
        this.ctx.strokeStyle = this.options.colorScale(particle.m) as string
      } else if (Array.isArray(this.options.colorScale)) {
        const colorIdx = indexFor(particle.m, min, max, this.options.colorScale)
        this.ctx.strokeStyle = this.options.colorScale[colorIdx]
      }

      if (isFunction(this.options.lineWidth)) {
        // @ts-ignore
        this.ctx.lineWidth = this.options.lineWidth(particle.m) as number
      }

      particle.x = particle.xt
      particle.y = particle.yt

      this.ctx.stroke()
    }
  }

  /**
   * 用于绘制坐标粒子
   * @param particle
   * @param min
   * @param max
   */
  private drawCoordsParticle(particle: any, min: number, max: number) {
    // TODO 需要判断粒子是否超出视野
    // this.ctx.strokeStyle = color;
    const source: [number, number] = [particle.x, particle.y]
    // when xt isn't exit
    const target: [number, number] = [particle.xt, particle.yt]

    if (
      target &&
      source &&
      isValide(target[0]) &&
      isValide(target[1]) &&
      isValide(source[0]) &&
      isValide(source[1]) &&
      this.intersectsCoordinate(target) &&
      particle.age <= this.options.maxAge
    ) {
      const pointPrev = this.project(source)
      const pointNext = this.project(target)

      if (pointPrev && pointNext) {
        this.ctx.beginPath()
        this.ctx.moveTo(pointPrev[0], pointPrev[1])
        this.ctx.lineTo(pointNext[0], pointNext[1])
        particle.x = particle.xt
        particle.y = particle.yt

        if (isFunction(this.options.colorScale)) {
          // @ts-ignore
          this.ctx.strokeStyle = this.options.colorScale(particle.m) as string
        } else if (Array.isArray(this.options.colorScale)) {
          const colorIdx = indexFor(particle.m, min, max, this.options.colorScale)
          this.ctx.strokeStyle = this.options.colorScale[colorIdx]
        }

        if (isFunction(this.options.lineWidth)) {
          // @ts-ignore
          this.ctx.lineWidth = this.options.lineWidth(particle.m) as number
        }

        this.ctx.stroke()
      }
    }
  }

  private prepareParticlePaths() {
    // 由用户自行处理，不再自动修改粒子数
    const { width, height } = this.ctx.canvas
    const particleCount = typeof this.options.paths === 'function' ? this.options.paths(this) : this.options.paths
    const particles: any[] = []
    if (!this.field) {
      return []
    }
    let i = 0
    for (; i < particleCount; i++) {
      particles.push(
        this.field.randomize(
          {
            age: this.randomize(),
          },
          width,
          height,
          this.unproject
        )
      )
    }
    return particles
  }

  private randomize() {
    return Math.floor(Math.random() * this.options.maxAge)
  }
}

export { Field, IField, Vector, WindCore }
