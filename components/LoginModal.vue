<script setup lang="ts">
import { validatePhone } from "~/utils/validate";
import {
  useAuthApi,
  useUserApi,
  getTicketApi
} from "~/api";
import { useAccessStore, useUserStore,useAuthStore } from "~/stores";
const router = useRouter();
const phone = ref("");
const code = ref("");
const agree = ref(false);
const countdown = ref(0);
const timer = ref<number | null>(null);

// 获取验证码
const getCode = () => {
  if (countdown.value > 0 || !validatePhone(phone.value)) return;
  const authApi = useAuthApi();
  authApi.smsSend({ mobile: phone.value, event: "mobilelogin" })
    .then((res: any) => {
      console.log(res);

      countdown.value = 60; // 30秒倒计时
      timer.value = window.setInterval(() => {
        countdown.value--;
        if (countdown.value === 0) {
          clearInterval(timer.value!);
          timer.value = null;
        }
      }, 1000);
    })
    .catch((err: any) => {
      console.log(err);
    });
};

// 提交表单
const userStore = useUserStore();
const authStore = useAuthStore();
const submit = () => {
  if (!validatePhone(phone.value) || !agree.value) {
    return alert("请填写正确的手机号并同意用户协议");
  }
  const authApi = useAuthApi();
  authApi.mobileLogin({ mobile: phone.value, captcha: code.value }).then((res: any) => {
    authStore.fetchUserInfo()
    if (res.userinfo?.token) {
      accessStore.setAccessToken(res.userinfo?.token);
      console.log('setLoginExpired2');
  
      accessStore.setLoginExpired(false);

      bindInvitedFn().then(() => {
        setTimeout(() => {
          // location.reload();
          router.go(0);
          clearData();
        }, 0);
        
        
      });
    }
  });
};

const wxLoginUrl = computed(
  () =>
    `https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${encodeURIComponent(
      ticket.value
    )}`
);
const ticket = ref("");
const sceneId = ref(0);

const accessStore = useAccessStore();
const scanTimer = ref<number | null>(null);
const model = computed({
  get: () => accessStore.loginExpired,
  set: (value) => {
    accessStore.loginExpired = value;
  },
});

function getTicketFn() {
  const authApi = useAuthApi();
  getTicketApi().then((res: any) => {
    console.log('完整的响应:', res,res.value);
    console.log('响应类型:', typeof res);
    console.log('是否有 ticket 属性:', 'ticket' in res);
    console.log('ticket 的值:', res.ticket);
    
    // 响应拦截器已经提取了 data 字段，所以直接使用 res
    if (res && res.ticket) {
      ticket.value = res.ticket;
      sceneId.value = res.scene_id;
    }
  }).catch((err: any) => {
    console.error('获取微信ticket失败:', err);
  });
}

function clearData() {
  phone.value = "";
  code.value = "";
  agree.value = false;
  if (scanTimer.value !== null) {
    clearInterval(scanTimer.value);
    scanTimer.value = null;
  }
}

function setScan() {
  if (scanTimer.value) return; // 避免重复创建轮询
  scanTimer.value = window.setInterval(() => {
    const authApi = useAuthApi();
    authApi.checkLogin(sceneId.value).then((res: any) => {
      if (res?.token) {
        accessStore.setAccessToken(res.token);
        clearInterval(scanTimer.value!);
        scanTimer.value = null;
        bindInvitedFn().then(() => {
          setTimeout(() => {
          // location.reload();
        }, 0);
        });
      }
    });
  }, 3000);
}
watch(
  () => accessStore.loginExpired,
  (newVal) => {
    console.log("登录状态改变:", newVal);
    // model.value = newVal;
    if (newVal === false) {
      clearData();
      if (scanTimer.value !== null) {
        clearInterval(scanTimer.value);
        scanTimer.value = null;
      }
    } else {
      getTicketFn();
      setScan();
    }
  },
  { immediate: true,deep:true }
);

