<script setup>
import AppAside from './components/AppAside.vue'
import AppHeader from './components/AppHeader.vue'
</script>
<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="auto">
        <AppAside />
      </el-aside>
      <el-container>
        <el-header>
          <AppHeader />
        </el-header>
        <el-main>
          <el-scrollbar>
            <RouterView />
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<style scoped>
.el-header {
  padding: 0px;
}
</style>
