<template>
    <div class="header">
        <ccb-row :wrap="'nowrap'" :type="'flex'">
            <ccb-col :span="8" :push="2">
                <div class="logo">
                <span class="logo-code" @click="toIndex"><i class="iconfont icon-cloud-server my-iconfont"></i>建行设备云服务平台</span>
                </div>
            </ccb-col>
            <ccb-col :span="4"></ccb-col>
            <ccb-col :span="8" :push="2">
                <div v-if="isLogin">已有账号，立即<router-link :to="'/loginIn'">登录</router-link></div>
                <div v-else>没有账号，立即<router-link :to="'/register'">注册</router-link></div>
            </ccb-col>
            <ccb-col :span="2" :pull="2"><div style="cursor: pointer;" @click="toIndex">首页</div></ccb-col>
            <ccb-col :span="2" :pull="2"><div style="cursor: pointer;" @click="toHelp">帮助中心</div></ccb-col>
        </ccb-row>        
    </div>
</template>
<script>
export default {
    name: 'loginHeader',
    data() {
        return {
            imgSrc: require('@/assets/images/regist/loge.png'),
            isLogin: true
        }
    },
    methods: {
        toIndex() {
            this.$router.push('/');
        },
        toHelp() {
            this.$router.push({name: 'help'});
        }
    },
    created() {
    },
    watch: {
        $route: {
            handler: function (val) {
                this.isLogin = val.name === 'register';
            },
            deep: true,
            immediate: true
        }
    }
}
</script>
<style scoped lang="scss">
    .header {
        width: 100%;
        height: 60px;
        line-height: 60px;
        background-color: #fff;
        color: 14p;
        color: #333333;
        .my-iconfont {
            font-size: 30px !important;
        }
        .logo {
            // width: 260px;
            // height: 47px;
            // vertical-align: middle;
            // cursor: pointer;
            .logo-code {
                display: inline-block;
                width: 290px;
                height: 40px;
                line-height: 40px;
                font-family: PingFangSC-Regular;
                font-size: 28px;
                color: #333333;
                letter-spacing: 0;
                cursor: pointer;
            }
        }
    }
</style>


