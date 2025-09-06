<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useStockApi } from "~/api";
import type { StockModelList } from "~/api";
import { message } from 'ant-design-vue';
const router = useRouter();
const columns = [
  { title: "代码", dataIndex: "code", align: "center" as const },
  { title: "股票名称", dataIndex: "name", align: "center" as const },
  { title: "涨幅", dataIndex: "increase", align: "center" as const },
  { title: "流通市值", dataIndex: "circulation_value", align: "center" as const },
  { title: "总市值", dataIndex: "total_value", align: "center" as const },
  { title: "自选", dataIndex: "optional", align: "center" as const },
];

const dataList = ref<StockModelList[]>([]);
const searchValue = ref("");
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showTotal: (total: number) => `共 ${total} 条`,
  showQuickJumper: true,
});

function getData() {
  const { getStockList } = useStockApi();
  getStockList({
    keyowrd: searchValue.value,
    page: pagination.value.current,
    page_size: pagination.value.pageSize,
  }).then((res) => {
    if (res && res.list) {
      dataList.value = res.list.map(item => ({
        ...item,
        circulation_value: item.circulation_value + '亿',
        total_value: item.total_value + '亿'
      }));
      pagination.value.total = res.total; // 后端返回的数据总条数
    }
  });
}

// 页码变化事件
function handleTableChange(pag: any) {
  pagination.value.current = pag.current;
  getData();
}

getData();

function addFavoriteFn(record: StockModelList) {
  console.log(record);
  
  const { addFavorite } = useStockApi();
  addFavorite({ code: record.code }).then((res) => {
    message.success("添加成功");
  });
}
</script>

<template>
  <div style="padding-top: 20px"></div>

  <a-breadcrumb>
    <a-breadcrumb-item href @click="router.push('/')">首页</a-breadcrumb-item>
    <a-breadcrumb-item>股票查询</a-breadcrumb-item>
  </a-breadcrumb>

  <div style="padding-top: 30px"></div>
  <a-flex>
    <a-input-search
    v-model:value="searchValue"
    placeholder="输入关键词搜索"
    style="width: 350px"
    @search="
      () => {
        pagination.current = 1;
        getData();
      }
    "
  />
  <a-button type="primary" style="margin-left: 20px" @click="router.push('/chooseStock')">我的自选</a-button>
  </a-flex>
 

  <div style="padding-top: 20px">
    <a-table
      :columns="columns"
      :data-source="dataList"
      :pagination="pagination"
      bordered
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'name'">
          <span class="text-blue-600 cursor-pointer" @click="router.push('/stockDetail/' + record.code)">{{ text }}</span>
        </template>
        <template v-else-if="column.dataIndex === 'optional'">
          <div
            class="cursor-pointer"
            style="color: #5f90ea"
            @click="addFavoriteFn(record)"
          >
            +添加
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'increase'">
          <div style="color: #f53144">{{ text }}%</div>
        </template>
      </template>
    </a-table>
  </div>
</template>
