import Vue from "vue";
import Router from "vue-router";
import { checkUserIsLogin } from "@/utils/myFn"

Vue.use(Router);

const router = new Router({
    //    mode: "history",
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            redirect: { name: 'home' }
        },
        //首页
        {
            path: '/home',
            name: 'home',
            component: () => import(/* webpackChunkName: "home" */ "./views/home")
        },
        //联系我们
        {
            path: '/Contact',
            name: 'contact',
            component: () => import(/* webpackChunkName: "home" */ "./views/contact")
        },
        //帮助中心
        {
            path: '/Help',
            name: 'help',
            component: () => import(/* webpackChunkName: "home" */ "./views/helpCenter")
        },
        // 产品中心
        {
            path: '/Product',
            name: 'product',
            component: () => import(/* webpackChunkName: "product" */ "./views/product")
        },
        // 产品详情
        {
            path: '/Product/detail',
            name: 'detail',
            component: () => import(/* webpackChunkName: "product" */ "./views/product/detail")
        },
        // 项目管理
        {
            path: '/ProjectManage',
            name: 'projectManage',
            component: () => import(/* webpackChunkName: "home" */ "./views/projectManage")
        },
        // 项目详情
        {
            path: '/ProjectManage/detail',
            name: 'pmDetail',
            component: () => import(/* webpackChunkName: "product" */ "./views/projectManage/detail")
        },
        // 创建新项目
        {
            path: '/ProjectManage/createNewProject',
            name: 'createNewProject',
            component: () => import(/* webpackChunkName: "product" */ "./views/projectManage/newProject")
        },
        // 项目发布成功
        {
            path: '/ProjectManage/createNewProject/success',
            name: 'cnSuccess',
            component: () => import(/* webpackChunkName: "product" */ "./views/projectManage/newProject/success")
        },
        // 资源管理
        {
            path: '/ResourceManage',
            name: 'resourseManage',
            component: () => import(/* webpackChunkName: "home" */ "./views/resourceManage")
        },
        // 资源管理详情
        {
            path: '/ResourceManage/detail',
            name: 'rmDetail',
            component: () => import(/* webpackChunkName: "home" */ "./views/resourceManage/detail")
        },
        //个人中心
        {
            path: '/userCenter',
            name: 'userCenter',
            component: () => import(/* webpackChunkName: "userCenter" */ "./views/userCenter")
        },
        //实名认证
        {
            path: '/userCenter/realName',
            name: 'realName',
            component: () => import(/* webpackChunkName: "userCenter" */ "./views/userCenter/real-name")
        },

        //登录
        {
            path: '',
            name: 'login',
            component: () => import(/* webpackChunkName: "login" */ "./views/login"),
            children: [
                //登录
                {
                    path: 'loginIn',
                    name: 'loginIn',
                    component: () => import(/* webpackChunkName: "login" */ "./views/login/login-in")
                },
                //注册
                {
                    path: 'register',
                    name: 'register',
                    component: () => import(/* webpackChunkName: "login" */ "./views/login/register")
                },
            ]
        },
        //修改用户信息
        {
            path: '',
            name: 'changeUserInfo',
            component: () => import(/* webpackChunkName: "change" */ "./views/changeUserInfo"),
            children: [
                {
                    path: '/success',
                    name: 'success',
                    component: () => import(/* webpackChunkName: "change" */ "./views/changeUserInfo/success")
                },
                {
                    path: '/resetCredential',
                    name: 'resetCredential',
                    component: () => import(/* webpackChunkName: "change" */ "./views/changeUserInfo/reset-credential")
                },
                {
                    //修改注册手机号
                    path: '/changeAcctPhone',
                    name: 'changeAcctPhone',
                    component: () => import(/* webpackChunkName: "change" */ "./views/changeUserInfo/change-acctPhone")
                },
                {
                    //修改密码
                    path: '/changePwd',
                    name: 'changePwd',
                    component: () => import(/* webpackChunkName: "change" */ "./views/changeUserInfo/change-pwd")
                },
            ]
        }
    ]
});

// 全局路由守卫
router.beforeEach((to, from, next) => {
    const nextRoute = ['ProjectManage', 'ResourceManage', 'UserCenter'];
    const bool = nextRoute.some(item => {
        return to.path.includes(item)
    })
    if (bool) {
        checkUserIsLogin().then(() => {
            // chrome
            document.body.scrollTop = 0
            // firefox
            document.documentElement.scrollTop = 0
            // safari
            window.pageYOffset = 0
            next()
        }).catch(() => {
            router.push({ name: 'loginIn' })
        })
    } else {
        // chrome
        document.body.scrollTop = 0
        // firefox
        document.documentElement.scrollTop = 0
        // safari
        window.pageYOffset = 0
        next()
    }
});

export default router;