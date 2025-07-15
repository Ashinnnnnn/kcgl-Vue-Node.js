<script setup>
import { getUsers, deleteUser } from '@/api/users'
import { ref } from 'vue'
import { timeToDate } from '@/utils/timeHandler'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { genImageUrl } from '@/utils/genImageUrl'

//查询条件
const queryCondition = ref({
  currentPage: 1,
  pageSize: 10,
})

//查询结果
const queryResult = ref({
  users: [],
  pagination: {},
})

//查询函数
const queryUsers = (otherCondition = {}) => {
  Object.assign(queryCondition.value, otherCondition)
  getUsers(queryCondition.value).then((res) => {
    console.log(res)
    queryResult.value = res.data.data
  })
}

queryUsers()

//性别格式化
const sexFormat = (val) => {
  if (val === 0) {
    return '男'
  } else if (val === 1) {
    return '女'
  } else {
    return '未知'
  }
}

//删除按钮点击事件
const handleDelete = async (id) => {
  await ElMessageBox.confirm('确认要删除吗?', '删除询问', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  }).catch(() => {
    ElMessage.success('删除用户动作被取消..')
    // 没有return,会得到一个成功的promise,即代码会继续向下执行
    // 这里返回一个无状态的promise,会阻止代码执行
    return new Promise(() => {})
  })

  // 通过接口执行删除操作
  await deleteUser(id)
    .then((res) => {
      ElMessage.success('删除用户成功!')
      queryUsers({ currentPage: 1 })
    })
    .catch((err) => {
      console.log(err)
      ElMessage.error('删除用户失败..')
    })
}
</script>

<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <el-button type="primary" @click="$router.push('/users/create')">新建用户</el-button>
        <el-form :inline="true" :model="queryCondition" class="demo-form-inline">
          <el-form-item label="昵称">
            <el-input v-model="queryCondition.nickname" placeholder="模糊查询" clearable />
          </el-form-item>
          <el-form-item label="角色">
            <el-select v-model="queryCondition.role" placeholder="角色" clearable>
              <el-option label="管理员" value="100" />
              <el-option label="普通用户" value="0" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryUsers">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </template>
    <el-table :data="queryResult.users" style="width: 100%">
      <el-table-column prop="email" label="邮箱" align="center" />
      <el-table-column prop="username" label="用户名" align="center" />
      <el-table-column prop="nickname" label="昵称" align="center" />
      <el-table-column prop="sex" label="性别" v-slot="{ row }" align="center">
        {{ sexFormat(row.sex) }}
      </el-table-column>
      <el-table-column prop="role" label="角色" v-slot="{ row }" align="center">
        {{ row.role === 100 ? '管理员' : '普通用户' }}
      </el-table-column>
      <el-table-column prop="avatar" label="头像" v-slot="{ row }" align="center">
        <el-avatar :size="40" :src="genImageUrl(row.avatar)" />
      </el-table-column>
      <el-table-column prop="createdAt" label="注册日期" :formatter="timeToDate" />
      <el-table-column label="操作" width="180" align="center">
        <template #default="scope">
          <el-button type="success" @click="$router.push(`/users/edit/${scope.row.id}`)"
            >编辑</el-button
          >
          <el-button type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <el-config-provider :locale="zhCn">
        <el-pagination
          v-model:current-page="queryResult.pagination.currentPage"
          v-model:page-size="queryResult.pagination.pageSize"
          :page-sizes="[3, 5, 10, 15]"
          :background="true"
          layout="total, sizes, prev, pager, next, jumper"
          :total="queryResult.pagination.total"
          @size-change="(pageSize) => queryUsers({ pageSize, currentPage: 1 })"
          @current-change="(currentPage) => queryUsers({ currentPage })"
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
