import { FC } from 'react'
import { Link } from 'react-router-dom'

const Sidebar: FC = () => {
  return (
    <aside className="w-64 mr-2" aria-label="Sidebar">
      <div className="overflow-y-auto py-4 px-3 rounded bg-gray-800">
        <ul className="space-y-2">
          <li>
            <Link to="/">
              <span className="ml-3">Home</span>
            </Link>
          </li>
          <li>
            <Link to="about">
              <span className="ml-3">About</span>
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  )
}

export default Sidebar
