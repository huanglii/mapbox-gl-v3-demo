import { createHashRouter } from 'react-router-dom'
import Layout from '@/layout'
import ErrorPage from '@/components/ErrorPage'
import NoFoundPage from '@/components/NoFoundPage'
import Expressions from '@/pages/Expressions'
import StandardStyle from '@/pages/StandardStyle'
import Taste from '@/pages/Taste'
import RasterColor from '@/pages/RasterColor'

export const pages = [
  {
    index: true,
    name: '3D 尝鲜',
    path: '3d-taste',
    element: <Taste />,
  },
  {
    name: '标准样式',
    path: 'standard-style',
    element: <StandardStyle />,
  },
  {
    name: '栅格颜色',
    path: 'raster-color',
    element: <RasterColor />,
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
