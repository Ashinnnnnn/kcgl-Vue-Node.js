<script setup>
import { getCourses, deleteCourse } from '@/api/courses'
import { ref } from 'vue'
import { timeToDate } from '@/utils/timeHandler'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { genImageUrl } from '@/utils/genImageUrl'

// 查询条件
const queryCondition = ref({
  currentPage: 1,
  pageSize: 10,
})

// 查询结果
const queryResult = ref({
  courses: [],
  pagination: {},
})

// 查询课程
const queryCourses = (otherCondition = {}) => {
  Object.assign(queryCondition.value, otherCondition)
  getCourses(queryCondition.value).then((res) => {
    console.log(res)
    queryResult.value = res.data.data
  })
}

queryCourses()

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

  await deleteCourse(id)
    .then(() => {
      ElMessage.success('课程删除成功')
      queryCourses({ currentPage: 1 })
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
      <div class="card-header">
        <el-button type="primary" @click="$router.push('/courses/create')">新建课程</el-button>
        <el-form :inline="true" :model="queryCondition" class="demo-form-inline">
          <el-form-item label="课程名称">
            <el-input v-model="queryCondition.name" placeholder="模糊查询" clearable />
          </el-form-item>
          <el-form-item label="推荐">
            <el-select v-model="queryCondition.recommended" placeholder="是否推荐" clearable>
              <el-option label="推荐" :value="true" />
              <el-option label="不推荐" :value="false" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryCourses">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </template>

    <!-- 数据存在时显示表格，否则显示空状态 -->
    <div v-if="queryResult.courses.length > 0">
      <el-table :data="queryResult.courses" style="width: 100%">
        <el-table-column prop="name" label="课程名称" align="center" />
        <el-table-column prop="recommended" label="推荐" align="center">
          <template #default="{ row }">{{ row.recommended ? '是' : '否' }}</template>
        </el-table-column>
        <el-table-column prop="introductory" label="入门课程" align="center">
          <template #default="{ row }">{{ row.introductory ? '是' : '否' }}</template>
        </el-table-column>
        <el-table-column prop="likesCount" label="点赞数" align="center" />
        <el-table-column prop="chaptersCount" label="章节数" align="center" />
        <el-table-column prop="image" label="课程图片" align="center">
          <template #default="{ row }">
            <el-avatar :size="40" :src="genImageUrl(row.image)" />
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" :formatter="timeToDate" align="center" />
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button type="success" @click="$router.push(`/courses/edit/${scope.row.id}`)"
              >编辑</el-button
            >
            <el-button type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 没有课程时显示 -->
    <el-empty v-else description="暂无课程" />

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
          @size-change="(pageSize) => queryCourses({ pageSize, currentPage: 1 })"
          @current-change="(currentPage) => queryCourses({ currentPage })"
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
