import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: '',
            component: () => import('../content/auth/Login.vue')
        },
        {
            path: '/signup',
            name: 'signup',
            component: () => import('../content/auth/Signup.vue')
        },
        {
            path: '/home',
            name: 'home',
            component: () => import('../content/home/HomePage.vue')
        },
        // {
        //     path: '/image',
        //     name: 'image',
        //     component: () => import('../components/AllImage.vue')
        // },
        // {
        //     path: '/signup',
        //     name: 'signup',
        //     component: () => import('../content/auth/Signup.vue')
        // },
        // {
        //     path: '/home',
        //     name: 'home',
        //     component: () => import('../content/home/HomePage.vue')
        // },
    ]
})

export default router