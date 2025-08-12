import { useNuxtApp } from '#app'
import httpRequest from "~/utils/request";
export function useHelpApi() {
  const $request = httpRequest

  return {
    /**
     * 获取帮助列表
     */
    getHelpList: () =>
      $request.get<HelpModel>('/help/list')
  }
}

export interface HelpModelList {
  id: number;
  title: string;
  content: string;
  create_time: string;
}

interface HelpModel {
  list: HelpModelList[]
  total: number
}
