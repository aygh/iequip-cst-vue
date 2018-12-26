<template>
  <div class="hello">
    <Head></Head>
    <Banner></Banner>
    <div class="in-product-show">
      <Title :describ="product.describ" :caption="product.tit"></Title>
      <div class="product-list">
          
                      
          <router-link  v-for="(item,index) in realProduct" :to="{path:path.path,query:{id:item.id,pdId:item.pdId}}" :key="index">
          <Product :t="item.pdNm" :msg="item.pdBrf" :img="item.pdLogoSrc"></Product>
          </router-link>

      </div>
    </div>
    <div class="news-box">
      <Title :describ="news.describ" :caption="news.tit"></Title>
      <div class="news-list">
          <a v-for="(item, index) in newsLists" :key="index">
            <News :t="item.tit" :msg="item.msg" :img="item.src" :date="item.date"></News>
          </a>
      </div>
    </div>
    <div>
      <Foot></Foot>
    </div>
  </div>
</template>

<script>
  import Banner from '@/components/templetes/commons/banner/Banner';
  import Head from '@/components/templetes/commons/head/Head';
  import Title from '@/components/templetes/commons/others/Title';
  import Product from '@/components/product/ProductIndex';
  import Foot from '@/components/templetes/commons/foot/Footer';
  import News from '@/components/news/NewsIndex';
  import { $myDecode } from "@/utils/myAxios";
export default {

  name: 'HelloWorld',
  components:{
    "Title":Title,
    "Foot":Foot,
    "Banner":Banner,
    "Head":Head,
    "Product":Product,
    "News":News,
  },
  data () {
    return {
      realProduct: [
        
      ],
      msg: 'Welcome to Your Vue.js App',
      path:{
        path:"/Product/detail",name:"产品中心"
      },
      product: {
        tit: "产品介绍",
        describ: "一体化、智能化、可视化的服务平台，打造优质的客户体验，提升客户满意度、忠诚度，驱动企业的业务增长"
      },
      news: {
        tit: "新闻中心",
        describ: "行业新闻、行业动态，就在这里"
      },
      
      newsLists:[
        {
          date:this.getDate(),tit:"拍照",msg:"人脸摄像头拍摄客户面部高清视频图像；全景摄像头拍摄客户操作区",src:require('../../assets/images/news/new1.png')
        },
        {
          date:this.getDate(),tit:"拍照",msg:"人脸摄像头拍摄客户面部高清视频图像；全景摄像头拍摄客户操作区",src:require('../../assets/images/news/new2.png')
        },
        {
          date:this.getDate(),tit:"拍照",msg:"人脸摄像头拍摄客户面部高清视频图像；全景摄像头拍摄客户操作区",src:require('../../assets/images/news/new3.png')
        },
      ]
    }
  },
  methods:{
    //获取时间格式化
    getDate:function(){
      var date = new Date();
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate;
      return currentdate;
    },
    //产品获取
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
          //this.hasProduct=true;
         //this.realProduct[i]("id",i);
        }
      }else{
        //this.hasProduct=false;
      }
      
    })
    .catch(err => {
      console.log("123"+err)
    })
    }
  },
  created(){
    setTimeout(this.getProductsData(), 2000);
  }
}
</script>


<style lang="scss" scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  list-style: none;

}

.hello{

}
.in-product-show {
  margin-top: 75px;
  .product-list{
    overflow:hidden;
    padding: 0 5rem;

    margin-top: 20px;
    >a{
      display: block;
      width: 25%;
      height: 245px;
      float: left;
      cursor: pointer;
      text-align: center;
      margin-top: 20px;
      margin-bottom: 10px;
      margin-right: 0;
      text-decoration: none;
      .product-show{
        padding: 20px;
        height: 200px;
        &:hover{
          box-shadow:0 0 20px rgba(199,237,204,0.8);
        }
      }
    }
  }
}
  .news-box{
    margin-top: 75px;

    .news-list{
      overflow: hidden;
      padding: 0 5rem;


      margin-top: 20px;
      >a{
        display: block;
        width: 33%;
        float: left;
        cursor: pointer;
        margin-top: 20px;
        margin-bottom: 10px;
        .new-show{
          padding: 20px;
          &:hover{
            box-shadow:0 0 20px rgba(199,237,204,0.8);
          }
          .new-msg{
            width: 360px;
            margin: 0 auto;

            >div{
              padding: 10px 20px;
            }
          }
        }
      }
    }
  }
</style>
