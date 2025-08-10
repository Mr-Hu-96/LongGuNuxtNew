<script setup lang="ts">
import {  computed, ref } from "vue";
import { getUserListApi, createOrder } from "@/api/core/user";
import image_super_vip from "~/assets/super_vip.svg";
import permanent_vip from "~/assets/permanent_vip.png";
import out_vip from "~/assets/out_vip.png";
import invite_friend_to_get_vip from "~/assets/invite_friend_to_get_vip.png";
import vip_card_1 from "~/assets/vip_card_1.png";
import vip_card_2 from "~/assets/vip_card_2.png";
import vip_card_3 from "~/assets/vip_card_3.png";
import vip_card_4 from "~/assets/vip_card_4.png";
import { getFlowApi } from "~/api/core/user";
import type { BasicUserInfo } from "~/types/user";
import { formatTimestamp } from "~/utils/date";
import { useUserStore } from "~/stores";
import { useRouter } from "vue-router";
const router = useRouter();

const flowList = ref<BasicUserInfo[]>([]);
getFlowApi().then((res) => {
  flowList.value = res;
});
const vipInfo = ref({});
getUserListApi().then((res) => {
  vipInfo.value = res;
  price.value = res.pricedata[0].price;
  days.value = res.pricedata[0].days
});


const userInfo = computed(() => {
  return useUserStore().userInfo;
});


function getImgList(num: type) {
  const imgObj = {
    1: vip_card_1,
    2: vip_card_2,
    3: vip_card_3,
    4: vip_card_4,
  };
  return imgObj[num + 1];
}

const price = ref(0);
const days = ref(0);
function setPay(priceNum: number, daysNum: number) {
  price.value = priceNum;
  days.value = daysNum;
}


function openAlipayForm(days) {
  createOrder({ days, paytype: "alipay", method: "web" }).then(
    (alipayFormHtml) => {
      const newWindow = window.open("", "_blank"); // 打开新窗口
      newWindow.document.write(alipayFormHtml); // 写入支付宝表单
      newWindow.document.forms[0].submit(); // 自动提交表单
    }
  );
}
</script>

<template>
  <div class="bg-white p-4 my-4 rounded">
    <div
      style="
        padding-top: 20px;
        display: flex;
        flex-direction: row;
        align-items: center;
      "
    >
      <a-typography-title :level="3">{{ vipInfo.name }}</a-typography-title>
      <div
        style="
          padding-left: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
        "
      >
        <img v-if="userInfo?.vip_info?.vip_type" style="width: 100px;" :src="'/images/user/vip'+userInfo?.vip_info?.vip_type+'.png'" alt="vip" class="px-2 py-1" />
      </div>
      <div style="padding-left: 10px; display: flex; flex-direction: column">
        <div style="color: grey">
          到期时间： {{ formatTimestamp(userInfo?.vip_info?.expiretime) }}
        </div>
      </div>
    </div>

    <div
      style="
        padding-top: 20px;
        display: flex;
        flex-direction: row;
        align-items: center;
      "
      class="hover:shadow-xl duration-500"
    >
      <img
        class="cursor-pointer"
        @click="router.push('/invitation')"
        :src="invite_friend_to_get_vip"
      />
    </div>

    <div style="padding-top: 40px">
      <a-row :gutter="[48, 16]">
        <a-col v-for="(item, index) in vipInfo.pricedata" :span="6">
          <div
            :style="{ backgroundImage: `url(${getImgList(index)})` }"
            class="flex w-[258px] h-[130px] items-center justify-center text-2xl text-white cursor-pointer hover:scale-102 shadow-xl transition-transform duration-500"
            @click="setPay(item.price, item.days)"
          >
            <div>{{ item.title }}</div>
            <div style="padding-left: 60px">{{ item.price + item.unit }}</div>
          </div>
        </a-col>
      </a-row>
    </div>
    <div
      class="bg-white rounded border mt-8 p-4 border-[#E8ECF5] flex flex-wrap justify-between"
    >
      <div
        v-for="(item, index) in flowList"
        :key="index"
        style="
          height: 40px;
          width: 500px;
          background-color: rgba(0, 0, 0, 0.08);
          padding: 10px;
          margin: 10px;
        "
      >
        <span>{{ item.nickname }} </span><span>&nbsp;&nbsp;</span>
        <span class="text-[#5F90EA]">
          {{ item.time_text }} {{ item.buy_text }}</span
        >
      </div>
    </div>
    <div class="bg-[#fbfbfc] rounded border mt-8 p-4 border-[#E8ECF5]">
      <a-typography-title :level="5" style="">超级会员权益</a-typography-title>
      <div style="padding: 10px; color: rgba(0, 0, 0, 0.4)">
        <div
          v-for="(item, index) in vipInfo.rightdata"
          class="p-2"
          :key="index"
        >
          {{ item.text }}:{{ item.intro }}
        </div>
      </div>
    </div>

    <div class="flex justify-between py-8">
      <div>
        实付
        <span style="font-weight: bold; font-size: 200%; color: #ff6823"
          >{{ price }}元</span
        >
      </div>
      <a-button type="primary" class="order_now" @click="openAlipayForm(days)"
        >立即订阅</a-button
      >
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
