<template>
  <div class="banner-word-box">
    <div class="t"><h1>{{bannerWord.title}}</h1></div>
    <div class="msg"><p>{{bannerWord.msg}}</p></div>
    <div class="btn">
      <router-link :to="{path:bannerWord.path}"><button>免费注册</button></router-link>
      <router-link :to="{path:bannerWord.path}"><button :style="btStyle">立即体验</button></router-link>
    </div>
  </div>
</template>

<script>
    import index from '@/views/home';
    export default {
          data(){
            return{
              bannerWord:{
                path:"/register",
                title:"平台保证 安全服务",
                msg:"更少的投入成本，更人性化的服务方式，更可靠的平台保障，为您提供一体化的解决方案",
              },
              btStyle:{
                background:'white',
                color:'black'
              }
            }
          }
    }
</script>

<style lang="scss">
  .banner-word-box{
    text-align: left;
    h1{
      font-size: 2rem;
      color: white;
    }
    p{
      color: white;
      font-size: 16px;

    }
    .btn{
      a{
        display: inline-block;
      }
        button{
          color: white;
          background: none;
          cursor: pointer;
          margin-top: 14px;
          width: 150px;
          font-size: 16px;
          line-height: 45px;
          outline:none;
          border: 1px solid white;
          border-radius: 4px;
        }
    }
  }
</style>
