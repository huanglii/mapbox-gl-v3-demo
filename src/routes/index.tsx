import Layout from '@/layout'
import ErrorPage from '@/components/ErrorPage'
import NoFoundPage from '@/components/NoFoundPage'
import Slot from '@/pages/Slot'
import ConfigProperty from '@/pages/ConfigProperty'
import { createHashRouter } from 'react-router-dom'

export const pages = [
  {
    index: true,
    name: '配置属性',
    path: 'config-property',
    element: <ConfigProperty />,
  },
  {
    name: '插 槽',
    path: 'slot',
    element: <Slot />,
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
