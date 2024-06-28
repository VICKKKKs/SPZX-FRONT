<template>
  <div class="tools-div">
    <el-button type="success" size="small" @click="addShow">添 加</el-button>
  </div>

  <el-table :data="list" style="width: 100%">
    <el-table-column prop="specName" label="规格名称" />
    <el-table-column label="规格值" #default="scope">
      <div
        v-for="(item1, index1) in scope.row.specValue"
        :key="index1"
        style="padding: 5px; margin: 0;width: 100%;"
      >
        {{ item1.key }}：
        <span
          v-for="(item2, index2) in item1.valueList"
          :key="index2"
          class="div-atrr"
        >
          {{ item2 }}
        </span>
      </div>
    </el-table-column>
    <el-table-column prop="createTime" label="创建时间" />
    <el-table-column label="操作" align="center" width="200" #default="scope">
      <el-button type="primary" size="small" @click="editShow(scope.row)">
        修改
      </el-button>
      <el-button type="danger" size="small">
        删除
      </el-button>
    </el-table-column>
  </el-table>

  <el-pagination
    v-model:current-page="pageParams.page"
    v-model:page-size="pageParams.limit"
    :page-sizes="[10, 20, 50, 100]"
    layout="total, sizes, prev, pager, next"
    :total="total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />

  <el-dialog v-model="dialogVisible" title="添加或修改" width="40%">
    <el-form label-width="120px">
      <el-form-item label="规格名称">
        <el-input v-model="productSpec.specName" />
      </el-form-item>
      <el-form-item>
        <el-button size="default" type="success" @click="addSpec">
          添加新规格
        </el-button>
      </el-form-item>
      <el-form-item
        label=""
        v-for="(item, index) in productSpec.specValue"
        :key="index"
      >
        <el-row>
          <el-col :span="10">
            <el-input
              v-model="item.key"
              placeholder="规格"
              style="width: 90%;"
            />
          </el-col>
          <el-col :span="10">
            <el-input
              v-model="item.valueList"
              placeholder="规格值(如:白色,红色)"
              style="width: 90%;"
            />
          </el-col>
          <el-col :span="4">
            <el-button size="default" type="danger" @click="delSpec(index)">
              删除
            </el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item align="right">
        <el-button type="primary" @click="saveOrUpdate">提交</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  GetProductSpecPageList,
  SaveProductSpec,
  UpdateProductSpec,
} from '@/api/productSpec'
import { ElMessage, ElMessageBox } from 'element-plus'

onMounted(() => {
  fetchData()
})
//页面变化
const handleSizeChange = size => {
  pageParams.value.limit = size
  fetchData()
}
const handleCurrentChange = number => {
  pageParams.value.page = number
  fetchData()
}

const pageParams = ref({
  page: 1,
  limit: 10,
})

const fetchData = async () => {
  const { data } = await GetProductSpecPageList(
    pageParams.value.page,
    pageParams.value.limit
  )
  data.list.forEach(item => {
    item.specValue = JSON.parse(item.specValue) // 将规格字符串转换成规格js对象
  })
  total.value = data.total
  list.value = data.list
}
// 表格数据模型
const list = ref([])

// 分页条数据模型
const total = ref(0)

const productSpec = ref({
  id: '',
  specName: '',
  specValue: [],
})
const dialogVisible = ref(false)
const addShow = () => {
  dialogVisible.value = true
  productSpec.value.id = ''
  productSpec.value.specName = ''
  productSpec.value.specValue = []
}

const editShow = row => {
  dialogVisible.value = true
  productSpec.value = { ...row }
}

const delSpec = index => {
  // alert("删除对话框中的规格信息");
  productSpec.value.specValue.splice(index, 1)
}
const addSpec = () => {
  // alert("新增对话框中的规格信息");
  productSpec.value.specValue.push({})
}
const saveOrUpdate = async () => {
  // 处理参数
  let productSpecClone = JSON.parse(JSON.stringify(productSpec.value))
  console.log(productSpecClone)

  // 处理规格值值
  productSpecClone.specValue.filter(specValue => {
    if (typeof specValue.valueList === 'string') {
      specValue.valueList = specValue.valueList.split(',') // 避开修改的数据数组
    }
  })

  // 转换规格值为字符串
  productSpecClone.specValue = JSON.stringify(productSpecClone.specValue)
  console.log(productSpecClone)

  if (productSpec.value.id) {
    // 有值，修改
    await UpdateProductSpec(productSpecClone)
    dialogVisible.value = false
    ElMessage.success('操作成功')
    fetchData()
  } else {
    // 无值，添加
    SaveProductSpec(productSpecClone).then(response => {
      dialogVisible.value = false
      ElMessage.success('操作成功')
      fetchData()
    })
  }
}
</script>

<style scoped>
.tools-div {
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 3px;
  background-color: #fff;
}

.div-atrr {
  padding: 5px 10px;
  margin: 0 10px;
  background-color: powderblue;
  border-radius: 10px;
}
</style>
