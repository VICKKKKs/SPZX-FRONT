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
    :page-sizes="[10, 20, 50, 100]"
    layout="total, sizes, prev, pager, next"
    :total="total"
  />
</template>

<script setup>
import { ref } from 'vue'

// 表格数据模型
const list = ref([
  {
    id: 2,
    createTime: '2023-05-06 12:56:08',
    specName: '笔记本电脑',
    specValue: [{ key: '内存', valueList: ['8G', '18G', '32G'] }],
  },
  {
    id: 1,
    createTime: '2023-05-06 12:40:22',
    specName: '小米手机',
    specValue: [
      { key: '颜色', valueList: ['白色', '红色', '黑色'] },
      { key: '内存', valueList: ['8G', '18G'] },
    ],
  },
])

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
