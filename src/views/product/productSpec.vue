<template>
  <div class="tools-div">
    <el-button type="success" size="small">添 加</el-button>
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
    <el-table-column label="操作" align="center" width="200">
      <el-button type="primary" size="small">
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
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { GetProductSpecPageList } from '@/api/productSpec'

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
