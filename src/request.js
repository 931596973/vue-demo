import axios from 'axios'

const service = axios.create({
  // baseURL: 'http://10.2.20.114:8080/',
  timeout: 120000
})

service.interceptors.request.use(config => {
  // config.headers.Authorization = ''
  return config
})

export default service