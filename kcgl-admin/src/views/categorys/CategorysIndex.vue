<script setup>
import { getCategories, deleteCategory } from '@/api/categories'
import { ref } from 'vue'
import { timeToDate } from '@/utils/timeHandler'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

// 查询条件
const queryCondition = ref({
  currentPage: 1,
  pageSize: 10,
})

// 查询结果
const queryResult = ref({
  categories: [],
  pagination: {},
})

// 查询课程
const queryCategories = (otherCondition = {}) => {
  Object.assign(queryCondition.value, otherCondition)
  getCategories(queryCondition.value).then((res) => {
    console.log(res)
    queryResult.value = res.data.data
  })
}

queryCategories()

// 删除课程
const handleDelete = async (id) => {
  await ElMessageBox.confirm('确认要删除这门课程吗?', '删除提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  }).catch(() => {
    ElMessage.info('删除操作已取消')
    return new Promise(() => {})
  })

  await deleteCategory(id)
    .then(() => {
      ElMessage.success('课程删除成功')
      queryCategories({ currentPage: 1 })
    })
    .catch((err) => {
      console.log(err)
      ElMessage.error('课程删除失败')
    })
}
</script>

<template>
  <el-card>
    <template #header>
      <div class="card-header">分类列表</div>
    </template>

    <!-- 数据存在时显示表格，否则显示空状态 -->
    <div v-if="queryResult.categories.length > 0">
      <el-table :data="queryResult.categories" style="width: 100%">
        <el-table-column prop="name" label="分类名称" align="center" />
        <el-table-column prop="rank" label="分类排序" align="center" />
        <el-table-column prop="createdAt" label="创建时间" :formatter="timeToDate" align="center" />
        <!-- <el-table-column label="操作" width="180" align="center"> -->
        <!-- <template #default="scope">
            <el-button type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          </template> -->
        <!-- </el-table-column> -->
      </el-table>
    </div>

    <!-- 分页组件 -->
    <template #footer>
      <el-config-provider :locale="zhCn">
        <el-pagination
          v-model:current-page="queryResult.pagination.currentPage"
          v-model:page-size="queryResult.pagination.pageSize"
          :page-sizes="[3, 5, 10, 15]"
          :background="true"
          layout="total, sizes, prev, pager, next, jumper"
          :total="queryResult.pagination.total"
          @size-change="(pageSize) => queryCategories({ pageSize, currentPage: 1 })"
          @current-change="(currentPage) => queryCategories({ currentPage })"
        />
      </el-config-provider>
    </template>
  </el-card>
</template>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-header .el-form-item {
  margin-bottom: 0px;
}
.demo-form-inline .el-input {
  --el-input-width: 220px;
}
.demo-form-inline .el-select {
  --el-select-width: 170px;
}
</style>
