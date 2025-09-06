<template>
  <div class="page">
    <!-- <a-flex class="p-2" gap="20">
      <a-button
        class="!border-transparent"
        v-for="item in new Array(8)"
        :key="item"
        >涨停跌停</a-button
      >
    </a-flex> -->
    <div class="flex mb-2 min-w-[1750px]">
      <div class="flex-1 mr-2">
        <a-flex
          class="h-[40px] bg-[#5F90EA]"
          justify="space-between"
          align="center"
        >
          <div class="flex items-center px-2 gap-x-1">
            <img
              class="h-[20px]"
              src="/images/home/ladder.png"
              alt=""
              srcset=""
            />
            <div class="pr-3 text-white">连扳梯队</div>
            <a-button class="!px-1">{{ leftData.date }}</a-button>
            <a-button
              class="!bg-[#7fa6ee] !text-white !border-transparent hover:!bg-[#5f90ea] !px-1"
              v-for="(item, index) in leftHotData"
              :key="index"
              @click="leftUpdateData(item)"
            >
              {{ item }}
            </a-button>
            <a-select
              v-if="isClient"
              v-model:value="leftCurrentDate"
              class="w-[115px] !shadow-none !border-none bg-transparent"
              :dropdown-style="{ boxShadow: 'none' }"
              placeholder="选择日期"
              :options="leftDateLeftOptions"
            >
            </a-select>
          </div>
          <div class="flex items-center px-2 text-white gap-x-1">
            <span class="pr-2">排除</span>
            <a-checkbox-group
              v-model:value="leftCheckedList"
              :options="plainOptions"
              @change="setLeftChecked"
            />
          </div>
        </a-flex>
        <div class="bg-white">
          <div
            v-for="group in leftData.list"
            :key="group.name"
            style="border-bottom: 3px solid #e8ecf5"
            class="flex items-stretch"
          >
            <!-- 外层容器 -->
            <div class="flex">
              <!-- 左侧 -->
              <div
                class="w-[110px] shrink-0 bg-[#eff3f6] px-2 text-sm text-[#3f3f3f] font-medium flex items-center gap-2 mr-2"
                style="border-bottom: 1px solid #fff"
              >
                <span
                  class="bg-[#6194dd] text-white h-[23px] leading-[23px] w-[23px] rounded-full text-center"
                  >{{ group.name["0"] }}</span
                >
                <span class="cursor-pointer">{{
                  getFirstFour(group.name)
                }}</span>
                <!-- <a-popover>
                  <template #content>
                    <p>{{ group.description }}</p>
                  </template>
                  <span class="cursor-pointer">{{ group.name }}</span>
                </a-popover> -->
              </div>

              <!-- 右侧：卡片容器 -->
              <div class="flex-1 py-4">
                <div class="flex flex-wrap gap-3">
                  <a-tooltip v-for="(item, i) in group.list" :key="item.code">
                    <template #title
                      ><p>
                        {{
                          formatTimestamp(item.limit_up_time, "HH:mm") +
                          "【" +
                          item.code +
                          "】" +
                          "【" +
                          item.stock_name +
                          "】"
                        }}
                      </p>
                      <div>{{ item.stock_reason }}</div>
                    </template>
                    <div
                      v-if="i > 0 || userInfo?.vip_info?.level"
                      class="rounded px-3 py-2 min-w-[110px] text-m shadow-sm border border-[#E8ECF5] cursor-pointer"
                      @click="router.push('/stockDetail/' + item.code)"
                    >
                      <div class="font-medium text-[#888888] h-[20px]">
                        {{ item.m_days_n_boards }}
                      </div>
                      <div class="flex justify-between">
                        <div class="text-[#222222]">{{ item.stock_name }}</div>
                        <div class="text-[#FF6823]">
                          {{ formatTimestamp(item.limit_up_time, "HH:mm") }}
                        </div>
                      </div>
                    </div>
                    <div
                      v-else
                      @click="router.push('/vip')"
                      class="rounded px-3 py-2 min-w-[110px] text-m shadow-sm border border-[#E8ECF5] cursor-pointer"
                    >
                      <div class="flex flex-col items-center">
                        <LockOutlined color="#888888" />
                        <div class="pt-1 text-[#888888]">点击解锁</div>
                      </div>
                    </div>
                  </a-tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-1">
        <a-flex
          class="h-[40px] bg-[#5F90EA]"
          justify="space-between"
          align="center"
        >
          <div class="flex items-center px-2 gap-x-1">
            <img
              class="h-[20px]"
              src="/images/home/ladder.png"
              alt=""
              srcset=""
            />
            <div class="pr-3 text-white">热点题材</div>
            <a-button class="!px-1">{{ rightData.date }}</a-button>
            <a-button
              class="!bg-[#7fa6ee] !text-white !border-transparent hover:!bg-[#5f90ea] !px-1"
              v-for="(item, index) in rightHotData"
              :key="index"
              @click="rightUpdateData(item)"
            >
              {{ item }}
            </a-button>
            <a-select
              v-if="isClient"
              v-model:value="rightCurrentDate"
              class="w-[115px] !shadow-none !border-none bg-transparent"
              :dropdown-style="{ boxShadow: 'none' }"
              placeholder="选择日期"
              :options="rightDateOptions"
            >
            </a-select>
          </div>
          <div class="flex items-center text-white gap-x-1">
            <span class="pr-2">排除</span>
            <a-checkbox-group
              v-model:value="rightCheckedList"
              :options="plainOptions"
              @change="setRightChecked"
            />
          </div>
        </a-flex>
        <div class="bg-white">
          <div
            v-for="group in rightData.list"
            :key="group.name"
            style="border-bottom: 3px solid #e8ecf5"
            class="flex items-stretch"
          >
            <!-- 外层容器 -->
            <div class="flex">
              <!-- 左侧 -->
              <div
                class="w-[110px] shrink-0 bg-[#eff3f6] px-2 text-sm text-[#3f3f3f] font-medium flex items-center gap-2 mr-2"
                style="border-bottom: 1px solid #fff"
              >
                <span
                  class="bg-[#6194dd] text-white h-[23px] leading-[23px] w-[23px] rounded-full text-center"
                  >{{ group.name["0"] }}</span
                >
                <a-tooltip>
                  <template #title>{{ group.description }}</template>
                  <span class="cursor-pointer">{{
                    getFirstFour(group.name)
                  }}</span>
                </a-tooltip>
              </div>

              <!-- 右侧：卡片容器 -->
              <div class="flex-1 py-4">
                <div class="flex flex-wrap gap-3">
                  <a-tooltip v-for="(item, i) in group.list" :key="item.code">
                    <template #title
                      ><p>
                        {{
                          formatTimestamp(item.limit_up_time, "HH:mm") +
                          "【" +
                          item.code +
                          "】" +
                          "【" +
                          item.stock_name +
                          "】"
                        }}
                      </p>
                      <div>{{ item.stock_reason }}</div>
                    </template>
                    <div
                      v-if="i > 0 || userInfo?.vip_info?.level"
                      class="rounded px-3 py-2 min-w-[110px] text-m shadow-sm border border-[#E8ECF5] cursor-pointer"
                      @click="router.push('/stockDetail/' + item.code)"
                    >
                      <div class="font-medium text-[#888888] h-[20px]">
                        {{ item.m_days_n_boards }}
                      </div>
                      <div class="flex justify-between">
                        <div class="text-[#222222]">{{ item.stock_name }}</div>
                        <div class="text-[#FF6823]">
                          {{ formatTimestamp(item.limit_up_time, "HH:mm") }}
                        </div>
                      </div>
                    </div>
                    <div
                      v-else
                      @click="router.push('/vip')"
                      class="rounded px-3 py-2 min-w-[110px] text-m shadow-sm border border-[#E8ECF5] cursor-pointer"
                    >
                      <div class="flex flex-col items-center">
                        <LockOutlined color="#888888" />
                        <div class="pt-1 text-[#888888]">点击解锁</div>
                      </div>
                    </div>
                  </a-tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom-[200px] right-[20px] fixed">
      <div class="flex flex-col">
        <img
          class="cursor-pointer"
          @click="showService = true"
          :src="home_service"
          alt=""
          srcset=""
        />
        <img
          class="cursor-pointer"
          @click="router.push('/message')"
          :src="home_notice"
          alt=""
          srcset=""
        />
        <img
          class="cursor-pointer"
          @click="router.push('/vip')"
          :src="home_vip"
          alt=""
          srcset=""
        />
      </div>
    </div>
    <a-modal
      v-model:open="showService"
      title="联系客服"
      :width="348"
      :footer="null"
    >
      <img style="width: 300px" :src="wechat" alt="" srcset="" />
      <div class="text-center">请使用微信扫码！</div>
    </a-modal>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { LockOutlined } from "@ant-design/icons-vue";
