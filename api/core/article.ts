import { requestClient } from '@/api/request';
import type { BasicUserInfo } from '@/types';
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

/**
 * 获取文章列表
 */
interface ArticleParams extends Page {
    user_id?: string;
}
export function getArticleListApi(params: ArticleParams) {
    return requestClient.get<{ list: SaveArticle[], total: number }>('/user/articleList', { params })
}

/**
 * 获取文章详情
 */
export function getArticleInfoApi(params: { article_id: string }) {
    return requestClient.get<SaveArticle>('/article/info', { params })
}

/**
 * 获取文章类别
 */
export function getArticleCategoryListApi() {
    return requestClient.get<{ name: string; id: number }[]>('/article/categoryList')
}

/**
 * 删除文章
 */
export function deleteArticleApi(params: { article_id: string }) {
    return requestClient.post<any>('/user/deleteArticle', params)
}

/**
 * 保存文章
 */
export function saveArticleApi(data: SaveArticle) {
    return requestClient.post<any>('/user/saveArticle', data)
}

/**
 * 添加文章
 */
export function createArticleApi(data: Article) {
    return requestClient.post<any>('/user/createArticle', data)
}

/**
 * 获取所有文章列表
 */

export interface ArticleListParams extends Page {
    category_id?: number;
}
export function getAllArticleListApi(params: ArticleListParams) {
    return requestClient.get<{ list: SaveArticle[], total: number }>('/article/list', { params })
}

/**
 * 获取文章用户发布列表
 */
export function getUserArticleApi(params: { article_id: string }) {
    return requestClient.get<SaveArticle[]>('/article/getUserArticle', { params })
}