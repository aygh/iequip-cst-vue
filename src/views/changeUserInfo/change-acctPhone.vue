<template>
    <div class="container">
        <div class="content fixed-box">
            <ccb-form :model="formData" ref="form" class="form-wrap" :layout="'vertical'">
                <p class="title">{{title}}</p>
                <ccb-form-item class="input-wrap" label="">
                    <span class="my-label">原手机号码：</span>
                    <span>{{oldAcctPhone}}</span><!--反显并隐藏中间四位-->
                </ccb-form-item>
              
                <ccb-form-item class="input-wrap" label="" :rules="rules.newAcctPhone" field="newAcctPhone">
                    <span class="my-label"><i>请输入新手机号码：</i></span>
                    <span class="my-label-right"><i>*</i>&nbsp;必填项</span>
                  <input class="my-input" v-model="formData.newAcctPhone" placeholder="请输入手机号" type="text">
                  <span class="err-tooltip" v-show="newPhoneTooltip">请输入正确的手机号码</span>
                </ccb-form-item>
                <ccb-form-item class="input-wrap" label="" :rules="rules.newVeriCode" field="newVeriCode">
                    <span class="my-label">请输入新手机号验证码：</span>
                    <span class="my-label-right"><i>*</i>&nbsp;必填项</span>
                  <input class="my-input my-code-input" v-model="formData.newVeriCode" placeholder="请输入验证码" type="text">
                  <button
                      type="button"
                      :disabled="codeBtnDisabled"
                      :class="isAgain ? 'validate-btn-again validate-btn' : 'validate-btn-again'"
                      @click="getCode"
                    >{{btnTxt}}</button>
                  <span class="err-tooltip" v-show="newCodeTooltip">验证码错误</span>
                </ccb-form-item>
                <button class="confirm-btn" type="button" @click="changePhone">确定</button>
                <button class="confirm-btn" type="button" @click="back">返回</button>
            </ccb-form>
        </div>
    </div>
