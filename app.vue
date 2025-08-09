<script setup lang="ts">
import { ref, watch, computed } from "vue";
import type { MenuProps } from "ant-design-vue";
import { useUserApi } from "~/apis/user"
import { useAccessStore } from "~/stores/access"
const userApi = useUserApi()
const current = ref<string[]>(["mail"]);
const items = ref<MenuProps["items"]>([
  {
    key: "/",
    label: "首页",
    title: "首页",
  },
  {
    key: "/news",
    label: "资讯",
    title: "资讯",
  },
  {
    key: "/supervise",
    label: "监管",
    title: "监管",
  },
]);
const links = [
  "股市网",
  "广发证券网",
  "东方财富网",
  "经济网",
  "股市网",
  "广发证券网",
  "东方财富网",
  "经济网",
];
// 不要在应用启动时自动登录或请求用户信息
// 当检测到已存在的 token 时再请求用户信息
const accessStore = useAccessStore()
const accessToken = computed(() => accessStore.accessToken)
watch(
  () => accessToken.value,
  (newToken) => {
    if (newToken) {
      userApi.getUserInfo()
    }
  },
  { immediate: true }
)

const searchValue = ref("");

const router = useRouter();
const route = useRoute();
const contentStyle: any = ref({
  width: "1200px",
  margin: "0 auto",
});
watch(
  () => route.path,
  (newPath) => {
    if (newPath === "/") {
      contentStyle.value = {};
    } else {
      if (!contentStyle.value.width) {
        contentStyle.value = {
          width: "1200px",
          margin: "0 auto",
        };
      }
    }
  },
  {
    immediate: true,
  }
);
const themeConfig = {
  token: {
    colorPrimary: "#5f90ea",
  },
};
// const onLogin = () => {
//   accessStore.setLoginExpired(true);
// };
// const accessStore = useAccessStore();
// const accessToken = computed(() => {
//   return accessStore.accessToken;
// });
// const loginExpired = computed(() => {
//   return accessStore.loginExpired;
// });
// watch(
//   () => accessToken.value,
//   (newToken) => {
//     if (newToken) {
//       userStore.getUserInfo();
//     }
//   },
//   {
//     immediate: true,
//   }
// );

// const authStore = useAuthStore();
// function onLogout() {
//   authStore.logout();
// }

function handleEnterPressed(){
  console.log(122);
  
  // searchValue
  // router.push('/search')
}

