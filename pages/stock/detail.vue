<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { formatTimestamp } from "~/utils/date";
import { useStockApi } from "~/api";
import type { StockInfoParams } from "~/api";
const chartRef = ref<HTMLDivElement | null>(null);
const { $echarts } = useNuxtApp();

const route = useRoute();
let code = route.params.code as string;
const periodType = ref("86400");
const periodTypeList = ref([
  { label: "分时图", value: "min" },
  { label: "日K", value: "86400" },
  { label: "周K", value: "604800" },
  { label: "月K", value: "2592000" },
]);
function changePeriodType(periodType: string) {
  const _code = "603162";
  getKlineDataFn(_code, periodType);
}
onMounted(() => {
  getData();
  getNewsListFn();
  getHistroyLimit();
  const _code = "603162";
  getKlineDataFn(_code, periodType.value);
});

function getKlineDataFn(_code: string, periodType: string) {
  if (periodType == "min") {
    getRealTimeData({ code: _code }).then((res) => {
      const times = [
        "09:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "13:00",
        "13:30",
        "14:00",
        "14:30",
        "15:00",
      ];

      const prices = [
        9.2, 10.5, 10.8, 10.7, 10.72, 10.73, 10.75, 10.78, 10.8, 10.82,
      ];
      const avgPrices = [
        9.2, 10.1, 10.5, 10.6, 10.68, 10.7, 10.72, 10.74, 10.76, 10.78,
      ];
      const volumes = [500, 800, 1200, 1000, 900, 600, 400, 700, 500, 800];

      const preClose = 10.2; // 昨收价（用于计算涨跌幅）

      const option = {
        backgroundColor: "#fff",
        title: {
          text: "分时图示例",
          left: "center",
          top: 5,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "cross" },
          formatter: (params) => {
            const price = params[0].data;
            const change = (((price - preClose) / preClose) * 100).toFixed(2);
            return `
        时间：${params[0].axisValue}<br/>
        现价：${price}<br/>
        均价：${params[1].data}<br/>
        涨跌幅：<span style="color:${
          change >= 0 ? "#ec0000" : "#00da3c"
        }">${change}%</span>
      `;
          },
        },
        axisPointer: {
          link: [{ xAxisIndex: "all" }],
        },
        grid: [
          {
            left: 60,
            right: 50,
            height: "60%",
          },
          {
            left: 60,
            right: 50,
            top: "72%",
            height: "20%",
          },
        ],
        xAxis: [
          {
            type: "category",
            data: times,
            axisLine: { lineStyle: { color: "#aaa" } },
            axisLabel: { color: "#555" },
            splitLine: { show: false },
          },
          {
            type: "category",
            gridIndex: 1,
            data: times,
            axisLine: { lineStyle: { color: "#aaa" } },
            axisLabel: { color: "#555" },
            splitLine: { show: false },
          },
        ],
        yAxis: [
          {
            type: "value",
            scale: true,
            splitLine: { show: false },
            axisLabel: { color: "#666" },
            axisLine: { show: false },
            min: preClose * 0.9,
            max: preClose * 1.1,
            axisPointer: { show: true },
            // 背景分层（±10%、±5%、0%）
            splitArea: {
              show: true,
              areaStyle: {
                color: [
                  "#e0f7ff", // +10%区域
                  "#f0faff", // +5%
                  "#ffffff", // 0%
                  "#f0fff0", // -5%
                  "#e0ffe0", // -10%
                ],
              },
            },
          },
          {
            type: "value",
            gridIndex: 1,
            axisLabel: { show: false },
            splitLine: { show: false },
          },
          // 右侧涨跌百分比刻度
          {
            type: "value",
            position: "right",
            min: -0.1,
            max: 0.1,
            interval: 0.05,
            axisLabel: {
              formatter: (val) => (val * 100).toFixed(2) + "%",
              color: (val) =>
                val > 0 ? "#ec0000" : val < 0 ? "#00da3c" : "#409eff",
            },
            splitLine: { show: false },
          },
        ],
        series: [
          {
            name: "现价",
            type: "line",
            data: prices,
            smooth: true,
            showSymbol: false,
            lineStyle: { color: "#1E90FF", width: 1.5 },
            areaStyle: { color: "rgba(30,144,255,0.1)" },
          },
          {
            name: "均价",
            type: "line",
            data: avgPrices,
            smooth: true,
            showSymbol: false,
            lineStyle: { color: "#DAA520", width: 1 },
          },
          {
            name: "成交量",
            type: "bar",
            xAxisIndex: 1,
            yAxisIndex: 1,
            barWidth: "60%",
            itemStyle: {
              color: (params) =>
                prices[params.dataIndex] >= preClose ? "#ec0000" : "#00da3c",
            },
            data: volumes,
          },
        ],
      };
      if (!chartRef.value) return;
       const chart = $echarts.init(chartRef.value);
       chart.setOption(option)
    });
  } else {
    getKlineData({ code: _code, period_type: periodType }).then((res) => {
      const _data = res.candle[_code].lines.map((item) => {
        return [
          formatTimestamp(item[8]),
          item[0],
          item[1],
          item[2],
          item[3],
          item[4],
          item[5],
          item[6],
          item[7],
        ];
      });
      setKLineChart(_data);
    });
  }
}
function setKLineChart(res) {
  if (!chartRef.value) return;
  const chart = $echarts.init(chartRef.value);
  const upColor = "#00da3c"; // 绿色
  const downColor = "#ec0000"; // 红色

  // 模拟的股票数据：[日期, 开盘价, 收盘价, 最低价, 最高价, 成交量]
  const rawData = res;

  function splitData(rawData) {
    const categoryData = [];
    const values = [];
    const volumes = [];
    for (let i = 0; i < rawData.length; i++) {
      categoryData.push(rawData[i][0]);
      values.push(rawData[i].slice(1, 5));
      // 这里改为：收盘价 > 开盘价 为 涨（1），否则为 跌（-1）
      volumes.push([i, rawData[i][5], rawData[i][2] > rawData[i][1] ? 1 : -1]);
    }
    return { categoryData, values, volumes };
  }

  function calculateMA(dayCount, data) {
    const result = [];
    for (let i = 0; i < data.values.length; i++) {
      if (i < dayCount) {
        result.push("-");
        continue;
      }
      let sum = 0;
      for (let j = 0; j < dayCount; j++) {
        sum += data.values[i - j][1];
      }
      result.push((sum / dayCount).toFixed(2));
    }
    return result;
  }

  const data = splitData(rawData);

  const option = {
    legend: {
      data: ["K线", "MA5", "MA10", "成交量"],
      bottom: 5,
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
    },
    axisPointer: {
      link: [{ xAxisIndex: "all" }],
    },
    grid: [
      {
        left: "10%",
        right: "8%",
        height: "60%",
      },
      {
        left: "10%",
        right: "8%",
        top: "70%",
        height: "20%",
      },
    ],
    xAxis: [
      {
        type: "category",
        data: data.categoryData,
        boundaryGap: false,
        axisLine: { onZero: false },
        splitLine: { show: false },
        min: "dataMin",
        max: "dataMax",
      },
      {
        type: "category",
        gridIndex: 1,
        data: data.categoryData,
        boundaryGap: false,
        axisTick: { show: false },
        axisLabel: { show: false },
        splitLine: { show: false },
        min: "dataMin",
        max: "dataMax",
      },
    ],
    yAxis: [
      {
        scale: true,
        splitArea: { show: true },
      },
      {
        scale: true,
        gridIndex: 1,
        splitNumber: 2,
        axisLabel: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
      },
    ],
    dataZoom: [
      {
        type: "inside",
        xAxisIndex: [0, 1],
        start: 0,
        end: 100,
      },
    ],
    visualMap: {
      show: false,
      seriesIndex: 3, // 改为成交量 series 索引
      dimension: 2,
      pieces: [
        { value: 1, color: downColor }, 
        { value: -1, color: upColor }, 
      ],
    },
    series: [
      {
        name: "K线",
        type: "candlestick",
        data: data.values,
        itemStyle: {
          color: 'transparent', 
          color0: upColor, 
          borderColor: downColor, 
          borderColor0: upColor, 
        },
      },
      {
        name: "MA5",
        type: "line",
        data: calculateMA(5, data),
        smooth: true,
        showSymbol: false,
        lineStyle: { opacity: 0.5 },
      },
      {
        name: "MA10",
        type: "line",
        data: calculateMA(10, data),
        smooth: true,
        showSymbol: false,
        lineStyle: { opacity: 0.5 },
      },
      {
        name: "成交量",
        type: "bar",
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: data.volumes,
      },
    ],
  };
  chart.setOption(option);

  window.addEventListener("resize", () => chart.resize());
}
const stockInfo = ref<StockInfoParams>({} as StockInfoParams);
const {
  getByCode,
  getNewsList,
  histroyLimitUp,
  getKlineData,
  getRealTimeData,
} = useStockApi();
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
function getNewsListFn() {
  getNewsList({ code }).then((res) => {
    newsList.value = res.list;
  });
}

