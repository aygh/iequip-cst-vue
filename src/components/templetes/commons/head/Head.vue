<template>
	<div class="head">
		<ccb-row v-if="showlogo">
         <ccb-col  class="logo" :span="7" :push="2">
           <!-- <img src="../../../../assets/log.png" /> -->
           <span><i class="iconfont icon-cloud-server my-iconfont"></i>建行设备云服务平台</span>
        </ccb-col>
      	<ccb-col class="tab" :span="13" >
      		<ul>
      			<!-- <li  v-for="(operate,path,index) in paths.ops" :key="index"> -->
      			<li  v-for="(operate,path,index) in ops" :key="index">
      				<router-link :to="{path:operate.path}">{{operate.name}}</router-link>
      			</li>
      		</ul>
      	</ccb-col>
        <ccb-col class="login" :span="4">
            <div v-if="isLogin">
 
              <router-link :to="'/register'"><button class="regist-bt">注册</button></router-link>
              <router-link :to="'/loginIn'"><button class="login-bt">登陆</button></router-link>
            </div>
            <div v-else>
              <el-col :span="12" class="user-info">
              <span>{{userName}}</span>
                <span @click="logout"><ccb-icon name="logout"></ccb-icon>退出</span>
              </el-col>  
            </div>
        </ccb-col>
		</ccb-row>
    <ccb-row v-else>
        <div style="overflow:hidden;margin:0 auto;width:80%;">
      	<ccb-col class="tab" :span="18" >
      		<ul>
      			<!-- <li  v-for="(operate,path,index) in paths.ops" :key="index"> -->
      			<li  v-for="(operate,path,index) in ops" :key="index">
      				<router-link :to="{path:operate.path}">{{operate.name}}</router-link>
      			</li>
      		</ul>
      	</ccb-col>
        <ccb-col style="float:right" class="login" :span="4">
            <div v-if="isLogin">
 
              <router-link :to="'/register'"><button class="regist-bt">注册</button></router-link>
              <router-link :to="'/loginIn'"><button class="login-bt">登陆</button></router-link>
            </div>
            <div v-else>
              <el-col :span="12" class="user-info">
              <span>{{userName}}</span>
                <span @click="logout"><ccb-icon name="logout"></ccb-icon>退出</span>
              </el-col>  
            </div>
        </ccb-col>
        </div>
		</ccb-row>

	</div>
</template>

<script>
import {checkUserIsLogin} from '@/utils/myFn'
import { setTimeout } from 'timers';
	export default{
		data(){
			return{
        isLogin: true,
        userName: '',
        showlogo:true,
				paths:{
          			// ops:[
          			// 	{path:"/",name:"首页"},
          			// 	{path:"/Product",name:"产品中心"},
          			// 	{path:"/ProjectManage",name:"项目管理"},
          			// 	{path:"/ResourceManage",name:"资源管理"},
          			// 	{path:"/Help",name:"帮助中心"},
          			// 	{path:"/Contact",name:"联系我们"},
          			// 	{path:"/UserCenter",name:"个人中心"},

          			// ]
          	}

			}
		},
    methods:{
      init() {
        checkUserIsLogin()
          .then(res => {
            this.isLogin = !sessionStorage.isLogin;
            this.userName = sessionStorage.userName;
          })
          .catch(err => {
            this.isLogin = true;
          })
      },
      logout() {
        this.$http({
              method: 'post',
              url: '/logout'
          }).then(res => {
              console.log(res);
              sessionStorage.clear();
              this.$router.push('/');
              this.isLogin = true;
          }).catch(err => {
              console.log(err);
          })
      }
    },
    created() {
      // this.isLogin = !sessionStorage.isLogin;
      // this.userName = sessionStorage.userName;
      this.init();
      let sscreenWidth=document.body.clientWidth;
      if(sscreenWidth<1224){
          
          this.showlogo=false;
        }else{
          this.showlogo=true;
          
        }
    },
    computed: {
      ops() {
        return this.$store.state.header.myNavList
      }
    },
    
    mounted(){
      let that=this;
      setTimeout(
      window.onresize= ()=>{
        window.screenWidth = document.body.clientWidth
      that.screenWidth = window.screenWidth;
        if(that.screenWidth<1224){
          
          this.showlogo=false;
        }else{
          this.showlogo=true;
          
        }
        
      },1000);
    }
	}
</script>

<style lang="scss" socped>
.head{
	width: 100%;
  position: absolute;
  top: 0;
  z-index: 9999999;
  line-height: 66px;
  .my-iconfont {
      color: #fff !important;
      font-size: 30px !important;
  }
  .logo{
    span {
      font-family: PingFangSC-Regular;
      font-size: 28px;
      color: #FFFFFF;
      letter-spacing: 0;
    }
  }
  .login{
    button{
      cursor: pointer;
      margin-top: 14px;
      width: 40%;
      max-width: 80px;
      font-size: 15px;
      line-height: 30px;
      outline:none;
      border: 1px solid white;
    }
    .regist-bt{
      color: white;
      background: none;
    }
    .login-bt{
      background: white;
      color: #000000;
    }
    span {
      font-family: MicrosoftYaHei;
      font-size: 14px;
      color: #B9B9B9;
      letter-spacing: 0.58px;
    }
  }
  .tab{
    ul{
      overflow:hidden;
      padding: 0;
      margin: 0;
      overflow-x: scroll;
      white-space: nowrap;
      overflow-scrolling: touch;

      li{
        display: inline-block;
        margin-left: 2rem;
        a{
          text-decoration: none;
          font-family: MicrosoftYaHei;
          font-size: 1.2rem;
          color: #B9B9B9;
          letter-spacing: 0.58px;
        }
      }
    }
  }
    .user-info {
        span {
            &:last-child {
                cursor: pointer;
            }
        }
    }
}
.tab ul::-webkit-scrollbar{
	display: none;
}



</style>
