<script setup lang="ts">
import { ref } from "vue";
import {
  useArticleApi,
} from "~/api";
import type { SaveArticle } from "~/api";
import { useSystemApi } from "~/api";
import type { UploadProps } from "ant-design-vue";
import type { Rule } from "ant-design-vue/es/form";
import { message } from "ant-design-vue";
import {
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons-vue";
import RichTextEditor from "~/components/RichTextEditor.vue";
const openArticle = defineModel();
const articleItem = ref<SaveArticle>({
  content: "",
  category_id: null,
  title: "",
  cover: "",
  abstract: "",
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
getArticleCategoryListApi().then((res) => {
  categoryList.value = res.map((item) => {
    return {
      value: item.id,
      label: item.name,
    };
  });
});

function saveArticle() {
  articleFormRef.value
    .validate()
    .then(() => {
      saveArticleApi(articleItem.value).then((res) => {
        message.success("创建成功");
        openArticle.value = false;
      });
    })
    .catch((error: any) => {
      console.log("error", error);
    });
  return false;
}
</script>
<template>
  <div>
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

<style scoped lang="less"></style>
