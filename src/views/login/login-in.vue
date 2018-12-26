<template>
    <div class="container">
        <div class="content">
            <div class="left">
                <span>平台保证 安全服务</span>
                <div class="left-box">
                    <span>更少的投入成本，更人性化的服务方式，更可靠的平台保障</span>
                </div>
                <img src="../../assets/images/login/登录-插图.png" alt="">
            </div>
            <div class="right">
            <ccb-form :model="formData" ref="form" class="form-wrap">
                <p>建行设备云服务平台</p>
                <ccb-form-item style="margin-top: 6.7%" class="input-wrap" label="" :rules="rules.acctNm" field="acctNm">
                  <input class="my-input" v-model="formData.acctNm" type="text" placeholder="请输入用户名">
                  <span class="err-toolTip" v-show="umTooltip">用户名或密码输入错误</span>
                </ccb-form-item>
                <ccb-form-item class="input-wrap" label="" :rules="rules.credential" field="credential">
                  <!-- <ccb-input type="password" :cssStyle="cssConfig.inputStyles" v-model="formData.credential" :placeholder="'请输入密码'"></ccb-input> -->
                  <input class="my-input" type="password" v-model="formData.credential" placeholder="请输入密码">
                </ccb-form-item>
                <ccb-form-item class="input-wrap" label="" :rules="rules.verify" field="verify">
                  <input class="my-verify-input my-input" type="text" v-model="formData.verify" placeholder="请输入验证码">
                  <!-- 验证码 -->
                  <div id="v_container"></div>
                  <span class="err-toolTip" v-show="codeTooltip">验证码错误</span>
                </ccb-form-item>
                <div class="check-box">
                    <ccb-check :multi="false" v-model="checked" :options="checkOptions"></ccb-check>
                    <!-- <router-link :to="'/resetcredential'">忘记密码？</router-link> -->
                </div>
                <button class="loginIn-button" type="button" @click="loginIn">登录</button>
            </ccb-form>
            
            </div>
        </div>
    </div>
