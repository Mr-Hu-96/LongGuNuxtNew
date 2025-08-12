<script setup lang="ts">
import { reactive, ref } from "vue";
import { useSystemApi } from "~/api";
import type { RegulatoryModel } from "~/api";
import { useRouter } from "vue-router";

import { setTDK } from "~/utils";
const { getTdk,getRegulatoryList } = useSystemApi();
getTdk({ module_type: "首页" }).then((res) => {
  const { title, description, keyword } = res;
  setTDK({ title, description, keyword });
});
const router = useRouter();
const queryParams = reactive({
  page: 1,
  page_size: 10,
});
const regulatoryList = ref<RegulatoryModel>({} as RegulatoryModel);
getRegulatoryList(queryParams).then((res) => {
  regulatoryList.value = res;
});
</script>

<template>
  <div class="p-2 mt-4 bg-white">
    <div style="display: flex; flex-direction: row; align-items: center">
      <a-typography-title :level="4" style="padding-right: 8px"
        >异动停牌:</a-typography-title
      >
      <a-typography-text type="secondary">根据规定</a-typography-text>
    </div>
    <a-timeline style="padding-top: 20px">
      <a-timeline-item>
        <p>当日异动提醒</p>
        <a-flex wrap="wrap" gap="small">
          <a-tooltip
            v-for="item in regulatoryList.daily_alerts"
            :key="item.id"
          >
            <template #title>
              <div>股票名称：{{ item.name }}</div>
              <div>异动描述：{{ item.alert_description }}</div>
              <div>偏离值：{{ item.deviation_value }}</div>
            </template>
            <a-card
              :title="item.name"
              :bordered="false"
              size="small"
              :headStyle="{ textAlign: 'center' }"
              :bodyStyle="{ textAlign: 'center' }"
              class="cursor-pointer"
              @click="router.push('stock/detail?code=' + item.code)"
            >
              <div>{{ item.code }}</div>
            </a-card>
          </a-tooltip>

        </a-flex>
      </a-timeline-item>
      <a-timeline-item>
        <p>次日异动提醒</p>
        <a-flex wrap="wrap" gap="small">
          <a-tooltip
            v-for="item in regulatoryList.next_day_alerts"
            :key="item.id"
          >
            <template #title>
              <div>股票名称：{{ item.name }}</div>
              <div>异动描述：{{ item.alert_description }}</div>
              <div>偏离值：{{ item.deviation_value }}</div>
            </template>
            <a-card
              :title="item.name"
              :bordered="false"
              size="small"
              :headStyle="{ textAlign: 'center' }"
              :bodyStyle="{ textAlign: 'center' }"
              class="cursor-pointer"
              @click="router.push('stock/detail?code=' + item.code)"
            >
              <div>{{ item.code }}</div>
            </a-card>
          </a-tooltip>
        </a-flex>
      </a-timeline-item>
      <a-timeline-item>
        <p>重点监控</p>

        <a-flex wrap="wrap" gap="small">
          <a-tooltip
            v-for="item in regulatoryList.key_monitoring"
            :key="item.id"
          >
            <template #title>
              <div>股票名称：{{ item.name }}</div>
              <div>异动描述：{{ item.alert_description }}</div>
              <div>偏离值：{{ item.deviation_value }}</div>
            </template>
            <a-card
              :title="item.name"
              :bordered="false"
              size="small"
              :headStyle="{ textAlign: 'center' }"
              :bodyStyle="{ textAlign: 'center' }"
              class="cursor-pointer"
              @click="router.push('stock/detail?code=' + item.code)"
            >
              <div>{{ item.code }}</div>
            </a-card>
          </a-tooltip>
        </a-flex>
      </a-timeline-item>
      <a-timeline-item>
        <p>多次异动个股</p>
        <a-flex wrap="wrap" gap="small">
          <a-tooltip
            v-for="item in regulatoryList.multiple_alerts"
            :key="item.id"
          >
            <template #title>
              <div>股票名称：{{ item.name }}</div>
              <div>异动描述：{{ item.alert_description }}</div>
              <div>偏离值：{{ item.deviation_value }}</div>
            </template>
            <a-card
              :title="item.name"
              :bordered="false"
              size="small"
              :headStyle="{ textAlign: 'center' }"
              :bodyStyle="{ textAlign: 'center' }"
              class="cursor-pointer"
              @click="router.push('stock/detail?code=' + item.code)"
            >
              <div>{{ item.code }}</div>
            </a-card>
          </a-tooltip>

        </a-flex>
      </a-timeline-item>
    </a-timeline>

    <div style="display: flex; flex-direction: column">
      <a-typography-title :level="4" style="padding-right: 8px"
        >异动停牌规则</a-typography-title
      >
      <a-typography-text type="secondary">
        <pre>
一、异动停牌
一般来说指的是深交所上市个股，当个股股价出现了较大的异常波动时，可能会能开盘啦的【异动停牌】功能，根据深交所的规则，预警可能触发异动停牌的个股。
二、停牌规则
根据《深圳证券交易所交易规则(2023年修订)》最新的规则，出现规定的异常
1.偏离值
收盘价涨跌幅偏离值累计值=(单只证券期末收盘价/期初前收盘价-1)x100%-(如期间内证券发生过除权除息，则对收盘价做相应调整
2.异常波动
收盘价涨跌幅偏离值累计值=(单只证券期末收盘价/期初前收盘价-1)x100%-(如期间内证券发生过除权除息，则对收盘价做相应调整
            </pre
        >
      </a-typography-text>
    </div>
  </div>
</template>

<style scoped></style>
