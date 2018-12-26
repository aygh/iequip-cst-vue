export default {
    state: {
        myNavList: [{
                path: "/",
                name: "首页"
            },
            {
                path: "/Product",
                name: "产品中心"
            },
            {
                path: "/ProjectManage",
                name: "项目管理"
            },
            {
                path: "/ResourceManage",
                name: "资源管理"
            },
            {
                path: "/Help",
                name: "帮助中心"
            },
            {
                path: "/Contact",
                name: "联系我们"
            },
            {
                path: "/UserCenter",
                name: "个人中心"
            },
        ]
    },
    mutations: {
        changeNav(state, path) {
            state.myNavList.forEach(item => {
                if (item.name === '个人中心') item.path = path;
            })
        }
    },
}