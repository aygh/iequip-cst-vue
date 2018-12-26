<template>
    <div class="container">

        <Head></Head>
        <div class="content fixed-box">
            <span class="title">个人中心</span>
            <!-- 个人中心 -->

            <div class="userCenter-wrap">
                <div class="userCenter-bar">
                    <div :class="isfix == true ? 'bar' :''" id="bar" :style="style">
                        <p>个人中心</p>
                        <p class="pro-manage">Personal Center</p>
                        <ul class="info-list">
                            <li v-for="(item, index) in ops" :key="index" :class="[{active : activeBtn == index},'atc']"
                                @click="chooseInfo('#tip'+index,index)" :style="{color: item.isShow ? '#3F79E5' : '#666'}"><i
                                    v-show="item.isShow"></i>{{ item.info }}</li>
                        </ul>
                    </div>
                </div>
                <div class="userCenter-info">
                    <!--<user-info :title="baseInfo.title" :infoList="baseInfo.baseInfoList" v-show="ops[0].isShow || ops[1].isShow"></user-info>
                    <user-info :title="realNameInfo.title" :infoList="realNameInfo.realNameInfoList" v-show="ops[0].isShow || ops[2].isShow"></user-info>
                    <project-info :infoList="projectInfo.projectList" v-show="ops[0].isShow || ops[3].isShow"></project-info>-->
                    <div id="tip0" style=""></div>
                    <div id="tip1" style="margin-bottom:60px"></div>
                    <user-info :title="baseInfo.title" :infoList="baseInfo.baseInfoList" id="">
                        
                    </user-info>
                    <div id="tip2" style="margin-bottom:60px"></div>
                    <user-info :title="realNameInfo.title" :infoList="realNameInfo.realNameInfoList" id=""></user-info>
                    <div id="tip3" style="margin-bottom:60px"></div>
                    <project-info :infoList="projectInfo.projectList" id=""></project-info>
                </div>
            </div>


        </div>
        <Footer></Footer>
    </div>
</template>
<script>
    import Head from "@/components/templetes/commons/head/Head2";
    import Footer from "@/components/templetes/commons/foot/Footer";
    import userInfo from "./components/userInfo";
    import projectInfo from "./components/projectInfo";
    import {
        realNameApi,
        projectApi
    } from "@/api";
    import {
        $myDecode
    } from '@/utils/myAxios'
