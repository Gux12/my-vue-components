import NotFoundComponent from 'src/components/basic/NotFoundComponent'
import Home from 'src/components/basic/Home'

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
