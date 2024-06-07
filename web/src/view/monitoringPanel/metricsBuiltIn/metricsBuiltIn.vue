<template>
    <div class="gva-tree-table-layout">
        <div class="tree-box">
            <div class="filter-tree-top">
                <div class="tooltip-layout">
                    <div>过滤条件</div>
                    <div style="margin-top: 1px;margin-left: 5px">
                        <el-tooltip content="Top Center prompts info">
                            <el-icon>
                                <InfoFilled />
                            </el-icon>
                        </el-tooltip>
                    </div>
                </div>
                <div>
                    <img class="gva-icon-add" src="@/assets/icons/add.png" alt="gin-vue-admin">
                </div>
            </div>
            <el-input v-model="input" size="large" placeholder="Please Input" :prefix-icon="Search" />
            <div class="tree-content">
                过滤条件 的作用是，在点击右侧指标，查看指标的监控数据时，缩小查询监控数据的范围。如果配置并选择了过滤条件 {ident="n9e01"}，则在查询 cpu_usage_idle 时，发起的查询是
                cpu_usage_idle{ident="n9e01"}，会极大降低查询曲线的数量
            </div>
        </div>
        <div class="tree-table">
            <Table />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
const input = ref('')
import Table from './Table.vue';
</script>

<style lang="scss">
.gva-tree-table-layout {
    width: 100%;
    height: calc(100vh - 200px);
    overflow: auto;
    padding: 24px;
    display: flex;

    .tree-box {
        flex: 1;
        background-color: #fff;
        margin-right: 24px;
        padding: 24px;

        .tooltip-layout {
            display: flex;
        }

        .gva-icon-add {
            width: 24px;
            height: 24px;
            cursor: pointer;
        }

        .filter-tree-top {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            font-weight: 700;
            margin-bottom: 12px;
        }

        .tree-content {
            background-color: #e8e1f0;
            border: 1px solid #cec9d6;
            margin-top: 12px;
            padding: 12px;
            border-radius: 2px;
        }

    }

    .tree-table {
        flex: 4;
        background-color: #fff;
        color: #262626;
        font-size: 12px;
        font-variant: tabular-nums;
        line-height: 1.5715;
        list-style: none;
        font-feature-settings: "tnum";
    }


}
</style>