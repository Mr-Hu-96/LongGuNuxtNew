// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'node:url'
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxtjs/tailwindcss',
    '@ant-design-vue/nuxt',
    '@pinia/nuxt',
    // '@pinia-plugin-persistedstate/nuxt', // 暂时注释掉，避免加载错误
  ],
  runtimeConfig: {
    public: {
      apiBase: 'https://api.longgu.com/api' // 可用 process.env.API_BASE 注入
    }
  },
  // 添加 SSR 配置来解决 wangeditor 兼容性问题
  ssr: true,
  nitro: {
    experimental: {
      wasm: true
    }
  },
  vite: {
    ssr: {
      noExternal: ['@wangeditor/editor', '@wangeditor/editor-for-vue']
    },
    define: {
      global: 'globalThis'
    }
  },
  plugins: [
    '~/plugins/antd.client.ts',
    '~/plugins/utils.client.ts',
    '~/plugins/route-guard.client.ts',
    '~/plugins/global-components.client.ts',
    '~/plugins/auth.client.ts',
    '~/plugins/axios.client.ts',
    '~/plugins/wangeditor.client.ts',
  ],
  hooks: {
    'pages:extend'(pages) {
      pages.push({
        path: '/about',
        file: '~/pages/home/about.vue',
        meta: { title: '关于我们' }
      })
      pages.push({
        path: '/news',
        file: '~/pages/news/index.vue',
        meta: { title: '咨询列表' }
      })
      pages.push({
        path: '/consultDetail/:article_id',
        file: fileURLToPath(new URL('./pages/news/detail.vue', import.meta.url)),
        meta: { title: '咨询详情' }
      })
      pages.push({
        path: '/supervise',
        file: '~/pages/supervise/index.vue',
        meta: { title: '监管' }
      })
      pages.push({
        path: '/search',
        file: '~/pages/home/search.vue',
        meta: { title: '搜索' }
      })
      pages.push({
        path: '/stock',
        file: '~/pages/stock/detail.vue',
        meta: { title: '股票详情' }
      })
      pages.push({
        path: '/center',
        file: '~/pages/user/center.vue',
        meta: { title: '个人中心' }
      })
      pages.push({
        path: '/info',
        file: '~/pages/user/info.vue',
        meta: { title: '用户中心' }
      })
      pages.push({
        path: '/message',
        file: '~/pages/user/message.vue',
        meta: { title: '信息中心' }
      })
      pages.push({
        path: '/vip',
        file: '~/pages/user/vip.vue',
        meta: { title: '购买会员' }
      })
      pages.push({
        path: '/invitation',
        file: '~/pages/user/invitation.vue',
        meta: { title: '我的邀请' }
      })
      pages.push({
        path: '/chooseStock',
        file: '~/pages/user/chooseStock.vue',
        meta: { title: '自选股' }
      })
    }
  }
})
