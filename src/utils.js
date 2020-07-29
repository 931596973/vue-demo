export function getFamateDate(value) {
  let date = new Date(value)
  let year = date.getFullYear()
  let month =
    date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1)
      : date.getMonth() + 1
  let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  return year + '-' + month + '-' + day
}

export function getSingleDelPage(pageNum, pageSize, total) {
  let num = 0
  // 是否删除的最后一页
  if (pageNum === Math.ceil(total / pageSize)){
    if ((total - 1) / pageSize === pageNum - 1) {
      num = pageNum - 1
    } else {
      num = pageNum
    }
  } else {
    num = pageNum
  }
  return num
}

export function getMultipleDelPage(pageNum, pageSize, total, selectionNum) {
  let num = 0
  // 是否删除的最后一页
  if (pageNum === Math.ceil(total / pageSize)){
    if ((total - selectionNum) / pageSize === pageNum - 1) {
      num = pageNum - 1
    } else {
      num = pageNum
    }
  } else {
    num = pageNum
  }
  return num
}