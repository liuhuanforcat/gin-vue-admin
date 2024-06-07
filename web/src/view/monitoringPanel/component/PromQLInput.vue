<template>
  <div ref="editorContainer" class="editor-container"></div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watchEffect } from 'vue';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { basicSetup } from "codemirror"
import { PromQLExtension } from '@prometheus-io/codemirror-promql';
import { createGlobalNode } from 'element-plus/es/utils';
const editorContainer = ref<HTMLElement | null>(null);
const editor = ref<any>(null);  // 定义editor为响应式引用
const promQL = new PromQLExtension().setComplete({ remote: { url: 'http://192.168.2.156:33002/' } })
const props = defineProps(['data']);  
onMounted(() => {

  if (editorContainer.value) {
    editor.value = new EditorView({
      state: EditorState.create({
        doc: '',
        extensions: [basicSetup, promQL.asExtension()],
      }),
      parent: editorContainer.value,
      // 可以通过 editor.value.state.doc.toString() 获取到编辑框的值
    });
  }
});
defineExpose({ editor });
</script>


<style>
::v-deep(.cm-scroller) {
  height: 32px;
  border: 1px solid pink;
}
/* 去掉 CodeMirror 编辑框获得焦点时的 outline */
::v-deep .cm-focused {
  outline: none !important;
}
.editor-container {
  width: 100%;
  border: 1px solid #dcdfe6;
}
</style>



