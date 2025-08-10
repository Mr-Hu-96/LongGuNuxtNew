<template>
  <div>
    <div
      class="flex items-center w-full h-[140px] bg-white p-4 rounded-sm shadow my-2"
    >
      <!-- 头像 -->
      <a-avatar :size="100" :src="userInfo?.avatar" />

      <!-- 右侧内容 -->
      <div class="ml-4 flex flex-col flex-1">
        <!-- 用户名和标签 -->
        <div class="flex items-center mt-2">
          <span class="text-lg font-semibold">{{ userInfo?.nickname }}</span>
          <img src="/images/user/vip1.png" alt="vip" class="px-2 py-1" />
          <span class="text-gray-500 text-sm"
            >到期时间：{{
              formatTimestamp(userInfo?.vip_info?.expiretime)
            }}</span
          >
        </div>

        <!-- ID 和其他信息 -->
        <div class="flex items-center text-gray-600 text-sm my-3">
          <span>ID: {{ userInfo?.id }}</span>
          <span class="ml-4 flex items-center"> 📌 {{ userInfo?.email }} </span>
          <span class="ml-4 flex items-center">
            📞 {{ userInfo?.mobile }}
          </span>
        </div>

        <!-- 简介 -->
        <p class="text-gray-500 text-sm">{{ userInfo?.brief }}</p>
      </div>
    </div>
    <div class="bg-white px-4 rounded-sm shadow my-2">
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="文章">
          <div class="article">
            <div
              v-if="articleData.list.length === 0"
              class="flex items-center flex-col mt-2 py-4"
            >
              <img class="pt-[48px]" src="/images/user/empty.png" alt="empty" />
              <div class="py-10">这里什么都没有~</div>
            </div>
            <div v-else class="pb-4">
              <div v-for="item in articleData.list" :key="item.article_id">
                <div
                  class="flex w-full h-[120px] bg-white p-4 rounded-sm shadow my-2 cursor-pointer"
                  @click="
                    router.push('/consultDetail?article_id=' + item.article_id)
                  "
                >
                  <img
                    :src="item.cover"
                    alt="list"
                    class="h-[90px] w-[150px]"
                  />
                  <div class="ml-4 flex flex-col flex-1">
                    <div class="flex items-center mt-2">
                      <div class="list-title">{{ item.title }}</div>
                    </div>

                    <div class="mt-4 flex items-center text-gray-600">
                      <img src="/images/user/time.png" alt="时间" />
                      <div class="pr-8">
                        {{
                          formatTimestamp(
                            item.createtime,
                            "YYYY-MM-DD HH:mm:ss"
                          )
                        }}
                      </div>
                      <img src="/images/user/view.png" alt="时间" />
                      <div>{{ item.read_num }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <a-pagination
                v-model:current="articleData.page"
                show-quick-jumper
                :total="articleData.total"
                @change="onChange"
              />
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="基本信息" force-render
          ><div class="pl-12 info">
            <!-- 头像和修改按钮 -->
            <div class="flex items-center space-x-4">
              <div class="font-semibold">头&emsp;&emsp;&emsp;像</div>
              <img
                :src="userInfo.avatar"
                alt="头像"
                class="w-16 h-16 rounded-full object-cover"
              />
            </div>

            <!-- 用户信息 -->
            <div class="mt-6 gap-4 text-gray-700">
              <div class="flex">
                <div class="font-semibold left-name">用户昵称</div>
                <span>{{ userInfo.nickname }}</span>
              </div>
              <div class="flex">
                <span class="font-semibold left-name">注册时间</span>
                <span>{{ formatTimestamp(userInfo.registertime) }}</span>
              </div>
              <div class="flex">
                <span class="font-semibold left-name">手机号码</span>
                <span>{{ userInfo.mobile }}</span>
              </div>
              <div class="flex">
                <span class="font-semibold left-name">微信号</span>
                <span>{{ userInfo.wechat }}</span>
              </div>
              <div class="flex">
                <span class="font-semibold left-name">QQ 号</span>
                <span>{{ userInfo.qq }}</span>
              </div>
              <div class="flex">
                <span class="font-semibold left-name">邮箱</span>
                <span>{{ userInfo.email }}</span>
              </div>
              <div class="flex">
                <span class="font-semibold left-name">个人简介</span>
                <p class="text-gray-600">{{ userInfo.brief }}</p>
              </div>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";

import type { BasicUserInfo } from "@/types/user";

import { formatTimestamp } from "@/utils/date";
import { useRouter, useRoute } from "vue-router";
import { useArticleApi, useUserApi } from "~/api";
import type { SaveArticle } from "~/api";

const router = useRouter();

const userInfo = ref<any>({});
const userId = ref("");
const route = useRoute();

const activeKey = ref("1");

const onChange = () => {
  getArticleList();
};

const articleData: pageObj<SaveArticle> = reactive({
  list: [],
  total: 0,
  page: 1,
  page_size: 10,
});
function getArticleList() {
  const { getArticleList } = useArticleApi();
  getArticleList({   
    page: articleData.page,
    page_size: articleData.page_size,
    user_id: userId.value,
  })
    .then((res) => {
      if (res && res.list) {
        articleData.list = res.list;
        articleData.total = res.total;
      }
    })
    .catch(() => {
      articleData.list = [];
      articleData.total = 0;
    });
}

if (route.query.user_id) {
  userId.value = route.query.user_id as string;
  const { getUserInfo } = useUserApi();
  getUserInfo({ user_id: route.query.user_id as string }).then((res) => {
    if (res) {
      userInfo.value = res as BasicUserInfo;
    }
  });
  getArticleList();
}
</script>
<style scoped lang="scss">
.article {
  .list-title {
    font-weight: bold;
    font-size: 14px;
    color: #222222;
  }
  .controls {
    :deep(.ant-btn) {
      color: #999;
      display: flex;
    }
  }
}

.info {
  .left-name {
    width: 100px;
    padding-right: 30px;
    text-align: justify;
  }

  .left-name::after {
    display: inline-block;
    width: 100%;
    content: "";
  }
}
.avatar-uploader > :deep(.ant-upload) {
  width: 128px;
  height: 128px;
}
.avatar-uploader :deep(.ant-upload-select-picture-card) i {
  font-size: 32px;
  color: #999;
}

.avatar-uploader :deep(.ant-upload-select-picture-card) .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
