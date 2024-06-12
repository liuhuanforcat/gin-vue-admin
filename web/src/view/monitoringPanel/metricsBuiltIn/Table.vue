<template>
  <div>
    <div class="gva-search-box">
      <el-form ref="searchForm" :inline="true" :model="searchInfo">
        <el-row>
          <el-col :span="16">
            <el-form-item>
              <el-select v-model="searchInfo.path" placeholder="类型" clearable>
                <el-option label="Zone one" value="shanghai" />
                <el-option label="Zone two" value="beijing" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="searchInfo.description" placeholder="采集器" clearable>
                <el-option label="Zone one" value="shanghai" />
                <el-option label="Zone two" value="beijing" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model="searchInfo.apiGroup" placeholder="单位" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="searchInfo.method" placeholder="请输入搜索关键字" :prefix-icon="Search" />
            </el-form-item>
          </el-col>
          <el-col :span="8" style="text-align: end;">
            <el-form-item>
              <el-space :size="20">
                <!-- @click="onSubmit" -->
                <el-button type="primary" @click="onClickHideIcon">创建指标</el-button>
                <el-dropdown>
                  <el-button>
                    更多操作<el-icon class="el-icon--right"><arrow-down /></el-icon>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item>导入指标</el-dropdown-item>
                      <el-dropdown-item>导出指标</el-dropdown-item>
                      <el-dropdown-item>批量删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
                <div class="icon-box">
                  <el-icon>
                    <Hide />
                  </el-icon>
                </div>
              </el-space>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
    </div>
    <div style="overflow: hidden;">
      <el-table :data="tableData" @sort-change="sortChange" @selection-change="handleSelectionChange" maxHeight="70vh">
        <el-table-column type="selection" width="55" />
        <el-table-column align="left" label="类型" min-width="150" prop="typ" />
        <el-table-column align="left" label="采集器	" min-width="150" prop="collector" />
        <el-table-column align="left" label="指标名称" min-width="350" prop="name" />
        <el-table-column align="left" label="单位" min-width="150" prop="unit" />
        <el-table-column align="left" label="表达式	" min-width="450" prop="expression" />
        <el-table-column align="left" label="描述	" min-width="350" prop="note" />
        <el-table-column align="left" label="请求" min-width="150" prop="method">

          <template #default="scope">
            <div>
              {{ scope.row.method }} / {{ methodFilter(scope.row.method) }}
            </div>
          </template>
        </el-table-column>

        <el-table-column align="left" fixed="right" label="操作" width="300">
          <template #default="scope">
            <el-button icon="CopyDocument" type="primary" link @click="cloneApiFunc(scope.row)">克隆</el-button>
            <el-button icon="edit" type="primary" link @click="editApiFunc(scope.row)">编辑</el-button>
            <el-button icon="delete" type="danger" link @click="deleteApiFunc(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="gva-pagination" style="margin-right: 48px">
        <el-pagination :current-page="page" :page-size="pageSize" :page-sizes="[10, 30, 50, 100]" :total="total"
          layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange"
          @size-change="handleSizeChange" />
      </div>

    </div>

    <el-drawer v-model="dialogFormVisible" size="30%" :before-close="closeDialog" :show-close="false">
      <template #header>
        <div class="flex justify-between items-center">
          <span class="text-lg">{{ dialogTitle }}</span>
          <div>
            <el-button @click="closeDialog">取 消</el-button>
            <el-button type="primary" @click="enterDialog">确 定</el-button>
          </div>
        </div>
      </template>


      <el-form ref="apiForm" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="指标名称" prop="name">
          <el-input v-model="form.name" autocomplete="off" :placeholder="placeholderType.name" />
        </el-form-item>
        <el-form-item label="类型" prop="typ">
          <el-select v-model="form.typ" :placeholder="placeholderType.typ" style="width:100%">
            <el-option v-for="item in methodOptions" :key="item.value" :label="`${item.label}(${item.value})`"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="采集器" prop="collector">
          <el-input v-model="form.collector" autocomplete="off" :placeholder="placeholderType.collector" />
        </el-form-item>
        <el-form-item label="表达式" prop="expression">
          <el-input v-model="form.expression" autocomplete="off" :placeholder="placeholderType.expression" />
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input v-model="form.unit" autocomplete="off" :placeholder="placeholderType.unit" />
        </el-form-item>
        <el-form-item label="描述" prop="note">
          <el-input type="textarea" v-model="form.note" autocomplete="off" :placeholder="placeholderType.note" />
        </el-form-item>
      </el-form>
    </el-drawer>


    <el-dialog v-model="dialogTableVisible" title="Shipping address" width="800">
      <el-table :data="gridData">
        <el-table-column property="date" label="Date" width="150" />
        <el-table-column property="name" label="Name" width="200" />
        <el-table-column property="address" label="Address" />
      </el-table>
    </el-dialog>

  </div>
