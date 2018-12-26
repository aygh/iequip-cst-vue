<template>
    <div class="">
        <Head></Head>
        <div class="product-Box">
            <div class="search">
                <div>
                    <span>领先</span><span class="midTitle">安全</span><span>稳定</span>
                    <!-- <p><input placeholder="请输入您要搜索的内容"/><button>搜索</button></p> -->
                </div>
            </div>
            <div class="detailList">
                <div class="list-box">
                    <h2>产品详情</h2>
                    <h3>product detail</h3>
                    <ul>
                        <li
                            v-for="(item,index) in listTab"
                            v-bind:key="index"
                            v-bind:class="['tab-button',{active:active[index]}]"
                            v-on:click="change(index,item.pdId,item.pdNm)"
                        >
                            <span></span>
                            {{item.pdNm}}
                        </li>
                    </ul>
                </div>
                <photograph v-if="has" :details="details" class="con-detail"  v-bind:is="ac" >

                </photograph>
            </div>
        </div>
        <Footer></Footer>
    </div>
</template>

<script>
import Head from "@/components/templetes/commons/head/Head2";
import Footer from "@/components/templetes/commons/foot/Footer";
import photograph from "@/views/product/detail/components/photograph";
import print from "@/views/product/detail/components/print";
import scanCode from "@/views/product/detail/components/scanCode";
import cardRead from "@/views/product/detail/components/cardRead";
import idIdentity from "@/views/product/detail/components/idIdentity";
import pwIdentity from "@/views/product/detail/components/pwIdentity";
import pay from "@/views/product/detail/components/pay";
import faceRecognition from "@/views/product/detail/components/faceRecognition";
import { $myDecode } from "@/utils/myAxios";
import { setTimeout } from 'timers';
import {productDetail} from "@/styles/productDetail.js";
export default {
  
  name: "detail",
  components: {
    Head,
    Footer,
    photograph,
   
    "tab0": photograph,
    "tab1": photograph,
    "tab2": photograph,
    "tab3": photograph,
    "tab4": photograph,
    "tab5": photograph,
    "tab6": photograph,
    "tab7": photograph
    // "tab1": print,
    // "tab2": scanCode,
    // "tab3": cardRead,
    // "tab4": idIdentity,
    // "tab5": pwIdentity,
    // "tab6": pay,
    // "tab7": faceRecognition
  },
  data() {
    return {
      productId: "",
      ac: "tab0",
      active:[],// [true, false, false, false, false, false, false, false],
      listTab:[],
      products:[],
      details:[],
      tabs:{},
      has:false,
      // listTab: [
      //   "拍照",
      //   "打印",
      //   "扫一扫",
      //   "卡证读取",
      //   "身份核查",
      //   "插卡验密",
      //   "聚合支付",
      //   "人脸识别"
      // ]
    };
  },
  methods: {
    change: function(x,pdid,pdnm) {
      for (let i = 0; i < this.active.length; i++) {
        this.active[i] = false;
        this.active[x] = true;
        this.ac = "tab" + x;
        //this.$route.query.id=x;
        
      }
      this.$set(this.active, this.active.length, 0);
      
      this.getProDetail(pdid);
     
    },
    getProductsData(){
      this.$axios({
      method: 'post',
      url: '/iequip/v1/portal/products/pdBlngSbj/iequip/queryEntity',
      data: {
        pageIndex: 8,
        pageSize:8
      },
      PBreq:'com.ccb.cloud.protobuf.proto.iequip.Product',
      PBres:'com.ccb.cloud.protobuf.proto.Page'
    })
    .then(resp => {
      // map
      
       this.products=resp.data.data.map(item => {
        
        //console.log($myDecode(item.value,'com.ccb.cloud.protobuf.proto.iequip.Product'))
        return $myDecode(item.value,'com.ccb.cloud.protobuf.proto.iequip.Product');
        
        })
         console.log("aaaaaaaaaaaaaaaaaaa");
        console.log(this.products);
        if(this.products!=""){
          for(let i=0;i<this.products.length;i++){
            
            this.listTab.push(this.products[i]);
            

          }
          
         
          let arr= Array.apply(null,{length:this.products.length-1}).map(function(){ //遍历生成新数组
            return false;
          })
          let tarr=[true];
          this.active=[...tarr,...arr];
          let pId = this.$route.query.id;
          let pdId=this.$route.query.pdId;
          
          this.getProDetail(pdId);
          //sessionStorage.id=this.$route.params.id;
          this.productId = pId;
          for (let i = 0; i < this.active.length; i++) {
              this.active[i] = false;
              this.active[this.productId] = true;
              this.ac = "tab" + this.productId;
            }
          this.$set(this.active, this.active.length, 0);
        }else{
          return;
        }
        

        
        
        

    })
    .catch(err => {
      console.log(err)
    })
    },
    //详情
    //port/iequip/v1/portal/products/{pdId}
    getProDetail(pdid){
      
        this.$axios({
        method: 'get',
        url: '/iequip/v1/portal/products/'+pdid,      
        PBres:'com.ccb.cloud.protobuf.proto.iequip.Product'
      }).then(resp =>{
        
        if(resp.data){
          this.details=resp.data;
          console.log("------------------------")
          console.log(this.details);
          if(this.details.pdUrl=="SXT_photo"){  
            this.details.productDetail=productDetail.SXT_photo;     
          }else if(this.details.pdUrl=="SCA_scan"){    
            this.details.productDetail=productDetail.SCA_scan;     
          }else if(this.details.pdUrl=="HDP_print")
          {  
            this.details.productDetail=productDetail.HDP_print; 
          }else if(this.details.pdUrl=="IdCard_read"){
             this.details.productDetail=productDetail.IdCard_read; 
          }
          else{
            this.details.productDetail=productDetail.DEFAULT;  
          }
          this.has=true;
        }else{
           this.details=[];
           this.has=false;
        }
        
        
      }).catch(err =>{
        console.log(err);
      })
    }
  },
  mounted() {
    
    
     
  },
  created(){
   // this.$route.params.id="1";
    
    setTimeout(this.getProductsData(),3000);
    
  }
};
</script>

