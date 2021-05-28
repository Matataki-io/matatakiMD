import axios from 'axios'
import { getCookie } from '../utils/cookie'
// axios.defaults.withCredentials = true

// interface ApiResult {
//   code: number,
//   data: any
// }

const client = axios.create({
  baseURL: 'http://127.0.0.1:7001',
  timeout: 1000 * 60,
  headers: {
  },
  withCredentials: true
})

// Just copy from matataki-fe
client.interceptors.request.use(
  (config) => {
    const token = getCookie('access-token')
    if (token) { config.headers['access-token'] = token }
    // console.warn('request config:',config)
    return config
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error)
  }
)

client.interceptors.response.use(
  (response) => {
    // if(loadingInstance) loadingInstance.close();
    return response.data
  },
  (error) => {
    // loadingInstance.close()
    console.log(error.message)

    if (error.message.includes('status code 401')) {
      console.log('登录状态异常,请重新登录')
    }
    // 超时处理
    if (error.message.includes('timeout')) {
      console.log('请求超时')
    }
    if (error.message.includes('Network Error')) {
      console.log('Network Error')
    }
    return Promise.reject(error)
  }
)

export default client
