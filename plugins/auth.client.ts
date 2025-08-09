export default defineNuxtPlugin(() => {
  return {
    provide: {
      // 检查用户是否已登录
      isAuthenticated: () => {
        if (process.client) {
          const token = localStorage.getItem('token')
          return !!token
        }
        return false
      },
      
      // 获取用户token
      getToken: () => {
        if (process.client) {
          return localStorage.getItem('token')
        }
        return null
      },
      
      // 设置用户token
      setToken: (token: string) => {
        if (process.client) {
          localStorage.setItem('token', token)
        }
      },
      
      // 清除用户token
      clearToken: () => {
        if (process.client) {
          localStorage.removeItem('token')
        }
      },
      
      // 登出
      logout: () => {
        if (process.client) {
          localStorage.removeItem('token')
          localStorage.removeItem('userInfo')
          navigateTo('/login')
        }
      },
      
      // 获取用户信息
      getUserInfo: () => {
        if (process.client) {
          const userInfo = localStorage.getItem('userInfo')
          return userInfo ? JSON.parse(userInfo) : null
        }
        return null
      },
      
      // 设置用户信息
      setUserInfo: (userInfo: any) => {
        if (process.client) {
          localStorage.setItem('userInfo', JSON.stringify(userInfo))
        }
      }
    }
  }
})
