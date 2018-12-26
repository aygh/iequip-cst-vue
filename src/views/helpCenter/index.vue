<template>
    <div>
        <Head></Head>
        <div class="help-box fixed-box">
            <div class="slogan">
                <div>
                    <h1>帮助中心&nbsp;&nbsp;&nbsp;&nbsp;帮您解答</h1>
                    <!-- <p><input v-model="searchContent" placeholder="请输入您要搜索的内容"/><button @click="search" type="button">搜索</button></p> -->
                </div>

            </div>
            <div class="con-msg">

                <div class="msg-box">
                    <div class="msg">
                        <h2>帮助中心</h2>
                        <h3>help center</h3>
                        <ul>
                            <h4>全部信息</h4>
                            <li v-for="(item,index) in leftTabs" v-bind:key="item" v-bind:class="['tab-button',{active:active[index]}]"  v-on:click="change(index)"><span>{{item}}</span></li>
                        </ul>
                    </div>
                    <div class="con-detail"  v-bind:is="ac" :ids="lists">

                    </div>
                </div>
            </div>
        </div>
        <Footer></Footer>
    </div>
</template>

<script>
    import Head from "@/components/templetes/commons/head/Head2";
    import Footer from "@/components/templetes/commons/foot/Footer";
    //import start from "./components/gettingStart";
    //import down from "./components/download";
    //import develop from "./components/developWord";
    import online from "./components/onlineQuestion";
    import {mapState} from "vuex"
    export default {
        name:"ids",
        components:{
            Head,
            Footer,
            "tab0":online,
            "tab1":online,
            "tab2":online,
            //"tab3":develop,

        },
        data(){
            return{
                ac:"tab0",
                active: [true, false, false],
                leftTabs:[
                    "操作指南","开发支持","上线问题"
                ],
                showQuestion: true,
                searchContent: '',
                lists:[
                    
                ]
            }
        },
        methods:{
            
            change(x){
                for(var i=0;i<this.active.length;i++){
                    this.active[i]=false;
                    this.active[x]=true;
                    this.ac="tab"+x;
                }
                this.$set(this.active, 4, 0);
                this.lists.id=x;
                this.$store.commit('changeShowQuestion', true);
            },

            //搜索
            search() {
                const self = this;
                let flag = true;
                let startQes = self.gettingStartQuestions;
                let onlineQes = self.onlineQuestions;
                for(var i = 0; i < startQes.length; i++) {
                    if(startQes[i].title.includes(self.searchContent.trim())) {
                        self.change(0);
                        let obj1 = {
                            title: startQes[i].title, 
                            tooltip: startQes[i].tooltip,
                            content: startQes[i].content,
                            titleNext: startQes[i + 1] ? startQes[i + 1].title : false,
                            titleLast: startQes[i - 1] ? startQes[i - 1].title : false,
                            nextI: i
                        }
                        this.$store.commit('changeHelpCenterContent', obj1);
                        this.$store.commit('changeShowQuestion', false);
                        flag = false;
                        break
                    }
                }
                if(!flag) return
                for(var j = 0; j < onlineQes.length; j++) {
                    if(onlineQes[j].title.includes(self.searchContent.trim())) {
                        self.change(1);
                        let obj2 = {
                            title: onlineQes[j].title, 
                            tooltip: onlineQes[j].tooltip,
                            content: onlineQes[j].content,
                            titleNext: onlineQes[j + 1] ? onlineQes[j + 1].title : false,
                            titleLast: onlineQes[j - 1] ? onlineQes[j - 1].title : false,
                            nextI: j
                        }
                        this.$store.commit('changeHelpCenterContent', obj2);
                        this.$store.commit('changeShowQuestion', false);
                        flag = false;
                        break
                    }
                }
              
            }

        },
        beforeRouteLeave(to, from, next) {
            this.$store.commit('changeShowQuestion', true);
            next()
        },
        computed: {
            ...mapState({
                gettingStartQuestions: state => state.helpCenter.gettingStartQuestions,
                onlineQuestions: state => state.helpCenter.onlineQuestions
            })
        },
        created(){
            this.change(0);
        }
    }
</script>

<style lang="scss" >
    .help-box{
        position: relative;

        width: 100%;
        background-image: url("../../assets/images/help/banner.png");
        background-repeat: no-repeat;
        background-size: contain;
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
                margin-bottom: 3rem;
            }
            p{

                font-size:0px;
                input{
                    height: 40px;
                    font-size: 12px;
                    padding: 0 6px;
                    border: none;
                    width: 30%;
                }
                button{
                    height: 40px;
                    font-size: 12px;
                    border-radius: 0;
                    padding: 0 2rem;
                }
            }
        }
        .con-msg{
            display: flex;
            width: 80%;
            padding: 20px 0;
            //margin-left: calc(50% - 640px);
            margin: 0 auto;
            background-color: #fff;
            overflow: hidden;

            .msg-box{
                overflow: hidden;
                display: flex;
                width: 100%;
                margin-left: 40px;
                .msg{
                    width: 90px;
                    p{
                        line-height: 25px;
                    }

                    h2{
                        font-weight: normal;
                    }
                    h3{
                        color: #999999;
                        margin-bottom: 1rem;
                    }
                    ul{
                        overflow: hidden;
                        margin-top: 1rem;
                        text-align: left;
                        h4{
                            margin-bottom: 20px;
                        }
                        li{
                            line-height: 43px;
                            text-indent: 12px;
                            font-size: 12px;
                            cursor: pointer;
                            border-bottom: 1px solid #e3e3e3;
                        }
                        li.active{
                            span{
                                border-left:2px solid blue;
                                padding-left: 4px;
                            }

                        }
                    }
                }
                .con-detail{
                    overflow: hidden;
                    padding:2rem  5rem;
                    text-align: left;
                    flex: 1;
                }
            }
        }
    }
</style>