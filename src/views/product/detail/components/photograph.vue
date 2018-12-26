<template>
    <div  class="detail">
       
        
        <div class="msg-b">
            
            <h3>{{details.pdNm}}</h3>
            <p  style="text-indent:2.4rem;padding:0;">{{details.productDetail.PRODUCT_DESC}}</p>
        </div>

        
        <div v-for="(item,index) in details.productDetail.DEMOS" class="msg-b" :key="index">
            <h3>{{item.DEMO_NAME}}</h3>
            <h4>示例代码</h4>
            
            <p><pre>{{getCode(item.DEMO_CODE)}}</pre></p>
            <h4>参数说明</h4>
            <ccb-grid :column-data="item.PRAMMETER_DESC" :columns="columns"></ccb-grid>
            <div v-for="(ite,inde) in item.CALLBACK" :key="inde">
                <h4>{{ite.FUN_DESC}}</h4>
                <ccb-grid :column-data="ite.FUN_PARAM" :columns="columns1"></ccb-grid>
            </div>
            
        </div>
        
        
        
    </div>
</template>

<script>
//import {productDetail} from "@/styles/productDetail.js";
export default {
    props:['details'],
    data(){
        return{
            name:"",
            //details:details,
            //productDetail:productDetail,
            hasPro:false,
            columns:[
                {title:"参数名称",field:"PARAM_NAME"},
                {title:"参数类型",field:"PARAM_TYPE"},
                {title:"是否必填",field:"PARAM_REQUIRE"},
                {title:"说明",field:"PARAM_DESC"},
            ],
            columns1:[
                {title:"参数名称",field:"PARAM_NAME"},
                {title:"参数类型",field:"PARAM_TYPE"},
               
                {title:"说明",field:"PARAM_DESC"},
            ],
        }
    },
    methods:{
        getCode(str) {
            
            return str= str.replace(/<br\/>/g,"\n");
           
        },
        
    },
    created(){ 
        
        
    }
}
</script>

<style lang="scss" socped >
    .detail{
        width: 80%;
        p{
            margin: 0;
            font-size: 1.2rem;
            padding-left: 2.4rem;
        }
        h3{
            margin-bottom: 1rem;
            font-size: 1.5rem;
        }
        .msg-b{
            margin: 1rem 0 3rem 0;
        }
    }
</style>
