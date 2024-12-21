import ErrorPage from '@/components/ErrorPage'
import NoFoundPage from '@/components/NoFoundPage'
import Layout from '@/layout'
import LowAltitude from '@/pages/LowAltitude'
import RasterColor from '@/pages/RasterColor'
import StandardStyle from '@/pages/StandardStyle'
import Taste from '@/pages/Taste'
import { createHashRouter } from 'react-router-dom'

export const pages = [
  {
    name: '标准样式',
    path: 'standard-style',
    element: <StandardStyle />,
  },
  {
    index: true,
    name: '建筑模型',
    path: '3d-taste',
    element: <Taste />,
  },
  {
    name: '栅格颜色',
    path: 'raster-color',
    element: <RasterColor />,
  },
  {
    name: '低空模拟',
    path: 'low-altitude',
    element: <LowAltitude />,
  },
]

const router = createHashRouter([
  {
    id: 'root',
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: pages,
  },
  {
    path: '*',
    element: <NoFoundPage />,
  },
])

export default router
