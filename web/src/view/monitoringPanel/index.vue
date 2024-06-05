<template>
  <div>
    <div class="panel-cart-box" v-for="(item,index) in panelNum" :key="item.uuid">
      <PanelTemplate :index="index"/>
      <el-row>
        <el-col :span="12">
          <el-button v-if="index===panelNum.length-1" type="primary" @click="handleAddClick">添加面板</el-button>
        </el-col>
        <el-col :span="12" style="text-align: right;">
          <el-button v-if="index!==0"  @click="() => handleDelClick(item)">删除面板</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script setup>
import PanelTemplate from '@/view/monitoringPanel/component/panelTemplate.vue';
import _ from 'lodash';
import { ref } from "vue";

//面板数量对象
const panelNum = ref([
  {
    uuid: _.uniqueId('panel_'),
  },
])
const handleAddClick = () => {
  console.log(123)
  panelNum.value = [...panelNum.value, { uuid: _.uniqueId('panel_') }]
}
const handleDelClick=(obj)=>{
  panelNum.value = panelNum.value.filter((item)=>obj.uuid!==item.uuid)
}
</script>
<style lang="scss">
.panel-cart-box {
  margin: 24px;
  padding: 24px;
  background-color:#fff;
  border: 1px solid  #dcdfe6;
}
</style>