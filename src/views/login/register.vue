<template>
  <div class="container">
    <div class="content">
      <div class="left">
        <span>平台保证 安全服务</span>
        <div class="left-box">
          <span>更少的投入成本，更人性化的服务方式，更可靠的平台保障</span>
        </div>
        <img src="../../assets/images/login/登录-插图.png" alt>
      </div>
      <div class="right">
        <ccb-form :model="formData" class="form-wrap" ref="form">
          <p>
            <span>{{ title }}</span>
          </p>
          <ccb-form-item
            style="margin-top: 6.7%"
            class="input-wrap"
            label
            :rules="rules.acctNm"
            field="acct.acctNm"
          >
            <input
              class="my-input"
              v-model="formData.acct.acctNm"
              type="text"
              placeholder="请设置您的账户名"
            >
            <span class="err-tooltip" v-show="umTooltip">{{umTooltipText}}</span>
          </ccb-form-item>
          <ccb-form-item class="input-wrap" label :rules="rules.emailAdr" field="acct.emailAdr">
            <input
              class="my-input"
              v-model="formData.acct.emailAdr"
              type="text"
              placeholder="请输入您的邮箱"
            >
            <span class="err-tooltip" v-show="emToolTip">{{emToolTipText}}</span>
          </ccb-form-item>
          <ccb-form-item class="input-wrap" label :rules="rules.credential" field="acct.credential">
            <input
              class="my-input"
              type="password"
              v-model="formData.acct.credential"
              :placeholder="'请输入密码'"
            >
            <span class="err-tooltip" v-show="PWDTooltip">{{PWDTooltipText}}</span>
          </ccb-form-item>
          <ccb-form-item
            class="input-wrap"
            label
            :rules="rules.credentialAgain"
            field="credentialAgain"
          >
            <input
              class="my-input"
              type="password"
              v-model="formData.credentialAgain"
              :placeholder="'请再次输入密码'"
            >
          </ccb-form-item>
          <ccb-form-item class="input-wrap" label :rules="rules.acctPhone" field="acct.acctPhone">
            <div class="select-wrap">
              <ccb-select class="reg-select" v-model="selectValue" :options="options"></ccb-select>
            </div>
            <input
              class="my-input my-phone-input"
              v-model="formData.acct.acctPhone"
              type="text"
              placeholder="请输入您的手机号"
            >
            <span class="err-tooltip" v-show="acctPhoneErrShow">请输入正确的手机号</span>
          </ccb-form-item>
          <ccb-form-item class="input-wrap" label :rules="rules.veriCode" field="veriCode">
            <input
              class="my-input my-vericode-input"
              v-model="formData.veriCode"
              type="text"
              placeholder="请输入短信验证码"
            >
            <button
              type="button"
              :disabled="codeBtnDisabled"
              :class="isAgain ? 'validate-btn-again validate-btn' : 'validate-btn-again'"
              @click="getCode"
            >{{btnTxt}}</button>
            <span class="err-tooltip" v-show="codeTooltip">验证码错误或已过期</span>
          </ccb-form-item>
          <div class="check-box">
            <ccb-check :multi="false" v-model="checked" :options="checkOptions"></ccb-check>
            <span v-if="checkTooltip" class="err-tooltip">您必须同意该协议后，才能提交注册</span>
          </div>
          <button type="button" class="confirm-btn" @click="confirmRegister">确定</button>
        </ccb-form>
      </div>
    </div>
    <ccb-window :show.sync="showWindow" title="《中国建设银行金融科技设备云用户协议》和《隐私政策声明》">
      <p>《中国建设银行金融科技设备云用户协议》和《隐私政策声明》</p>
      <div slot="footer">
        <ccb-button @click="showWindow = false">确定</ccb-button>
      </div>
    </ccb-window>
  </div>
