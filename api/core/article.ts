import type { BasicUserInfo } from '~/types'
import { useNuxtApp } from '#app'
import httpRequest from "~/utils/request";
export function useArticleApi() {
  const $request = httpRequest

  return {
    /**
     * 获取文章列表
     */
    getArticleList: (params: ArticleParams) =>
      $request.get<{ list: SaveArticle[], total: number }>('/user/articleList', params),

    /**
     * 获取文章详情
     */
    getArticleInfo: (params: { article_id: string }) =>
      $request.get<SaveArticle>('/article/info', params),

    /**
     * 获取文章类别
     */
    getArticleCategoryList: () =>
      $request.get<{ name: string; id: number }[]>('/article/categoryList'),

    /**
     * 删除文章
     */
    deleteArticle: (params: { article_id: string }) =>
      $request.post<any>('/user/deleteArticle', params),

    /**
     * 保存文章
     */
    saveArticle: (data: SaveArticle) =>
      $request.post<any>('/user/saveArticle', data),

    /**
     * 添加文章
     */
    createArticle: (data: Article) =>
      $request.post<any>('/user/createArticle', data),

    /**
     * 获取所有文章列表
     */
    getAllArticleList: (params: ArticleListParams) =>
      $request.get<{ list: SaveArticle[], total: number }>('/article/list', params),

    /**
     * 获取文章用户发布列表
     */
    getUserArticle: (params: { article_id: string }) =>
      $request.get<SaveArticle[]>('/article/getUserArticle', params)
  }
}

export interface Article {
  title: string;
  content: string;
  abstract: string;
  cover: string;
  status: '0' | '1' | '2';
  read_num: number;
  category_id: number | null;
  createtime: number;
  user_info: BasicUserInfo;
  prev: {
    article_id: number;
    title: string;
    status: number;
    status_text: string;
    publish_time_text: string;
  }
  next: {
    article_id: number;
    title: string;
    status: number;
    status_text: string;
    publish_time_text: string;
  }
}

export interface SaveArticle extends Article {
  article_id: string;
}

interface ArticleParams {
  user_id?: string;
  page?: number;
  page_size?: number;
}

interface Page {
  page: number
  page_size: number
}

export interface ArticleListParams extends Page {
  category_id?: number;
}
