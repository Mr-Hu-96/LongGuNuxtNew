<template>
  <div>
    <div
      class="flex items-center w-full h-[140px] bg-white p-4 rounded-sm shadow my-2"
    >
      <!-- 头像 -->
      <a-avatar :size="100" :src="userInfo?.avatar" />

      <!-- 右侧内容 -->
      <div class="ml-4 flex flex-col flex-1">
        <!-- 用户名和标签 -->
        <div class="flex items-center mt-2">
          <span class="text-lg font-semibold">{{ userInfo?.nickname }}</span>
          <img v-if="userInfo?.vip_info?.vip_type" style="width: 100px;" :src="'/images/user/vip'+userInfo?.vip_info?.vip_type+'.png'" alt="vip" class="px-2 py-1" />

          <span class="text-gray-500 text-sm"
            >到期时间：{{
              formatTimestamp(userInfo?.vip_info?.expiretime)
            }}</span
          >
          <div class="ml-auto">
            <a-button type="primary" @click="showModal">编辑资料</a-button>
          </div>
        </div>

        <!-- ID 和其他信息 -->
        <div class="flex items-center text-gray-600 text-sm my-3">
          <span>ID: {{ userInfo?.id }}</span>
          <span class="ml-4 flex items-center"> 📌 {{ userInfo?.email }} </span>
          <span class="ml-4 flex items-center">
            📞 {{ userInfo?.mobile }}
          </span>
        </div>

        <!-- 简介 -->
        <p class="text-gray-500 text-sm">{{ userInfo?.brief }}</p>
      </div>
    </div>
    <div class="bg-white px-4 rounded-sm shadow my-2">
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="文章">
          <div class="article">
            <div
              v-if="articleData.list.length === 0"
              class="flex items-center flex-col mt-2 py-4"
            >
              <img class="pt-[48px]" src="/images/user/empty.png" alt="empty" />
              <div class="py-10">这里什么都没有，赶紧创作吧~</div>
              <a-button type="primary" @click="onCreateArticle"
                >开始创作</a-button
              >
            </div>
            <div v-else class="pb-4">
              <div v-for="item in articleData.list" :key="item.article_id">
                <div
                  class="flex w-full h-[120px] bg-white p-4 rounded-sm shadow my-2 cursor-pointer"
                  @click="
                    router.push('/consultDetail?article_id=' + item.article_id)
                  "
                >
                  <img
                    :src="item.cover"
                    alt="list"
                    class="h-[90px] w-[150px]"
                  />
                  <div class="ml-4 flex flex-col flex-1">
                    <div class="flex items-center mt-2">
                      <div class="list-title">{{ item.title }}</div>
                      <div
                        class="ml-auto flex items-center text-gray-600 controls"
                      >
                        <span
                          :style="'color:' + statusObj[item.status].color"
                          >{{ statusObj[item.status].text }}</span
                        >
                        <div class="mx-8">
                          <a-button
                            type="text"
                            :icon="
                              h(EditOutlined, {
                                style: { fontSize: '20px', color: '#1890ff' },
                              })
                            "
                            @click.stop="onEditArticle(item.article_id)"
                            >编辑</a-button
                          >
                        </div>
                        <a-popconfirm
                          title="确认删除文章?"
                          ok-text="确认"
                          cancel-text="取消"
                          @confirm.stop="onDeleteArticle(item.article_id)"
                        >
                          <a-button
                            type="text"
                            @click.stop
                            :icon="
                              h(DeleteOutlined, {
                                style: { fontSize: '20px' },
                              })
                            "
                            >删除</a-button
                          >
                        </a-popconfirm>
                      </div>
                    </div>

                    <div class="mt-4 flex items-center text-gray-600">
                      <img src="/images/user/time.png" alt="时间" />
                      <div class="pr-8">
                        {{
                          formatTimestamp(
                            item.createtime,
                            "YYYY-MM-DD HH:mm:ss"
                          )
                        }}
                      </div>
                      <img src="/images/user/view.png" alt="时间" />
                      <div>{{ item.read_num }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <a-pagination
                v-model:current="articleData.page"
                show-quick-jumper
                :total="articleData.total"
                @change="onChange"
              />
              <div class="w-full flex justify-end items-center py-4">
                <a-button type="primary" @click="onCreateArticle"
                  >开始创作</a-button
                >
              </div>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="基本信息" force-render
          ><div class="pl-12 info">
            <!-- 头像和修改按钮 -->
            <div class="flex items-center space-x-4">
              <div class="font-semibold">头&emsp;&emsp;&emsp;像</div>
              <img
                :src="userInfo.avatar"
                alt="头像"
                class="w-16 h-16 rounded-full object-cover"
              />
              <a-upload
                v-model:file-list="fileList"
                name="file"
                action="#"
                :before-upload="avatarBeforeUpload"
                :showUploadList="false"
              >
                <span class="cursor-pointer">上传头像</span>
              </a-upload>
            </div>

            <!-- 用户信息 -->
            <div class="mt-6 gap-4 text-gray-700">
              <div class="flex">
                <div class="font-semibold left-name">用户昵称</div>
                <span>{{ userInfo.nickname }}</span>
              </div>
              <div class="flex">
                <span class="font-semibold left-name">注册时间</span>
                <span>{{ formatTimestamp(userInfo.registertime) }}</span>
              </div>
              <div class="flex">
                <span class="font-semibold left-name">手机号码</span>
                <span>{{ userInfo.mobile }}</span>
              </div>
              <div class="flex">
                <span class="font-semibold left-name">微信号</span>
                <span>{{ userInfo.wechat }}</span>
              </div>
              <div class="flex">
                <span class="font-semibold left-name">QQ 号</span>
                <span>{{ userInfo.qq }}</span>
              </div>
              <div class="flex">
                <span class="font-semibold left-name">邮箱</span>
                <span>{{ userInfo.email }}</span>
              </div>
              <div class="flex">
                <span class="font-semibold left-name">个人简介</span>
                <p class="text-gray-600">{{ userInfo.brief }}</p>
              </div>
            </div>
          </div>
          <!-- 修改按钮 -->
          <div class="w-full flex justify-center my-4">
            <a-button style="width: 200px" type="primary" @click="showModal"
              >修改</a-button
            >
          </div></a-tab-pane
        >
      </a-tabs>
    </div>
    <a-modal v-model:open="open" title="基本信息" @ok="handleOk">
      <a-form
        :model="user"
        name="basic"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
      >
        <a-form-item label="用户昵称" name="username">
          <a-input v-model:value="user.nickname">
            <template #suffix>
              <span class="text-gray-400">30天内还可以修改2次</span>
            </template>
          </a-input>
        </a-form-item>
        <a-form-item label="手机号码" name="mobile">
          <a-input v-model:value="user.mobile" />
        </a-form-item>
        <a-form-item label="微信号" name="wechat">
          <a-input v-model:value="user.wechat" />
        </a-form-item>
        <a-form-item label="QQ号" name="qq">
          <a-input v-model:value="user.qq" />
        </a-form-item>
        <a-form-item label="邮  箱" name="email">
          <a-input v-model:value="user.email" />
        </a-form-item>
        <a-form-item label="个人简介" name="brief">
          <a-textarea v-model:value="user.brief" />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal
      v-model:open="openArticle"
      title="创作文章"
      @ok="saveArticle"
      width="90%"
    >
      <a-form
        ref="articleFormRef"
        :model="articleItem"
        name="basic"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
        :rules="rules"
        autocomplete="off"
      >
        <a-form-item label="文章标题" name="title">
          <a-input v-model:value="articleItem.title"> </a-input>
        </a-form-item>
        <a-form-item label="文章封面" name="cover">
          <a-upload
            v-model:file-list="coverFileList"
            name="file"
            class="avatar-uploader"
            :before-upload="coverBeforeUpload"
            :showUploadList="false"
            list-type="picture-card"
          >
            <img
              v-if="articleItem.cover"
              :src="articleItem.cover"
              alt="avatar"
            />
            <div v-else>
              <loading-outlined v-if="loading"></loading-outlined>
              <plus-outlined v-else></plus-outlined>
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
        </a-form-item>
        <a-form-item label="文章类别" name="title">
          <a-select
            ref="select"
            v-model:value="articleItem.category_id"
            placeholder="请选择文章类别"
            style="width: 200px"
            :options="categoryList"
          ></a-select>
        </a-form-item>
        <a-form-item label="文章简介" name="abstract">
          <a-textarea v-model:value="articleItem.abstract" />
        </a-form-item>
      </a-form>
      <RichTextEditor v-model="articleItem.content" />
    </a-modal>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, h, computed } from "vue";
