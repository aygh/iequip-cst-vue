<template>
  <div class="title">
      <div class="line"></div>
      <h2>{{caption}}</h2>
      <p>{{describ}}</p>
  </div>
</template>

<script>
  export  default {
        props:['caption','describ']
  }
</script>

<style lang="scss">
    .title{
       text-align: center;
       .line{
         margin: 0 auto;
         width: 72px;
         height: 6px;
         background-color: #306FE4;;
       }
      h2{
          margin: 1rem 0 1.5rem 0;
          font-size: 32px;
      }
      p{
          margin: 0;
          font-size: 16px;
          color: #666666;
      }
    }
</style>
