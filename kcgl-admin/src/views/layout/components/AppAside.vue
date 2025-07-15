<script lang="ts" setup>
import { ref } from 'vue'
import {
  User as IconUser,
  Menu as IconMenu,
  Reading as IconReading,
  Setting as IconSetting,
} from '@element-plus/icons-vue' // 导入需要使用图标, 同时设置别名
import { useLayoutStore } from '@/stores/layout'
const layoutStore = useLayoutStore()

//   const isCollapse = ref(false) // 控制菜单折叠与展开的响应数据
</script>

<template>
  <!--  添加的图标与项目名称  -->
  <div class="menu-header">
    <img src="@/assets/logo.svg" class="app-logo" />
    <span class="app-title" v-show="!layoutStore.isCollapse">项目名称</span>
  </div>

  <!--
     添加 router, 让 index 属性变成可跳转链接
     isCollapse  控制菜单的折叠与展开
  -->
  <el-menu router class="el-menu-vertical-demo" :collapse="layoutStore.isCollapse">
    <!-- 点击该项, 路由跳转为 /users -->
    <el-menu-item index="/users">
      <el-icon>
        <IconUser />
      </el-icon>
      <template #title>用户管理</template>
    </el-menu-item>
    <el-menu-item index="/categories">
      <el-icon>
        <IconMenu />
      </el-icon>
      <template #title>分类管理</template>
    </el-menu-item>
    <el-menu-item index="/courses">
      <el-icon>
        <IconReading />
      </el-icon>
      <template #title>课程管理</template>
    </el-menu-item>
    <el-menu-item index="/settings">
      <el-icon>
        <IconSetting />
      </el-icon>
      <template #title>系统设置</template>
    </el-menu-item>
  </el-menu>
</template>

<style>
.menu-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 12px 12px 12px;
  height: 56px;
  line-height: 24px;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
}

.app-logo {
  width: 24px;
  height: 24px;
  margin-right: 0;
}

.app-title {
  font-size: 16px;
  font-weight: bold;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
