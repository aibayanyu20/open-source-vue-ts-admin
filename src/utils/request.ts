import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import { UserModule } from '@/store/modules/user'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 60000
})

// Request interceptors
service.interceptors.request.use(
  (config) => {
    // Add Access-Token header to every request, you can add other custom headers here
    if (UserModule.token) {
      config.headers['Access-Token'] = UserModule.token
    }
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

// Response interceptors
service.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.code !== 200) {
      // 当前用户已经退出登录
      isLogout(res)
      return Promise.reject(new Error(res.msg || '服务器连接失败'))
    } else {
      return response.data
    }
  },
  (error) => {
    if (error.response.data) {
      const data = error.response.data
      isLogout(data)
    } else {
      if (error.response.data.message) {
        Message({
          message: error.response.data.message,
          type: 'error',
          duration: 5 * 1000
        })
      } else {
        Message({
          message: error.message,
          type: 'error',
          duration: 5 * 1000
        })
      }
    }
    return Promise.reject(error)
  }
)
interface CallbackInterface {
  code:number
  msg:string
  data?:any
}

const isLogout = (res:CallbackInterface) => {
  if (res.code === 10000) {
    MessageBox.confirm(
      '当前账号已离线，请重新登录',
      '登录过期',
      {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(() => {
      UserModule.ResetToken()
      location.reload() // To prevent bugs from vue-router
    })
  } else {
    Message({
      message: res.msg || '服务器连接失败',
      type: 'error',
      duration: 5 * 1000
    })
  }
}

export default service
