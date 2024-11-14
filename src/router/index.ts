import { createRouter, createWebHistory } from 'vue-router'

// export const baseUrl = 'https://cloud-storage-project.onrender.com';
// https://cloud-storage-g8vy.onrender.com
// Test commit 
// export const baseUrl = 'http://localhost:8080';
export const baseUrl = import.meta.env.VITE_BASE_URL;

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