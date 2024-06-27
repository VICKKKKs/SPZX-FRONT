<template>
  <div class="search-div">
    <el-form label-width="70px" size="small">
      <el-row>
        <el-col :span="12">
          <el-form-item label="品牌">
            <el-select
              class="m-2"
              placeholder="选择品牌"
              size="small"
              style="width: 100%"
              v-model="queryDto.brandId"
            >
              <el-option
                v-for="item in brandList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分类">
            <el-cascader
              :props="categoryProps"
              style="width: 100%"
              v-model="searchCategoryIdList"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="display:flex">
        <el-button type="primary" size="small" @click="fetchData()">
          搜索
        </el-button>
        <el-button size="small" @click="resetData">重置</el-button>
      </el-row>
    </el-form>
  </div>

  <div class="tools-div">
    <el-button type="success" size="small" @click="addShow()">添 加</el-button>
  </div>

  <el-table :data="list" style="width: 100%">
    <el-table-column prop="categoryName" label="分类" />
    <el-table-column prop="brandName" label="品牌" />
    <el-table-column prop="logo" label="品牌图标" #default="scope">
      <img :src="scope.row.logo" width="50" />
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
    :page-sizes="[10, 20, 50, 100]"
    layout="total, sizes, prev, pager, next"
    :total="total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />

  <el-dialog v-model="dialogVisible" title="添加或修改" width="30%">
    <el-form label-width="120px">
      <el-form-item label="品牌">
        <el-select
          class="m-2"
          placeholder="选择品牌"
          size="small"
          v-model="categoryBrand.brandId"
        >
          <el-option
            v-for="item in brandList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="分类">
        <el-cascader
          :props="categoryProps"
          v-model="categoryBrand.categoryId"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveOrUpdate">提交</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { FindAllBrand } from '@/api/brand'
import { FindCategoryByParentId } from '@/api/category'
import {
  GetCategoryBrandPageList,
  SaveCategoryBrand,
  UpdateCategoryBrand,
} from '@/api/categoryBrand'
import { ElMessage } from 'element-plus'

// ================数据模型定义  start ===============================================
onMounted(() => {
  // selectAllBrandList()
  fetchData()
})

// const selectAllBrandList = async () => {
//   const { data } = await FindAllBrand()
//   brandList.value = data
// }

// 定义搜索表单数据模型
const brandList = ref([])
const queryDto = ref({ brandId: '', categoryId: '' })
const searchCategoryIdList = ref([])
const dialogVisible = ref(false)

const pageParams = ref({
  page: 1,
  limit: 10,
})

const categoryBrand = ref({
  id: '',
  categoryId: '',
  brandId: '',
})

const addShow = () => {
  dialogVisible.value = true
  categoryBrand.value = { ...null }
}

const editShow = row => {
  dialogVisible.value = true
  categoryBrand.value = { ...row }
}

const saveOrUpdate = async () => {
  if (categoryBrand.value.brandId == '') {
    ElMessage.info('品牌信息必须选择')
    return
  }
  //categoryId为数组：[1,2,3]
  if (categoryBrand.value.categoryId.length != 3) {
    ElMessage.info('分类信息必须选择')
    return
  }
  //系统只需要三级分类id
  categoryBrand.value.categoryId = categoryBrand.value.categoryId[2]
  if (!categoryBrand.value.id) {
    saveData()
  } else {
    editData()
  }
}

const editData = async () => {
  await UpdateCategoryBrand(categoryBrand.value)
  dialogVisible.value = false
  ElMessage.success('操作成功')
  fetchData()
}

const saveData = async () => {
  await SaveCategoryBrand(categoryBrand.value)
  dialogVisible.value = false
  ElMessage.success('操作成功')
  fetchData()
}

const fetchData = async () => {
  FindAllBrand().then(res => {
    brandList.value = res.data
  })

  if (searchCategoryIdList.value.length === 3) {
    queryDto.value.categoryId = searchCategoryIdList.value[2]
  }
  GetCategoryBrandPageList(
    pageParams.value.page,
    pageParams.value.limit,
    queryDto.value
  ).then(res => {
    list.value = res.data.list
    total.value = res.data.total
  })
}

const resetData = () => {
  queryDto.value = { brandId: '', categoryId: '' }
}

//页面变化
const handleSizeChange = size => {
  pageParams.value.limit = size
  fetchData()
}
const handleCurrentChange = number => {
  pageParams.value.page = number
  fetchData()
}

const props = {
  lazy: true,
  value: 'id',
  label: 'name',
  leaf: 'leaf',
  async lazyLoad(node, resolve) {
    if (typeof node.value == 'undefined') node.value = 0
    // 加载数据的方法
    const { data } = await FindCategoryByParentId(node.value)
    let clist = data.filter(item => {
      item.leaf = !item.hasChildren
    })
    resolve(data) // 返回数据
  },
}
const categoryProps = ref(props)

// 定义表格数据模型
const list = ref([])

// 分页条数据模型
const total = ref(0)

// =========   数据模型定义 end======================================================================
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
