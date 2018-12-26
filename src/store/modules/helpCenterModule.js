export default {
    state: {
        gettingStartQuestions: [
            {
                title:"如何注册平台账号？", 
                tooltip: '注册平台账号', 
                content: [
                    `（1） 注册流程需要用到手机号，1个账号对应1个手机号，若需注册新的账号，请使用其他手机号码。`,
                    `（2） 注册成功后仅可使用用户中心功能，如需使用创建项目等功能，需要完成账号的实名认证。
                                可以在注册成功后直接进行实名认证，或后续通过用户中心进行。`
                ],
            },
            {
                title:"如何创建项目，购买产品呢？", 
                tooltip: '创建项目，购买产品',
                content: [
                    `（1） 注册流程需要用到手机号，1个账号对应1个手机号，若需注册新的账号，请使用其他手机号码。`,
                    `（2） 注册成功后仅可使用用户中心功能，如需使用创建项目等功能，需要完成账号的实名认证。
                                可以在注册成功后直接进行实名认证，或后续通过用户中心进行。`
                ],
            },
            {title:"建行设备云平台主要提供那些服务？", tooltip: '主要提供哪些服务'},
            
        ],
        onlineQuestions: [
            {
                title:"如何申请上线？", 
                tooltip: '申请上线', 
                content: [
                    `（1） 注册流程需要用到手机号，1个账号对应1个手机号，若需注册新的账号，请使用其他手机号码。`,
                    `（2） 注册成功后仅可使用用户中心功能，如需使用创建项目等功能，需要完成账号的实名认证。
                                可以在注册成功后直接进行实名认证，或后续通过用户中心进行。`
                ],
            },
            {
                title:"如何进行上线测试？", 
                tooltip: '上线测试',
                content: [
                    `（1） 注册流程需要用到手机号，1个账号对应1个手机号，若需注册新的账号，请使用其他手机号码。`,
                    `（2） 注册成功后仅可使用用户中心功能，如需使用创建项目等功能，需要完成账号的实名认证。
                                可以在注册成功后直接进行实名认证，或后续通过用户中心进行。`
                ],
            },
            {title:"如何进行资源下载？", tooltip: '主要提供哪些服务'},
            
        ],
        showQuestion: true,
        title: '',
        tooltip: '',
        content: '',
        titleNext: '',
        titleLast: '',
        nextI: ''
    },
    mutations: {
        changeShowQuestion(state, bool) {
            state.showQuestion = bool;
        },
        changeHelpCenterContent(state, obj) {
            state.title = obj.title;
            state.tooltip = obj.tooltip;
            state.content = obj.content;
            state.titleNext = obj.titleNext;
            state.titleLast = obj.titleLast;
            state.nextI = obj.nextI;
        }
    },
}