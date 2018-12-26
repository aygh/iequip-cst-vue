<template>
    <div class="head2">
        <div style="width:90%; height: 100%; margin: 0 auto">
        <ccb-row class="my-row"  :wrap="'nowrap'">
          <ccb-col :span="6" :pull="1">
              <span class="logo" @click="toHome"><i class="iconfont icon-cloud-server my-iconfont"></i>建行设备云服务平台</span>
          </ccb-col>
          <ccb-col :span="2" :push="1" v-for="(operate, index) in paths.ops" :key="index">
              <router-link :id="operate.path.toLowerCase()" :to="{path:operate.path}">{{operate.name}}</router-link>
          </ccb-col>
          <ccb-col v-if="!userName" :span="2" :push="1"><button @click="register" type="button" class="regester">注册</button></ccb-col>
          <ccb-col v-if="!userName" :span="2" :push="2"><router-link :to="'/loginIn'" class="loginIn">登录</router-link></ccb-col>
          <ccb-col v-if="userName" :span="4" :push="1">
            <el-col :span="24" class="user-info">
	    		<span class="el-dropdown-link userinfo-inner">{{userName}}</span>
	    		<span @click="logout"><ccb-icon name="logout"></ccb-icon>退出</span>
	        </el-col>        
          </ccb-col>
        </ccb-row>
        </div>
    </div>
</template>
 
<script>
	export default{
		data(){
			return{
                userName: '',
				paths:{
        		ops:[
        			{path:"/",name:"首页"},
        			{path:"/Product",name:"产品中心"},
        			{path:"/ProjectManage",name:"项目管理"},
        			{path:"/ResourceManage",name:"资源管理"},
        			{path:"/Help",name:"帮助中心"},
        			{path:"/Contact",name:"联系我们"},
        			{path:"/UserCenter",name:"个人中心"},
        		]
        },
        mapPath: {
          '/userCenter': [
            '/userCenter', 
            '/changeAcctPhone', 
            '/changePwd',
            '/userCenter/realName'
          ]
        }
 
            }
        },
    methods:{
      register(){
        this.$router.push({path: '/register'})
      },
      toHome() {
        this.$router.push('/')
      },
      toOtherRoute(path) {
        this.$router.push(path)
      },
      setDeafultPath() {
        let matched = this.$route.matched.filter(item => item.path);
        let pathObj = matched[matched.length - 1];
        let defaultPath = pathObj.path;
        let setPath = ''
        for(let k in this.mapPath) {
          if(this.mapPath[k].some(item => defaultPath === item)) {
            setPath = k.toLowerCase()
            break
          }
        }
        setTimeout(() => {
          if(setPath){
            document.getElementById(setPath) && document.getElementById(setPath).classList.add('router-link-exact-active');
          }
          
        }, 0);
          // console.log(this.$refs[setPath][0]);
          // console.log(this.$refs[setPath][0].$el.addClass)
          //  = {className: `router-link-exact-active`}
      },

      logout() {
          this.$http({
              method: 'post',
              url: '/logout'
          }).then(res => {
              console.log(res);
              sessionStorage.clear();
              this.userName = '';
              this.$router.push('/')
          }).catch(err => {
              console.log(err);
          })
      }
    },
    created() {
      this.userName = sessionStorage.userName;
    },
    mounted() {
      this.$nextTick(() => {
        this.setDeafultPath();
      })
    }
    }
</script>
 
<style lang="scss">
.head2{
  width: 100%;
  height: 60px;
  box-shadow: 0 2px 20px 0 rgba(0,0,0,0.15);
  position: fixed;
  top: 0;
  background-color: #ffffff;
  z-index: 999;

    .my-iconfont {
        font-size: 30px !important;
    }

  .my-row {
    height: 100%;
    line-height: 60px;
    .logo {
      display: inline-block;
      width: 100%;
      line-height: 60px;
      text-align: center;
      min-width: 290px;
      font-family: PingFangSC-Regular;
      font-size: 28px;
      color: #333333;
      letter-spacing: 0;
      cursor: pointer;
    }
    a {
      color: #B9B9B9;
      letter-spacing: 0.58px;
    }
    .router-link-exact-active{
      color: #3F79E5;
      border-bottom: 2px solid #3F79E5;
      padding-bottom: 20px;
      font-weight: bold;
    }
    .regester {
      width: 80px;
      height: 36px;
      color: #c5c5c5;
      letter-spacing: 0.67px;
      font-size: 16px;
      font-family: MicrosoftYaHei;
      background: #151521;
      border: 1px solid #FFFFFF;
      border-radius: 2px;
    }
    .loginIn {
      font-family: MicrosoftYaHei;
      font-size: 16px;
      color: #151521;
      letter-spacing: 0.67px;
    }
  }
  .user-info {
      span {
          margin: 0 10px;
          &:last-child {
              cursor: pointer;
          }
      }
  }
}
 
</style>