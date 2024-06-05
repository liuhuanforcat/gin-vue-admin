<template>
    <div class="input-submit-box">
        <PromQLInput ref="promQLInputRef"/>
        <div class="after-box">
            <el-space   direction="horizontal" alignment="start" :size="20">
                <el-button @click="onClick">新手模式</el-button>
                <el-button type="primary" @click="onClick">Execute</el-button>
            </el-space>

        </div>
    </div>

</template>
<script setup>
import { Search } from '@element-plus/icons-vue'
import { ref } from "vue";
import PromQLInput from './PromQLInput.vue'
const input = ref('')
const promQLInputRef = ref()
const emit = defineEmits(['submitInput'])
const onClick = () => { 
    emit('submitInput', promQLInputRef.value.editor.contentDOM.outerText)
}
defineExpose({promQLInputRef});
</script>
<style lang="scss" scoped>
.input-submit-box {
    width: 100%;
    display: flex;

    .input-style {
        flex: 1;
    }
.after-box{
    padding-left: 20px;
}
    ::v-deep(.el-button) {
        border-top-left-radius: 0;
        /* 右上角 */
        border-bottom-left-radius: 0;
        /* 右下角 */
        height: calc(98% + 1px);

    }

    ::v-deep(.el-input__wrapper) {
        border-top-right-radius: 0;
        /* 右上角 */
        border-bottom-right-radius: 0;
        /* 右下角 */
        padding: 0 11px;
        box-sizing: border-box;
    }


}
</style>