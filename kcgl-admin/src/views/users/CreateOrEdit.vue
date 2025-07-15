<script setup>
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { createUser, getUsersById, updateUser } from '@/api/users'
import { genImageUrl } from '@/utils/genImageUrl'
import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// 绑定表单的响应式数据
const form = ref({
  email: '',
  username: '',
  password: '',
  nickname: '',
  sex: 2,
  company: '',
  introduce: '',
  role: 0,
  avatar: '',
})

const onSubmit = async () => {
  try {
    //密码为空则不修改密码，服务端password字段为undefined，则不修改密码
    if (isEditMode.value && form.value.password === '') {
      form.value.password = undefined
    }
    //封装两个动作为函数
    const userUpdate = () => updateUser(userId.value, form.value)
    const userCreate = () => createUser(form.value)
    //判断是否为编辑模式，如果是则更新用户信息，否则创建新用户
    const saveOrupdate = isEditMode.value ? userUpdate : userCreate
    //执行保存或更新操作，并跳转到用户列表页面
    await saveOrupdate()
    ElMessage.success(isEditMode.value ? '更新用户成功' : '创建用户成功')
    router.push('/users')
  } catch (error) {
    console.log(error)
    ElMessage.error(isEditMode.value ? '更新用户失败' : '创建用户失败')
  }
}

// 图片地址-只是为了临时显示
const imageUrl = ref('')
// 上传头像成功-要干的事情
const handleAvatarSuccess = (response, uploadFile) => {
  // 临时内存中的图片地址
  imageUrl.value = URL.createObjectURL(uploadFile.raw)
  // console.log(response.data)
  // 服务器返回的图片地址
  form.value.avatar = response.data.url
}
// 上传头像之前的校验
const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('头像必须为 JPG 格式！')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('头像大小不应超过 2MB!')
    return false
  }
  isShowProgress.value = true
  return true
}

// 记录上传进度
const percentage = ref(0)
// 是否显示上传进度条
const isShowProgress = ref(false)

//标记是否为编辑模式
const isEditMode = ref(false)
//编辑模式下的用户id
const userId = ref(null)

//判断是否为编辑模式
if (route.params.id) {
  isEditMode.value = true
  userId.value = route.params.id
  //获取用户信息，填充表单
  getUsersById(userId.value).then((res) => {
    form.value = res.data.data.user
    form.value.password = ''
    imageUrl.value = genImageUrl(res.data.data.user.avatar)
  })
}
</script>

<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>{{ isEditMode ? '编辑用户' : '新建用户' }}</span>
      </div>
    </template>
    <el-form :model="form" label-width="auto" style="max-width: 600px">
      <el-form-item label="邮箱" required>
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item label="用户名" required>
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item label="密码" required>
        <el-input v-model="form.password" placeholder="留空表示不修改密码" type="password" />
      </el-form-item>
      <el-form-item label="昵称">
        <el-input v-model="form.nickname" />
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="form.sex">
          <el-radio :value="0">男</el-radio>
          <el-radio :value="1">女</el-radio>
          <el-radio :value="2">未选择</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="公司">
        <el-input v-model="form.company" />
      </el-form-item>
      <el-form-item label="个人简介">
        <el-input v-model="form.introduce" type="textarea" />
      </el-form-item>
      <el-form-item label="角色">
        <el-select v-model="form.role" placeholder="请选择">
          <el-option label="管理员" :value="100" />
          <el-option label="普通用户" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="头像">
        <el-progress v-show="isShowProgress" type="circle" :percentage="percentage" :width="178" />
        <el-upload
          v-show="!isShowProgress"
          class="avatar-uploader"
          action="/api/admin/users/uploadAvatar"
          name="avatar"
          :on-progress="
            (e) => {
              percentage = Math.floor(e.percent)
            }
          "
          :headers="{ Authorization: authStore.token }"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" @load="isShowProgress = false" />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">{{ isEditMode ? '更新' : '创建' }}</el-button>
        <el-button type="default" @click="$router.push('/users')">取消</el-button>
      </el-form-item>
    </el-form>
    <template #footer></template>
  </el-card>
</template>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed gray;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: gray;
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