<style lang="scss" scoped>

  > .head2 .tabs .tab ul li:nth-child(2) {
    border-bottom: 4px solid #3F79E5 !important;
  }
.product-Box {
  width: 100%;
  background: url("../../../assets/images/product/u73.png") no-repeat;
  background-size: 100%;
  position: relative;
  > .search {
    width: 100%;
    text-align: center;
   
    padding-top: 4rem;
    > div {
      color: #fff;
      text-align: center;
      padding-top: 60px;
      > span {
        display: inline-block;
        font-size: 48px;
        font-weight: 600;
        margin-bottom: 50px;
      }
      > .midTitle {
        margin: 0 60px;
      }
      > p {
        input {
          height: 40px;
          font-size: 12px;
          padding: 0 6px;
          width: 30%;
          outline: none;
          vertical-align: middle;
        }
        button {
          height: 40px;
          font-size: 12px;
          padding: 0 2rem;
          border-radius: 0;
          outline: none;
          vertical-align: middle;
        }
      }
    }
  }
  > .detailList {
    background-color: #fff;
    width: 80%;
    padding: 20px 40px;
    margin-left: 10%;
    margin: 0 auto;
    overflow: hidden;
    display: flex;
    .con-detail{
      float: left;
      padding-left: 5rem;
    }
    > .list-box {
      float: left;
      h2 {
        font-weight: normal;
        text-align: left;
      }
      h3 {
        margin-bottom: 1rem;
        font-weight: normal;
        font-size: 16px;
      }
      ul {
        li {
          line-height: 43px;
          font-size: 14px;
          cursor: pointer;
          border-bottom: 1px solid #e3e3e3;
          display: flex;
          justify-content: left;
          color: #666666;
          align-items: center;
          span {
            border-left: 4px solid #fff;
            height: 15px;
            margin-right: 16px;
          }
        }
        li.active {
          color: #000;
          span {
            border-left: 4px solid #3399ff;
          }
        }
      }
    }
  }
}
</style>
