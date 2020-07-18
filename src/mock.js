const Mock = require('mockjs')
const Random = Mock.Random
const produceNewsData = function () {
  let newList = []
  for (let i = 0; i < 20; i++) {
    let newNewsObject = {
      id: Random.integer(20,100), //  Random.ctitle( min, max ) 随机产生一个中文标题，长度默认在3-7之间
      name: Random.ctitle( 3, 5 ), // Random.cparagraph(min, max) 随机生成一个中文段落，段落里的句子个数默认3-7个
      buyDate: Random.date(), // Random.date()指示生成的日期字符串的格式,默认为yyyy-MM-dd；
      price: Random.integer(500000, 1000000),
      carNumber: Random.string(5, 10),
      rentStatus: Random.string(3, 3)

    }
    newList.push(newNewsObject)
  }

  return newList
}
// 请求该url，就可以返回newsList
Mock.mock('http://localhost:8080/mock/news', produceNewsData) // 后面讲这个api的使用细节
