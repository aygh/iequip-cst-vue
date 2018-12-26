<template>
  <div class="product-show">
      <div><img :src="`/getFile?filePath=${filePath}${img.replace(/\\/g, '/')}`"/></div>
      <h2>{{t}}</h2>
      <p>{{msg}}</p>
  </div>
</template>

<script>
import { filePath } from '@/config';
  export  default {
    props:['img','t','msg'],
    components:{

    },
    data(){
      return{
        filePath:filePath
      }
    }
  }
</script>
<style lang="scss">
  .product-show{
    h2{
      padding: 0;
      margin: 0;
      color: #333333;
    }
    p{
      margin: 0.3rem 0;
      padding: 0 2rem;
      color: #333333;
    }
    img{
      
    }
  }
</style>
