import { ConfigProvider, theme } from 'antd'
import zhCN from 'antd/lib/locale/zh_CN'
import ReactDOM from 'react-dom/client'
import config from '../package.json'
import App from './App'
import { showVersion } from './utils'

import '@/styles/index.less'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ConfigProvider
    locale={zhCN}
    theme={{
      algorithm: theme.darkAlgorithm,
    }}
  >
    <App />
  </ConfigProvider>
)

showVersion('version:', config.version)
