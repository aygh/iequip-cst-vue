export default {
    state: {
        realNameInfo: {},
        realNameShowPage: 0,
        acctTp: '2' 
    },
    mutations: {
        changeRealNameInfo(state, obj) {
            state.realNameInfo = obj;
        },
        changeRealNameShowPage(state, num) {
            state.realNameShowPage = num;
        },
        changeAdtType(state, type) {
            state.acctTp = type;
        }
    },
}