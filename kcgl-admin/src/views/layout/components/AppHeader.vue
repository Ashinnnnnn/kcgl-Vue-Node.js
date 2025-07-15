<script setup>
import { Expand, Fold } from '@element-plus/icons-vue'
import { useLayoutStore } from '@/stores/layout'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
const router = useRouter()
const authStore = useAuthStore()
const layoutStore = useLayoutStore()

//退出登录
const handleLogout = () => {
  authStore.logout()
  router.push('login')
}
</script>

<template>
  <div class="app-header">
    <!-- 折叠/展开菜单按钮 -->
    <el-icon class="app-header-menu-btn" @click="layoutStore.toggleCollapse">
      <Expand v-if="layoutStore.isCollapse" />
      <Fold v-else />
    </el-icon>

    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item
        v-for="(item, index) in $route.matched"
        :key="index"
        :to="{ path: item.path }"
        >{{ item.meta.title }}
      </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 用户退出 -->
    <el-dropdown class="app-header-user-dropdown">
      <span class="el-dropdown-link"> {{ authStore.user.username }} </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>用户中心</el-dropdown-item>
          <el-dropdown-item>选项</el-dropdown-item>
          <el-dropdown-item @click="handleLogout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<style scoped>
.app-header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 60px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  padding: 0px 20px;
}

.app-header-menu-btn {
  font-size: 20px;
  cursor: pointer;
  margin-right: 20px;
}

.app-header-user-dropdown {
  margin-left: auto;
}

.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>
