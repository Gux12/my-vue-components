import Vue from 'vue'
import concat from 'lodash/concat'
import Router from 'vue-router'
import math from './math.js'
import common from './common.js'
import SideBar from '@/components/SideBar'

Vue.use(Router)

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
      children: concat(math, common)
    }
  ]
})
