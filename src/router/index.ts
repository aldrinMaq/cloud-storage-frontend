import { createRouter, createWebHistory } from 'vue-router'

// export const baseUrl = 'https://cloud-storage-project.onrender.com';

export const baseUrl = 'https://262b-2001-4455-266-d800-e540-a8ee-6a3c-b78f.ngrok-free.app';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: '',
            component: () => import('../content/home/HomePage.vue')
        },
        {
            path: '/login',
            name: 'login',
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
        {
            path: '/profile',
            name: 'profile',
            component: () => import('../content/profile/Profile.vue')
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