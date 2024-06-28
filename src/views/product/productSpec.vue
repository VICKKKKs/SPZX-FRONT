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
      <el-button type="danger" size="small" @click="remove(scope.row.id)">
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
  DeleteProductSpecById,
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
    item.specValue = JSON.parse(item.specValue) // 将规格字符串转换成规格js对象,如果规格值不处理，页面不能正常显示规格值
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
  // 深拷贝 productSpec 对象，确保不修改原对象。
  //   处理规格值，将字符串形式的规格值转换为数组。
  // 将规格值转换为 JSON 字符串，以符合后端接口要求。
  // 根据是否存在 id 判断执行更新操作还是新增操作。
  // 更新操作使用 await 等待异步完成，新增操作使用 then 方法处理返回的 Promise。
  // 操作成功后，关闭对话框，显示成功消息，并重新获取数据更新表格。

  // 处理参数
  // 使用 JSON.parse(JSON.stringify(productSpec.value)) 进行深拷贝，确保对 productSpec 的修改不会影响到原对象。
  let productSpecClone = JSON.parse(JSON.stringify(productSpec.value))
  console.log(productSpecClone)

  // 处理规格值值
  // 遍历 productSpecClone.specValue 数组，如果 valueList 是字符串形式，则使用 split(',') 将其转换为数组。这样做的目的是确保每个规格值都是数组形式，便于后续处理。
  productSpecClone.specValue.filter(specValue => {
    if (typeof specValue.valueList === 'string') {
      specValue.valueList = specValue.valueList.split(',') // 避开修改的数据数组
    }
  })

  // 转换规格值为字符串
  // 将 specValue 数组转换为 JSON 字符串。这是为了符合后端接口的要求，通常后端存储数据时需要字符串格式。
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

// 删除
const remove = async id => {
  ElMessageBox.confirm('此操作将永久删除该记录, 是否继续?', 'warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      await DeleteProductSpecById(id)
      ElMessage.success('删除成功')
      fetchData()
    })
    .catch(() => {
      ElMessage.info('取消删除')
    })
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
