<template>
  <div class="new-show">
    <div class="new-msg">
      <img :src="img"/>
      <div>
        <h3>{{date}}</h3>
        <h2>{{t}}</h2>
        <p>{{msg}}</p>
      </div>

    </div>
  </div>
</template>

<script>
  export  default {
    props:['img','t','msg','date'],
    components:{

    }
  }
</script>
<style lang="scss">
  .new-show{
    text-align: left;
    h2{
      padding: 0;
      margin: 0;
      font-size: 16px;
    }
    p{
      font-size: 14px;
      margin: 0.3rem 0;
    }
    h3{
      text-align: left;
      display: inline-block;
      background-color: cornflowerblue;
      color: white;
      padding: 6px;
      font-size: 12px;
    }
    .new-msg{
      >img{
        width: 100%;
      }
      >div{
        padding-left: 1rem;
      }
    }
  }
</style>
