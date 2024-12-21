import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'
import externalGlobals from 'rollup-plugin-external-globals'
import { defineConfig } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    // createHtmlPlugin({
    //   minify: true,
    //   inject: {
    //     data: {
    //       injectScript: '<script src="https://api.mapbox.com/mapbox-gl-js/v3.0.0/mapbox-gl.js"></script>',
    //     },
    //   },
    // }),
  ],
  // 路径别名
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    // rollup 配置
    rollupOptions: {
      external: ['mapbox-gl'],
      plugins: [
        // 避免打包和生产模式运行出错 在这里声明公共模块
        externalGlobals({
          //  "在项目中引入的变量名称" ："CDN包导出的名称，一般在CDN包中都是可见的"
          'mapbox-gl': 'mapboxgl',
        }),
      ],

      // 分包
      // output: {
      //   manualChunks(id: any): string {
      //     if (id.includes('node_modules')) {
      //       console.log(id)

      //       return id.toString().split('node_modules/')[1].split('/')[0].toString()
      //     }
      //   },
      // },
    },
  },
  server: {
    port: 3000, // 端口号
  },
})
