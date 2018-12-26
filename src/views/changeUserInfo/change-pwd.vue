<template>
    <div class="container">
        <div class="content">
            <ccb-form :model="formData" ref="form" class="form-wrap" :layout="'vertical'">
                <p class="title">修改密码</p>
                <ccb-form-item class="input-wrap" label="" :rules="rules.name" field="name">
                    <span class="my-label">请输入用户名：</span>
                    <span class="my-label-right"><i>*</i>&nbsp;必填项</span>
                  <input class="my-input" type="text" placeholder="请输入" v-model="formData.name">
                  <span class="err-tooltip" v-show="nameTooltip">用户名或密码错误</span>
                </ccb-form-item>
                <ccb-form-item class="input-wrap" label="" :rules="rules.oldCredential" field="oldCredential">
                    <span class="my-label">请输入原密码：</span>
                    <span class="my-label-right"><i>*</i>&nbsp;必填项</span>
                  <input class="my-input" type="password" placeholder="请输入" v-model="formData.oldCredential">
                  <!-- <span class="err-tooltip" v-show="oldPWDTooltip">原密码错误</span> -->
                </ccb-form-item>
                <ccb-form-item class="input-wrap" label="" :rules="rules.newCredential" field="newCredential">
                    <span class="my-label">请输入新密码：</span>
                    <span class="my-label-right"><i>*</i>&nbsp;必填项</span>
                  <input class="my-input" type="password" v-model="formData.newCredential" placeholder="请输入">
                  <span class="err-tooltip" v-show="newPWDTooltip">密码必须包含数字、字母、特殊符号</span>
                </ccb-form-item>
                <ccb-form-item class="input-wrap" label="" :rules="rules.newCredentialAgain" field="newCredentialAgain">
                    <span class="my-label">请再次输入新密码：</span>
                    <span class="my-label-right"><i>*</i>&nbsp;必填项</span>
                  <input class="my-input" type="password" v-model="formData.newCredentialAgain" placeholder="请输入">
                  <span class="err-tooltip" v-show="newPWDTooltipAgain">两次输入的密码不一致</span>
                </ccb-form-item>
                <button class="confirm-btn" type="button" @click="changePwd">确定</button>
                <button class="confirm-btn" type="button" @click="back">返回</button>
            </ccb-form>
        </div>
    </div>
</template>
<script>
import loginHeader from "@/components/templetes/commons/login/login-header";
import { userApi } from "@/api";
export default {
  name: "changePwd",
  components: {
    loginHeader
  },
  data() {
    return {
      formData: {
        name: "",
        oldCredential: "",
        newCredential: "",
        newCredentialAgain: "",
      },
      rules: {
        name: [{ type: "string", required: true, message: "请输入用户名" }],
        oldCredential: [
          { type: "string", required: true, message: "请输入原密码" }
        ],
        newCredential: [
          { type: "string", required: true, message: "请输入新密码" }
        ],
        newCredentialAgain: [
          { type: "string", required: true, message: "请再次输入新密码" }
        ]
      },
      cssConfig: {
        inputStyles: {
          width: "500px",
          height: "50px"
        }
      },
      nameTooltip: false,
      newPWDTooltip: false,
      newPWDTooltipAgain: false
    };
  },
  methods: {
    //修改密码
    changePwd() {
      this.oldPWDTooltip = false;
      this.newPWDTooltip = false;
      this.newPWDTooltipAgain = false;
      this.$refs["form"].validateForm(valid => {
        if (!valid) return
        if (this.formData.newCredential !== this.formData.newCredentialAgain) {
          return (this.newPWDTooltipAgain = true);
        }
        if (
          !/^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/.test(
            this.formData.newCredential
          )
        ) {
          return (this.newPWDTooltip = true);
        }
        let params = {
          newPassword: this.formData.newCredential,
          oldPassword: this.formData.oldCredential
        };
        this.$http({
          url: userApi.resetPWD(sessionStorage.userName, 1101), //更新方式：1101通过旧密码更新
          method: "put",
          data: params
          // PBreq: "com.ccb.cloud.protobuf.proto.iequip.AcctUpdCredential"
        })
          .then(res => {
            console.log(res);
            const {SYS_TX_STATUS, SYS_RESP_DESC} = res.headers
            if(SYS_TX_STATUS != '00') {
                this.$ccb.$alert({
                    styleType: "error",
                    title: "提示",
                    content: SYS_RESP_DESC
                });
            }else {
                this.$router.push({path: 'success', query: {type: 'change'}})
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
    toSucc() {
      this.$router.push({ path: "/success", query: { type: "change" } });
    },
    //返回
    back(){
      this.$router.push({path:'/UserCenter'})
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  // height: 100%;
  .content {
    width: 100%;
    // height: calc(100% - 60px);
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


