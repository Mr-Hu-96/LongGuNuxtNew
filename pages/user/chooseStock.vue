<script setup lang="ts">
import { ref, createVNode } from "vue";
import { useStockApi } from "~/api";
import { useRouter } from "vue-router";
import { DeleteOutlined } from "@ant-design/icons-vue";
import type { StockModelList } from "~/api";
import { message, Modal } from "ant-design-vue";

const { getFavorites: getFavoritesApi, deleteFavorites: deleteFavoritesApi, updateFavorite: updateFavoriteApi } = useStockApi();

const columns = [
  { title: "代码", dataIndex: "code", align: "center" as const },
  { title: "股票名称", dataIndex: "name", align: "center" as const },
  { title: "涨幅", dataIndex: "increase", align: "center" as const },
  { title: "换手", dataIndex: "prev_close", align: "center" as const },
  { title: "成交", dataIndex: "open_price", align: "center" as const },
  { title: "总市值", dataIndex: "total_value", align: "center" as const },
  { title: "流通市值", dataIndex: "circulation_value", align: "center" as const },
  { title: "最近炒作", dataIndex: "low_price", align: "center" as const },
  {
    title: "操作",
    dataIndex: "operate",
    align: "center" as const,
  },
  {
    title: "备注",
    dataIndex: "mark",
    align: "center" as const,
  },
];

const router = useRouter();
const dataList = ref<StockModelList[]>([]);
function getData() {
  getFavoritesApi().then((res) => {
    if (res && res.list) {
      dataList.value = res.list.map(item => {
        return {
          ...item,
          prev_close: item.increase + '%',
          open_price: item.circulation_value + '亿',
          total_value: item.total_value + '亿',
          circulation_value: item.circulation_value + '亿'
        };
      });
    }
  });
}
getData();

function deleteStock(code: string, index: number) {
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
        dataList.value.splice(index, 1);
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
            class="text-blue-600 cursor-pointer"
            @click="router.push('/stockDetail/' + record.code)"
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