</template>

<script setup>
import { createMetricsBuiltIn, typList, deleteRow ,getApiList} from '@/api/metricsBuiltIn'
import {
  getApiById,
  updateApi,
  freshCasbin
} from '@/api/api'
import { toSQLLine } from '@/utils/stringFun'
import { useAsyncState } from '@vueuse/core'
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'


defineOptions({
  name: 'Api',
})

const methodFilter = (value) => {
  const target = methodOptions.value.filter(item => item.value === value)[0]
  return target && `${target.label}`
}

const apis = ref([])
const form = ref({
  name: '',
  typ: '',
  collector: '',
  expression: '',
  unit: '',
  note: ''
})
const methodOptions = ref([
  {
    value: 'AutoMQ',
    label: 'AutoMQ',
    type: 'success'
  },
  {
    value: 'GET',
    label: '查看',
    type: ''
  },
  {
    value: 'PUT',
    label: '更新',
    type: 'warning'
  },
  {
    value: 'DELETE',
    label: '删除',
    type: 'danger'
  }
])

const type = ref('')

const { isLoading, state, isReady } = useAsyncState(
  (args) => {
    return typList()
  },
  {},

)


const rules = ref({
  name: [{ required: true, message: '请输入指标名称', trigger: 'blur' }],
  typ: [
    { required: true, message: '请输入类型', trigger: 'blur' }
  ],
  collector: [
    { required: true, message: '请输入采集器', trigger: 'blur' }
  ],
  expression: [
    { required: true, message: '请输入表达式', trigger: 'blur' }
  ],
})

//默认值
const placeholderType = ref({
  name: '请输入指标名称',
  typ: '请输入类型',
  collector: '请输入采集器',
  expression: '请输入表达式',
  unit: '请输入单位',
  note: '请输入描述'
})

const page = ref(1)
const total = ref(0)
const pageSize = ref(10)
const tableData = ref([{
  collector
    :
    "Categraf",
  created_at
    :
    1718085904,
  created_by
    :
    "system",
  expression
    :
    "elasticsearch_cluster_health_delayed_unassigned_shards",
  id
    :
    60,
  lang
    :
    "zh_CN",
  name
    :
    "Cluster Health delayed unassigned 的分片数",
  note
    :
    "",
  typ
    :
    "ElasticSearch",
  unit
    :
    "sishort",
  updated_at
    :
    1718085904,
  updated_by
    :
    "system",
  uuid
    :
    1717556327385727000
}])
const searchInfo = ref({})
//控制table列的弹窗

const onClickHideIcon = () => {
  dialogFormVisible.value = true
  openDialog('add')
}


// 搜索

const onSubmit = () => {
  page.value = 1
  pageSize.value = 10
  getTableData()
}

// 分页
const handleSizeChange = (val) => {
  pageSize.value = val
  getTableData()
}

const handleCurrentChange = (val) => {
  page.value = val
  getTableData()
}

// 排序
const sortChange = ({ prop, order }) => {
  if (prop) {
    if (prop === 'ID') {
      prop = 'id'
    }
    searchInfo.value.orderKey = toSQLLine(prop)
    searchInfo.value.desc = order === 'descending'
  }
  getTableData()
}

