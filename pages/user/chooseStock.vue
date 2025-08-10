<script setup lang="ts">
import { ref, createVNode } from "vue";
import {
  getFavoritesApi,
  deleteFavoritesApi,
  updateFavoriteApi,
} from "@/api/core/stock";
import { useRouter } from "vue-router";
import { DeleteOutlined } from "@ant-design/icons-vue";
import type { StockModelList } from "@/api/core/stock";
import { message, Modal } from "ant-design-vue";

const columns = [
  { title: "代码", dataIndex: "code", align: "center" },
  { title: "股票名称", dataIndex: "name", align: "center" },
  { title: "涨幅", dataIndex: "increase", align: "center" },
  { title: "换手", dataIndex: "prev_close", align: "center" },
  { title: "成交", dataIndex: "open_price", align: "center" },
  { title: "总市值", dataIndex: "total_value", align: "center" },
  { title: "流通市值", dataIndex: "circulation_value", align: "center" },
  { title: "最近炒作", dataIndex: "low_price", align: "center" },
  {
    title: "操作",
    dataIndex: "operate",
    align: "center",
  },
  {
    title: "备注",
    dataIndex: "mark",
    align: "center",
  },
];

const router = useRouter();
const dataList = ref<StockModelList[]>([]);
function getData() {
  getFavoritesApi().then((res) => {
    dataList.value = res.list.map(item=>{
      item.prev_close = item.prev_close+'%'
      item.open_price = item.open_price+'亿'
      item.total_value = item.total_value+'亿'
      item.circulation_value = item.circulation_value+'亿'
      return item

    });
  });
}
getData();

function deleteStock(code: string,index:number) {
  Modal.confirm({
    title: "确认删除",
    content: createVNode(
      "div",
      { style: "color:red;" },
      "确认删除" + code + "吗?"
    ),
    onOk() {
      deleteFavoritesApi({ code }).then((res) => {
        message.success("删除成功");
        dataList.value.splice(index,1)
      });
    },
    onCancel() {
      console.log("Cancel");
    },
  });
}

function updateRemark(code: number, mark: string) {
  updateFavoriteApi({ code, mark }).then((res) => {
    message.success("修改成功");
  });
}
</script>

<template>
  <div
    class="py-4"
    style="display: flex; flex-direction: row; align-items: center"
  >
    <div style="font-size: 120%; font-weight: bold">自选股</div>
    <!-- <div style="color: #666666">（长点行数据拖动到可自由排序)</div> -->
  </div>
  <div>
    <a-table :columns="columns" :data-source="dataList" bordered>
      <template #bodyCell="{ column, text, record,index }">
        <template v-if="column.dataIndex === 'name'">
          <span
            class="cursor-pointer text-blue-600"
            @click="router.push('/stock/detail?code=' + record.code)"
            >{{ text }}</span
          >
        </template>
        <template v-if="column.dataIndex === 'increase'">
          <div style="color: #f53144">{{ text }}%</div>
        </template>
        <template v-if="column.dataIndex === 'operate'">
          <div style="color: #ff6823">
            <DeleteOutlined
              class="cursor-pointer"
              @click="deleteStock(record.code,index)"
              style="font-size: 150%"
            />
          </div>
        </template>
        <template v-if="column.dataIndex === 'mark'">
          <a-input
            v-model:value="record.mark"
            placeholder="点击修改自选备注"
            @pressEnter="updateRemark(record.code, record.mark)"
          />
        </template>
      </template>
    </a-table>
  </div>
</template>

<style scoped></style>
