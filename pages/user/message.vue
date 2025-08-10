<script setup lang="ts">
import { reactive } from "vue";
import { useUserApi } from "~/api";
import type { Notice } from "~/api";
import { formatTimestamp } from "~/utils/date";
import { useRouter } from "vue-router";
const router = useRouter();
const data: {
  current_page: number;
  page_size: number;
  total: number;
  list: Notice[];
} = reactive({
  current_page: 1,
  page_size: 10,
  total: 0,
  list: [],
});

function getNoticeList() {
  const { getNoticeList } = useUserApi();
  getNoticeList({
    page: data.current_page,
    page_size: data.page_size,
  }).then((res) => {
    data.list = res.data;
    data.total = res.total;
  });
}
getNoticeList();
function onChange() {
  getNoticeList();
}
</script>

<template>
  <div style="padding-top: 20px"></div>
  <a-breadcrumb>
    <a-breadcrumb-item href @click="router.push('/')">首页</a-breadcrumb-item>
    <a-breadcrumb-item>消息中心</a-breadcrumb-item>
  </a-breadcrumb>
  <div class="p-4 mt-4 bg-white">
    <div
      v-for="n in data.list"
      :key="n.id"
      class="my-2"
      style="
        display: flex;
        flex-direction: row;
        padding: 15px;
        background-color: rgba(0, 0, 0, 0.02);
      "
    >
      <img
        style="width: 60px; height: 60px"
        :src="'/images/user/msg-' + n.type + '.png'"
      />

      <div
        style="
          display: flex;
          flex-direction: column;
          margin-left: 10px;
          margin-top: 5px;
          width: 100%;
        "
      >
        <div class="flex items-center justify-between pb-2">
          <div style="font-size: 150%; font-weight: bold">{{ n.name }}</div>
          <div
            style="
              display: flex;
              flex-direction: row;
              justify-content: space-between;
            "
          >
            <div>{{ formatTimestamp(n.createtime) }}</div>
          </div>
        </div>
        <a-typography>
          <a-typography-paragraph
            :ellipsis="{
              rows: 1,
              expandable: true,
              symbol: '展开',
            }"
            :content="n.content"
          >
          </a-typography-paragraph>
        </a-typography>
      </div>
    </div>
  </div>
<div class="py-2">
  <a-pagination
    v-model:current="data.current_page"
    show-quick-jumper
    :total="data.total"
    @change="onChange"
  />
</div>

</template>

<style scoped>
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
</style>
