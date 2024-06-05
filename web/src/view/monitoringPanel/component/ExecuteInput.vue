<template>
    <div class="input-submit-box">
        <PromQLInput ref="promQLInputRef"/>
        <div class="after-box">
            <el-space   direction="horizontal" alignment="start" :size="20">
                <el-button type="primary" :icon="Search">Search</el-button>
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


}
</style>