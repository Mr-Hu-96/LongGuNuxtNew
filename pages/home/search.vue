<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { getStockListApi, addFavorite } from "@/api/core/stock";
import type { StockModelList } from "@/api/core/stock";
import { message } from 'ant-design-vue';
const router = useRouter();
const columns = [
  { title: "代码", dataIndex: "code", align: "center" },
  { title: "股票名称", dataIndex: "name", align: "center" },
  { title: "涨幅", dataIndex: "increase", align: "center" },
  { title: "流通市值", dataIndex: "circulation_value", align: "center" },
  { title: "总市值", dataIndex: "total_value", align: "center" },
  { title: "自选", dataIndex: "optional", align: "center" },
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
  getStockListApi({
    keyword: searchValue.value,
    page: pagination.value.current,
    pageSize: pagination.value.pageSize,
  }).then((res) => {
    dataList.value = res.list.map(item=>{
      item.circulation_value = item.circulation_value+'亿'
      item.total_value = item.total_value+'亿'
      return item
    });
    pagination.value.total = res.total; // 后端返回的数据总条数
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
          <span class="cursor-pointer text-blue-600" @click="router.push('/stock/detail?code=' + record.code)">{{ text }}</span>
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
