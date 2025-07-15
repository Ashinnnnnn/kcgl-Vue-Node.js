<script setup>
import { ref } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import { login } from '@/api/auth'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
const router = useRouter()

// 与表单绑定的数据
const loginForm = ref({
  login: 'admin',
  password: '123123',
})

// 表单校验规则
const loginRules = {
  login: [
    { required: true, message: '请输入账号/邮箱', trigger: 'blur' },
    // { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6位', trigger: 'blur' },
  ],
}

// 表单引用容器
const loginFormRef = ref(null)

// 1.定义登录加载状态
const loading = ref(false)

// 表单提交事件
const onSubmit = async () => {
  try {
    // 通过表单引用容器进行验证
    await loginFormRef.value.validate()
    // 表示登录中
    loading.value = true
    // 登录
    const res = await login(loginForm.value)
    authStore.setToken(res.data.data.token)
    authStore.setUser(res.data.data.user)
    ElMessage.success('登录成功')
    router.push('/')
  } catch (error) {
    console.log(error)
    ElMessage.error('登录失败，请检查账号/密码')
  } finally {
    // 表示登录结束
    loading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="login-title">欢迎登录</h2>
      <!-- 1.给表单添加引用标识  -->
      <el-form
        :model="loginForm"
        :rules="loginRules"
        ref="loginFormRef"
        label-width="auto"
        label-position="top"
        style="max-width: 600px"
      >
        <el-form-item label="账号/邮箱" prop="login">
          <el-input
            v-model="loginForm.login"
            placeholder="请输入账号/邮箱"
            :prefix-icon="User"
            clearable
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <!--  4.对按钮做不同状态的处理  -->
          <el-button :loading="loading" class="login-btn" type="primary" @click="onSubmit">
            {{ loading ? '登录中...' : '登录' }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  width: 90%;
  max-width: 400px;
  padding: 40px;
  background-color: #fff;
  border-radius: 7px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.login-title {
  margin-bottom: 30px;
  color: #333;
  text-align: center;
  font-size: 24px;
  font-weight: 500;
}

.login-btn {
  width: 100%;
  margin-top: 20px;
}
</style>
