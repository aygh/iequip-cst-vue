<template>
    <div class="container">
        <div class="content">
            <ccb-form :model="formData" ref="form" class="form-wrap">
                <p class="title">重置密码</p>
                <!-- <ccb-form-item class="input-wrap" label="" :rules="rules.userName" field="userName">
                  <input class="my-input" type="text" v-model="formData.userName" :placeholder="'请输入用户名'">
                </ccb-form-item> -->
                <ccb-form-item class="input-wrap" label="" :rules="rules.acctPhone" field="acctPhone">
                    <span class="my-label">请输入手机号码：</span>
                    <span class="my-label-right"><i>*</i>&nbsp;必填项</span>
                  <input class="my-input" type="text" v-model="formData.acctPhone" :placeholder="'请输入'">
                  <span class="err-tooltip" v-show="phoneTooltip">请输入正确的手机号</span>
                </ccb-form-item>
                <ccb-form-item class="input-wrap" label="" :rules="rules.veriCode" field="veriCode">
                    <span class="my-label">请输入验证码：</span>
                    <span class="my-label-right"><i>*</i>&nbsp;必填项</span>
                  <input class="my-input my-vericode-input" type="text" v-model="formData.veriCode" :placeholder="'请输入'">
                  <button
                      type="button"
                      :disabled="codeBtnDisabled"
                      :class="isAgain ? 'validate-btn-again validate-btn' : 'validate-btn-again'"
                      @click="getCode"
                    >{{btnTxt}}</button>
                  <span class="err-tooltip" v-show="codeTooltip">验证码错误</span>
                </ccb-form-item>
                <ccb-form-item class="input-wrap" label="" :rules="rules.newCredential" field="newCredential">
                    <span class="my-label">请输入新密码：</span>
                    <span class="my-label-right"><i>*</i>&nbsp;必填项</span>
                  <input class="my-input" type="password" v-model="formData.newCredential" :placeholder="'请输入'">
                  <span class="err-tooltip" v-show="PWDTooltip">密码必须包含数字、字母、特殊符号</span>
                </ccb-form-item>
                <ccb-form-item class="input-wrap" label="" :rules="rules.newCredentialAgain" field="newCredentialAgain">
                    <span class="my-label">请再次输入新密码：</span>
                    <span class="my-label-right"><i>*</i>&nbsp;必填项</span>
                  <input class="my-input" type="password" v-model="formData.newCredentialAgain" :placeholder="'请输入'">
                  <span class="err-tooltip" v-show="PWDTooltipAgain">两次输入的密码不一致</span>
                </ccb-form-item>
                <button type="button" class="confirm-btn" @click="resetPassword">确定</button>
            </ccb-form>
        </div>
    </div>
</template>
<script>
import {userApi} from '@/api'
export default {
    name: 'resetCredential',
    data() {
        return {
            formData: {
                // userName: '',
                acctPhone: '',
                veriCode: '',
                newCredential: '',
                newCredentialAgain: '',
                updTp: '1',//更新方式：通过手机验证
                codeSN: ''//短信验证码序号
            },
            rules: {
                // userName: [ { type: 'string', required: true, message: '用户名不能为空' } ],
                acctPhone: [ { type: 'string', required: true, message: '手机号码不能为空' } ],
                veriCode: [ { type: 'string', required: true, message: '验证码不能为空' } ],
                newCredential: [ { type: 'string', required: true, message: '密码不能为空' } ],
                newCredentialAgain: [ { type: 'string', required: true, message: '再次输入密码不能为空' } ],
            },
            resetSuccTooltip: '密码修改成功',
            codeTooltip: false,
            PWDTooltip: false,
            PWDTooltipAgain: false,
            phoneTooltip: false,
            timer: null,
            flag: false,
            isAgain: true,
            btnTxt: "免费获取短信验证码",
            codeBtnDisabled: false
        }
    },
    methods: {
         //获取短信验证码
        getCode() {
            if(this.flag) return
            this.codeTooltip = false;
            this.phoneTooltip = false;
            this.$refs['form'].clearValidate()
          if (!this.validatePhone(this.formData.acctPhone)) {
            return this.phoneTooltip = true
          }
          this.$http({
            method: "post",
            url: "/iequip/smsController/sendVerificationNumber",
            params: {
              phoneNumber: this.formData.acctPhone
            }
          })
            .then(res => {
              console.log(res);
              let { data } = res;
              if (data.BK_STATUS != "00") return console.log(data.BK_DESC);
              this.formData.codeSN = data.codeSN;
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

        resetPassword() {
            this.phoneTooltip = false;
            this.codeTooltip = false;
            this.PWDTooltip = false;
            this.PWDTooltipAgain = false;
            this.$refs['form'].validateForm(valid => {
                if(!valid) return
                if(!/^1(3|4|5|7|8)\d{9}$/.test(this.formData.acctPhone)) {
                    return this.phoneTooltip = true;
                }
                if(this.formData.newCredential !== this.formData.newCredentialAgain) {
                    return this.PWDTooltipAgain = true;
                }
                if(!/^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/.test(this.formData.newCredential)) {
                    return this.PWDTooltip = true;
                }

                this.$axios({
                    url: userApi.resetPWD,
                    method: 'patch',
                    data: this.formData,
                    PBreq: 'com.ccb.cloud.protobuf.proto.iequip.AcctUpdCredential',
                }).then(res => {
                    console.log(res);
                }).catch(err => {
                    console.log(err);
                    this.$ccb.$alert({
                        styleType: 'error',
                        title: '提示',
                        content: '系统异常，请稍后再试!'
                    })
                })
            })
        },

        toSucc() {
            this.$router.push({path: '/success', query: {type: 'reset'}})
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
    }
}
</script>
<style lang="scss" scoped>
.container {
    width: 100%;
    // height: 100%;
    .content { 
        width: 100%;
        height: calc(100% - 60px);
    }
    .form-wrap {
        width: 763px;
        height:100%;
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
                width: 140px;
                right: 420px;
                top: 0;
                text-align: right;
                color: #666666;
            }
            .my-label-right {
                position: absolute;
                right: -280px;
                top: 0;
                width: 60px;
                color:#999999;
                i {
                    color: #E03434;
                }
            }
            .my-input {
                width: 600px;
                height: 40px;
                padding-left: 10px;
            }
            .my-vericode-input {
                width: 422px;
            }
            .validate-btn-again {
                position: absolute;
                right: -200px;
                top: 0;
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
            width: 100%;
            height: 55px;
            margin-top: 50px;
        }
    }
 

}
</style>


