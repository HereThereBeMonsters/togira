import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/toggl-entries',
    name: 'toggl-entries',
    // route level code-splitting
    // this generates a separate chunk (toggl-entries.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "toggl-entries" */ '../views/TogglEntries.vue')
  },
  {
    path: '/config',
    name: 'config',
    component: () => import(/* webpackChunkName: "config" */ '../views/Config.vue')
  }
];

const router = new VueRouter({
  routes
});

export default router;