// 查询
const getTableData = async () => {
  const table = await getApiList({ page: page.value, pageSize: pageSize.value || 10, ...searchInfo.value })
  console.log('======')
  console.log(table)
  tableData.value = table.data.list
  total.value = table.data.total
  page.value = table.data.page
  pageSize.value = table.data.pageSize

}

getTableData()

// 批量操作
const handleSelectionChange = (val) => {
  apis.value = val
}

const onDelete = async () => {
  ElMessageBox.confirm('确定要删除吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const ids = apis.value.map(item => item.ID)
    const res = await deleteRow({ ids })
    if (res.code === 0) {
      ElMessage({
        type: 'success',
        message: res.msg
      })
      if (tableData.value.length === ids.length && page.value > 1) {
        page.value--
      }
      getTableData()
    }
  })
}
const onFresh = async () => {
  ElMessageBox.confirm('确定要刷新缓存吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const res = await freshCasbin()
    if (res.code === 0) {
      ElMessage({
        type: 'success',
        message: res.msg
      })
    }
  })
}

// 弹窗相关
const apiForm = ref(null)
const initForm = () => {
  apiForm.value.resetFields()
  form.value = {
    path: '',
    apiGroup: '',
    method: '',
    description: ''
  }
}

const dialogTitle = ref('创建指标')
const dialogFormVisible = ref(false)
const openDialog = (key) => {
  switch (key) {
    case 'add':
      dialogTitle.value = '创建指标'
      break
    case 'edit':
      dialogTitle.value = '编辑指标'
      break
    case 'clone':
      dialogTitle.value = '克隆指标'
      break
    default:
      break
  }
  type.value = key
  dialogFormVisible.value = true
}
const closeDialog = () => {
  initForm()
  dialogFormVisible.value = false
}

const editApiFunc = async (row) => {
  // const res = await getApiById({ id: row.ID })
  console.log('------')
  console.log(row)
  form.value = row

  openDialog('edit')
}
const cloneApiFunc = async (row) => {
  const res = await getApiById({ id: row.ID })
  form.value = res.data.api
  openDialog('clone')
}

const enterDialog = async () => {
  const res = await createMetricsBuiltIn(form.value)
  if (res.code === 0) {
    ElMessage({
      type: 'success',
      message: '添加成功',
      showClose: true
    })
  }
  apiForm.value.validate(async valid => {
    if (valid) {
      switch (type.value) {
        case 'addApi':
          {
            const res = await createMetricsBuiltIn(form.value)
            if (res.code === 0) {
              ElMessage({
                type: 'success',
                message: '添加成功',
                showClose: true
              })
            }
            getTableData()
            closeDialog()
          }

          break
        case 'edit':
          {
            const res = await updateApi(form.value)
            if (res.code === 0) {
              ElMessage({
                type: 'success',
                message: '编辑成功',
                showClose: true
              })
            }
            getTableData()
            closeDialog()
          }
          break
        default:
          // eslint-disable-next-line no-lone-blocks
          {
            ElMessage({
              type: 'error',
              message: '未知操作',
              showClose: true
            })
          }
          break
      }
    }
  })
}

const deleteApiFunc = async (row) => {
  ElMessageBox.confirm('确认删除吗？?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      const res = await deleteRow(row)
      // if (res.code === 0) {
      //   ElMessage({
      //     type: 'success',
      //     message: '删除成功!'
      //   })
      //   if (tableData.value.length === 1 && page.value > 1) {
      //     page.value--
      //   }
      //   getTableData()
      // }
    })
}


</script>

<style scoped lang="scss">
.warning {
  color: #dc143c;
}

.metricsbuiltin-table-box {
  overflow: auto;
}

.icon-box {
  width: 32px;
  border: 1px solid pink;
  text-align: center;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: #409eff;
    transition: background-color 0.5s ease
  }
}
</style>