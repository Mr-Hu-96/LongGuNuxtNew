export default defineNuxtPlugin(() => {
  return {
    provide: {
      // 格式化日期
      formatDate: (date: Date | string, format = 'YYYY-MM-DD HH:mm:ss') => {
        const d = new Date(date)
        const year = d.getFullYear()
        const month = String(d.getMonth() + 1).padStart(2, '0')
        const day = String(d.getDate()).padStart(2, '0')
        const hours = String(d.getHours()).padStart(2, '0')
        const minutes = String(d.getMinutes()).padStart(2, '0')
        const seconds = String(d.getSeconds()).padStart(2, '0')
        
        return format
          .replace('YYYY', String(year))
          .replace('MM', month)
          .replace('DD', day)
          .replace('HH', hours)
          .replace('mm', minutes)
          .replace('ss', seconds)
      },
      
      // 防抖函数
      debounce: (func: Function, wait: number) => {
        let timeout: NodeJS.Timeout
        return function executedFunction(...args: any[]) {
          const later = () => {
            clearTimeout(timeout)
            func(...args)
          }
          clearTimeout(timeout)
          timeout = setTimeout(later, wait)
        }
      },
      
      // 节流函数
      throttle: (func: Function, limit: number) => {
        let inThrottle: boolean
        return function executedFunction(...args: any[]) {
          if (!inThrottle) {
            func.apply(this, args)
            inThrottle = true
            setTimeout(() => inThrottle = false, limit)
          }
        }
      },
      
      // 深拷贝
      deepClone: <T>(obj: T): T => {
        if (obj === null || typeof obj !== 'object') return obj
        if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T
        if (obj instanceof Array) return obj.map(item => item) as unknown as T
        if (typeof obj === 'object') {
          const clonedObj = {} as T
          for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
              clonedObj[key] = obj[key]
            }
          }
          return clonedObj
        }
        return obj
      },
      
      // 生成随机ID
      generateId: (length = 8) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        let result = ''
        for (let i = 0; i < length; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        return result
      }
    }
  }
})
