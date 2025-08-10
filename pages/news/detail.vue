<script setup lang="ts">
import { ref, watch } from "vue";
import { useArticleApi } from "~/api";
import { useRoute, useRouter } from "vue-router";
import type { SaveArticle } from "~/api";
import { formatTimestamp } from "@/utils/date";

import {
  FieldTimeOutlined,
  EyeOutlined,
  UserOutlined,
} from "@ant-design/icons-vue";

const route = useRoute();
const router = useRouter();

const article_id = route.query.article_id as string;
const articleData = ref<SaveArticle>({} as SaveArticle);
const userArticleList = ref<SaveArticle[]>([]);
watch(
  () => route.query,
  ({ article_id }) => {
    getData(article_id as string);
  }
);
getData(article_id);
function getData(article_id: string) {
  const { getArticleInfo, getUserArticle } = useArticleApi();
  getArticleInfo({ article_id }).then((res) => {
    if (res) {
      articleData.value = res;
    }
  });
  getUserArticle({ article_id }).then((res) => {
    if (res) {
      userArticleList.value = res;
    }
  });
}
</script>

<template>
  <div style="padding-top: 20px"></div>
  <a-breadcrumb>
    <a-breadcrumb-item href @click="router.push('/')">首页</a-breadcrumb-item>
    <a-breadcrumb-item href @click="router.push('/news')"
      >资讯中心</a-breadcrumb-item
    >
    <a-breadcrumb-item>文章详情</a-breadcrumb-item>
  </a-breadcrumb>
  <div
    style="
      margin-top: 20px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    "
  >
    <div class="flex-1">
      <div class="bg-white p-4">
        <div style="font-size: 150%; font-weight: bold">
          {{ articleData.title }}
        </div>
        <div
          class="pt-4"
          style="width: 100%; display: flex; flex-direction: row; color: #999"
        >
          <div>
            <UserOutlined />
            {{ articleData?.user_info?.nickname }}
          </div>
          <div style="margin-left: 50px">
            <FieldTimeOutlined /> {{ formatTimestamp(articleData.createtime) }}
          </div>
          <div style="margin-left: 50px">
            <EyeOutlined /> {{ articleData.read_num }}
          </div>
        </div>
      </div>

      <div
        class="mt-2 bg-white p-4 html-box"
        v-html="articleData.content"
      ></div>
      <div class="mt-2 bg-white p-4">
        <span class="text-[#5F90EA]"> 版权及免责声明：</span
        >本文内容由入驻龙股网的作者自发贡献，该文观点仅代表作者本人，与本网站立场无关，不对您构成任何投资建议。用户应基于自己的独立判断，自行决策投资行为并承担全部风险。本站仅提供信息存储空间服务，不拥有所有权，不承担相关法律责任。如发现本站有涉嫌抄袭侵权/违法违规的内容，请发送邮件至26688@qq.com
        举报，一经查实，本站将立刻删除。
      </div>
      <div
        style="
          margin-top: 20px;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        "
      >
        <div
          v-if="articleData.prev"
          class="left_or_right_button cursor-pointer"
          @click="
            router.push(
              '/consultDetail?article_id=' + articleData.prev?.article_id
            )
          "
        >
          上一篇：{{ articleData.prev?.title }}
        </div>
        <div
          v-if="articleData.next"
          class="left_or_right_button cursor-pointer"
          @click="
            router.push(
              '/consultDetail?article_id=' + articleData.next?.article_id
            )
          "
        >
          下一篇：{{ articleData.next?.title }}
        </div>
      </div>
    </div>
    <div class="w-[230px] pl-4">
      <div class="bg-white p-2">
        <div
          class="flex cursor-pointer"
          @click="router.push('/info?user_id=' + articleData.user_info.id)"
        >
          <a-avatar :size="60" :src="articleData?.user_info?.avatar"></a-avatar>
          <div style="display: flex; flex-direction: column; margin-left: 10px">
            <div class="mt-2">{{ articleData?.user_info?.nickname }}</div>
            <div style="margin-top: 10px; color: #999999">
              id: {{ articleData?.user_info?.id }}
            </div>
          </div>
        </div>
        <div
          style="
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            margin-top: 20px;
          "
        >
          <div
            style="
              display: flex;
              flex-direction: column;
              align-items: center;
              margin-left: 40px;
            "
          >
            <div class="text-[#999999]">文章</div>
            <div class="font-bold mt-4">
              {{ articleData?.user_info?.article_num }}
            </div>
          </div>
          <div
            style="
              display: flex;
              flex-direction: column;
              align-items: center;
              margin-right: 40px;
            "
          >
            <div class="text-[#999999]">浏览量</div>
            <div class="font-bold mt-4">
              {{ articleData?.user_info?.user_visit_num }}
            </div>
          </div>
        </div>
      </div>
      <div class="bg-white mt-2 p-2">
        <div
          style="
            margin-top: 10px;
            margin-left: 10px;
            border-left: #5f90ea 5px solid;
          "
          class="pl-3"
        >
          最新发布
        </div>
        <div
          style="
            display: flex;
            flex-direction: column;
            margin-left: 20px;
            margin-top: 10px;
          "
        >
          <div
            v-for="item in userArticleList"
            class="cursor-pointer"
            style="margin-top: 20px"
            @click="router.push('/consultDetail?article_id=' + item.article_id)"
          >
            {{ item.title }}
          </div>
        </div>
      </div>
    </div>
  </div>

  <div style="padding-top: 40px"></div>
</template>

<style scoped>
textarea {
  border-radius: 0px;
  padding: 5px;
}
.ant-input {
  background-color: white;
  color: black;
  border-radius: 0px;
}

.ant-btn {
  width: 180px;
  height: 50px;
}
.ant-btn-default {
  background-color: #ff6823;
  color: white;
}

.left_or_right_button {
  background-color: white;
  padding-left: 30px;
  padding-right: 30px;
  padding-top: 10px;
  padding-bottom: 10px;
}
</style>
<style>
.html-box p {
  line-height: 30px;
  font-size: 18px;
}
</style>
