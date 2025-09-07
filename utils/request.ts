// service/index.ts
import type { UseFetchOptions } from "nuxt/app";
import { useNuxtApp } from "#app";
import { useAccessStore } from '~/stores'; // 这里路径换成你的实际路径


type Methods = "GET" | "POST" | "DELETE" | "PUT";

export interface IResultData<T> {
  code: number;
  data: T;
  msg: string;
}

class HttpRequest {
  /**
   * 检查对象是否包含文件（支持嵌套）
   */
  private hasFile(obj: any): boolean {
    if (!obj || typeof obj !== 'object') return false;

    const hasFileCtor = typeof File !== 'undefined';
    const hasBlobCtor = typeof Blob !== 'undefined';

    for (const value of Object.values(obj)) {
      if (
        (hasFileCtor && value instanceof File) ||
        (hasBlobCtor && value instanceof Blob)
      ) {
        return true;
      }
      if (value && typeof value === 'object' && this.hasFile(value)) {
        return true;
      }
    }
    return false;
  }

  /**
   * 递归将对象转为 FormData
   */
  private toFormData(obj: any, formData = new FormData(), parentKey?: string) {
    Object.entries(obj).forEach(([key, value]) => {
      const fieldKey = parentKey ? `${parentKey}[${key}]` : key;

      if (value === null || value === undefined) return;

      if (
        (typeof File !== 'undefined' && value instanceof File) ||
        (typeof Blob !== 'undefined' && value instanceof Blob)
      ) {
        formData.append(fieldKey, value);
      } else if (Array.isArray(value)) {
        value.forEach((v, i) => this.toFormData(v, formData, `${fieldKey}[${i}]`));
      } else if (typeof value === 'object') {
        this.toFormData(value, formData, fieldKey);
      } else {
        formData.append(fieldKey, String(value));
      }
    });
    return formData;
  }

  async request<T = any>(
    url: string,
    method: Methods,
    data?: any,
    options?: UseFetchOptions<T>
  ) {
    const config = useRuntimeConfig();
    const BASE_URL = config.public.apiBase as string;
    const fullUrl = BASE_URL + url;
    const newOptions: any = {
      baseURL: BASE_URL,
      method,
      ...options,
      headers: {
        ...(options?.headers || {})
      }
    };

    // token 处理
    const accessStore = useAccessStore();
    const token = accessStore.getAccessToken();
    console.log('token', token, fullUrl);

    if (token) {
      newOptions.params = { ...(newOptions.query || {}), token };
    }

    // GET / DELETE 参数直接走 query
    if (method === 'GET' || method === 'DELETE') {
      newOptions.params = { ...(newOptions.params || {}), ...(data || {}) };
    }

    // POST / PUT 处理
    if (method === 'POST' || method === 'PUT') {
      if (process.client) {
        // 客户端检测文件
        if (data && typeof data === 'object' && this.hasFile(data)) {
          newOptions.body = this.toFormData(data);
          delete newOptions.headers['Content-Type']; // 让浏览器自动设置 boundary
        } else {
          newOptions.body = data;
        }
      } else {
        // SSR 阶段直接当 JSON 发
        newOptions.body = data;
      }
    }

    const nuxtApp = useNuxtApp();

    try {
      const responseData = await $fetch<IResultData<T>>(fullUrl, newOptions);
      console.log('responseData', responseData);

      return responseData.data;
    } catch (error: any) {
      let errorMessage = '服务端错误';

      if (error.response && error.response._data) {
        let data = error.response._data;
        const { code, msg } = error.response._data;

        if (code === 401) {
          if (process.client) {
            console.log('401');
            console.log('setLoginExpired6', fullUrl, newOptions);
            accessStore.setLoginExpired(true); // 只在客户端打开登录框
          }
        }
        if (typeof data === 'string') {
          try {
            data = JSON.parse(data);
          } catch {
            errorMessage = data;
          }
        }
        if (data.errors) {
          errorMessage = Object.values(data.errors)
            .map((msgs: any) => msgs.join(', '))
            .join('; ') || errorMessage;
        } else {
          errorMessage = data.message || errorMessage;
        }
      }

      if (process.client) {
        console.error(errorMessage);
      }

      // 特定错误码直接返回
      if (
        error.response &&
        [40001, 40002, 40003].includes(error.response._data.code)
      ) {
        return error.response._data;
      }

      throw error.response ? error.response._data : errorMessage;
    }
  }

  get<T = any>(url: string, params?: any, options?: UseFetchOptions<T>) {
    return this.request(url, 'GET', params, options);
  }
  post<T = any>(url: string, data?: any, options?: UseFetchOptions<T>) {
    return this.request(url, 'POST', data, options);
  }
  put<T = any>(url: string, data: any, options?: UseFetchOptions<T>) {
    return this.request(url, 'PUT', data, options);
  }
  delete<T = any>(url: string, params: any, options?: UseFetchOptions<T>) {
    return this.request(url, 'DELETE', params, options);
  }
}

const httpRequest = new HttpRequest();
export default httpRequest;
