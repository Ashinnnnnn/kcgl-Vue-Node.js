<script setup>
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { createCourse, getCoursesById, updateCourse } from '@/api/courses'
import { getCategories } from '@/api/categories'
import { genImageUrl } from '@/utils/genImageUrl'
import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const categories = ref([])

const queryCategorys = (otherCondition = {}) => {
  getCategories(categories.value).then((res) => {
    categories.value = res.data.data.categories
    console.log('课程分类:', categories.value)
  })
}
queryCategorys()

// 表单数据
const form = ref({
  name: '',
  userId: authStore.user.id, // 实际提交
  recommended: false,
  introductory: false,
  content: '',
  image: '',
  categoryId: '',
})

// 上传头像预览图
const imageUrl = ref('')
// 上传进度
const percentage = ref(0)
const isShowProgress = ref(false)

// 判断是否编辑模式
const isEditMode = ref(false)
const courseId = ref(null)

if (route.params.id) {
  isEditMode.value = true
  courseId.value = route.params.id
  getCoursesById(courseId.value).then((res) => {
    console.log('课程详情:', res)
    form.value = res.data.data
    imageUrl.value = genImageUrl(form.value.image)
  })
}

// 提交表单
// const onSubmit = async () => {
//   if (!form.value.name || !form.value.categoryId || !form.value.image || !form.value.content) {
//     ElMessage.warning('请完整填写课程信息')
//     return
//   }
//   try {
//     const action = isEditMode.value
//       ? () => updateCourse(courseId.value, form.value)
//       : () => createCourse(form.value)

//     await action()
//     ElMessage.success(isEditMode.value ? '更新课程成功' : '创建课程成功')
//     router.push('/courses')
//   } catch (err) {
//     console.error(err)
//     ElMessage.error(isEditMode.value ? '更新课程失败' : '创建课程失败')
//   }
// }
const onSubmit = async () => {
  try {
    const action = isEditMode.value
      ? () => updateCourse(courseId.value, form.value)
      : () => createCourse(form.value)

    await action()
    ElMessage.success(isEditMode.value ? '更新课程成功' : '创建课程成功')
    router.push('/courses')
  } catch (err) {
    ElMessage.error(isEditMode.value ? '更新课程失败' : '创建课程失败')
  }
}

// 上传头像成功
const handleAvatarSuccess = (response, uploadFile) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw)
  form.value.image = response.data.url
  isShowProgress.value = false
}

// 上传头像前校验
const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('头像必须为 JPG 格式！')
    return false
  }
  if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('头像大小不能超过 2MB！')
    return false
  }
  isShowProgress.value = true
  return true
}
</script>

<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>{{ isEditMode ? '编辑课程' : '新建课程' }}</span>
      </div>
    </template>

    <el-form :model="form" label-width="auto" style="max-width: 600px">
      <el-form-item label="课程名" required>
        <el-input v-model="form.name" />
      </el-form-item>

      <el-form-item label="用户昵称">
        <el-input :value="authStore.user.nickname" readonly />
      </el-form-item>

      <el-form-item label="课程分类" required>
        <el-select v-model="form.categoryId" placeholder="请选择课程分类">
          <el-option
            v-for="item in categories"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="推荐" required>
        <el-radio-group v-model="form.recommended">
          <el-radio :value="true">是</el-radio>
          <el-radio :value="false">否</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="入门课程" required>
        <el-radio-group v-model="form.introductory">
          <el-radio :value="true">是</el-radio>
          <el-radio :value="false">否</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="课程简介" required>
        <el-input v-model="form.content" type="textarea" />
      </el-form-item>

      <el-form-item label="照片" required>
        <el-progress v-if="isShowProgress" type="circle" :percentage="percentage" :width="178" />
        <el-upload
          v-else
          class="avatar-uploader"
          action="/api/admin/users/uploadAvatar"
          name="avatar"
          :headers="{ Authorization: authStore.token }"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :on-progress="(e) => (percentage = Math.floor(e.percent))"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">{{ isEditMode ? '更新' : '创建' }}</el-button>
        <el-button @click="$router.push('/courses')">取消</el-button>
      </el-form-item>
    </el-form>
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
