<template>
  <div style="border: 1px solid #ccc; z-index: 100000">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />
    <div style="max-height: 400px; overflow: auto">
      <Editor
        style="min-height: 200px"
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="handleCreated"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
//import "@wangeditor/editor/dist/css/style.css"; // 引入 css

import { onBeforeUnmount, ref, shallowRef } from "vue";
//import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
//import type { IDomEditor, IToolbarConfig } from "@wangeditor/editor";
import { useAccessStore } from "@/stores";
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();

const mode = ref("default");
// 内容 HTML
const valueHtml = defineModel();

const toolbarConfig: Partial<IToolbarConfig> = {
  excludeKeys: ["fullscreen"],
};
const editorConfig = {
  placeholder: "请输入内容...",
  MENU_CONF: {} as any,
};
const accessStore = useAccessStore();
// 上传图片配置
editorConfig.MENU_CONF["uploadImage"] = {
  // form-data fieldName ，默认值 'wangeditor-uploaded-image'。传给后端接口的参数名，重要!
  fieldName: "file",
  server: "https://api.longgu.com/api/upload/index",
  meta: {
    token: accessStore.accessToken,
  },
  customInsert(
    res: any,
    insertFn: (url: string, alt?: string, href?: string) => void
  ) {
    // console.log(res)
    if (res.code === 1 && res.data.fullurl) {
      insertFn(res.data.fullurl); // 使用完整图片链接
    } else {
      console.error("图片上传失败", res);
    }
  },
};
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

const handleCreated = (editor: IDomEditor) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};
</script>

<style scoped>
.ProseMirror {
  outline: none;
  min-height: 150px;
}
.ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #aaa;
  pointer-events: none;
  height: 0;
}
</style>
