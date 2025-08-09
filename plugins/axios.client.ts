import axios from 'axios'

export default defineNuxtPlugin((nuxtApp) => {
  // 创建 axios 实例
  const http = axios.create({
    baseURL: process.env.NUXT_PUBLIC_API_BASE_URL || '/api',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // 请求拦截器
  http.interceptors.request.use(
    (config) => {
      // 从 localStorage 获取 token
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // 响应拦截器
  http.interceptors.response.use(
    (response) => {
      return response.data
    },
    (error) => {
      if (error.response?.status === 401) {
        // 未授权，跳转到登录页
        navigateTo('/login')
      }
      return Promise.reject(error)
    }
  )

  // 提供全局 http 实例
  nuxtApp.provide('http', http)
})
