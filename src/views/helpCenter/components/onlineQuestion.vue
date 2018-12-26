<template>
    <div v-if="showQuestion" class="container question">
        <h3 class="lib">{{titles}}</h3>
        
        <ul>
            <li class="show-libs" v-for="(qs,index) in questionData" :key="index">
                <div>{{index+1}}.{{qs.docNm}}</div>
                
                <div>
                    <button @click="online(qs.docSrc)">在线预览</button>
                    <button @click="download(qs.docSrc)">本地下载</button>
                </div>
            </li>
        </ul>
        <!-- <ccb-pagination
            :pageSizeList="paginatioinConfig.sizes"
            :current.sync="paginatioinConfig.start"
            :total="paginatioinConfig.total"
            :pageSize.sync="paginatioinConfig.maxRows"
            @page-size-change="handleSizeChange"
            @click-prev="handleClickPrev"
            @click-next="handleClickNext"
            @current-change="handleCurrentChange"
        ></ccb-pagination> -->
    </div>
    <!-- <div v-else class="container">
        <h3 class="lib lib2">帮助中心 > 上线问题 > <span>{{tooltip}}</span></h3>
        <p class="title">{{title}}</p>
        <div class="lib-wrap">
            <p v-for="(item, index) in content" :key="index">
                {{item}}
            </p>
        </div>
        <div class="next-wrap">
            <p v-if="titleLast">上一篇：<span @click="changeShow(nextI - 1)">{{titleLast}}</span></p>
            <p v-if="titleNext">下一篇：<span @click="changeShow(nextI + 1)">{{titleNext}}</span></p>
        </div>
    </div> -->
</template>

<script>
    import {mapState} from 'vuex';
    import { $myDecode } from "@/utils/myAxios";
    import { filePath } from '@/config';
    export default {
        props:[
            "ids"
        ],
        data(){
            return{
                 paginatioinConfig: {
                    total: 0,
                    maxRows: 999,    //当页条数
                    sizes: [10, 20, 30],
                    start: 1   //起始条数
                },
                questionData:[],
                titles:""
            }
        },
        methods: {
            changeShow(i) {

                let obj = {
                    title: this.onlineQuestions[i].title, 
                    tooltip: this.onlineQuestions[i].tooltip,
                    content: this.onlineQuestions[i].content,
                    titleNext: this.onlineQuestions[i + 1] ? this.onlineQuestions[i + 1].title : false,
                    titleLast: this.onlineQuestions[i - 1] ? this.onlineQuestions[i - 1].title : false,
                    nextI: i
                }
                this.$store.commit('changeHelpCenterContent', obj);
                this.$store.commit('changeShowQuestion', false);
            },
            online(src){
                let url=`/getFile?filePath=${src}`;
                window.open(url,"_blank");
            },
            download(src){
                let url = `/download?filePath=${filePath}${src}`;
                window.open(url);

            },
            getWordsData(){
                console.log("aaaaaaaaaaaaaabbbbbbbbbbbbbbb");
                console.log(this.$props.ids.id+1);
                let tp=this.$props.ids.id+1;
                if(tp=="1"){
                    this.titles="操作指南"
                }else if(tp=="2"){
                    this.titles="开发支持"
                }else if(tp=="3"){
                    this.titles="上线问题"
                }
                this.$axios({
                method: 'post',
                url: '/iequip/v1/portal/docs/docBlngSbj/iequip',
                data: {
                    pageSize: this.paginatioinConfig.maxRows.toString(),    //当页条数
                    pageNum: this.paginatioinConfig.start.toString(),   //起始条数
                    docTp:tp.toString()
                },
                PBreq:'com.ccb.cloud.protobuf.proto.iequip.Doc',
                PBres:'com.ccb.cloud.protobuf.proto.Page'
                })
                .then(resp => {
                // map
                    console.log("11111111111111111111111111")
                    console.log(resp)
                
                   this.questionData=resp.data.data.map(item => { 
                        console.log("---------------------");
                        
                        console.log($myDecode(item.value,'com.ccb.cloud.protobuf.proto.iequip.Doc'));  
                        
                       
                                  
                        return $myDecode(item.value,'com.ccb.cloud.protobuf.proto.iequip.Doc')
                    });
                    this.paginatioinConfig.total= this.questionData.length;
                
                
                
                })
                .catch(err => {
                console.log("123"+err)
                })
            },
            handleSizeChange (v) {
                this.paginatioinConfig.maxRows=v;
                this.getWordsData();
                console.log('size change', v)
            },
            handleCurrentChange (v) {
                this.paginatioinConfig.start=v;
                this.getWordsData();
                console.log('current change', v)
            },
            handleClickPrev (v) {
                this.paginatioinConfig.start=v;
                this.getWordsData();
                console.log('click prev', v)
            },
            handleClickNext (v) {
                this.paginatioinConfig.start=v;
                this.getWordsData();
                console.log('click next', v)
            }
        },
        computed: {
            ...mapState({
                onlineQuestions: state => state.helpCenter.onlineQuestions,
                showQuestion: state => state.helpCenter.showQuestion,
                title: state => state.helpCenter.title,
                tooltip: state => state.helpCenter.tooltip,
                content: state => state.helpCenter.content,
                titleNext: state => state.helpCenter.titleNext,
                titleLast: state => state.helpCenter.titleLast,
                nextI: state => state.helpCenter.nextI,
            })
        },
        created(){
            setTimeout(this.getWordsData(),2000);
            //this.getWordsData();
        }
    }
</script>

<style lang="scss" scoped>
    .container {
        width: 100%;
        .lib {
            margin-bottom: 40px;
        }
        .lib2 {
            font-family: MicrosoftYaHei;
            font-size: 18px;
            color: #333333;
            letter-spacing: 0;
            font-weight: 500;
            span {
                font-family: MicrosoftYaHei;
                font-size: 18px;
                color: #3F79E5;
                letter-spacing: 0;
                line-height: 24px;
            }
        }
        .show-libs {
            line-height: 56px;
            padding-left: 30px;
            border-top: 1px solid #ccc;
            cursor: pointer;
            &:last-child {
                border-bottom: 1px solid #ccc;
            }
        }
        .title {
            font-family: MicrosoftYaHei-Bold;
            font-size: 20px;
            color: #333333;
            letter-spacing: 0;
            text-align: left;
        }
        .lib-wrap {
            border-top: 1px solid #ccc;
            border-bottom: 1px solid #ccc;
            padding: 20px 30px;
            margin: 10px 0;
            p {
                line-height: 40px;
                font-family: MicrosoftYaHei;
                font-size: 14px;
                color: #333333;
                text-align: left;
                line-height: 40px;
            }
        }
        .next-wrap {
            display: flex;
            justify-content: space-between;
            p {
                font-family: MicrosoftYaHei;
                font-size: 14px;
                color: #333333;
                letter-spacing: 0;
                span {
                    color: #3F79E5;
                    cursor: pointer;
                }
            }
        }
    }
    .question{
        ul{
            li{
                display: flex;
                div{
                    flex: 1;
                    button{
                        vertical-align: middle;

                        padding: 8px;
                        margin: 0 2px;

                    }
                }
                div:last-child{
                    text-align: right;
                }
            }
        }
    }
</style>