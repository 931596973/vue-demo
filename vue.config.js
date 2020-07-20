module.exports = {
  devServer: {
    proxy: {
      '/api': { //
        target: 'http://10.2.20.114:8080/', //需要请求的目标接口
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}