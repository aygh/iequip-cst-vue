import { $http } from '@/utils/http'
//检测用户登录状态
export function checkUserIsLogin() {
    return new Promise((resolve, reject) => {
        $http.post('/iequip/v1/portal/accounts/isLogin')
        .then(res => {
            if(res.data) {
                resolve()
            }else {
                reject()
            }
        })
        .catch(err => {
            reject(err)
        })
    })
} 