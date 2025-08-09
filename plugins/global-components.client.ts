export default defineNuxtPlugin((nuxtApp) => {
  // 注册全局组件
  nuxtApp.vueApp.component('LoadingSpinner', {
    template: `
      <div class="flex justify-center items-center p-4">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    `
  })
  
  nuxtApp.vueApp.component('EmptyState', {
    props: {
      message: {
        type: String,
        default: '暂无数据'
      },
      icon: {
        type: String,
        default: '📭'
      }
    },
    template: `
      <div class="flex flex-col items-center justify-center p-8 text-gray-500">
        <div class="text-4xl mb-2">{{ icon }}</div>
        <div class="text-sm">{{ message }}</div>
      </div>
    `
  })
  
  nuxtApp.vueApp.component('ErrorBoundary', {
    data() {
      return {
        hasError: false,
        error: null
      }
    },
    errorCaptured(err: any, vm: any, info: any) {
      this.hasError = true
      this.error = err
      console.error('Error captured:', err, info)
      return false
    },
    template: `
      <div v-if="hasError" class="p-4 bg-red-50 border border-red-200 rounded">
        <h3 class="text-red-800 font-medium">出错了</h3>
        <p class="text-red-600 text-sm mt-1">请刷新页面重试</p>
      </div>
      <slot v-else></slot>
    `
  })
})
