<template>
    <div class="success">
        <Head></Head>
        <div class="success-box">
            <div>
                <span>领先</span><span class="midTitle">安全</span><span>稳定</span>
            </div>
            <div class="success-content">
                <img src="@/assets/images/projectManage/success.png" alt="">
                <p>项目已创建成功</p>
                <button class="login" @click="turnToProjectDetail">确定</button>
            </div>
        </div>
        <Footer></Footer>
    </div>
</template>

<script>
    import Head from "@/components/templetes/commons/head/Head2";
    import Footer from "@/components/templetes/commons/foot/Footer"; 
    
    export default {
        name: 'success',
        components: {
            Head,
            Footer
        },
        methods: {
            turnToProjectDetail() {
                this.$router.push({
                    path: "/ProjectManage"
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .success {
        > .success-box {
            width: 100%;
            background-image: url("../../../../assets/images/projectManage/u159.png");
            background-repeat: no-repeat;
            background-size: 100%;
            position: relative;
            > div {
                padding-top: 60px;
                color: #fff;
                text-align: center;
                > span {
                    display: inline-block;
                    font-size: 48px;
                    font-weight: 600;
                    margin-bottom: 50px;
                }
                > .midTitle {
                    margin: 0 60px;
                }
            }
        }
        .success-content {
            background-color: #fff;
            width: 1200px;
            padding-top: 224px !important;
            margin-left: calc(50% - 600px);
            overflow: hidden;
            > p {
                color: #333;
                margin-top: 22px;
                font-size: 14px;
                margin-bottom: 40px;
            }
            > button {
                width: 400px;
                height: 50px;
                background-color: #3F79E5;
                border-radius: 2px;
                color: #fff;
                font-size: 16px;
                margin-bottom: 312px;
            }
        }
    }
</style>