import { useUserStore } from "~/stores";
import { useSystemApi, useStockApi } from "~/api";

import { formatTimestamp } from "~/utils/date";
import type { SelectProps } from "ant-design-vue";
import home_notice from "/assets/home_notice.png";
import home_service from "/assets/home_service.png";
import home_vip from "/assets/home_vip.png";
import wechat from "/assets/wechat.png";
import type { BasicUserInfo } from "~/types/user";
const plainOptions = [
  { label: "主板", value: 1 },
  { label: "创业板", value: 2 },
  { label: "ST", value: 3 },
];

const isClient = ref(false);
onMounted(() => {
  isClient.value = true;
});
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
if (route?.query?.invite_code) {
  userStore.setInviteCode(route.query.invite_code as string);
}
const showService = ref(false);
const userInfo = computed(() => {
  return (userStore.userInfo as BasicUserInfo) || {};
});
const { getLbtd, getHot } = useStockApi();
// 左侧数据
const leftData: any = ref({});
const leftDateLeftOptions = ref<SelectProps["options"]>([]);
const leftHotData = ref<string[]>([]);
const leftCurrentDate = ref<null | string>(null);
const leftCheckedList = ref<number[]>([]);
getLbtdFn();
function leftUpdateData(item: string) {
  leftCurrentDate.value = item;
}
function getLbtdFn() {
  getLbtd({
    date: leftCurrentDate.value || "",
    blank_type: leftCheckedList.value.join(","),
  }).then((res) => {
    leftData.value = res;
    if (leftHotData.value.length == 0) {
      leftHotData.value = [res.date];
      leftDateLeftOptions.value = res.dates.map((item: any, index: number) => {
        if (index < 2) {
          leftHotData.value.push(item);
        }
        return {
          label: item,
          value: item,
        };
      });
    }
  });
}
function setLeftChecked() {
  getLbtdFn();
}
watch(
  () => leftCurrentDate.value,
  () => {
    getLbtdFn();
  }
);

