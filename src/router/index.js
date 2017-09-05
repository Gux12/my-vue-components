import concat from 'lodash/concat'
import Vue from 'vue'
import Router from 'vue-router'
import math from './math.js'
import Hello from '@/components/common/Hello'
import NotFoundComponent from '@/components/common/NotFoundComponent'

Vue.use(Router)

export default new Router({
  routes: concat([
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/NotFoundComponent',
      name: 'NotFoundComponent',
      component: NotFoundComponent
    },
    {
      path: '*',
      redirect: '/NotFoundComponent'
    }
  ], math)
})
