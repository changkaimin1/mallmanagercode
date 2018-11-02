// 导入axios
import axios from 'axios'

// 从文档中得知: 需要一个对象.属性install, 参数一是Vue, 参数二是可选
const HttpTool = {}
HttpTool.install = (Vue) => {
  // 在添加到Vue原型之前, 先给axios配置上基本地址baseURL
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
  // 将axios添加到Vue的原型上
  Vue.prototype.$http = axios
}

// 导出对象 HttpTool
export default HttpTool
