// service/index.ts
import type { UseFetchOptions } from "nuxt/app";
import { useNuxtApp } from "#app";

type Methods = "GET" | "POST" | "DELETE" | "PUT";

export interface IResultData<T> {
  code: number;
  data: T;
  msg: string;
}

class HttpRequest {
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

    const token = useCookie("token");
    if (token.value) {
      newOptions.headers.Authorization = `Bearer ${token.value}`;
    }

    if (method === "GET" || method === "DELETE") {
      newOptions.params = data;
    }
    if (method === "POST" || method === "PUT") {
      newOptions.body = data;
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
