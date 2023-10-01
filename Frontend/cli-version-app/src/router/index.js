import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/addpost',
    name: 'addpost',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AddpostView.vue'),
    //  props: (route) => ({
    //   postId: route.query.postId,
     //})
    //   // Retrieve more query parameters as needed
  }, 
  // {
  //   path: '/addpost/:postId',
  //   name: 'addpost',
  //   component: () => import(/* webpackChunkName: "about" */ '../views/AddpostView.vue'),
  //   props: (route) => ({
  //     postId: route.params.postId,
  //   }),
  // },
  {
    path: '/login',
    name: 'login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/LoginView.vue')
  },
  {
    path: '/signup',
    name: 'signup',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "signup" */ '../views/SignupView.vue')
  },
  {
    path: '/editprofile',
    name: 'EditProfile',
    component: () => import('../views/EditProfileView.vue'), // Import your EditProfileView component
  },
  {
    path: '/:postId',
    name: 'CommentPostView',
    component: () => import('../views/CommentPostView.vue'),
    props: true, // Pass the postId as a prop
  }
  

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
