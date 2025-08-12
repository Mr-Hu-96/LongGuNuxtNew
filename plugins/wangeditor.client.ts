// 解决 wangeditor 在 SSR 环境下的兼容性问题
export default defineNuxtPlugin(() => {
  // 在客户端环境下模拟 navigator 对象
  if (process.client) {
    // 确保在客户端环境下运行
    return
  }
  
  // 在服务端环境下，为 wangeditor 提供必要的全局对象
  if (process.server) {
    // 模拟浏览器环境
    globalThis.navigator = globalThis.navigator || {}
    globalThis.navigator.userAgent = globalThis.navigator.userAgent || 'Node.js'
    globalThis.navigator.platform = globalThis.navigator.platform || 'Win32'
    
    // 模拟其他必要的浏览器 API
    globalThis.document = globalThis.document || {}
    globalThis.window = globalThis.window || globalThis
  }
})

