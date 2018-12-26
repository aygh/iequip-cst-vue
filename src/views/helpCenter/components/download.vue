<template>
    <div class="down">
        <h3>资料下载</h3>
        <ul>
            <li v-for="(down,index) in textDownloads" :key="index">
                
                <div>
                    <img :src="down.icon" alt="">
                </div>
                <div>
                    <h4>
                        {{index+1}}.{{down.title}}
                    </h4>
                    <p>{{down.introduce}}</p>
                </div>
                <div>
                    <button @click="onlineView(down.src)" :key="index">在线预览</button>
                    <button>本地下载</button>
                </div>
                
                
            </li>
        </ul>
        <ccb-window :show.sync="showWindow" title="预览">
                    <iframe  :src="downsrc" type="application/docx" width="100%" height="400px"></iframe>
                     <ccb-button @click="closeWin">关闭</ccb-button>
        </ccb-window>
    </div>

</template>

<script>

    export default {
        data(){
            return{
                downsrc:"",
                showWindow:false,
                textDownloads:[
                    {icon:require("@/assets/images/help/1.png"),
                    title:"文档",introduce:"三点定位多多无无无无多多过",
                    src:"http://view.officeapps.live.com/op/view.aspx?src=newteach.pbworks.com/f/ele+newsletter.docx"
                    //微软提供的在线浏览，src后必须是域名
                    },
                    {icon:require("@/assets/images/help/1.png"),title:"文档",introduce:"三点定位多多无无无无多多过",src:""},
                    {icon:require("@/assets/images/help/1.png"),title:"web",introduce:"三点定位多多无无无无多多过",src:""},
                    {icon:require("@/assets/images/help/1.png"),title:"文档",introduce:"三点定位多多无无无无多多过",src:""}, 
                    {icon:require("@/assets/images/help/1.png"),title:"文档",introduce:"三点定位多多无无无无多多过",src:""},
                ]
            }
        },
        methods:{
            onlineView(src){
               this.showWindow=true;
               this.downsrc=src;
            },
            closeWin(){
                this.showWindow=false;
                this.downsrc="";
            }
        }
        
    }
</script>

<style lang="scss">
    .down{
        width: 90%;
        ul{
            li{
                overflow: hidden;
                cursor: auto !important;
                div{
                    float: left;


                    button{
                        vertical-align: middle;

                        padding: 8px;
                        margin: 0 2px;
                    }
                }
                div:nth-child(2){
                    width: 70%;
                }
                div:last-child{
                    line-height: 80px;
                }
            }
        }
    }
</style>