import {
  EditOutlined,
  DeleteOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons-vue";
import RichTextEditor from "@/components/RichTextEditor.vue";
import { useUserStore } from "@/stores/modules/user";
import { useAuthStore } from "@/stores/modules/auth";
import { uploadFile } from "@/api/core/system";
import type { UploadProps } from "ant-design-vue";
import { message } from "ant-design-vue";
import type { BasicUserInfo } from "@/types/user";
import { saveUserInfoApi } from "@/api/core/user";
import { useCloned } from "@vueuse/core";
import { formatTimestamp } from "@/utils/date";
import { useRouter } from "vue-router";
import {
  getArticleListApi,
  saveArticleApi,
  deleteArticleApi,
  getArticleInfoApi,
  getArticleCategoryListApi,
} from "@/api/core/article";
import type { SaveArticle } from "@/api/core/article";
import type { Rule } from "ant-design-vue/es/form";
const router = useRouter();
const userStore = useUserStore();
const userInfo = computed(() => {
  return (userStore.userInfo as BasicUserInfo) || {};
});
const { cloned } = useCloned(userInfo);
const user = ref<BasicUserInfo>(cloned.value);
const activeKey = ref("1");

const statusObj = {
  0: {
    color: "#FF6823",
    text: "待审核",
  },

  1: {
    color: "#5F90EA",
    text: "已通过",
  },
  2: {
    color: "#F53144",
    text: "未通过",
  },
};
const onChange = () => {
  getArticleList();
};

const open = ref<boolean>(false);

const showModal = () => {
  open.value = true;
};

const authStore = useAuthStore();
const handleOk = (_e: MouseEvent) => {
  saveUserInfoApi({ data: JSON.stringify(user.value) }).then((_res) => {
    message.success("修改成功");
    authStore.fetchUserInfo();
  });
  open.value = false;
};

const fileList = ref<UploadProps["fileList"]>([]);
const avatarBeforeUpload: UploadProps["beforeUpload"] = (file) => {
  uploadFile({ file }).then((res) => {
    user.value.avatar = res.fullurl;
    saveUserInfoApi({ data: JSON.stringify(user.value) }).then((_res) => {
      message.success("头像修改成功");
      authStore.fetchUserInfo();
    });
  });
  // ⚠️ 阻止默认上传行为
  return false;
};

const articleData: pageObj<SaveArticle> = reactive({
  list: [],
  total: 0,
  page: 1,
  page_size: 10,
});
function getArticleList() {
  getArticleListApi({
    page: articleData.page,
    page_size: articleData.page_size,
  })
    .then((res) => {
      articleData.list = res.list;
      articleData.total = res.total;
    })
    .catch(() => {
      articleData.list = [];
      articleData.total = 0;
    });
}
getArticleList();

const openArticle = ref<boolean>(false);
const articleItem = ref<SaveArticle>({
  content: "",
} as SaveArticle);
const coverFileList = ref<UploadProps["fileList"]>([]);
const loading = ref<boolean>(false);
const rules: Record<string, Rule[]> = {
  title: [{ required: true, message: "请输入文章标题", trigger: "blur" }],
  cover: [{ required: true, message: "请上传封面", trigger: "blur" }],
  abstract: [{ required: true, message: "请输入文章简介", trigger: "blur" }],
  category_id: [
    { required: true, message: "请选择文章类别", trigger: "change" },
  ],
};

const articleFormRef = ref();
const coverBeforeUpload: UploadProps["beforeUpload"] = (file) => {
  uploadFile({ file }).then((res) => {
    articleItem.value.cover = res.fullurl;
  });
  // ⚠️ 阻止默认上传行为
  return false;
};

const categoryList = ref<{ value: number; label: string }[]>([]);
function onCreateArticle() {
  articleItem.value = {
    content: "",
    category_id: null,
    title: "",
    cover: "",
    abstract: "",
  } as SaveArticle;
  getArticleCategoryListApi().then((res) => {
    categoryList.value = res.map((item) => {
      return {
        value: item.id,
        label: item.name,
      };
    });
  });
  openArticle.value = true;
}
function saveArticle() {
  articleFormRef.value
    .validate()
    .then(() => {
      saveArticleApi(articleItem.value).then((res) => {
        message.success("创建成功");
        getArticleList();
        openArticle.value = false;
      });
    })
    .catch((error: any) => {
      console.log("error", error);
    });
  return false;
}
function onEditArticle(article_id: string) {
  getArticleInfoApi({ article_id }).then((res) => {
    const { article_id, content, cover, abstract, title ,category_id} = res;
    articleItem.value.abstract = abstract;
    articleItem.value.content = content;
    articleItem.value.cover = cover;
    articleItem.value.article_id = article_id;
    articleItem.value.title = title;
    articleItem.value.category_id = category_id;
    if (categoryList.value?.length == 0) {
      getArticleCategoryListApi().then((res) => {
        categoryList.value = res.map((item) => {
          return {
            value: item.id,
            label: item.name,
          };
        });
      });
    }

    openArticle.value = true;
  });
}
function onDeleteArticle(article_id: string) {
  deleteArticleApi({ article_id }).then((res) => {
    message.success("删除成功");
    getArticleList();
  });
}
</script>
<style scoped lang="scss">
.article {
  .list-title {
    font-weight: bold;
    font-size: 14px;
    color: #222222;
  }
  .controls {
    :deep(.ant-btn) {
      color: #999;
      display: flex;
    }
  }
}

.info {
  .left-name {
    width: 100px;
    padding-right: 30px;
    text-align: justify;
  }

  .left-name::after {
    display: inline-block;
    width: 100%;
    content: "";
  }
}
.avatar-uploader > :deep(.ant-upload) {
  width: 128px;
  height: 128px;
}
.avatar-uploader :deep(.ant-upload-select-picture-card) i {
  font-size: 32px;
  color: #999;
}

.avatar-uploader :deep(.ant-upload-select-picture-card) .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