const histroyLimit = ref<any>([]);
function getHistroyLimit() {
  histroyLimitUp({ code }).then((res) => {
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
    <div class="flex flex-row mb-2 bg-white" style="padding: 20px">
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
            成交额:
            <span style="color: #ff6823">{{
              formatNumber(stockInfo.amount)
            }}</span>
          </div>
        </div>
      </div>
    </div>
    <a-tabs v-model:activeKey="periodType" @change="changePeriodType">
      <a-tab-pane
        v-for="item in periodTypeList"
        :key="item.value"
        :tab="item.label"
      ></a-tab-pane>
    </a-tabs>
    <div ref="chartRef" class="bg-white chart w-full h-[400px] mb-2"></div>

    <div class="mt-2 bg-white">
      <div class="p-4">
        <a-tabs v-model:activeKey="dict.data.table_index" size="large">
          <a-tab-pane key="1" tab="基本信息">
            <div style="margin-top: 20px"></div>
            <div
              style="display: flex; flex-direction: row; margin-bottom: 40px"
            >
              <div style="font-weight: bold; width: 140px">
                公司信息（同花顺）
              </div>
              <div style="color: #666666" class="flex-1">
                {{ stockInfo.company_info }}
              </div>
            </div>
            <div
              style="display: flex; flex-direction: row; margin-bottom: 40px"
            >
              <div style="font-weight: bold; width: 140px">
                涨停逻辑（开盘了）
              </div>
              <div style="color: #666666" class="flex-1">
                {{ stockInfo.kpl_logic }}
              </div>
            </div>
            <div
              style="display: flex; flex-direction: row; margin-bottom: 40px"
            >
              <div style="font-weight: bold; width: 140px">
                涨停逻辑（选股宝）
              </div>
              <div style="color: #666666" class="flex-1">
                {{ stockInfo.xgb_logic }}
              </div>
            </div>
            <div
              style="display: flex; flex-direction: row; margin-bottom: 40px"
            >
              <div style="font-weight: bold; width: 140px">
                涨停逻辑（财联社）
              </div>
              <div style="color: #666666" class="flex-1">
                {{ stockInfo.cls_logic }}
              </div>
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
                    {{ item.reason }}
                  </div>
                </div>
              </a-timeline-item>
            </a-timeline>
          </a-tab-pane>
          <a-tab-pane key="4" tab="个股快讯">
            <div style="margin-top: 20px"></div>
            <a-timeline>
              <a-timeline-item v-for="item in newsList">
                <div style="font-size: 120%; color: #5f90ea">
                  {{ formatTimestamp(item.createtime) }}
                </div>
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
