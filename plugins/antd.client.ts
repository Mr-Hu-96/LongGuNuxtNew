import { ConfigProvider } from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(ConfigProvider)
  
  // 全局配置 Ant Design Vue
  nuxtApp.vueApp.provide('antdLocale', zhCN)
  
  // 设置全局主题配置
  const theme = {
    token: {
      colorPrimary: '#1890ff',
      borderRadius: 6,
    },
  }
  
  nuxtApp.vueApp.provide('antdTheme', theme)
})
