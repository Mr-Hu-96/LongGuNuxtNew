import type {
    ApplicationConfig,
    VbenAdminProAppConfigRaw,
} from '@/types/global';

/**
 * 由 vite-inject-app-config 注入的全局配置
 */
export function useAppConfig(
    env: Record<string, any>,
    isProduction: boolean,
): ApplicationConfig {
    // 生产环境下，直接使用 window._VBEN_ADMIN_PRO_APP_CONF_ 全局变量
    const config = isProduction
        ? window._VBEN_ADMIN_PRO_APP_CONF_
        : (env as VbenAdminProAppConfigRaw);

    if (!config) {
       return {
            apiURL: 'https://api.longgu.com/api',
        }
        // throw new Error(isProduction 
        //     ? 'window._VBEN_ADMIN_PRO_APP_CONF_ is not defined' 
        //     : 'env config is not provided');
    }

    if (!config.VITE_GLOB_API_URL) {
        console.warn('VITE_GLOB_API_URL is not configured');
    }

    const { VITE_GLOB_API_URL = '/api' } = config;

    return {
        apiURL: VITE_GLOB_API_URL,
    };
}
