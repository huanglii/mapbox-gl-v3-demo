import '@/styles/index.less'
import themeToken from '@/utils/theme.json'
import { ConfigProvider, theme } from 'antd'
import zhCN from 'antd/lib/locale/zh_CN'
import React from 'react'
import ReactDOM from 'react-dom/client'
import config from '../package.json'
import App from './App'
import { showVersion } from './utils'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ConfigProvider
    locale={zhCN}
    theme={{
      algorithm: theme.darkAlgorithm,
      components: themeToken.components,
      token: themeToken.token,
    }}
  >
    <App />
  </ConfigProvider>
)

showVersion('version:', config.version)
