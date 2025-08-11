// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  routeRules: {
    '/**': { cors: true }
  },
  nitro: {
    //handlers: [
    //  { 
    //    route: '/hi',
    //    handler: '~/server/routes/hi.ts'
    //  }
    //],
    // The newest nuxt has bug, which will only use following config, ignore *.ts routes
    routeRules: {
      '/**': {
        proxy: 'http://127.0.0.1:5173/**'
      }
    }
  }
})
