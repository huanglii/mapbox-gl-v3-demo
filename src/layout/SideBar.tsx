import { pages } from '@/routes'
import { FC } from 'react'
import { Link } from 'react-router-dom'

const Sidebar: FC = () => {
  return (
    <aside className="w-28 p-2" aria-label="Sidebar">
      <div className="overflow-y-auto p-2 rounded bg-gray-800">
        <div className="sidebar-menu space-y-1">
          {pages.map((item, index) => (
            <Link key={index} to={item.path}>
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
