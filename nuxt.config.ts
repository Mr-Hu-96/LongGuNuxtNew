// https://nuxt.com/docs/api/configuration/nuxt-config
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
  plugins: [
    '~/plugins/antd.client.ts',
    '~/plugins/utils.client.ts',
    '~/plugins/route-guard.client.ts',
    '~/plugins/global-components.client.ts',
    '~/plugins/auth.client.ts',
    '~/plugins/axios.client.ts',
  ],
  hooks: {
    'pages:extend'(pages) {
      pages.push({
        path: '/vip',
        file: '~/pages/user/vip.vue',
        meta: { title: '购买会员' }
      })
      pages.push({
        path: '/about',
        file: '~/pages/home/about.vue',
        meta: { title: '关于我们' }
      })
    }
  }
})
