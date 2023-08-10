import { FC, ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import MapboxMap from '@/components/MapboxMap'
import Sidebar from './SideBar'

import './index.less'

interface LayoutProps {
  children?: ReactNode
}

const Layout: FC<LayoutProps> = () => {
  return (
    <div className="bg-gray-900 h-[100vh] flex flex-col">
      <div className="flex flex-auto">
        <Sidebar />
        <div className="flex-1 relative">
          <MapboxMap />
          {/* 渲染子路由组件 */}
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Layout