</template>
<script>
import { userApi } from "@/api";
export default {
  name: "changeAcctPhone",
  data() {
    return {
      formData: {
        oldAcctPhone: "",
        newAcctPhone: "",
        newVeriCode: "",
        newCodeSN: '',
        updTp: ''
      },
      rules: {
        newAcctPhone: [
          { type: "string", required: true, message: "新注册手机号不能为空" }
        ],
        newVeriCode: [
          {
            type: "string",
            required: true,
            message: "新手机短信验证码不能为空"
          }
        ]
      },
      cssConfig: {
        inputStyles: {
          width: "380px",
          height: "50px"
        },
        veriCodeStyles: {
          width: "300px",
          height: "50px",
          marginLeft: "-198px"
        }
      },
      title: "",
      newPhoneTooltip: false,
      newCodeTooltip: false,
      codeBtnDisabled: false,
      isAgain: true,
      btnTxt: "免费获取短信验证码",
      oldAcctPhone: '',
      timer: null,
      flag: false
    };
  },
  methods: {
    //获取短信验证码
    getCode() {
        if(this.flag) return
        this.newPhoneTooltip = false;
        this.newPhoneTooltip = false
        this.$refs['form'].clearValidate()
      if (!this.validatePhone(this.formData.newAcctPhone)) {
        return this.newPhoneTooltip = true
      }
      this.$http({
        method: "post",
        url: "/iequip/smsController/sendVerificationNumber",
        params: {
          phoneNumber: this.formData.newAcctPhone
        }
      })
        .then(res => {
          console.log(res);
          let { data } = res;
          if (data.BK_STATUS != "00") return console.log(data.BK_DESC);
          this.formData.newCodeSN = data.codeSN;
          this.codeBtnDisabled = true;
          this.flag = true
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
          this.flag = false
          this.btnTxt = `免费获取短信验证码`;
        }
      }, 1000);
    },

    changePhone() {
      this.newPhoneTooltip = false;
      this.newCodeTooltip = false;
      this.$refs["form"].validateForm(valid => {
        if (!valid) return;
        const reg = /^1(3|4|5|7|8)\d{9}$/;
   
        if (!reg.test(this.formData.newAcctPhone)) {
          return (this.newPhoneTooltip = true);
        }
        console.log(this.formData);
        this.$axios({
          url: userApi.changePhone,
          method: "patch",
          data: this.formData,
          PBreq: "com.ccb.cloud.protobuf.proto.iequip.AcctUpdPhone"
        })
          .then(res => {
            console.log(res);
            const {SYS_TX_STATUS, SYS_RESP_DESC} = res.headers
            if(SYS_TX_STATUS == "01") {
                if(SYS_RESP_DESC == '短信验证失败') {
                    this.newCodeTooltip = true
                }else {
                    this.$ccb.$alert({
                        styleType: "error",
                        title: "提示",
                        content: SYS_RESP_DESC
                    });
                }
            }else {
                this.$router.push({path: 'success', query: {type: 'phone'}});
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
    },

    //手机号校验
    validatePhone(p) {
        const reg = /^[1][3,4,5,7,8][0-9]{9}$/
        if(reg.test(p)) {
            return true
        }else {
            return false
        }
    },

    //返回
    back(){
      this.$router.push({path:'/UserCenter'});
    },

    //隐藏中间四位
    hidePhone(value){
        
        
    },

    init() {
        let type = this.$route.query.type
        if(type === 1) {
            this.title = '修改注册手机号'
            this.formData.updTp = '1'
            this.formData.oldAcctPhone = sessionStorage.OldUserPhone || '***********'
            this.oldAcctPhone = this.formData.oldAcctPhone.slice(0, 3) + '****' + this.formData.oldAcctPhone.slice(7)
        } else if(type === 2) {
            this.title = '修改管理员手机号'
            this.formData.updTp = '3'
        }else if(type === 3) {
            this.title = '修改经办人手机号'
            this.formData.updTp = '2'
            this.formData.oldAcctPhone = sessionStorage.OldRealNamePhone || '***********'
            this.oldAcctPhone = this.formData.oldAcctPhone.slice(0, 3) + '****' + this.formData.oldAcctPhone.slice(7)
        }
        this.hidePhone();
    }
    
  },
  created() {
    this.init();
    
  }
};
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  // height: 100%;
  .content {
    width: 100%;
    height: calc(100% - 60px);
    .form-wrap {
      width: 763px;
      height: 100%;
      margin: 0 auto;
      box-sizing: border-box;
      padding-top: 50px;
      .title {
        font-family: MicrosoftYaHei-Bold;
        font-size: 18px;
        color: #333333;
        text-align: center;
        line-height: 24px;
        margin-bottom: 50px;
      }
      .input-wrap {
        position: relative;
        width: 600px;
        height: 40px;
        margin: 0 auto;
        margin-bottom: 20px;
        .err-tooltip {
          position: absolute;
          left: 0;
          top: 33px;
          color: #f5222d;
          font-size: 14px;
        }
        .my-label {
          position: absolute;
          width: 160px;
          right: 614px;
          top: 0;
          text-align: right;
          color: #666666;
        }
        .my-label-right {
          position: absolute;
          right: -78px;
          top: 0;
          width: 60px;
          color: #999999;
          i {
            color: #e03434;
          }
        }
        .my-input {
          width: 600px;
          height: 40px;
          padding-left: 10px;
        }
        .my-code-input {
          width: 422px;
        }

        .validate-btn-again {
          position: absolute;
          top: 0px;
          right: -14px;
          width: 158px;
          height: 40px;
          background: #f5f6fa;
          border: 1px solid #e6e6e6;
          border-radius: 2px;
          color: #ccc;
        }

        .validate-btn {
          background: #3f79e5;
          color: #fff;
        }
      }
      .confirm-btn {
        width: 40%;
        height: 45px;
        margin:10px 20px;
      }
    }
  }
}
</style>

