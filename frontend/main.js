import Vue from 'vue'
import App from './App.vue'
import router from './router';

export default new Vue({
    router,
    render: function (h) { return h(App) },
}).$mount('#app');