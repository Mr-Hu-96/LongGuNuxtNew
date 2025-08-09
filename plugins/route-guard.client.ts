export default defineNuxtPlugin((nuxtApp) => {
  // 路由守卫
  nuxtApp.hook('page:start', () => {
    // 页面开始加载时的处理
    console.log('页面开始加载')
  })
  
  nuxtApp.hook('page:finish', () => {
    // 页面加载完成时的处理
    console.log('页面加载完成')
  })
  
  // 全局错误处理
  nuxtApp.hook('app:error', (error) => {
    console.error('应用错误:', error)
  })
  
  // 路由变化时的处理
  nuxtApp.hook('page:transition:finish', () => {
    // 页面过渡完成后的处理
    console.log('页面过渡完成')
  })
  
  // 提供路由相关工具函数
  return {
    provide: {
      // 检查是否需要登录
      requireAuth: (to: any) => {
        const publicRoutes = ['/login', '/register', '/forgot-password']
        return !publicRoutes.includes(to.path)
      },
      
      // 重定向到登录页
      redirectToLogin: () => {
        navigateTo('/login')
      },
      
      // 检查用户权限
      hasPermission: (permission: string) => {
        if (process.client) {
          const userInfo = localStorage.getItem('userInfo')
          if (userInfo) {
            const user = JSON.parse(userInfo)
            return user.permissions?.includes(permission) || false
          }
        }
        return false
      }
    }
  }
})
