# Plugins 插件文档

本项目包含以下插件，用于增强应用功能：

## 插件列表

### 1. antd.client.ts - Ant Design Vue 配置插件
- **功能**: 配置 Ant Design Vue 的中文语言包和主题
- **使用方式**: 自动加载，无需手动调用
- **提供**: `antdLocale`, `antdTheme`

### 2. axios.client.ts - HTTP 请求插件
- **功能**: 配置 axios 实例，包含请求/响应拦截器
- **使用方式**: 
```typescript
// 在组件中使用
const { $http } = useNuxtApp()
const data = await $http.get('/api/users')
```
- **提供**: `http` - axios 实例

### 3. utils.client.ts - 工具函数插件
- **功能**: 提供常用的工具函数
- **使用方式**:
```typescript
const { $formatDate, $debounce, $throttle, $deepClone, $generateId } = useNuxtApp()

// 格式化日期
const formattedDate = $formatDate(new Date(), 'YYYY-MM-DD')

// 防抖函数
const debouncedSearch = $debounce(searchFunction, 300)

// 节流函数
const throttledScroll = $throttle(scrollFunction, 100)

// 深拷贝
const clonedObject = $deepClone(originalObject)

// 生成随机ID
const id = $generateId(10)
```

### 4. auth.client.ts - 认证管理插件
- **功能**: 管理用户认证状态和用户信息
- **使用方式**:
```typescript
const { 
  $isAuthenticated, 
  $getToken, 
  $setToken, 
  $clearToken, 
  $logout, 
  $getUserInfo, 
  $setUserInfo 
} = useNuxtApp()

// 检查是否已登录
if ($isAuthenticated()) {
  // 用户已登录
}

// 获取用户信息
const userInfo = $getUserInfo()

// 登出
$logout()
```

### 5. global-components.client.ts - 全局组件插件
- **功能**: 注册全局组件
- **提供组件**:
  - `LoadingSpinner` - 加载动画组件
  - `EmptyState` - 空状态组件
  - `ErrorBoundary` - 错误边界组件

### 6. route-guard.client.ts - 路由守卫插件
- **功能**: 处理路由守卫和导航
- **使用方式**:
```typescript
const { $requireAuth, $redirectToLogin, $hasPermission } = useNuxtApp()

// 检查是否需要认证
if ($requireAuth(to)) {
  // 需要登录
}

// 检查权限
if ($hasPermission('admin')) {
  // 有管理员权限
}
```

## 插件使用示例

### 在页面中使用插件

```vue
<template>
  <div>
    <LoadingSpinner v-if="loading" />
    <EmptyState v-else-if="!data.length" message="暂无数据" />
    <div v-else>
      <!-- 内容 -->
    </div>
  </div>
</template>

<script setup>
const { $http, $formatDate, $isAuthenticated } = useNuxtApp()

const loading = ref(true)
const data = ref([])

onMounted(async () => {
  if ($isAuthenticated()) {
    try {
      data.value = await $http.get('/api/data')
    } catch (error) {
      console.error('获取数据失败:', error)
    } finally {
      loading.value = false
    }
  }
})
</script>
```

### 在组件中使用工具函数

```vue
<template>
  <div>
    <input @input="handleSearch" placeholder="搜索..." />
    <p>最后更新: {{ formattedDate }}</p>
  </div>
</template>

<script setup>
const { $debounce, $formatDate } = useNuxtApp()

const formattedDate = computed(() => $formatDate(new Date(), 'YYYY-MM-DD HH:mm'))

const handleSearch = $debounce((event) => {
  // 搜索逻辑
  console.log('搜索:', event.target.value)
}, 300)
</script>
```

## 注意事项

1. 所有插件都标记为 `.client.ts`，表示只在客户端运行
2. 插件会自动注册，无需手动导入
3. 使用 `useNuxtApp()` 来访问插件提供的功能
4. 确保在使用插件前检查客户端环境（`process.client`）

## 扩展插件

如需添加新插件，请遵循以下规范：

1. 文件名使用 `.client.ts` 或 `.server.ts` 后缀
2. 使用 `defineNuxtPlugin()` 定义插件
3. 通过 `provide` 提供功能
4. 添加适当的类型定义
5. 更新此文档
