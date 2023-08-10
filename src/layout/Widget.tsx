import useMapStore from '@/components/MapboxMap/useMapStore'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { FC } from 'react'

interface WidgetProps {
  className?: string
  children?: React.ReactNode
}

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />

const Widget: FC<WidgetProps> = (props) => {
  const { map } = useMapStore()

  return (
    <div className={`widget bg-gray-800 bg-opacity-50 ${props.className}`}>
      <Spin spinning={!map} indicator={antIcon}>
        {props.children}
      </Spin>
    </div>
  )
}

export default Widget
