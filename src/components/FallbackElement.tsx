import { Skeleton } from 'antd'
import { FC } from 'react'

const FallbackElement: FC = () => {
  return (
    <div className="w-full h-full fixed bg-[#2c3e50] flex flex-col justify-center">
      <div className="container mx-auto">
        <div className="spinner h-10 text-center text-sm mx-auto mt-5 mb-3">
          {new Array(5).fill('').map((_v, k) => (
            <div
              style={{ animation: 'stretchdelay 1.2s infinite ease-in-out', animationDelay: `${-1.1 + k * 0.1}s` }}
              className="bg-[#647eff] h-full w-[6px] inline-block mr-[3px]"
              key={k}
            ></div>
          ))}
        </div>
        <div
          style={{ WebkitTextFillColor: 'transparent' }}
          className="text-center text-lg bg-clip-text bg-gradient-to-r from-[#42d392] to-[#647eff] font-bold"
        >
          数据加载中
        </div>
        <div className="py-12">
          <Skeleton active />
          <Skeleton active />
        </div>
      </div>
    </div>
  )
}

export default FallbackElement
