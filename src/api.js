import request from './request'

export function getParentCarType({ id, carTypeName, carTypeCode, carTypeParent }) {
  return request({
    url: `/api/getParentCarType?id=${id}&carTypeName=${carTypeName}&carTypeCode=${carTypeCode}&carTypeParent=${carTypeParent}`,
    method: 'GET'
  })
}

export function getCarType({ id, carTypeName, carTypeCode }) {
  return request({
    url: `/api/getCarType?id=${id}&carTypeName=${carTypeName}&carTypeCode=${carTypeCode}`,
    method: 'GET'
  })
}

export function updateCarType(data) {
  return request({
    url: `/api/modifyCarType`,
    method: 'POST',
    data
  })
}

export function addCarType(data) {
  return request({
    url: `/api/insertCarType`,
    method: 'POST',
    data
  })
}

export function deleteCaarType(data) {
  return request({
    url: '/api/deleteCarType',
    method: 'POST',
    data
  })
}

export function getCar({ cartypeId, pageNum, pageSize, searchText }) {
  return request({
    url: `/api/getCar?cartypeId=${cartypeId}&pageNum=${pageNum}&pageSize=${pageSize}&searchText=${searchText}`,
    method: 'GET'
  })
}

export function addCar(data) {
  return request({
    url: '/api/insertCar',
    method: 'POST',
    data
  })
}

export function updateCar(data) {
  return request({
    url: '/api/modifyCar',
    method: 'POST',
    data
  })
}

export function deleteCar(data) {
  return request({
    url: '/api/deleteCar',
    method: 'POST',
    data
  })
}

export function getRent({ carCode, pageNum, pageSize, searchText }) {
  return request({
    url: `/api/getRent?carCode=${carCode}&pageNum=${pageNum}&pageSize=${pageSize}&searchText=${searchText}`,
    method: 'GET'
  })
}

export function updateRent(data) {
  return request({
    url: '/api/modifyRent',
    method: 'POST',
    data
  })
}

export function addRent(data) {
  return request({
    url: '/api/insertRent',
    method: 'POST',
    data
  })
}

export function deleteRent(data) {
  return request({
    url: '/api/deleteRent',
    method: 'POST',
    data
  })
}