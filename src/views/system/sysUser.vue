<template>
  <div>
    <!---搜索表单-->
    <div class="search-div">
      <el-form label-width="70px" size="small">
        <el-row>
          <el-col :span="12">
            <el-form-item label="关键字">
              <el-input
                style="width: 100%"
                placeholder="用户名、姓名、手机号码"
                v-model="queryDto.keyword"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-date-picker
                type="daterange"
                range-separator="To"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                v-model="dataTimes"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="display: flex">
          <el-button type="primary" size="small" @click="fetchData()">
            搜索
          </el-button>
          <el-button size="small" @click="reset">重置</el-button>
        </el-row>
      </el-form>
    </div>

    <!--添加按钮-->
    <div class="tools-div">
      <el-button type="success" size="small" @click="addShow">添 加</el-button>
    </div>

    <!---数据表格-->
    <el-table :data="list" style="width: 100%">
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="phone" label="手机" />
      <el-table-column prop="avatar" label="头像" #default="scope">
        <img :src="scope.row.avatar" width="50" />
      </el-table-column>
      <el-table-column prop="description" label="描述" />
      <el-table-column prop="status" label="状态" #default="scope">
        {{ scope.row.status == 1 ? '正常' : '停用' }}
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column label="操作" align="center" width="280" #default="scope">
        <el-button type="primary" size="small" @click="editShow(scope.row)">
          修改
        </el-button>
        <el-button type="danger" size="small" @click="deleteById(scope.row)">
          删除
        </el-button>
        <el-button
          type="warning"
          size="small"
          @click="showAssignRole(scope.row)"
        >
          分配角色
        </el-button>
      </el-table-column>
    </el-table>

    <el-pagination
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next"
      :total="total"
    />

    <el-dialog v-model="dialogVisible" title="添加或修改" width="40%">
      <el-form label-width="120px">
        <el-form-item label="用户名">
          <el-input v-model="sysUser.username" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" show-password v-model="sysUser.password" />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="sysUser.name" />
        </el-form-item>
        <el-form-item label="手机">
          <el-input v-model="sysUser.phone" />
        </el-form-item>
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            action="http://localhost:8501/admin/system/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :headers="headers"
          >
            <img v-if="sysUser.avatar" :src="sysUser.avatar" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="sysUser.description" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">提交</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog v-model="dialogRoleVisible" title="分配角色" width="40%">
      <el-form label-width="80px">
        <el-form-item label="用户名">
          <el-input disabled :value="sysUser.username"></el-input>
        </el-form-item>

        <el-form-item label="角色列表">
          <el-checkbox-group v-model="userRoleIds">
            <el-checkbox
              v-for="role in allRoles"
              :key="role.id"
              :label="role.id"
            >
              {{ role.roleName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="doAssign">提交</el-button>
          <el-button @click="dialogRoleVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  GetSysUserListByPage,
  SaveSysUser,
  UpdateSysUser,
  DeleteSysUserById,
} from '@/api/sysUser'
import { GetAllRoleList, DoAssignRoleToUser } from '@/api/sysRole'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useApp } from '@/pinia/modules/app'

const headers = {
  token: useApp().authorization.token, // 从pinia中获取token，在进行文件上传的时候将token设置到请求头中
}

onMounted(() => {
  fetchData()
})

const reset = () => {
  queryDto.value = { ...null }
}

// 表格数据模型
const list = ref([])

// 分页条数据模型
const total = ref(0)
// 分页请求参数
const pageParam = ref({
  pageNum: 1,
  pageSize: 10,
})

// 表单参数
const queryDto = ref({
  keyword: '',
  createTimeBegin: '',
  createTimeEnd: '',
})
const dataTimes = ref([])

// sysUser对象模型
const sysUser = ref({
  username: '',
  name: '',
  phone: '',
  password: '',
  description: '',
  avatar: '',
})

const allRoles = ref([])
const userRoleIds = ref([])

const handleAvatarSuccess = (response, uploadFile) => {
  sysUser.value.avatar = response.data
}

// 显示对话框函数
const dialogVisible = ref(false)
const dialogRoleVisible = ref(false)
const showAssignRole = row => {
  userId.value = row.id
  dialogRoleVisible.value = true
  sysUser.value = { ...row }
  // 打开分配对话框后要显示所有角色和当前用户已经拥有的角色
  GetAllRoleList(row.id).then(response => {
    allRoles.value = response.data.allRoles
    userRoleIds.value = response.data.currentRoleIds
  })
}
const addShow = () => {
  dialogVisible.value = true
  sysUser.value = { ...null }
}
const editShow = row => {
  dialogVisible.value = true
  sysUser.value = { ...row }
}

// 提交分配函数
const userId = ref(0)
const doAssign = async () => {
  // 手动封装的userId对应角色ids的js对象
  let assginRoleVo = {
    userId: userId.value,
    roleIdList: userRoleIds.value,
  }
  const { code, message, data } = await DoAssignRoleToUser(assginRoleVo)
  if (code === 200) {
    ElMessage.success('操作成功')
    dialogRoleVisible.value = false
    fetchData()
  }
}

// 提交函数
const submit = () => {
  if (sysUser.value.id) {
    UpdateSysUser(sysUser.value).then(response => {
      ElMessage.success('修改成功')
      dialogVisible.value = false
      fetchData()
    })
  } else {
    SaveSysUser(sysUser.value).then(response => {
      ElMessage.success('添加成功')
      dialogVisible.value = false
      fetchData()
    })
  }
}

const fetchData = async () => {
  if (dataTimes.value.length == 2) {
    queryDto.value.createTimeBegin = dataTimes.value[0]
    queryDto.value.createTimeEnd = dataTimes.value[1]
  }
  const { data, code, message } = await GetSysUserListByPage(
    pageParam.value.pageNum,
    pageParam.value.pageSize,
    queryDto.value
  )
  list.value = data.list
  total.value = data.total
}

// 删除角色
const deleteById = row => {
  ElMessageBox.confirm('此操作将永久删除该记录, 是否继续?', 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const { code } = await DeleteSysUserById(row.id)
      if (code === 200) {
        ElMessage.success('删除成功')
        fetchData()
      }
    })
    .catch(() => {
      ElMessage.info('取消删除')
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
<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
