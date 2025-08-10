<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { getHelpListApi } from "@/api";
import type { HelpModelList } from "@/api";
import { useRoute } from "vue-router";

const tabIndex = ref(0);
const tabList = ref<HelpModelList[]>([]);
const router = useRoute();

function updateTabIndexByQuery() {
  const queryType = router.query.type;
  if (!queryType || tabList.value.length === 0) return;

  const target = tabList.value.find(item => item.title === queryType);
  tabIndex.value = target?.id || tabList.value[0].id;
}

// 初始化数据
getHelpListApi()
  .then((res) => {
    tabList.value = res.list || [];
    if (tabList.value.length > 0) {
      updateTabIndexByQuery(); // 初次判断
    }
  })
  .catch(() => {
    tabList.value = [
      {
        id: 1,
        title: "暂无帮助1",
        content: "暂无帮助1",
        create_time: "",
      },
    ];
    tabIndex.value = tabList.value[0].id;
  });

// 监听路由 query.type 变化
watch(() => router.query.type, () => {
  updateTabIndexByQuery();
});

function getContentData(id: number) {
  if (!id) return "";
  return tabList.value.find(item => item.id === id)?.content || "";
}

const ContentData = computed(() => getContentData(tabIndex.value));
</script>

<template>
  <div
    class="py-6"
    style="display: flex; flex-direction: row; min-height: 500px"
  >
    <div
      class="bg-white max-h-[700px] overflow-auto"
      style="width: 200px; display: flex; flex-direction: column"
    >
      <div
        v-for="item in tabList"
        :key="item.id"
        class="menu_item cursor-pointer"
        :class="{ menu_item_light: tabIndex === item.id }"
        @click="tabIndex = item.id"
      >
        {{ item.title }}
      </div>
    </div>
    <div class="tab_content bg-white max-h-[700px] overflow-auto">
      <div v-html="ContentData"></div>
    </div>
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

.menu_item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  font-weight: bold;
  padding: 20px 10px;
  transition: all 0.3s;
}

.menu_item_light {
  background-color: #e6f0ff; /* 淡蓝背景 */
  color: #3a78f4; /* 蓝色字体 */
  border-left: 4px solid #3a78f4; /* 左侧蓝边条 */
}
.tab_content {
  width: 100%;
  margin-left: 10px;
  padding: 20px;
  color: #222222;
}
</style>
