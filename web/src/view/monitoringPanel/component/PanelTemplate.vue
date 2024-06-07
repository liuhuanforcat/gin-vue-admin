<template>
  <div class="gva-table-box">
    <el-form :model="form" label-width="auto">
      <el-form-item>
        <el-checkbox-group v-model="form.type">
          <el-checkbox value="1" name="type">
            Use local time
          </el-checkbox>
          <el-checkbox value="2" name="type">
            Enable query history
          </el-checkbox>
          <el-checkbox value="3" name="type">
            Enable autocomplete
          </el-checkbox>
          <el-checkbox value="4" name="type">
            Enable highlighting
          </el-checkbox>
          <el-checkbox value="6" name="type">
            Enable linter
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <ExecuteInput @submitInput="onSubmit" ref="inputRef">
        </ExecuteInput>
      </el-form-item>
    </el-form>
    <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">

      <el-tab-pane label="Table" name="first">

        <el-form-item>
          <el-date-picker v-model="form.date1" type="datetime" placeholder="Select date and time" clearable=true />
        </el-form-item>

        <div>
          <el-row v-for="(item, index) in tableData" :key="index" class="describe-row">
            <el-col :span="12">{{ item?.metric?.__name__ ||''}}{address:"{{ item?.metric?.address||'' }}"
              ,ident:"{{ item.metric.ident }}"}</el-col>
            <el-col :span="12" style="text-align: right;">
              {{
                item.value[1]
              }}
            </el-col>
          </el-row>
        </div>

      </el-tab-pane>
      <el-tab-pane label="Graph" name="second">

        <div>
          <el-row>
            <el-col :span="2">
              <el-input-number v-model="step" @change="handleChange" />
            </el-col>
            <el-col :span="5">
              <el-date-picker v-model="dateRangeRef" type="datetimerange" :shortcuts="shortcuts" range-separator="至"
                start-placeholder="开始时间" end-placeholder="结束时间" format="YYYY-MM-DD HH:mm:ss" />
            </el-col>
            <el-col :span="2">
              <el-radio-group v-model="radio2">
                <el-radio-button value="1">
                  <el-icon>
                    <TrendCharts />
                  </el-icon>
                </el-radio-button>
                <el-radio-button value="2">
                  <el-icon>
                    <Management />
                  </el-icon>
                </el-radio-button>
              </el-radio-group>
            </el-col>

            <el-col :span="1">
              <el-button type="primary" :icon="Setting" />
            </el-col>
            <el-col :span="1">
              <el-button type="primary" :icon="Share" />
            </el-col>
          </el-row>
        </div>

        <div :id="`chartContainer${props.index}`" class="chars-box-layout">
        </div>

        <el-table :data="tableRangeDatasource" style="width: 100%">
          <el-table-column prop="series" :label="`Series ${tableRangeDatasource?.length||0}`" width="680"
            :show-overflow-tooltip="true" />
          <el-table-column prop="max" label="最大值" :default-sort="{ prop: 'max', order: 'descending' }" sortable
            width="180" />
          <el-table-column prop="min" label="最小值" :default-sort="{ prop: 'min', order: 'descending' }" sortable />
          <el-table-column prop="avg" label="平均值" :default-sort="{ prop: 'avg', order: 'descending' }" sortable />
          <el-table-column prop="total" label="汇总值" :default-sort="{ prop: 'total', order: 'descending' }" sortable />
          <el-table-column prop="current" label="当前值" :default-sort="{ prop: 'current', order: 'descending' }"
            sortable />
        </el-table>
      </el-tab-pane>

    </el-tabs>


  </div>

</template>
<script setup>
import { onMounted, reactive, ref, watchEffect } from "vue";
import {
  ArrowLeft,
  ArrowRight,
  Delete,
  Edit,
  Setting,
  Share,
} from '@element-plus/icons-vue'
import ExecuteInput from '@/view/monitoringPanel/component/ExecuteInput.vue'
import { Chart } from '@antv/g2';
import service from '@/utils/request';
import { getData, getDataRange } from '@/api/peregrine'
import { formatTimestamp } from '@/utils/date'
const form = reactive({
  name: "",
  region: "",
  date1: "",
  date2: "",
  delivery: false,
  type: [],
  resource: "",
  desc: "",
});

const dateRangeRef = ref()
const activeName = ref('first')
const radio2 = ref(1)
const isGroupFlag = ref(false)
//g2图
const chartContainer = ref(null);

const queryRangeDatasource = ref();
//输入框
const inputRef = ref(null);

