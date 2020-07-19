import axios from 'axios'

const service = axios.create({
  // baseURL: '',
  timeout: 120000
})

service.interceptors.request.use(config => {
  // config.headers.Authorization = ''
  return config
})

export default service