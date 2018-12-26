<template>
  <!--<div class="swiper-container">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="(str,index) in listImg" :key="index">
          <img :src='str' />
      </div>

    </div>
    <div class="swiper-pagination swiper-pagination-white" slot="pagination"></div>
  </div>-->
  <div id="vue-swiper" class="vue-swiper m-topic-swiper">
    <swiper :options="swiperOption">
      <swiper-slide v-for="(str,index) in listImg" :key="index">
        <img :src='str' />
        <BannerW></BannerW>
      </swiper-slide>
    </swiper>
    <div class="swiper-pagination" id="swiper-pagination" slot="pagination"></div>

  </div>
</template>

<script>
  import BannerW from '@/components/templetes/commons/banner/BannerWord';
  import {swiper,swiperSlide } from 'vue-awesome-swiper';
  //import Swiper from 'swiper';
  import 'swiper/dist/css/swiper.css';

  export default {
    components: {
      swiper,
      swiperSlide,
      BannerW
    },
    mounted() {
    /* new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        paginationClickable: true,
        loop: true,
        autoplay:true,
        speed: 600,
        //autoplay: 4000,
        /!*onTouchEnd: function() {
          swiper.startAutoplay()
        }*!/
      });*/

    },
    data() {
      return {
        swiperOption: {//swiper3
          autoplay: false,
          speed: 1000,
          loop:false,
          pagination: {
            el: '.swiper-pagination',
           // type: 'custom',
            //type: 'fraction',
            //type : 'progressbar',
            //type : 'custom',
            //progressbarOpposite: false, //使进度条分页器与Swiper的direction参数相反
            bulletElement : 'span', //设定分页器指示器（小点）的HTML标签。
           // dynamicBullets: true,  //动态分页器，当你的slide很多时，开启后，分页器小点的数量会部分隐藏。
           // dynamicMainBullets: 2, //动态分页器的主指示点的数量
           // hideOnClick: true, //默认分页器会一直显示。这个选项设置为true时点击Swiper会隐藏/显示分页器。
            clickable: true, //此参数设置为true时，点击分页器的指示点分页器会控制Swiper切换。
            paginationClickable:true
          },
        },
        listImg: [
          require('@/assets/images/banner/banner1.jpg'),
          // require('@/assets/images/banner/banner2.jpg'),
          // require('@/assets/images/banner/banner3.jpg'),
        ]
      }
    },
  }
</script>

<style lang="scss">

  .vue-swiper{


    width: 100%;
    height: 400px;
    overflow: hidden;
    position: relative;
    .swiper-container{
      width: 100%;
    }
    .swiper-pagination{
      left: 0;
      width:100% !important;
      text-align: center;
      bottom: 10px;
      .swiper-pagination-bullet-active{
        background-color: blue;
        width: 10px;
        height: 10px;
      }
      .swiper-pagination-bullet{
        background-color: white;

        border-radius: 50%;
        margin: 0 10px;
      }
    }
    .banner-word-box{
      position: absolute;
      top:8rem;
      left:8rem;
      z-index: 99999;
      width: 26rem;
    }
  }
  .swiper-slide {
    background-position: center;
    background-size: cover;
    width: 100%;
    height: 100%;
    img {
      width: 100%;
    }
  }

</style>
