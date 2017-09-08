import NotFoundComponent from '@/components/common/NotFoundComponent'
import Home from '@/components/common/Home'

export default [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: Home
  },
  {
    path: '/NotFoundComponent',
    component: NotFoundComponent
  },
  {
    path: '*',
    redirect: '/NotFoundComponent'
  }
]
