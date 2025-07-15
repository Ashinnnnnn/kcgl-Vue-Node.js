<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>
<template>
  <div class="not-found-title">
    <h1>404 Not Found</h1>
    <h2>你要找的页面不存在</h2>
    <RouterLink to="/">返回首页</RouterLink>
  </div>
</template>

<style>
.not-found-title {
  text-align: center;
  margin-top: 100px;
}
</style>
