import ErrorPage from '@/components/ErrorPage'
import NoFoundPage from '@/components/NoFoundPage'
import Layout from '@/layout'
import About from '@/pages/About'
import Home from '@/pages/Home'
import { createHashRouter } from 'react-router-dom'

const router = createHashRouter([
  {
    id: 'root',
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'about',
        element: <About />,
      },
    ],
  },
  {
    path: '*',
    element: <NoFoundPage />,
  },
])

export default router
