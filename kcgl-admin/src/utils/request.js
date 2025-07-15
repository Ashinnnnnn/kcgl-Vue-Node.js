import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

// 创建axios实例
const request = axios.create({
  baseURL: 'http://localhost:3000', // API基础URL
  baseURL: '/api',
  timeout: 5000, // 请求超时时间
})

// 请求-拦截器
request.interceptors.request.use(
  (config) => {
    // 之所以有这个 if 判断, 是因为早期代码验证担心 headers 不存在.
    // 防止访问 config.undefined.Authorization 而报错
    if (config.headers) {
      const authStore = useAuthStore()
      config.headers.Authorization = authStore.token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 响应-拦截器
request.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default request
