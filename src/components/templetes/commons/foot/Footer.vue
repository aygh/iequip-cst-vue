<template>
  <div class="f">
    <!--顶部上层-->
    <div class="f-t">
        <ul>
          <li v-for="(img,index) in ftdata" :key="index">
            <img :src="img.icon"/>
            <span>{{img.msg}}</span>
          </li>
        </ul>
    </div>
    <div class="f-b">
      <!--产品列表-->
      <div class="f-pro">
        <div>
          <h3>{{fbdata.title1}}</h3>
          <p v-for="(item,index) in fbdata.one" v-bind:key="index">{{item.msg}}</p>
        </div>
        <div>
          <h3>{{fbdata.title2}}</h3>
          <p v-for="(item,index) in fbdata.two" v-bind:key="index">{{item.msg}}</p>
        </div>
      </div>
      <!--二维码-->
      <div class="wxin">

          <div v-for="(we, i) in wxin" :key="i">
            <img :src="we.src"/>
            <p>{{we.msg}}</p>
          </div>

      </div>
      <!--联系方式-->
      <div class="f-contact">
        <div>
          <h3>联系我们</h3>
          <ul>
            <li v-for="(con, i) in contact" :key="i">
              <!-- <router-link :to="{path:con.src}">
                
              </router-link> -->
              <img :src="con.src"/>
            </li>
          </ul>
          <h3>联系方式</h3>
          <p v-for="(addr, i) in contacts" :key="i">
            <label>{{addr.addr}}</label><span>{{addr.phobeNum}}</span>
          </p>
        </div>

      </div>
    </div>
    <!--底部下层-->
  </div>
</template>

<script>
  export default {
    data(){
      return {
        ftdata: [
          {icon: require('@/assets/images/foot/f1.png'), msg: "7*24小时服务"},
          {icon: require('@/assets/images/foot/f2.png'), msg: "全流程服务"},
          {icon: require('@/assets/images/foot/f3.png'), msg: "7天无理由退款"},
          {icon: require('@/assets/images/foot/f4.png'), msg: "安全保障 "}
        ],
        fbdata: {
          title1:"外设能力",
          title2:"金融服务",
          one: [
            {path: "", msg: "拍照"},
            {path: "", msg: "打印"},
            {path: "", msg: "扫描"},
            {path: "", msg: "卡证读取"},
          ],
          two: [

            {path: "", msg: "客户信息"},
            {path: "", msg: "支付服务"},
            {path: "", msg: "缴费服务"},
            {path: "", msg: "人脸识别"},
          ],
        },
        wxin:[
          {src:require('@/assets/images/foot/wxin.png'),msg:"二维码",name:""},
          {src:require('@/assets/images/foot/wxin.png'),msg:"二维码",name:""},
        ],
        contact:[
          {src:require('@/assets/images/foot/weibo.png'),img:"二维码",name:""},
          {src:require('@/assets/images/foot/weixin.png'),img:"二维码",name:""},
          {src:require('@/assets/images/foot/mail.png'),img:"二维码",name:""},

        ],
        contacts:[
          {addr:"服务热线:",phobeNum:"123231231"},
          {addr:"网站地址:",phobeNum:"www.ccb.com"},
        ]
      }
    }
  }
</script>

<style lang="scss">
  .f{
    width:100%;
    background: url("../../../../assets/images/foot/footer-BG.png") 0 0 no-repeat;
    background-size: 100%;
    .f-t{
      background-color: rgb(24,24,40);
      ul{
        padding: 30px 80px;
        overflow: hidden;
        margin-bottom: 0;
        li{
          width: 25%;
          float: left;
          margin: 0;
          height: 46px;
          text-align: center;
          font-size: 0px;
          img{
            vertical-align:middle;
          }
          span{
            vertical-align:middle;
            color: white;
            font-size: 12px;
            margin-left: 10px;
          }
        }
      }
    }
    .f-b{
      padding: 6rem 10rem 0 10rem;
      //background-color: rgba(24,24,40,0.7);
      
     
      overflow: hidden;
      >div{
        width: 33%;
        float: left;

      }
      .f-pro{
        overflow: hidden;
        >div{
          margin-right: 5rem;
          float: left;
          h3{
            font-size: 14px;
            margin-bottom: 2rem;
            color: white;
          }
          p{
            color: #A8ACB9;
            font-size: 14px;
            text-align: left;
            margin-bottom: 16px;
          }
        }
      }
      .wxin{
        text-align: left;
        overflow: hidden;
        >div{
          display: inline-block;
          text-align: center;
          margin: 0 1rem;
          p{
            margin-top: 10px  ;
            color: #A8ACB9;
          }
          img{
            width: 90%;
          }
        }
      }
      .f-contact{
        >div{
          padding: 0 5rem;
          text-align: left;
          ul{
            margin-bottom: 1rem;
            li{
              margin: 0;
              display: inline-block;
              //margin-right: 1rem;
              width: 33%;
              
            }
          }
        }

        h3{
          color: white;
          margin-bottom: 25px;
          font-size: 16px;
        }
        p{
          color: #A8ACB9;
          font-size: 14px;
          margin-bottom: 16px;
          label{

          }
          span{

          }
        }
      }
    }
  }
  h3{
    margin: 0;
  }
</style>
