import request from './request'

export function getUserInfo() {
  return request({
    url: '/',
    method: 'GET'
  })
}