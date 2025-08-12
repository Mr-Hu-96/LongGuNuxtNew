<template>
  <div v-if="isClient" style="border: 1px solid #ccc; z-index: 100000">
    <div v-if="Editor && Toolbar">
      <component
        :is="Toolbar"
        style="border-bottom: 1px solid #ccc"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
      />
      <div style="max-height: 400px; overflow: auto">
        <component
          :is="Editor"
          style="min-height: 200px"
          v-model="valueHtml"
          :defaultConfig="editorConfig"
          :mode="mode"
          @onCreated="handleCreated"
        />
      </div>
    </div>
    <div v-else style="padding: 20px; text-align: center; color: #999;">
      编辑器加载中...
    </div>
  </div>
  <div v-else style="border: 1px solid #ccc; padding: 20px; text-align: center; color: #999;">
    编辑器加载中...
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, shallowRef, onBeforeUnmount } from "vue";

// 客户端检查
const isClient = ref(false);

// 动态导入的组件
const Editor = ref(null);
const Toolbar = ref(null);

// 编辑器相关状态
const editorRef = shallowRef();
const mode = ref("default");
const valueHtml = defineModel<string>();

// 配置
const toolbarConfig = ref({
  excludeKeys: ["fullscreen"],
});

const editorConfig = ref({
  placeholder: "请输入内容...",
  MENU_CONF: {} as any,
});

onMounted(async () => {
  isClient.value = true;
  
  try {
    // 动态导入 wangeditor 相关模块
    const wangeditorModule = await import("@wangeditor/editor-for-vue");
    const editorModule = await import("@wangeditor/editor");
    
    Editor.value = wangeditorModule.Editor;
    Toolbar.value = wangeditorModule.Toolbar;
    
    // 导入 CSS
    await import("@wangeditor/editor/dist/css/style.css");
    
    // 获取 access store
    const { useAccessStore } = await import("~/stores");
    const accessStore = useAccessStore();

    // 上传图片配置
    editorConfig.value.MENU_CONF["uploadImage"] = {
      fieldName: "file",
      server: "https://api.longgu.com/api/upload/index",
      meta: {
        token: accessStore.accessToken,
      },
      customInsert(
        res: any,
        insertFn: (url: string, alt?: string, href?: string) => void
      ) {
        if (res.code === 1 && res.data.fullurl) {
          insertFn(res.data.fullurl);
        } else {
          console.error("图片上传失败", res);
        }
      },
    };
    
  } catch (error) {
    console.error("Failed to load wangeditor:", error);
  }
});

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

const handleCreated = (editor: any) => {
  editorRef.value = editor;
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
