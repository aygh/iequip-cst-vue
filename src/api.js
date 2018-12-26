export const userApi = {
    register: '/iequip/v1/portal/accounts', //5.1.用户注册 POST 
    // resetPWD: '/iequip/v1/portal/accounts/credential', //5.3用户密码更新 PATCH 
    resetPWD: (name, authtype) => `/api/v1/xk/manage/user/${name}/credence/${authtype}`,  //put
    changePhone: '/iequip/v1/portal/accounts/acctPhone' //5.4修改注册手机号
}



export const realNameApi = {   //实名认证
    realNmAudits: '/iequip/v1/portal/realNmAudits', //5.6用户提交实名认证服务 POST
    queryEntity: '/iequip/v1/portal/realNmAudits/queryEntity',//5.7.查询实名认证请求列表服务 POST ConditionQuery
    rlnmAdtIdGet: rlnmAdtId => `/iequip/v1/portal/realNmAudits/${rlnmAdtId}`,//5.8.具体实名认证请求的详情查询服务 GET
    rlnmAuthenStPatch: '/iequip/v1/portal/realNmAudits'//5.9.实名认证请求处理服务 PATCH req&res -> AcctRlnm
}

export const projectApi = {
    createPro: '/iequip/v1/portal/apps', //7.1 创建项目,
    queryEntity: `/iequip/v1/portal/apps/queryEntity` //7.4 项目列表查询服务    post
}