function bindInvitedFn() {
  return new Promise((resolve) => {
    // 异步操作
    if (userStore.inviteCode) {
      const userApi = useUserApi();
      userApi.bindInvited({
        invited_id: userStore.inviteCode,
      }).then(() => {
        userStore.setInviteCode(null);
        resolve("");
      });
    } else {
      resolve("");
    }
  });
}

const loginModal = ref();
</script>

<template>
  <div class="login-modal" ref="loginModal">
    <ClientOnly>
      <a-modal
      v-model:open="model"
      centered
      width="820"
      :footer="null"
      :maskClosable="false"
      :getContainer="loginModal"
    >
      <div class="flex login">
        <div class="scan-box">
          <div class="flex flex-col items-center w-[410px] mx-auto mt-10 p-4">
            <!-- 标题部分 -->
            <div class="flex items-center mb-3">
              <div class="text-lg font-bold">极速登录</div>
              <div
                class="bg-[url('/images/login/lianHe.png')] ml-2 w-[126px] h-[36px] text-center leading-[36px] text-blue-500"
              >
                扫码登录更方便
              </div>
            </div>
            <!-- 盒子 -->
            <div
              class="w-[220px] h-[220px] my-4 flex items-center justify-center"
            >
              <img
                v-if="ticket"
                class="w-[220px] h-[220px]"
                :src="wxLoginUrl"
                alt="二维码"
                srcset=""
              />
            </div>

            <!-- 说明 -->
            <div class="mb-8 text-sm text-center text-gray-700">
              打开微信
              <span class="text-green-500">📷</span> 扫一扫，快速登录/注册
            </div>

            <!-- 说明文字 -->
            <div class="mt-2 text-xs text-gray-400">
              【已注册】 免费享受扫码登录，安全快捷。
              <br />
              【未注册】 用户可选择继续登录，后续可关联账号！
            </div>
          </div>
        </div>
        <div class="phone-box bg-[url('/images/login/bg.png')]">
          <div class="w-[410px] rounded-lg mx-auto mt-10 p-6">
            <!-- 标题 -->
            <div class="mb-10 text-lg font-bold text-center">免密登录注册</div>

            <!-- 手机号输入 -->
            <a-input
              size="large"
              v-model:value="phone"
              addon-before="中国大陆"
              class="w-full mb-6"
              placeholder="请输入手机号"
            />

            <!-- 验证码输入 -->
            <div class="flex items-center mb-10 space-x-2">
              <a-input
                size="large"
                v-model:value="code"
                placeholder="请输入验证码"
                class="flex-1"
                allow-clear
              />
              <a-button
                size="large"
                type="primary"
                :disabled="countdown > 0"
                @click="getCode"
              >
                {{ countdown > 0 ? `${countdown}s后重新获取` : "获取验证码" }}
              </a-button>
            </div>

            <!-- 提交按钮 -->
            <a-button type="primary" block class="h-10 text-lg" @click="submit">
              登录 / 注册
            </a-button>

            <!-- 用户协议 -->
            <div
              class="flex items-center mt-3 mb-10 space-x-2 text-sm text-gray-500"
            >
              <a-checkbox v-model:checked="agree" />
              <span
                >我已阅读并同意 <a class="text-blue-500">《用户协议》</a> 和
                <a class="text-blue-500">《隐私政策》</a></span
              >
            </div>

            <!-- 新用户提示 -->
            <p class="mt-4 text-sm text-center text-gray-400">
              新用户可直接登录
            </p>
          </div>
        </div>
      </div>
    </a-modal>
      
    </ClientOnly>
    
  </div>
</template>

<style scoped lang="scss">
.login {
  height: 485px;

  .scan-box {
    width: 410px;
    height: 100%;
    border-right: 1px dashed #ccc;
  }
  .phone-box {
    width: 410px;
    height: 100%;
  }
}
.login-modal :deep(.ant-modal-content) {
  padding: 0 !important;
}
</style>
<style></style>