</template>
<script>
import GVerify from "@/utils/gVerify.js";
import { roles } from "@/config";
export default {
  data() {
    return {
      formData: {
        acctNm: "",
        credential: "",
        verify: ""
      },
      rules: {
        acctNm: [{ type: "string", required: true, message: "用户名不能为空" }],
        credential: [
          { type: "string", required: true, message: "密码不能为空" }
        ],
        verify: [{ type: "string", required: true, message: "验证码不能为空" }]
      },
      checked: "",
      checkOptions: [{ label: "记住密码", value: "1" }],
      verifyCode: null,
      umTooltip: false,
      codeTooltip: false,
    };
  },
  methods: {
    loginIn() {
      this.codeTooltip = false;
      this.umTooltip = false;
      this.$refs["form"].validateForm(valid => {
        if (!valid) return;
        let bool = this.verifyCode.validate(this.formData.verify);
        if (!bool) {
          return (this.codeTooltip = true);
        }

        this.$http({
          method: "post",
          url: "/login",
          params: {
            username: this.formData.acctNm,
            password: this.formData.credential
          }
        })
          .then(res => {
            let { data } = res;
            if (res.data.status !== "success") {
              return this.umTooltip = true
            }
            let { _login_info } = data;
            if(_login_info) {
              let {roleList} = _login_info;
            if (!roleList.some(roleListItem => roles.some(rolesItem => roleListItem.rlId === rolesItem))) {
                this.umTooltip = true;
                this.logout()
                return
              }
              sessionStorage.userId = _login_info.usrId;
              sessionStorage.userName = _login_info.usrNm;
              sessionStorage.emailAdr = _login_info.emailAdr;
              sessionStorage.usrGnd = _login_info.usrGnd;
              sessionStorage.insId = _login_info.insId;
              sessionStorage.isLogin = true;
              //李军新增测试储存session
              
              sessionStorage.setItem("userInfo",JSON.stringify(data));
            }
            localStorage.remberUserId =
              (this.checked === "1" && _login_info.usrId) || "";
            this.$router.push({ path: '/' });
          })
          .catch(err => {
              console.log(err);
            sessionStorage.isLogin = false;
            this.$ccb.$alert({
              styleType: "error",
              title: "error",
              content: '系统异常，请稍后再试'
            });
          });
      });
    },

    logout() {
        this.$http({
            method: 'post',
            url: '/logout'
        }).then(res => {
            console.log(res);
            sessionStorage.clear();
        }).catch(err => {
            console.log(err);
        })
    },

    init() {
      if (localStorage.remberUserId) {
        this.formData.acctNm = localStorage.remberUserId;
        this.checked = "1";
      } else {
        this.formData.acctNm = "";
        this.checked = "";
      }
    }
  },
  created() {
    this.init();
  },
  mounted() {
    this.verifyCode = new GVerify("v_container");
  }
};
</script>
<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: calc(100% - 60px);
  background-image: url("../../assets/images/login/登录BG.png");
  background-repeat: no-repeat;
  background-size: cover;
  .content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 1200px;
    // height: 580px;
    .left {
      width: 610px;
      // height: 100%;
      overflow: hidden;
      & > span {
        display: block;
        width: 100%;
        height: 70px;
        margin-top: 30px;
        margin-bottom: 30px;
        line-height: 70px;
        text-align: center;
        font-family: MicrosoftYaHei-Bold;
        font-size: 54px;
        color: #ffffff;
        letter-spacing: 2.25px;
      }
      .left-box {
        width: 100%;
        height: 54px;
        line-height: 54px;
        text-align: center;
        opacity: 0.2;
        background: #ffffff;
        border-radius: 23px;
        margin-bottom: 30px;
        span {
          opacity: 0.8;
          font-family: MicrosoftYaHei;
          font-size: 20px;
          line-height: 26px;
          color: #000;
          letter-spacing: 2.22px;
        }
      }
    }
    .right {
      width: 500px;
      height: 100%;
    }
  }

  p {
    font-family: MicrosoftYaHei-Bold;
    font-size: 22px;
    color: #333333;
    letter-spacing: 0;
    text-align: center;
    margin-top: 6.7%;
  }
  .form-wrap {
    width: 500px;
    height: 100%;
    background: #ffffff;
    border-radius: 8px;
    overflow: hidden;
  }
  .input-wrap {
    position: relative;
    width: 400px;
    height: 50px;
    box-sizing: border-box;
    padding-left: 10px;
    margin: 0 auto 30px;
    #v_container {
      position: absolute;
      right: -145px;
      bottom: 0;
      width: 120px;
      height: 100%;
      border-radius: 2px;
    }
    .err-toolTip {
      position: absolute;
      top: 39px;
      width: 100%;
      height: 14px;
      color: #f5222d;
      font-size: 14px;
    }
  }
  .check-box {
    display: flex;
    justify-content: space-between;
    width: 400px;
    height: 30px;
    margin: 0 auto;
    box-sizing: border-box;
    padding: 0 10px;
    a {
      font-family: MicrosoftYaHei;
      font-size: 14px;
      color: #cccccc;
      text-align: left;
    }
  }
  .loginIn-button {
    width: 380px;
    height: 50px;
    background: #3f79e5;
    border-radius: 2px;
    font-size: 14px;
    margin-left: 60px;
    margin-top: 30px;
    margin-bottom: 6.7%;
  }
  .my-input {
    width: 380px;
    height: 50px;
    border: 0 none;
    border: 1px solid #dcdfe6;
    line-height: 30px;
    border-radius: 4px;
    padding: 0 10px;
    outline: none;
  }
  .my-verify-input {
    width: 240px;
    height: 50px;
  }
}
</style>
<style>
input::-webkit-input-placeholder {
  font-family: MicrosoftYaHei;
  font-size: 14px;
  color: #cccccc;
}
input::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  font-family: MicrosoftYaHei;
  font-size: 14px;
  color: #cccccc;
}
input:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  font-family: MicrosoftYaHei;
  font-size: 14px;
  color: #cccccc;
}
input:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  font-family: MicrosoftYaHei;
  font-size: 14px;
  color: #cccccc;
}
</style>


