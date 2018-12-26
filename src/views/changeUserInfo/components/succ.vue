<template>
    <div class="succ-container">
        <p>{{ title }}</p>
        <img :src="imgUrl" alt="">
        <span class="tooltip">{{ tooltip }}</span>
        <button class="login-btn" @click="confirmBtn">{{ btnText }}</button>
    </div>
</template>
<script>
export default {
    name: 'succ',
    props:['title', 'tooltip', 'btnText'],
    data() {
        return {
            imgUrl: require('@/assets/images/regist/succ.png')
        }
    },
    methods: {
        confirmBtn() {
            this.$store.commit('changeRealNameShowPage', 0);
            const {type} = this.$route.query
            if(type === 'register') {
                this.$router.push('/loginIn')
            }else {
                this.$router.push('/UserCenter')
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.succ-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 500px;
    margin: 0 auto;
    p {
        font-family: MicrosoftYaHei;
        font-weight: 600;
        font-size: 18px;
        color: #333333;
        text-align: center;
        line-height: 24px;
        margin-top: 50px;
    }
    img {
        width: 138px;
        height: 120px;
        margin: 30px 0;
    }
    .tooltip {
        font-family: MicrosoftYaHei;
        font-size: 14px;
        color: #333333;
        text-align: center;
    }
    .login-btn {
        border-width: 0px;
        width: 400px;
        height: 50px;
        background-color: #3F79E5;
        font-family: MicrosoftYaHei;
        font-size: 16px;
        color: #FFFFFF;
        margin-top: 30px;
    }
}
</style>


