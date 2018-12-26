<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
#app {
  width: 100%;
  height: 100%;
  
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
.fixed-box{
    margin-top: 60px;
  }
  .com-body{
    
    width: 100%;
    position: absolute;
    
  }
</style>
