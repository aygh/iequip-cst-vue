<template>
    <div class="">
        <Head></Head>
        <div class="com-body">

        
        <div class="contact-box fixed-box">
            <div class="slogan">
                    <div>
                    <h1>同行业先行者与领导者</h1>
                    <p>Forerunners and leaders in the same industry</p>
                    </div>

            </div>
            <div class="con-msg">

                <div class="msg-box">
                    <div class="msg">
                        <h2><i></i>联系我们</h2>
                        <!-- <h3>Contact Us</h3> -->
                        <p>公司金融要跟上技术的演进，但是还有一个很重要的观点就是科技的进步其实低于我们的想象，这张图讲的是整个人工智能的发展历程，从1960年到现在并没有大的变化，大数据的应用无非是算力、算法和数据。</p>
                        <ul>
                            <li v-for="(msg,index) in msgs" :key="index">
                                <img :src="msg.src"/>
                                <h4>{{msg.title}}</h4>
                                <p>{{msg.msg}}</p>
                            </li>
                        </ul>

                    </div>
                    <div class="con-detail">
                        <div v-for="(detail,index) in conDetail" :key="index">
                            <h3>{{detail.title}}</h3>
                            <p>{{detail.phone}}</p>
                            <p>{{detail.email}}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <Footer></Footer>
        </div>
    </div>
</template>
<script>
    import Head from "@/components/templetes/commons/head/Head2";
    import Footer from "@/components/templetes/commons/foot/Footer";

    export default {
        name: "userCenter",
        components: {
            Head,
            Footer,

        },
        data(){
            return{
                msgs:[
                    {src:require("@/assets/images/contact/c1.png"),title:"联系电话",msg:"400-888-9999"},
                    {src:require("@/assets/images/contact/c2.png"),title:"智能客服",msg:"服务时间: 7*24小时支持"},
                    {src:require("@/assets/images/contact/c3.png"),title:"公司地址",msg:"成都市成华区航天科技大厦"},
                ],
                conDetail:[
                    {title:"客户服务",phone:"联系电话:400-888-999",email:"Email：jianxinjinke@ccb.com"},
                    {title:"寻求合作",phone:"联系人:李先生",email:"Email：jianxinjinke@ccb.com"},
                ]
            }
        }
    };
</script>
<style lang="scss" scoped>
    .contact-box{
        position: relative;

        width: 100%;
        background-image: url("../../assets/images/contact/banner.png");
        background-repeat: no-repeat;
        background-size: 100%;
        .slogan{
            width: 100%;
            text-align: center;
            height: 300px;
            display: table;
            >div{
                display: table-cell;
                vertical-align: middle;
            }
            color: white;
            h1{
                font-weight: normal;
                font-size: 42px;
            }
            p{

                font-size: 24px;
            }
        }
        .con-msg{
            display: flex;
            width: 85%;
            padding: 20px 0;
            margin: 0 auto;
            background-color: #fff;
            .msg-box{
                padding: 0 8rem;
                margin-left: 40px; 
                .msg{
                    margin-top: 2rem;
                    p{
                        line-height: 25px;
                    }

                    h2{
                        font-weight: normal;
                    }
                    h3{
                        color: #999999;
                        margin-bottom: 3rem;
                    }
                    ul{
                        overflow: hidden;
                        margin-top: 6rem;
                        padding-bottom: 3rem;
                        border-bottom: 1px solid #e3e3e3;
                        li{
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                            float: left;
                            width: calc(100% / 3);
                            p{
                                font-family: MicrosoftYaHei;
                                font-size: 14px;
                                color: #999999;
                                letter-spacing: 0.5px;
                                text-align: center;
                            }
                            h4{
                                font-family: MicrosoftYaHei;
                                font-size: 16px;
                                color: #000000;
                                letter-spacing: 0.57px;
                                text-align: justify;
                                margin: 20px 0 10px;
                            }
                        }
                    }
                }
                .con-detail{
                    overflow: hidden;
                    padding:4rem  5rem;
                    >div{
                        float: left;
                        width: 50%;
                        text-align: left;
                        h3{
                            margin-bottom: 2rem;
                            font-family: MicrosoftYaHei-Bold;
                            font-size: 16px;
                            color: #000000;
                            letter-spacing: 0.57px;
                            text-align: justify;
                        }
                        p{
                            line-height: 25px;
                            font-family: MicrosoftYaHei;
                            font-size: 16px;
                            color: #000000;
                            letter-spacing: 0.57px;
                            text-align: justify;
                        }
                    }
                }
            }
        }
    }
</style>


