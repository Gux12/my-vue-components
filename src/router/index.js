// 引入第三方库
import Vue from 'vue'
import concat from 'lodash/concat'
import Router from 'vue-router'
// 引入路由
import math from './math'
import threejs from './threejs'
import icons from './icons'
import basic from './basic'
import common from './common'
// 引入组件
import SideBar from 'src/components/basic/SideBar'
// 插入中间件
Vue.use(Router)
// 导出路由对象
export default new Router({
  routes: [
    {
      path: '/',
      components: {
        default: {
          name: 'ContentPanel',
          template: '<router-view></router-view>'
        },
        header: SideBar
      },
      children: concat(math, threejs, icons, common, basic)
    }
  ]
})
