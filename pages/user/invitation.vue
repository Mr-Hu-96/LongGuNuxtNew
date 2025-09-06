<script setup lang="ts">
import { ref, computed } from "vue";
import { useUserApi } from "~/api";
import { useClipboard } from "@vueuse/core";
import { useUserStore } from "~/stores";
import { message } from "ant-design-vue";
import { formatTimestamp } from "~/utils/date";
import { useRouter } from "vue-router";
const router = useRouter();
const userStore = useUserStore();
const url = useRequestURL(); // SSR 阶段也有值
const domain = url.origin;

const invitationUrl = computed(() => {
  return domain + "?invite_code=" + userStore.userInfo?.id;
});

const tableList: any = ref([]);
const tableColumns = [
  {
    title: "头像",
    dataIndex: "avatar",
  },
  {
    title: "用户名",
    dataIndex: "username",
  },
  {
    title: "加入时间",
    dataIndex: "createtime",
  },
];
const {getInviteList} = useUserApi();
getInviteList({ page: 1, page_size: 5 }).then((res) => {
  tableList.value = res.data.map((item) => {
    return {
      avatar: item.avatar,
      username: item.invited.username,
      createtime: formatTimestamp(item.invited.createtime),
    };
  });
});

const { copy } = useClipboard({ legacy: true });
function onCopy(url: string) {
  copy(url);
  message.success("复制成功");
}
</script>

<template>
  <div style="padding-top: 20px"></div>
  <a-breadcrumb>
    <a-breadcrumb-item href @click="router.push('/')">首页</a-breadcrumb-item>
    <a-breadcrumb-item href @click="router.push('/vip')"
      >会员中心</a-breadcrumb-item
    >
    <a-breadcrumb-item>我的邀请</a-breadcrumb-item>
  </a-breadcrumb>
  <div class="bg-dark-700">
    <div
      style="
        padding-top: 40px;
        display: flex;
        flex-direction: row;
        align-items: center;
      "
    >
      <a-typography-title :level="4" style="padding-right: 8px"
        >你可以在下方手动生成邀请链接，将你的邀请链接发送给你的朋友，<span
          style="color: #ff6823"
          >邀请5人可获得月卡</span
        >，可以重复邀请</a-typography-title
      >
    </div>

    <div style="padding-top: 40px; display: flex; flex-direction: row">
      <a-input
        style="width: 100%"
        v-model:value="invitationUrl"
        :disabled="true"
      />
      <a-button type="primary" @click="onCopy(invitationUrl)"
        >复制链接</a-button
      >
    </div>
  </div>

  <div style="padding-top: 40px">
    <a-table :columns="tableColumns" :data-source="tableList" bordered>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'avatar'">
          <a-avatar :size="32" :src="record.avatar"></a-avatar>
        </template>
      </template>
    </a-table>
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
