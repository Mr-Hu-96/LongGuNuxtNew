// utils/request.ts

import { useAccessStore } from '~/stores'
import { message } from 'ant-design-vue'

export interface RequestOptions {
  params?: Record<string, any>     // GET/DELETE 参数
  body?: any                       // POST/PUT 数据
  headers?: HeadersInit            // 自定义请求头
  auth?: boolean                   // 是否附带 token，默认 true
}

/**
 * 通用请求方法
 */
async function coreRequest<T>(
  url: string,
  method: 'get' | 'post' | 'put' | 'delete',
  options: RequestOptions = {}
): Promise<T | null> {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase as string
  const accessStore = useAccessStore()
  const token = accessStore.getAccessToken()
  try {
    const { data, error } = await useFetch<T>(baseURL + url, {
      method: method as any, // 避免类型冲突
      onRequest({ request, options }) {
        // 设置请求头
        // 请注意，这依赖于 ofetch >= 1.4.0 - 您可能需要刷新您的锁文件
        options.headers.set('Authorization', "Bearer "+accessStore.getAccessToken())
      },
      query: method === 'get' || method === 'delete' ? getFormData(options.params,token) : getFormData({},token),
      body: method === 'post' || method === 'put' ? getFormData(options.body,token) ?? getFormData(options.params,token) : null,
      watch: false,
      key: `${method}:${url}:${JSON.stringify(options.params || options.body || '')}`,
    })

    if (error.value) throw error.value
    return data.value as T
  } catch (err: any) {
    if (process.client) {
      const msg = err?.data?.message || err.message || '请求失败'
      message.error(msg)
    }
    return null
  }
}

function getFormData(obj: Record<string, any>,token: string) {


  const formData = new FormData()
  formData.append('token',token )
  if (!obj) return formData
  for (const [key, value] of Object.entries(obj)) {
    console.log(key, value);

    formData.append(key, value)
  }
  console.log(obj, formData);
  return formData
}

export const request = {
  get: <T>(url: string, params?: RequestOptions['params'], options?: Omit<RequestOptions, 'params'>) =>
    coreRequest<T>(url, 'get', { ...options, params }),

  post: <T>(url: string, body?: RequestOptions['body'], options?: Omit<RequestOptions, 'body'>) =>
    coreRequest<T>(url, 'post', { ...options, body }),

  put: <T>(url: string, body?: RequestOptions['body'], options?: Omit<RequestOptions, 'body'>) =>
    coreRequest<T>(url, 'put', { ...options, body }),

  delete: <T>(url: string, params?: RequestOptions['params'], options?: Omit<RequestOptions, 'params'>) =>
    coreRequest<T>(url, 'delete', { ...options, params }),
}