const step = ref(100);
//charsSerach
const num = ref(1)
const tableData = ref([])

onMounted(() => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 3);
  dateRangeRef.value = [start, end];
});

const tableRangeDatasource = ref([])

const props = defineProps(['index']);

const handleChange = (value) => {
  console.log(value)
}

const queryRanage = () => {
  return getDataRange({
    query: inputRef.value.promQLInputRef.editor.state.doc.toString(),
    step: step.value,
    ...formatTimestamp(dateRangeRef.value),
  }).then((res) => {
    queryRangeDatasource.value = res?.data?.data?.result.map((res) => {
      return res.values.map((item) => [...item, res.metric.ident])
    }).flat().map(item => ({
      timestamp: item[0] * 1000,
      value: Number(item[1]),
      type: item[2]
    }))
    tableRangeDatasource.value = res?.data?.data?.result?.map((item) => {
      return {
        series: `${item?.metric?.__name__||''}{address="${item?.metric?.address||''},ident="${item.metric.ident}""}`,
        max: Math.max(...item.values.map((item) => item[1])),
        min: Math.min(...item.values.map((item) => item[1])),
        avg: item.values.map((item) => Number(item[1])).reduce((acc, val) => acc + val, 0) / item.values.length,
        total: item.values.map((item) => Number(item[1])).reduce((acc, val) => acc + val, 0),
        current: item.values.map((item) => Number(item[1]))[0] || 0
      }
    })
  })
}

const queryData = () => {
  console.log(inputRef.value)
  return getData({ query: inputRef.value.promQLInputRef.editor.state.doc.toString(), ...formatTimestamp(form.date1) }).then((res) => {
    console.log(res?.data?.data)
    tableData.value = res?.data?.data.result
    return res?.data?.data
  })
}


watchEffect(() => {
  if (activeName.value === 'second' || queryRangeDatasource.value) {
    const data = [
      { type: 'A', month: 'Jan', value: 30 },
      { type: 'A', month: 'Feb', value: 30 },
      { type: 'A', month: 'Mar', value: 30 },
      { type: 'A', month: 'Apr', value: 30 },
      { type: 'B', month: 'Jan', value: 50 },
      { type: 'B', month: 'Feb', value: 50 },
      { type: 'B', month: 'Mar', value: 50 },
      { type: 'B', month: 'Apr', value: 50 },
    ];
    const chart = new Chart({
      container: 'chartContainer'+props.index,
      autoFit: true, // 自适应容器尺寸
      height: 200,
      forceFit: true,
      paddingRight: 50,
      paddingTop: 50
    });
    chart
      .line()
      .data(queryRangeDatasource.value)
      .encode('x', 'timestamp')
      .encode('y', 'value')
      // .encode('shape', 'hv')
      .encode('series', 'type')
      .encode('color', 'type')
      .scale('x', {
        range: [0, 1],
      })
      .scale('y', {
        nice: true,
      })

    chart.scale('x', {
      type: 'time', // 指定为时间类型  
      mask: 'YYYY-MM-DD HH:mm:ss', // 可选的日期格式掩码  
      tickCount: 5 // 刻度数量，可根据需要调整  
    })

    chart.render();
  }
});

watchEffect(() => {
  if (step.value && dateRangeRef.value) {
    queryRanage()
  }
})

const onSubmit = (e) => {
  if (activeName.value === "second") {
    queryRanage()
  } else {
    queryData()
  }
}

const handleClick = (tab) => {
  if (tab.props.name === "second") {
    queryRanage()
  } else {
    queryData()
  }
}
</script>

<style lang="scss" scoped>
.after-box {
  width: 200px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.after-img {
  width: 24px;
  height: 24px;
}

.after-button {
  background-color: #007bff;
  color: #FFF !important;
}


.demo-tabs {
  width: 100%;
}

.chars-box-layout {
  widows: 100%;
  height: 200px;
}

.chars-box-layout {
  display: flex;
  justify-content: flex-start;

  &>* {
    padding-left: 24px;
  }

}

.describe-row {
  height: 30px;
  border-block-end: 1px solid rgba(5, 5, 5, 0.06);
  line-height: 30px;
  font-size: 14px;
  font-variant: tabular-nums;
  font-feature-settings: "tnum";
  color: #262626;
  cursor: pointer;
  padding-left: 4px;
  padding-right: 4px;
  &:hover{
    background-color: #f0f0f0;
    transition: background-color 0.3s;
  }
}
</style>