const showArticle = ref(false);
</script>
<template>
  <a-config-provider :theme="themeConfig">
    <a-layout style="min-height: 100vh;">
      <a-layout-header
        class="header"
        :style="{ position: 'fixed', zIndex: 1, width: '100%',minWidth:'1530px'}"
      >
        <img src="/images/header/logo.png" alt="" srcset="" />
        <a-menu
          v-model:selectedKeys="current"
          mode="horizontal"
          :items="items"
          @click="(e: any) => router.push(e.key)"
        />
        <div class="right">
          <div @click="handleEnterPressed" class="flex items-center cursor-pointer">
            <a-input v-model:value="searchValue" class="pointer-events-none" readonly placeholder="请输入关键词搜索">
            <template #prefix>
              <search-outlined :style="{ fontSize: '20px', color: '#FFF' }" />
            </template>
          </a-input>
          </div>
          
          <img
            class="mx-4 cursor-pointer"
            src="/images/header/消息.png"
            alt=""
            srcset=""
            @click="router.push('/message')"
          />
          <a-button @click="showArticle = true">
            <template #icon
              ><img
                class="btn-icon"
                src="/images/header/发帖.png"
                alt=""
                srcset=""
            /></template>
            发帖
          </a-button>
          <div class="mx-4 vip-btn">
            <a-button ghost @click="router.push('/vip')">
              <template #icon>
                <img
                  class="btn-icon"
                  src="/images/header/vips.png"
                  alt=""
                  srcset=""
              /></template>
              会员中心
            </a-button>
          </div>
          <!-- <div class="mr-2 vip-btn" v-if="!accessToken">
            <a-button ghost @click="onLogin"> 登录/注册 </a-button>
          </div>
          <a-avatar :src="userStore.userInfo?.avatar" />
          <a-dropdown>
            <a class="ant-dropdown-link" @click.prevent>
              {{ userStore.userInfo?.nickname }}
              <DownOutlined />
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <span @click="router.push('/center')">个人信息</span>
                </a-menu-item>
                <a-menu-item>
                  <span @click="router.push('/invitation')">我的邀请</span>
                </a-menu-item>
                <a-menu-item>
                  <span @click="onLogout">退出登录</span>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown> -->
        </div>
      </a-layout-header>
      <a-layout-content class="flex-1">
        <div :style="contentStyle">
          <NuxtPage />
        </div>
      </a-layout-content>
      <a-layout-footer>
        <div class="text-sm text-white bg-gray-100">
          <!-- 顶部友情链接 -->
          <div class="mb-1 bg-white">
            <div class="flex items-center friendship-box">
              <div class="friendship">友情链接</div>
              <a
                v-for="(link, index) in links"
                :key="index"
                href="#"
                class="mx-2 hover:underline"
              >
                {{ link }}
              </a>
            </div>
          </div>

          <!-- 中间内容 -->
          <div class="flex center-box">
            <!-- 左侧LOGO -->
            <div class="flex-1 logo">
              <img src="/images/header/logo2x.png" alt="" srcset="" />
            </div>
            <!-- 其他栏目 -->

            <div class="flex-1 he-box">
              <h3
                class="mb-4 font-semibold"
                style="font-weight: bold; font-size: 16px"
                
              >
                加入我们
              </h3>
              <ul class="space-y-1">
                <li class="pb-1">
                  <a href="#" class="hover:underline" @click="router.push('/about')">关于我们</a>
                </li>
                <li class="pb-1">
                  <a href="#" class="hover:underline" @click="router.push('/about')">联系我们</a>
                </li>
                <li class="pb-1">
                  <a href="#" class="hover:underline" @click="router.push('/vip')">会员说明</a>
                </li>
              </ul>
            </div>
            <div class="flex-1 he-box">
              <h3
                class="mb-4 font-semibold"
                style="font-weight: bold; font-size: 16px"
              >
                帮助中心
              </h3>
              <ul class="space-y-1">
                <li class="pb-1">
                  <a href="#" class="hover:underline">常见问题</a>
                </li>
                <li class="pb-1">
                  <a href="#" class="hover:underline">使用帮助</a>
                </li>
              </ul>
            </div>
            <div class="flex-1 he-box">
              <img class="he-img" src="/images/header/logo.png" alt="" />
              <h3 class="mt-2 mb-2">咨询客服</h3>
            </div>
            <div class="flex-1 he-box">
              <img class="he-img" src="/images/header/logo.png" alt="" />
              <h3 class="mt-2 mb-2">商务合作</h3>
            </div>

            <div class="w-1/3 pr-4">
              <h3
                class="mb-2 font-semibold"
                style="font-weight: bold; font-size: 16px"
              >
                关于我们
              </h3>
              <p class="text-xs leading-5 text-gray-400">
                关于我们关于我们关于我们关于我们关于我们关于我们关于我们关于我们关于我们关于我们关于我们关于我们关于我们。
              </p>
            </div>
          </div>

          <!-- 底部版权信息 -->
          <div class="py-2 text-center text-gray-400 bg-gray-900">
            备案信息备案信息备案信息备案信息备案信息备案信息备案信息备案信息备案信息备案信息备案信息备案信息
          </div>
        </div>
      </a-layout-footer>
      <!-- <LoginModal v-if="!accessToken" v-model="loginExpired" /> -->
      <Article v-if="showArticle" v-model="showArticle" />
    </a-layout>
  </a-config-provider>
</template>
<style scoped lang="scss">
@use "~/assets/scss/main.scss";
.header {
  color: #fff;
  height: 60px;
  background: #5f90ea;
  display: flex;
  justify-content: space-between;
  align-items: center;
  h1 {
    font-weight: bold;
    font-size: 20px;
    color: #ffffff;
  }

  .right {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .btn-icon {
      display: inline;
      padding-right: 5px;
      padding-bottom: 4px;
    }
  }
  :deep(.ant-input-affix-wrapper) {
    width: 400px;
    height: 40px;
    background: #7fa6ee;
    border-radius: 4px 4px 4px 4px;
    border-color: #5f90ea;
  }
  :deep(.ant-input) {
    background: #7fa6ee;
  }
  :deep(.ant-input::placeholder) {
    color: #fff;
  }
}
/* 为内容区域添加顶部内边距 */
:deep(.ant-layout-content) {
  margin-top: 60px;
}

.vip-btn
  :where(.css-dev-only-do-not-override-1p3hq3p).ant-btn-default:not(
    :disabled
  ):hover {
  color: #fff;
}

:where(.ant-layout-footer) {
  padding: 0 !important;
}

.friendship-box {
  height: 36px;

  .friendship {
    position: relative;
    width: 88px;
    height: 26px;
    margin-right: 40px;
    line-height: 26px;
    text-align: center;
    background: #5f90ea;
  }

  .friendship::after {
    position: absolute;
    top: 50%;
    left: 100%;
    width: 0;
    height: 0;
    margin-top: -13px;
    content: "";
    border: 13px solid transparent;
    border-left-color: #5f90ea;
  }

  a {
    color: #888;
  }
}

.center-box {
  padding-top: 24px;
  background-color: #38404d;

  .logo {
    margin-right: 50px;
    margin-left: 30px;
  }

  .he-box {
    margin: 0 auto;
    text-align: center;

    .he-img {
      width: 95px;
      height: 95px;
      margin: 0 auto;
    }
  }
}
</style>