import { RouterProvider } from 'react-router-dom'
import FallbackElement from './components/FallbackElement'
import router from './routes'

function App() {
  return <RouterProvider router={router} fallbackElement={<FallbackElement />} />
}

export default App
