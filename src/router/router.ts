
import { createRouter, createWebHistory,RouteRecordRaw } from "vue-router";
import { useUserStore } from '@/store/user';

const Home  = () => import('@/view/Home.vue')
const Login = () =>import('@/view/Login.vue')

const ImageList = ()=>import('@/view/imageManage/ImageManage.vue')
const ImageDetail = ()=>import('@/view/imageManage/ImageDetail.vue')
const UserList = ()=>import('@/view/userManage/UserManage.vue')
const UserDetail = ()=>import('@/view/userManage/UserDetail.vue')
const  routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/home' // 默认就跳转此页面
    },
    {
        path: "/home",
        name: "home",
        meta: {
            auth: true,
            keepAlive: false
        },
        component: Home,
        children:[
            {
                path: '/image-manage/imageList',
                component: ImageList,
                meta: {
                    auth: true,
                    keepAlive: false
                },
                name: 'imageList'
            },
            {
                path: '/image-manage/ImageDetail',
                component: ImageDetail,
                meta: {
                    auth: true,
                    keepAlive: false
                },
                name: 'imageDetail'
            },
            {
                path: '/user-manage/userList',
                component: UserList,
                meta: {
                    auth: true,
                    keepAlive: false
                },
                name: 'userList'
            },
            {
                path: '/user-manage/userDetail',
                component: UserDetail,
                meta: {
                    auth: true,
                    keepAlive: false
                },
                name: 'userDetail'
            },
        ]
    },
    {
        path: "/login",
        name: "login",
        meta: {
            auth: false,
            keepAlive: false
        },
        component: Login
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

router.beforeEach((to, from, next) => {
    const store = useUserStore();
    if (to.path == '/login') {
        store.Authorization = ''
        store.nickname = ''

    }
    if (to.meta.auth) {
        if (store.Authorization) {
            // store.$state.historyRouter = from.path
            // store.$state.toRouter = to.path
            next()
        } else {
            next({
                path: '/login'
            })
        }
    } else {
        next()
    }
});

export default router
