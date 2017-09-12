// 引入组件
import Index from 'src/components/icons/Index.vue'
import IconFindIphone from 'src/components/icons/IconFindIphone.vue'
// 导出路由
export default [
  {
    path: '/icons',
    component: Index,
    children: [
      {
        path: 'IconFindIphone',
        component: IconFindIphone
      }
    ]
  }
]