// 右侧数据
const rightData: any = ref({});
const rightDateOptions = ref<SelectProps["options"]>([]);
const rightHotData = ref<string[]>([]);
const rightCurrentDate = ref<string | null>(null);
const rightCheckedList = ref<number[]>([]);
getHotFn();
function rightUpdateData(item: string) {
  rightCurrentDate.value = item;
}

function getFirstFour(str: string): string {
  return str.slice(0, 4);
}
function getHotFn() {
  getHot({
    date: rightCurrentDate.value || "",
    blank_type: rightCheckedList.value.join(","),
  }).then((res) => {
    rightData.value = res;
    if (rightHotData.value.length == 0) {
      rightHotData.value = [res.date];
      rightDateOptions.value = res.dates.map((item: any, index: number) => {
        if (index < 2) {
          rightHotData.value.push(item);
        }
        return {
          label: item,
          value: item,
        };
      });
    }
  });
}
function setRightChecked() {
  getHotFn();
}
watch(
  () => rightCurrentDate.value,
  () => {
    getHotFn();
  }
);
const { getTdk } = useSystemApi();
const { data: tdk } = await useAsyncData(() => getTdk({ module_type: '首页' }), { server: true })

useHead(() => ({
  title: tdk.value?.title || '',
  meta: [
    { name: 'description', content: tdk.value?.description || '' },
    { name: 'keywords', content: tdk.value?.keyword || '' },
  ],
}))
</script>
<style scoped>
.page {
  font-size: 14px;
}
:deep(.ant-select-selector) {
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;
  color: white;
}
:deep(.ant-select-selection-placeholder) {
  color: white !important;
}

:deep(.ant-select-arrow) {
  color: white !important;
  /* 针对某些情况下是 SVG 图标 */
  svg {
    fill: white !important;
  }
}
:deep(.ant-checkbox-wrapper) {
  color: #fff !important;
}
:deep(.ant-checkbox-inner) {
  background-color: #5f90ea !important;
}
</style>
