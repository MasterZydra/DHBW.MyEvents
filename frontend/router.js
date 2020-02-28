import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from "./views/Home";

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'My Events Home',
        component: Home
    }
];

export default new VueRouter({
    mode: 'history',
    routes
});