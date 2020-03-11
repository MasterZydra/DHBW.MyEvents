import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Events from '../views/Events.vue'

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'My Events Home',
    component: Home
  },
  {
    path: '/events',
    name: 'My Events',
    component: Events
  }
];

const router = new VueRouter({
  mode: "history",
  routes
});

export default router