</template>
<script>
import { userApi } from "@/api";
import { setInterval, clearInterval } from "timers";
import { phoneOptions } from "./phoneOptions.js";
export default {
  name: "register",
  data() {
    return {
      formData: {
        credentialAgain: "",
        veriCode: "",
        codeSN: "",
        acct: {
          acctNm: "",
          acctPhone: "",
          credential: "",
          emailAdr: ""
        }
      },
      rules: {
        acctNm: [{ type: "string", required: true, message: "账户名不能为空" }],
        emailAdr: [{ type: "string", required: true, message: "邮箱不能为空" }],
        credential: [
          { type: "string", required: true, message: "密码不能为空" }
        ],
        credentialAgain: [
          { type: "string", required: true, message: "请再次输入密码" }
        ],
        acctPhone: [
          { type: "string", required: true, message: "手机号不能为空" }
        ],
        veriCode: [
          { type: "string", required: true, message: "短信验证码不能为空" }
        ]
      },
      selectValue: "+86(中国)",
      options: phoneOptions,
      checked: "1",
      checkOptions: [
        {
          label:
            "我已阅读并同意《中国建设银行金融科技设备云用户协议》和《隐私政策声明",
          value: "1"
        }
      ],
      showWindow: false,
      title: "建行设备云服务平台",
      registerSuccTooltip: "恭喜您，您已成功注册为设备云平台会员！",
      umTooltip: false,
      umTooltipText: "",
      emToolTipText: "",
      emToolTip: false,
      PWDTooltip: false,
      PWDTooltipText: "",
      codeTooltip: false,
      checkTooltip: false,
      acctPhoneErrShow: false,
      btnTxt: "免费获取短信验证码",
      codeBtnDisabled: false,
      timer: null,
      isAgain: true,
      flag: false
    };
  },
  methods: {
    //获取短信验证码
    getCode() {
      if (this.flag) return;
      this.acctPhoneErrShow = false;
      if (!this.validatePhone(this.formData.acct.acctPhone)) {
        return (this.acctPhoneErrShow = true);
      }
      this.$http({
        method: "post",
        url: "/iequip/smsController/sendVerificationNumber",
        params: {
          phoneNumber: this.formData.acct.acctPhone
        }
      })
        .then(res => {
          console.log(res);
          let { data } = res;
          if (data.BK_STATUS != "01") return console.log(data.BK_DESC);
          this.formData.codeSN = data.codeSN;
          this.codeBtnDisabled = true;
          this.flag = true;
          this.getCodeAgain();
        })
        .catch(err => {
          console.log(err);
        });
    },

    //再次获取短信验证码
    getCodeAgain() {
      this.isAgain = false;
      let t = 59;
      this.btnTxt = `再次获取短信验证码（${t}）`;
      this.timer = setInterval(() => {
        t -= 1;
        this.btnTxt = `再次获取短信验证码（${t}）`;
        if (t <= 0) {
          clearInterval(this.timer);
          this.codeBtnDisabled = false;
          this.isAgain = true;
          this.flag = false;
          this.btnTxt = `免费获取短信验证码`;
        }
      }, 1000);
    },

    // 提交注册
    confirmRegister() {
      this.umTooltip = false;
      this.emToolTip = false;
      this.PWDTooltip = false;
      this.codeTooltip = false;
      this.checkTooltip = false;
      this.acctPhoneErrShow = false;
      if (!this.checked) return (this.checkTooltip = true);
      this.$refs["form"].validateForm(valid => {
        if (!valid) return;
        if (!this.validateEmail(this.formData.acct.emailAdr)) {
          this.emToolTipText = "请输入正确的邮箱";
          this.emToolTip = true;
          return;
        }
        if (!this.validateCredential(this.formData.acct.credential)) {
          this.PWDTooltipText = "密码必须包含大小写字母和特殊符号";
          this.PWDTooltip = true;
          return;
        }
        if (this.formData.credentialAgain !== this.formData.acct.credential) {
          this.PWDTooltipText = "两次输入的密码不一致";
          this.PWDTooltip = true;
          return;
        }
        if (!this.validatePhone(this.formData.acct.acctPhone)) {
          return (this.acctPhoneErrShow = true);
        }
        let params = {};
        for (let k in this.formData) {
          if (k != "credentialAgain") {
            params[k] = this.formData[k];
          }
        }
        params.codeSN = params.codeSN || "1111";
        this.$axios({
          method: "post",
          url: userApi.register,
          data: params,
          PBreq: "com.ccb.cloud.protobuf.proto.iequip.AcctRegister"
        })
          .then(res => {
            console.log(res);
            const { SYS_TX_STATUS, SYS_RESP_DESC } = res.headers;
            if (SYS_TX_STATUS == "00") {
              this.$router.push({
                path: "/success",
                query: { type: "register" }
              });
            } else if (SYS_TX_STATUS == "01") {
              if (SYS_RESP_DESC.includes("已过期") || SYS_RESP_DESC.includes("短信验证失败")) {
                this.codeTooltip = true;
              } else if (SYS_RESP_DESC.includes("账户") && SYS_RESP_DESC.includes("已存在")) {
                this.umTooltipText = "账户名已存在";
                this.umTooltip = true;
              } else if (SYS_RESP_DESC.includes("邮箱") && SYS_RESP_DESC.includes("已存在")) {
                this.emToolTipText = "邮箱已存在";
                this.emToolTip = true;
              } else {
                this.$ccb.$alert({
                  styleType: "error",
                  title: "提示",
                  content: SYS_RESP_DESC
                });
              }
            }
          })
          .catch(err => {
            console.log(err);
            this.$ccb.$alert({
              styleType: "error",
              title: "提示",
              content: "系统异常，请稍后再试!"
            });
          });
      });

      // this.title = '注册成功';
    },

    //手机号校验
    validatePhone(p) {
      const reg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (reg.test(p)) {
        return true;
      } else {
        return false;
      }
    },

    //密码校验
    validateCredential(c) {
      const reg = /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/;
      if (reg.test(c)) {
        return true;
      } else {
        return false;
      }
    },

    //邮箱校验
    validateEmail(em) {
      const reg = /^[\w\-\.]+\@[\w]+\.[\w]{2,4}$/;
      if (reg.test(em)) {
        return true;
      } else {
        return false;
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
  }
};
</script>
<style lang="scss" scoped>
.container {
  position: relative;
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
      // overflow: hidden;
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

    .form-wrap {
      width: 500px;
      height: 100%;
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      p {
        font-family: MicrosoftYaHei-Bold;
        font-size: 22px;
        color: #333333;
        letter-spacing: 0;
        text-align: center;
        margin-top: 6.7%;
      }
    }
    .input-wrap {
      position: relative;
      width: 400px;
      height: 50px;
      box-sizing: border-box;
      padding-left: 10px;
      margin: 0 auto 20px;
    }
    .select-wrap {
      position: absolute;
      top: 0;
      left: 0;
      width: 130px;
      height: 50px;
      z-index: 100;
    }
    .validate-btn-again {
      position: absolute;
      z-index: 9999;
      top: 0px;
      right: -150px;
      width: 148px;
      height: 50px;
      background: #f5f6fa;
      border: 1px solid #e6e6e6;
      border-radius: 2px;
      color: #ccc;
    }

    .validate-btn {
      background: #3f79e5;
      color: #fff;
    }

    .confirm-btn {
      width: 379px;
      height: 50px;
      margin-left: 60px;
      margin-bottom: 6.7%;
    }
    .check-box {
      position: relative;
      width: 380px;
      margin-left: calc(50% - 190px);
      margin-bottom: 20px;
    }
    .my-input {
      width: 380px;
      height: 50px;
      border: 0 none;
      border: 1px solid #dcdfe6;
      line-height: 30px;
      border-radius: 4px;
      padding: 0 15px;
      outline: none;
    }
    .my-phone-input {
      width: 222px;
      height: 50px;
      margin-left: 156px;
    }
    .my-vericode-input {
      width: 222px;
      height: 50px;
    }
    .err-tooltip {
      position: absolute;
      left: 0;
      top: 38px;
      color: #f5222d;
      font-size: 14px;
    }
  }
}
</style>
<style lang="scss">
.reg-select {
  .ccb-input {
    height: 50px !important;
  }
}
.check-box {
  .ccb-check-item {
    span {
      font-family: MicrosoftYaHei;
      font-size: 14px;
      color: #cccccc;
      text-align: left;
    }
  }
}
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


