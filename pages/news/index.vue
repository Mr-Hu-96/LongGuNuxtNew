<script setup lang="ts">
import { reactive, ref } from "vue";

import { FieldTimeOutlined, EyeOutlined } from "@ant-design/icons-vue";
import { formatTimestamp } from "~/utils/date";
import { useArticleApi, useSystemApi } from "~/api";
import type { SaveArticle } from "~/api";
import { setTDK } from "~/utils";
import { useRouter } from "vue-router";
const router = useRouter();
const articleData: pageObj<SaveArticle> = reactive({
  list: [],
  total: 0,
  page: 1,
  page_size: 10,
});
const categoryId = ref();
function onChange() {
  getArticleList();
}

const categoryList = ref<{ value: number; label: string }[]>([]);
function onTabChange() {
  getArticleList();
}
getArticleCategoryList();
function getArticleCategoryList() {
  const { getArticleCategoryList } = useArticleApi();
  getArticleCategoryList().then((res) => {
    if (res) {
      categoryList.value = res.map((item) => {
        return {
          value: item.id,
          label: item.name,
        };
      });
      categoryId.value = categoryList.value[0].value;
      getArticleList();
    }
  });
}
function getArticleList() {
  const { getAllArticleList } = useArticleApi();
  getAllArticleList({
    page: articleData.page,
    page_size: articleData.page_size,
    category_id: categoryId.value,
  }).then((res) => {
    if (res && res.list) {
      articleData.list = res.list;
      articleData.total = res.total;
    }
  });
}
const { getTdk } = useSystemApi();
getTdk({ module_type: "首页" }).then((res) => {
  if (res) {
    const { title, description, keyword } = res;
    setTDK({ title, description, keyword });
  }
});
</script>

<template>
  <div style="padding-top: 20px"></div>
  <div class="news-container">
    <a-tabs v-model:activeKey="categoryId" @change="onTabChange">
      <a-tab-pane
        v-for="item in categoryList"
        :key="item.value"
        :tab="item.label"
      >
      </a-tab-pane>
    </a-tabs>
    <div
      v-if="articleData.list.length === 0"
      class="flex items-center flex-col mt-2 py-4"
    >
      <img class="pt-[48px]" src="/images/user/empty.png" alt="empty" />
      <div class="py-10">这里什么都没有，赶紧创作吧~</div>
    </div>
    <div
      v-for="item in articleData.list"
      :key="item.article_id"
      class="mb-2 h-[160px] flex flex-row bg-[#fff] p-4 cursor-pointer"
      @click="router.push('/consultDetail?article_id=' + item.article_id)"
    >
      <div
        style="
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        "
      >
        <div>
          <a-avatar :src="item.user_info.avatar"></a-avatar>
          {{ item.user_info.nickname }}
        </div>
        <div>
          <a-typography-title :level="5" style="">{{
            item.title
          }}</a-typography-title>
          <div style="padding-top: 2px" v-html="item.abstract"></div>
        </div>
        <div
          style="width: 100%; display: flex; flex-direction: row; color: #999"
        >
          <div>
            <FieldTimeOutlined /> {{ formatTimestamp(item.createtime) }}
          </div>
          <div style="margin-left: 100px">
            <EyeOutlined /> {{ item.read_num }}
          </div>
        </div>
      </div>
      <img style="height: 100%; width: 250px" :src="item.cover" />
    </div>
  </div>
  <div class="py-2">
    <a-pagination
      v-model:current="articleData.page"
      show-quick-jumper
      :total="articleData.total"
      @change="onChange"
    />
  </div>
</template>

<style scoped lang="scss">
.news-container {
  :deep(.ant-tabs-nav-wrap) {
    padding-left: 20px;
    background-color: white;
  }
}
.ant-input {
  background-color: white;
  color: black;
  height: 50px;
}

.ant-btn {
  width: 180px;
  height: 50px;
}
.ant-btn-default {
  background-color: #ff6823;
  color: white;
}
.card {
  width: 260px;
  height: 100px;
}

.container {
  position: relative;
  text-align: center;
  width: 100%;
  height: 100%;
}
.background_image {
  position: absolute;
  left: 0px;
  right: 0px;
}
.floating_things_above_image {
  position: absolute;
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: row;
  align-items: center;
}
.one_line_in_a_card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  color: white;
  font-weight: bold;
  font-size: 120%;
}
.order_now {
  width: 150px;
  height: 40px;
}
</style>
