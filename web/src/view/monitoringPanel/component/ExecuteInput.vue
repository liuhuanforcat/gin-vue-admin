<template>
    <div class="input-submit-box">
        <PromQLInput ref="promQLInputRef" />
        <div class="after-box">
            <el-space direction="horizontal" alignment="start" :size="20">
                <el-button type="primary" :icon="Search" @click="dialogOpen = true">Search</el-button>
                <el-button @click="onClick">新手模式</el-button>
                <el-button type="primary" @click="onClick">Execute</el-button>
            </el-space>

        </div>
        <el-dialog v-model="dialogOpen" title="Metrics Explorer" width="600" >
            <div class="dialog-container">
                <el-input v-model="serachParam" placeholder="请输入" :prefix-icon="Search" />
                <el-row v-for="(item, index) in dialogListData" :key="index" class="row-list-item"
                    @click="onListItemClick(item)">
                    <el-col :span="24">{{ item }}</el-col>
                </el-row>
            </div>
        </el-dialog>
    </div>

</template>
<script setup>
import { Search } from '@element-plus/icons-vue'
import { ref, watchEffect } from "vue";
import PromQLInput from './PromQLInput.vue'
import { getSerchData } from '@/api/peregrine'
const dialogOpen = ref(false)

const dialogListData = ref(["categraf_current_queue_size1", "categraf_current_queue_size2", "categraf_current_queue_size3"])

const serachParam = ref()
const promQLInputRef = ref()

const promQLInputData = ref('')
// const 
watchEffect(() => {
    if (dialogOpen.value) {
    }
})

const emit = defineEmits(['submitInput'])
const onClick = () => {
    emit('submitInput', promQLInputRef.value.editor.contentDOM.outerText)
}


const onListItemClick = (val) => {
    promQLInputData.value = val
    dialogOpen.value = false
    if (promQLInputRef.value) {
    const newContent = '新的查询语句';
    const state = promQLInputRef.value.editor.state;
    const transaction = state.update({
      changes: { from: 2, to: state.doc.length, insert: newContent },
    });
    promQLInputRef.value.editor.dispatch(transaction);
  }
  
};




defineExpose({ promQLInputRef });
</script>
<style lang="scss" scoped>
.input-submit-box {
    width: 100%;
    display: flex;

    .input-style {
        flex: 1;
    }

    .after-box {
        padding-left: 20px;
    }

}
.dialog-container{
    height: 700px;
    overflow: auto;
    margin-top: 24px;
    .row-list-item {
    border-block-end: 1px solid rgba(5, 5, 5, 0.06);
    &:hover {
        background-color: #f0f0f0;
        transition: background-color 0.3s;
        cursor: pointer;
    }
}
}

</style>