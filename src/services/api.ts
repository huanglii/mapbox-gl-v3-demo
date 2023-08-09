import Service from './request'

// 接口配置文件
export const test = () => {
  return Service.get('/test')
}
