import { defineNuxtPlugin } from '#app'

// Pinia 持久化插件 - 手动实现版本
export default defineNuxtPlugin(() => {
  if (process.client) {
    // 手动实现持久化功能
    const { $pinia } = useNuxtApp()
    
    if ($pinia) {
      // 为每个 store 添加持久化功能
      $pinia.use(({ store }) => {
        // 检查 store 是否有 persist 配置
        if (store.$id && store.$state && typeof store.$state === 'object') {
          const storeName = store.$id
          const storageKey = `pinia-${storeName}`
          
          // 从 localStorage 恢复状态
          const savedState = localStorage.getItem(storageKey)
          if (savedState) {
            try {
              const parsedState = JSON.parse(savedState)
              Object.assign(store.$state, parsedState)
            } catch (error) {
              console.warn(`恢复 store ${storeName} 状态失败:`, error)
            }
          }
          
          // 监听状态变化并保存到 localStorage
          store.$subscribe((mutation, state) => {
            localStorage.setItem(storageKey, JSON.stringify(state))
          })
        }
      })
      
      console.log('Pinia 持久化插件已手动配置')
    }
  }
})