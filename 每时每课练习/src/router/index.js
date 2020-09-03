import Vue from 'vue';
import Router from 'vue-router';
import routes from './routes'
import store from '../store'

Vue.use(Router);

const router = new Router({
    mode: 'history',
    scrollBehavior: () => ({ y: 0 }),
    base: process.env.BASE_URL,
    routes,
});

// 规则
router.beforeEach((to, from, next) => {
    if (to.meta.footer) {
        store.commit('SET_FOOT', to.name)
    } else {
        store.commit('SET_FOOT')
    }
    document.title = to.meta.title
    next()
})

export default router