import { setTimeout } from 'timers';
    export default {
        name: "userCenter",
        components: {
            Head,
            Footer,
            userInfo,
            projectInfo
        },
        data() {
            return {
                style: {},
                activeBtn: "",
                isfix: false,
                ops: [{
                        info: "全部信息",
                        isShow: true
                    },
                    {
                        info: "基本信息",
                        isShow: false
                    },
                    {
                        info: "实名认证信息",
                        isShow: false
                    },
                    {
                        info: "项目信息",
                        isShow: false
                    }
                ],
                baseInfo: {
                    title: "基本信息",
                    baseInfoList: [{
                            listName: "账户名",
                            listInfo: ""
                        },
                        {
                            listName: "注册手机号",
                            listInfo: "",
                            handle: "修改"
                        },
                        {
                            listName: "密码",
                            listInfo: "******",
                            handle: "修改"
                        },
                        {
                            listName: "认证信息",
                            listInfo: "",
                        }
                    ]
                },
                realNameInfo: {
                    title: "实名认证信息",
                    realNameInfoList: [{
                            listName: "企业名称",
                            listInfo: ""
                        },
                        {
                            listName: "法人姓名",
                            listInfo: ""
                        },
                        {
                            listName: "经办人姓名",
                            listInfo: ""
                        },
                        {
                            listName: "经办人手机号",
                            listInfo: "",
                            handle: "修改"
                        },
                        {
                            listName: "统一社会信用代码",
                            listInfo: ''
                        },
                        {
                            listName: "审核状态",
                            listInfo: ""
                        }
                    ]
                },
                projectInfo: {
                    projectList: []
                },
                oldAcctPhone: '',
                oldAuthenPhone: ''
            };
        },
        methods: {
            chooseInfo(selector, index) {
                // console.log(index);

                this.ops.forEach((item, i) => {
                    item.isShow = i === index;
                })

                this.activeBtn = index;
                // let hight=document.documentElement.scrollTop;
                // console.log(hight);
                // if(hight>280){
                //   alert()
                //   this.style={top:0,position:'fixed'}
                //   console.log(this.style);
                // }else{
                //   this.style="";
                // };
                this.$el.querySelector(selector).scrollIntoView();
                //document.getElementsByClassName("userCenter-info").animate({scrollTop: 50+"px"},800);

                // console.log(index);

            },

            //获取基本信息
            getBaseData() {
                return new Promise((resolve, reject) => {
                    this.$axios({
                        method: "get",
                        url: "/iequip/v1/portal/accounts/account",
                        PBres: "com.ccb.cloud.protobuf.proto.iequip.Acct"
                    }).then(res => {
                        resolve(res)
                    }).catch(err => {
                        resolve({err})
                    })
                })
            },

            //获取项目信息
            getProjectInfo() {
                return new Promise((resolve, reject) => {
                    this.$axios({
                        method: 'post',
                        url: projectApi.queryEntity,
                        data: {
                            insId: sessionStorage.insId,
                            start: 1,
                            maxRows: 9999
                        },
                        PBreq: 'com.ccb.cloud.protobuf.proto.iequip.App',
                        PBres: 'com.ccb.cloud.protobuf.proto.Page'
                    }).then(res => {
                        resolve(res)
                    }).catch(err => {
                        resolve({err})
                    })
                })
            },

            getAllData() {
                Promise
                    .all([this.getBaseData(), this.getProjectInfo()])
                        .then(res => {
                            console.log(res);
                            res.forEach(item => {
                                if(item.err) console.log(item.err);
                            })
                            if(!res[0].err) {
                                let data = res[0].data;
                                //基本信息
                                this.baseInfo.baseInfoList[0].listInfo = data.acctNm;
                                this.baseInfo.baseInfoList[1].listInfo = data.acctPhone && data.acctPhone.slice(0, 3) + '****' + data.acctPhone
                                    .slice(7);
                                this.baseInfo.baseInfoList[3].listInfo = data.rlnmAuthenSt == '1' ? '已实名认证' : '未实名认证';
                                this.baseInfo.baseInfoList[3].handle = data.rlnmAuthenSt != '1' ? '马上认证' : ''
                                this.oldAcctPhone = data.acctPhone
                                sessionStorage.OldUserPhone = this.oldAcctPhone
                                //实名信息
                                this.realNameInfo.realNameInfoList.forEach(item => {
                                    switch (item.listName) {
                                        case '企业名称':
                                            item.listInfo = data.entNm
                                            break
                                        case '法人姓名':
                                            item.listInfo = data.sbjNm
                                            break
                                        case '经办人姓名':
                                            item.listInfo = data.rspbpsnNm
                                            break
                                        case '经办人手机号':
                                            this.oldAuthenPhone = data.authenPhone
                                            item.listInfo = data.authenPhone && data.authenPhone.slice(0, 3) + '****' + data.authenPhone.slice(7);
                                            sessionStorage.OldRealNamePhone = this.oldAuthenPhone
                                            if(data.rlnmAuthenSt == '1') {
                                                item.handle = '修改'    //只有实名认证通过才能修改经办人手机号
                                            }else {
                                                item.handle = ''
                                            }
                                            break
                                        case '统一社会信用代码':
                                            item.listInfo = data.unnSocCrCd
                                            break
                                        case '审核状态':
                                            if(data.rlnmAuthenSt == '1') {
                                                item.listInfo = '已通过'
                                                this.baseInfo.baseInfoList[3].handle = ''
                                            }else if (data.rlnmAuthenSt == '0') {
                                                item.listInfo = '未处理'
                                                this.baseInfo.baseInfoList[3].handle = ''
                                            }else {
                                                item.listInfo = '已拒绝'
                                                this.baseInfo.baseInfoList[3].handle = '马上认证'
                                            }
                                    }
                                })
                                if (data.rlnmAuthenSt == '2') {
                                    this.realNameInfo.realNameInfoList.push({
                                        listName: "拒绝理由",
                                        listInfo: data.rlnmAuthenMsg
                                    })
                                }
                            }
                            //项目信息
                            if(!res[1].err){
                                let pro = res[1] && res[1].data && res[1].data.data;
                                if(Object.prototype.toString.call(pro) == "[object Array]") {
                                    this.projectInfo.projectList = pro.map(item => {
                                        return $myDecode(item.value, 'com.ccb.cloud.protobuf.proto.iequip.App');
                                    })
                                    setTimeout(() => {
                                        console.log(111);
                                        console.log(this.projectInfo.projectList)
                                    }, 0)
                                }
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        })
            },

            handleScroll() {
                var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
                // console.log(scrollTop);
                //var offsetTop = document.querySelector('#bar').offsetTop
                if (scrollTop > 220) {
                    this.isfix = true
                } else {
                    this.isfix = false
                }
            },

            init() {
                this.getAllData();    
            }

        },

        created() {
            this.init()
           
            
                window.addEventListener('scroll', this.handleScroll);
            
                this.isfix = false;
            
        },
        beforeRouteLeave(to, from, next) {
            next();
        },
        destroyed() {
            window.removeEventListener('scroll', this.handleScroll)
        },

    };
</script>
<style lang="scss" scoped>
    .container {
        width: 100%;
    }

    .content {
        position: relative;
        width: 100%;
        padding-top: 200px;
        background-image: url("../../assets/images/userCenter/u1168.png");
        background-repeat: no-repeat;
        background-size: 100%;

        .title {
            position: absolute;
            left: 50%;
            top: 60px;
            transform: translateX(-50%);
            display: block;
            width: 200px;
            height: 64px;
            font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
            font-size: 48px;
            color: #ffffff;
            letter-spacing: 2px;
        }
    }

    .userCenter-wrap {
        display: flex;
        width: 80%;
        min-width: 1000px;
        padding: 20px 40px;
        margin: 0 auto;
        background-color: #fff;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        text-align: left;

        .userCenter-bar {
            border-right: 1px solid #e6e6e6;

            >div {
                //position: fixed;
            }

            .bar {
                position: fixed;
                background-color: #Fff;
                top: 60px;
                z-index: 999;
            }

            width: 200px;

            // height: 1000px;
            &:nth-child(1) {
                // font-weight: 500;
                font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
                font-size: 20px;
                color: #333333;
                letter-spacing: 0;
            }

            .pro-manage {
                font-family: MicrosoftYaHei;
                font-size: 16px;
                color: #999999;
                letter-spacing: 0;
                margin-bottom: 15px;
            }

            .info-list {
                font-weight: 500;
                font-style: normal;
                font-size: 14px;
                color: #000000;

                li {
                    position: relative;
                    width: 180px;
                    height: 30px;
                    box-sizing: border-box;
                    padding-left: 30px;
                    margin-bottom: 10px;
                    box-shadow: inset 0 -1px 0 0 #e6e6e6;
                    cursor: pointer;

                    &:nth-child(1) {
                        padding-left: 20px;
                    }
                }

                i {
                    position: absolute;
                    left: 0px;
                    top: 0px;
                    width: 4px;
                    height: 15px;
                    background-color: rgba(51, 153, 255, 1);
                }
            }
        }

        .userCenter-info {
            flex: 1;
        }
    }

    .no-real {
        font-size: 14px;
        text-align: center;
        color: #999;
    }
</style>