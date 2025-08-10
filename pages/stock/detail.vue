<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { formatTimestamp } from "@/utils/date";
import { getByCode, getNewsListApi, histroyLimitUpApi } from "@/api/core/stock";
import type { StockInfoParams } from "@/api/core/stock";
const route = useRoute();
const code = route.query.code as string;
if (code) {
  getData();
  getNewsList();
  getHistroyLimit();
}

const stockInfo = ref<StockInfoParams>({} as StockInfoParams);
function getData() {
  getByCode({ code }).then((res) => {
    stockInfo.value = res;
  });
}
const dict = reactive({
  tempData: {},
  data: {
    tab_index: "1",
  },
});

const newsList = ref<any>([]);
function getNewsList() {
  getNewsListApi({ code }).then((res) => {
    newsList.value = res.list;
  });
}

const histroyLimit = ref<any>([]);
function getHistroyLimit() {
  histroyLimitUpApi({ code }).then((res) => {
    histroyLimit.value = res.list;
  });
}

function formatNumber(value: number): string {
    if (value < 10000) {
        return `${value}元`;
    } else if (value < 100000000) {
        return `${(value / 10000).toFixed(2)}万`;
    } else {
        return `${(value / 100000000).toFixed(2)}亿`;
    }
}
</script>

<template>
  <div class="py-2">
    <div class="flex flex-row bg-white" style="padding: 20px; height: 100px">
      <div style="width: 700px; display: flex; flex-direction: column">
        <div style="font-size: 150%; font-weight: bold">
          {{ stockInfo.name }}[{{ stockInfo.code }}]
        </div>
        <div
          style="
            font-size: 200%;
            font-weight: bold;
            color: #ff6823;
            margin-top: 10px;
          "
        >
          {{ stockInfo.increase }}%
        </div>
      </div>
      <div
        style="
          padding: 2px;
          padding-right: 15px;
          width: 100%;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        "
      >
        <div style="display: flex; flex-direction: column">
          <div>最新: {{ stockInfo.open_price }}</div>
          <div style="margin-top: 20px">
            换手:
            <span style="color: #ff6823">{{ stockInfo.turnover_ratio }}%</span>
          </div>
        </div>
        <div style="display: flex; flex-direction: column">
          <div>涨停: {{ stockInfo.high_price }}</div>
          <div style="margin-top: 20px">
            跌停: <span style="color: #ff6823">{{ stockInfo.low_price }}</span>
          </div>
        </div>
        <div style="display: flex; flex-direction: column">
          <div>总市值: {{ stockInfo.total_value }}</div>
          <div style="margin-top: 20px">
            流通值: {{ stockInfo.circulation_value }}
          </div>
        </div>
        <div style="display: flex; flex-direction: column">
          <div>市盈率: {{ stockInfo.increase }}</div>
          <div style="margin-top: 20px">
            成交额: <span style="color: #ff6823">{{ formatNumber(stockInfo.amount) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white mt-2">
      <div class="p-4">
        <a-tabs v-model:activeKey="dict.data.table_index" size="large">
          <a-tab-pane key="1" tab="基本信息">
            <div style="margin-top: 20px"></div>
            <div
              style="display: flex; flex-direction: row; margin-bottom: 40px"
            >
              <div style="font-weight: bold;width: 140px;">公司信息（同花顺）</div>
              <div style="color: #666666" class="flex-1">{{ stockInfo.company_info }}</div>
            </div>
            <div
              style="display: flex; flex-direction: row; margin-bottom: 40px"
            >
              <div style="font-weight: bold; width: 140px;">涨停逻辑（开盘了）</div>
              <div style="color: #666666" class="flex-1">{{ stockInfo.kpl_logic }}</div>
            </div>
            <div
              style="display: flex; flex-direction: row; margin-bottom: 40px"
            >
              <div style="font-weight: bold; width: 140px;">涨停逻辑（选股宝）</div>
              <div style="color: #666666" class="flex-1">{{ stockInfo.xgb_logic }}</div>
            </div>
            <div
              style="display: flex; flex-direction: row; margin-bottom: 40px"
            >
              <div style="font-weight: bold; width: 140px;">涨停逻辑（财联社）</div>
              <div style="color: #666666" class="flex-1">{{ stockInfo.cls_logic }}</div>
            </div>
          </a-tab-pane>

          <a-tab-pane key="3" tab="历史涨停">
            <div style="margin-top: 20px"></div>
            <a-timeline>
              <a-timeline-item v-for="item in histroyLimit">
                <div style="font-size: 120%; color: #5f90ea">2015-09-01</div>
                <div
                  style="display: flex; flex-direction: row; font-size: 110%"
                >
                  <div style="font-weight: bold">{{ item.sclt }}</div>
                  <div style="margin-left: 5px; color: #666666">
                    {{item.reason}}
                  </div>
                </div>
              </a-timeline-item>
            </a-timeline>
          </a-tab-pane>
          <a-tab-pane key="4" tab="个股快讯">
            <div style="margin-top: 20px"></div>
            <a-timeline>
              <a-timeline-item v-for="item in newsList">
                <div style="font-size: 120%; color: #5f90ea">{{ formatTimestamp(item.createtime) }}</div>
                <div
                  style="
                    display: flex;
                    flex-direction: row;
                    font-size: 110%;
                    color: #666666;
                  "
                >
                  <div style="margin-left: 5px">{{ item.content }}</div>
                </div>
              </a-timeline-item>
            </a-timeline>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
