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
     * 检查对象是否包含文件
     */
    private hasFile(obj: any): boolean {
      if (!obj || typeof obj !== 'object') return false;
      
      for (const value of Object.values(obj)) {
        if (value instanceof File || value instanceof Blob) {
          return true;
        }
        if (value && typeof value === 'object' && this.hasFile(value)) {
          return true;
        }
      }
      return false;
    }

    async request<T = any>(
      url: string,
      method: Methods,
      data?: any,
      options?: UseFetchOptions<T>
    ) {
      const config = useRuntimeConfig();
      const BASE_URL = config.public.apiBase as string;

      // 拼装请求配置
      const newOptions: any = {
        baseURL: BASE_URL,
        method,
        ...options,
        headers: {
          ...(options?.headers || {})
        }
      };
      const accessStore = useAccessStore();
      const token = accessStore.getAccessToken();
      
      if (token) {
        // 把 token 放到 query 参数里
        if (!newOptions.params) {
          newOptions.params = {};
        }
        newOptions.params.token = token;
      }
      if (method === "GET" || method === "DELETE") {
        newOptions.params = {
          ...(newOptions.params || {}),
          ...(data || {})
        };
      }
      if (method === "POST" || method === "PUT") {
        // 检查是否包含文件对象，如果有则转换为 FormData
        if (data && typeof data === 'object' && this.hasFile(data)) {
          const formData = new FormData();
          Object.entries(data).forEach(([key, value]) => {
            if (value instanceof File || value instanceof Blob) {
              formData.append(key, value);
            } else if (value !== null && value !== undefined) {
              formData.append(key, String(value));
            }
          });
          newOptions.body = formData;
          // 不要设置 Content-Type，让浏览器自动设置 boundary
          delete newOptions.headers['Content-Type'];
        } else {
          newOptions.body = data;
        }
      }

      const nuxtApp = useNuxtApp();

      try {
        let responseData: any;

        if (process.client && !nuxtApp.isHydrating) {
          // 客户端正常阶段 → 用 nuxtApp.$request

          responseData = await $fetch(url, newOptions);
          console.log(responseData);
        } else {
          // SSR 或 hydration 阶段 → 用 $fetch（直接返回最终数据）
          responseData = await $fetch<IResultData<T>>(url, newOptions);
        }

        return responseData.data;
      } catch (error: any) {
        let errorMessage = "服务端错误";

        if (error.response && error.response._data) {
          let data = error.response._data;
          if (typeof data === "string") {
            try {
              data = JSON.parse(data);
            } catch {
              errorMessage = data;
            }
          }
          if (data.errors) {
            const errorMessages = [];
            for (const key in data.errors) {
              errorMessages.push(`${data.errors[key].join(", ")}`);
            }
            errorMessage = errorMessages.join("; ") || errorMessage;
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
      return this.request(url, "GET", params, options);
    }

    post<T = any>(url: string, data?: any, options?: UseFetchOptions<T>) {
      return this.request(url, "POST", data, options);
    }

    put<T = any>(url: string, data: any, options?: UseFetchOptions<T>) {
      return this.request(url, "PUT", data, options);
    }

    delete<T = any>(url: string, params: any, options?: UseFetchOptions<T>) {
      return this.request(url, "DELETE", params, options);
    }
  }

  const httpRequest = new HttpRequest();
  export default httpRequest;
