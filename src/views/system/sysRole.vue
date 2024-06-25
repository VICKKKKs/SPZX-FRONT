<template>
  <div class="search-div">
    <!-- 搜索表单 -->
    <el-form label-width="70px" size="small">
      <el-form-item label="角色名称">
        <el-input
          style="width: 100%"
          placeholder="角色名称"
          v-model="queryDto.roleName"
        ></el-input>
      </el-form-item>
      <el-row style="display: flex">
        <el-button type="primary" size="small" @click="fetchData">
          搜索
        </el-button>
        <el-button size="small" @click="reset">重置</el-button>
      </el-row>
    </el-form>

    <!-- 添加按钮 -->
    <div class="tools-div">
      <el-button type="success" size="small" @click="addShow()">
        添 加
      </el-button>
    </div>

    <!--- 角色表格数据 -->
    <el-table :data="list" style="width: 100%">
      <el-table-column prop="roleName" label="角色名称" width="180" />
      <el-table-column prop="roleCode" label="角色code" width="180" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column label="操作" align="center" width="280" #default="scope">
        <el-button type="primary" size="small" @click="editShow(scope.row)">
          修改
        </el-button>
        <el-button type="danger" size="small" @click="deleteById(scope.row)">
          删除
        </el-button>
        <!-- 分配菜单按钮 -->
        <el-button
          type="warning"
          size="small"
          @click="showAssignMenu(scope.row)"
        >
          分配菜单
        </el-button>
      </el-table-column>
    </el-table>

    <!--分页条-->
    <el-pagination
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next"
      :total="total"
    />

    <!-- 添加角色表单对话框 -->
    <el-dialog v-model="dialogVisible" title="添加或修改角色" width="30%">
      <el-form label-width="120px">
        <el-form-item label="角色名称">
          <el-input v-model="sysRole.roleName" />
        </el-form-item>
        <el-form-item label="角色Code">
          <el-input v-model="sysRole.roleCode" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">提交</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 分配菜单的对话框  -->
    <el-dialog v-model="dialogMenuVisible" title="分配菜单" width="40%">
      <el-form label-width="80px">
        <el-tree
          :data="sysMenuTreeList"
          show-checkbox
          default-expand-all
          node-key="id"
          :props="defaultProps"
          :check-on-click-node="true"
          :ref="tree"
        />
        <el-form-item>
          <el-button type="primary" @click="doAssign">提交</el-button>
          <el-button @click="dialogMenuVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  GetSysRoleListByPage,
  SaveSysRole,
  UpdateSysRole,
  DeleteSysRoleById,
  GetSysRoleMenuIds,
  DoAssignMenuIdToSysRole,
} from '@/api/sysRole'
import { ElMessage, ElMessageBox } from 'element-plus'

onMounted(() => {
  // alert("调用后端分页接口")
  fetchData()
})

// 分页请求参数
const pageParam = ref({
  pageNum: 1,
  pageSize: 10,
})

// 表单参数
const queryDto = ref({
  roleName: '',
})

//分配菜单
const defaultProps = {
  children: 'children',
  label: 'title',
}

// 菜单中的数据
const sysMenuTreeList = ref([])

const dialogMenuVisible = ref(false)
const roleId = ref(0)

// 分配对话框
const tree = ref()
const showAssignMenu = row => {
  dialogMenuVisible.value = true
  roleId.value = row.id
  GetSysRoleMenuIds(roleId.value).then(response => {
    sysMenuTreeList.value = response.data.sysMenuList
    tree.value.setCheckedKeys(response.data.roleMenuIds)
  })
}

// 提交分配菜单
const doAssign = () => {
  // alert('提交分配')
  dialogMenuVisible.value = false
  // a().then(response => {
  //   sysMenuTreeList.value = response.data.sysMenuTreeList
  //   tree.value.setCheckedNodes(response.data.MenuIds)
  // })
}

// 分页条总记录数
let total = ref(0)

// 定义表格数据模型
let list = ref([])

// 对话框数据模型
const sysRole = ref({
  id: '',
  roleCode: '',
  roleName: '',
})
const dialogVisible = ref(false)

// 显示对话框
const addShow = () => {
  dialogVisible.value = true
  sysRole.value = { ...null }
}
const editShow = row => {
  dialogVisible.value = true
  sysRole.value = { ...row }
}

// 提交保存
const submit = () => {
  if (sysRole.value.id) {
    UpdateSysRole(sysRole.value).then(response => {
      ElMessage.success('修改成功')
      dialogVisible.value = false
      fetchData()
    })
  } else {
    SaveSysRole(sysRole.value).then(response => {
      ElMessage.success('添加成功')
      dialogVisible.value = false
      fetchData()
    })
  }
}

/* const deleteRole = (row) => {
    DeleteSysRole(row.id).then(response => {
      ElMessage.success('删除成功')
      dialogVisible.value = false
      fetchData()
    })
} */

// 删除数据
const deleteById = row => {
  ElMessageBox.confirm('此操作将永久删除该记录, 是否继续?', 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const { code } = await DeleteSysRoleById(row.id)
      if (code === 200) {
        ElMessage.success('删除成功')
        fetchData()
      }
    })
    .catch(() => {
      ElMessage.info('取消删除')
    })
}

// 重置
const reset = () => {
  queryDto.value = { ...null }
  fetchData()
}

// 获取分页数据
const fetchData = () => {
  // alert("调用后端分页接口")
  GetSysRoleListByPage(
    pageParam.value.pageNum,
    pageParam.value.pageSize,
    queryDto.value
  ).then(response => {
    list.value = response.data.list
    total.value = response.data.total
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
