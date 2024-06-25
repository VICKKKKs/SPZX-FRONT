<template>
  <div>
    <div class="tools-div">
      <el-button type="success" size="small" @click="addShow()">
        添 加
      </el-button>
    </div>

    <el-table
      :data="list"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      default-expand-all
    >
      <el-table-column prop="title" label="菜单标题" />
      <el-table-column prop="component" label="路由名称" />
      <el-table-column prop="sortValue" label="排序" />
      <el-table-column prop="status" label="状态" #default="scope">
        {{ scope.row.status === 1 ? '正常' : '停用' }}
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column label="操作" align="center" width="280" #default="scope">
        <el-button type="success" size="small" @click="addShow(scope.row)">
          添加下级节点
        </el-button>
        <el-button type="primary" size="small" @click="editShow(scope.row)">
          修改
        </el-button>
        <el-button type="danger" size="small">
          删除
        </el-button>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="30%">
      <el-form label-width="120px">
        <el-form-item label="菜单标题">
          <el-input v-model="sysMenu.title" />
        </el-form-item>
        <el-form-item label="路由名称">
          <el-input v-model="sysMenu.component" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="sysMenu.sortValue" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="sysMenu.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveOrUpdate">提交</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { FindNodes, UpdateSysMenu, SaveSysMenu } from '@/api/sysMenu'
import { ElMessage } from 'element-plus'

onMounted(() => {
  fetchData()
})

//页面表单数据
const defaultForm = {
  id: '',
  parentId: 0,
  title: '',
  url: '',
  component: '',
  icon: '',
  sortValue: 1,
  status: 1,
}

// 定义表格数据模型
const list = ref([])

// 表单响应式数据模型对象
const sysMenu = ref(defaultForm)

const dialogTitle = ref('添加')
const dialogVisible = ref(false)

const addShow = row => {
  dialogVisible.value = true
  sysMenu.value = { ...null }
  if (row) {
    dialogTitle.value = '添加' + row.title + '下一级'
    sysMenu.value.parentId = row.id
  } else {
    dialogTitle.value = '添加顶级'
    sysMenu.value.parentId = 0
  }
}
const editShow = row => {
  dialogVisible.value = true
  sysMenu.value = { ...row }
}

//提交保存与修改
const saveOrUpdate = () => {
  if (sysMenu.value.id) {
    // 修改
    UpdateSysMenu(sysMenu.value).then(response => {
      ElMessage.success('修改成功')
      dialogVisible.value = false
      fetchData()
    })
  } else {
    // 添加
    SaveSysMenu(sysMenu.value).then(response => {
      ElMessage.success('添加成功')
      dialogVisible.value = false
      fetchData()
    })
  }
}

const fetchData = () => {
  // alert("查询")
  FindNodes(0).then(response => {
    list.value = response.data
  })
}
</script>

<style scoped>
.search-div {
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 3px;
  background-color: #fff;
}
.tools-div {
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 3px;
  background-color: #fff;
}
</style>
