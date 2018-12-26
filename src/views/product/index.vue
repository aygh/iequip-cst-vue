<template>
    <div class="product">
        <Head></Head>
        <div class="product-Box fixed-box">
            <div class="search">
                <div>
                  <span>领先</span><span class="midTitle">安全</span><span>稳定</span>
                  <!-- <p><input placeholder="请输入关键字"/><button>搜索</button></p> -->
                </div>
            </div>
            <div  class="in-product-show">
                <Title :describ="product.describ" :caption="product.tit"></Title>
                <div class="product-list" v-if="hasProduct">
                    <router-link
                      
                      v-for="(item,index) in realProduct"
                      :to="{path:path.name,query:{id:item.id,pdId:item.pdId}}"
                      :key="index"
                    >
                        <Product :t="item.pdNm" :msg="item.pdBrf" :img="item.pdLogoSrc"></Product>
                    </router-link>
                </div>
                <div v-else class="noProduct">
                  <p>暂无数据</p>
                </div>
            </div>
            <!-- <div class="realProduct">
              <ul v-for="item in realProduct" :key="item.id">
                <li>{{item.pdId}}</li>
              </ul>
            </div> -->
        </div>
        <Footer></Footer>
    </div>
</template>

<script>
import Head from "@/components/templetes/commons/head/Head2";
import Footer from "@/components/templetes/commons/foot/Footer";
import Product from "@/components/product/ProductIndex";
import Title from "@/components/templetes/commons/others/Title";
import { $myDecode } from "@/utils/myAxios"

export default {
  name: "product",
  components: {
    Head,
    Footer,
    Product,
    Title
  },
  data() {
    return {
      hasProduct:false,
      path: {
        path: "/ResourceManage/detail",
        name: "/Product/detail"
      },
      product: {
        tit: "产品介绍",
        describ:
          "一体化、智能化、可视化的服务平台，打造优质的客户体验，提升客户满意度、忠诚度，驱动企业的业务增长"
      },
      news: {
        tit: "新闻中心",
        describ:
          "一体化、智能化、可视化的服务平台，打造优质的客户体验，提升客户满意度、忠诚度，驱动企业的业务增长"
      },
      
      realProduct: [
        
      ]
    }
  },
  methods: {
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
     
      this.realProduct = resp.data.data.map(item => {               
        return $myDecode(item.value,'com.ccb.cloud.protobuf.proto.iequip.Product')
      })
      
      if(this.realProduct!=""){
        for(let i=0;i<this.realProduct.length;i++){
          Object.assign(this.realProduct[i],{"id":i});
          this.hasProduct=true;
         //this.realProduct[i]("id",i);
        }
      }else{
        this.hasProduct=false;
      }
      
    })
    .catch(err => {
      console.log("123"+err)
    })
    }
  },
  // 产品列表数据请求
  created () {
    setTimeout(this.getProductsData(),2000);
  },
  mounted(){
    this.$nextTick(() => {
      this.$forceUpdate();
    })
  }
};
</script>

<style lang="scss" scoped>
.product-Box {
  width: 100%;
  background: url("../../assets/images/product/u73.png") 0 0 no-repeat;
  background-size: 100%;
  position: relative;
  > .search {
    width: 100%;
    text-align: center;
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
      > p {
        width: 100%;
        height: 40px;
        margin: 0 auto 60px;
        > input {
          width: 30%;
          height: 100%;
          vertical-align: middle;
          font-size: 14px;
          color: #999;
          padding-left: 20px;
          outline: none;
        }
        > button {
          width: 60px;
          height: 100%;
          background: #3f79e5;
          border-radius: 0 2px 2px 0;
          vertical-align: middle;
          outline: none;
        }
      }
    }
  }
  .in-product-show {
    background-color: #fff;
    width: 80%;
    padding-top: 80px;
    margin-left: 10%;
    margin:0 auto;
    > .title .line {
      width: 72px;
      height: 6px;
      background-color: #306FE4 !important;
    }
    > .product-list {
      overflow: hidden;
      padding: 0 5rem;
      margin-top: 20px;
      margin-bottom: 40px;
      > a {
        display: block;
        width: 25%;
        height: 190px;
        float: left;
        cursor: pointer;
        text-align: center;
        margin-top: 20px;
        margin-bottom: 10px;
        margin-right: 0;
        text-decoration: none;
        > .product-show {
          padding: 20px 20px 0 20px;
          height: 150px;
          &:hover {
            box-shadow: 0 0 20px rgba(199, 237, 204, 0.8);
          }
        }
      }
    }
    .noProduct{
      margin: 20px 0;
      p{
        text-align:center;
        color: #b9b9b9;
      }
    }
  }
}
</style>

