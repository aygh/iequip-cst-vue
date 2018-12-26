<template>
  <div class="newProject">
    <Head></Head>
    <div class="steps-box">
      <div>
        <span>领先</span>
        <span class="midTitle">稳定</span>
        <span>安全</span>
      </div>
      <div class="steps">
        <div class="projectInfo">
          <!-- 项目名称 -->
          <div>
            <span class="project projectName">项目名称：</span>
            <input type="text" placeholder="请输入项目名称" v-model="formData.appNm" @change="checkLength">
            <b>
              <span v-show="!showWarning">*</span>
              <span v-show="!showWarning">必选项</span>
            </b>
            <span v-show="showWarning" style="color:red;">限定10字符</span>
          </div>
          <!-- 项目类型 -->
          <div>
            <span class="project projectType">项目类型：</span>
            <select id="projectType" v-model="formData.appTp">
              <option v-for="item in projectType" :key="item.id" :value="item.value">{{item.name}}</option>
            </select>
            <!-- 1 -->
            <b>
              <span>*</span>
              <span>必选项</span>
            </b>
          </div>
          <!-- 项目简介 -->
          <div id="introduce">
            <div>
              <span class="project projectIntroduce">项目简介：</span>
            </div>
            <div>
              <textarea
                type="text"
                placeholder="请输入"
                class="introduce"
                v-model="formData.appBrf"
                @change="checkLength"
              ></textarea>
            </div>
            <div class="sele">
              <span v-show="!showWarningDesc">选填项</span>
              <span v-show="showWarningDesc" style="color:red;">限定100字符</span>
            </div>
          </div>
          <!-- LOGO上传 -->
          <div class="uploading">
            <div class="img-back-box">
              <p>LOGO：</p>
              <img
                v-show="imgUrlConfig.projectLogo"
                class="showImg"
                :src="imgUrlConfig.projectLogo"
                alt
              >
              <img class="img-back" :src="imgBackUrl" alt>
            </div>
            <ccb-form class="wrap" label>
              <ccb-upload
                :url="url"
                :on-success="succ"
                :on-error="err"
                :on-before-upload="beforeUpload"
              ></ccb-upload>
            </ccb-form>
            <b>
              <span>*</span>
              <span>必选项</span>
            </b>
          </div>
          <button @click="turnToSuccessPage" style="margin-top: 40px;width: 100px;height:45px">确定</button>
          <button @click="goBack" style="width: 100px;height:45px;margin-left: 10px;">返回</button>
        </div>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>
 
<script>
import Head from "@/components/templetes/commons/head/Head2";
import Footer from "@/components/templetes/commons/foot/Footer";

import { filePath } from "@/config";

export default {
  name: "newProject",
  components: {
    Head,
    Footer
  },
  data() {
    return {
      showWarning: false,
      showWarningDesc: false,
      url: `/upload?savePath=appLogo/${sessionStorage.userId}/`,
      // url: `/upload?filePath=ISVcode/00000021/`,
      file: "",
      imgBackUrl: require("@/assets/images/projectManage/u214.png"),
      imgUrlConfig: {
        projectLogo: ""
      },
      projectType: [
        {
          name: "请选择",
          value: 0
        },
        {
          name: "报刊杂志",
          value: 1
        },
        {
          name: "餐饮",
          value: 2
        },
        {
          name: "社交",
          value: 3
        },
        {
          name: "摄影",
          value: 4
        }
      ],
      formData: {
        appNm: "",
        appTp: "请选择",
        appLogoSrc: "",
        appBrf: ""
      }
    };
  },
  methods: {
    checkLength() {
      if (this.formData.appNm.length > 10) {
        this.showWarning = true;
      } else {
        this.showWarning = false;
      }
      if (this.formData.appBrf.length > 100) {
        this.showWarningDesc = true;
      } else {
        this.showWarningDesc = false;
      }
    },
    goBack() {
      this.$router.push({
        path: "/ProjectManage"
      });
    },
    succ(file) {
      if (file.path.includes("jpg") || file.path.includes("png")) {
        (this.imgUrlConfig.projectLogo = `/getFile?filePath=${filePath}${file.path.replace(
          /\\/g,
          "/"
        )}`),
          // `http://128.160.180.1:8081/getFile?filePath=e:/ccb-upload-file/input/${file.path.replace(/\\/g, '/')}`;
          (this.formData.appLogoSrc = file.path);
      }
    },
    err(er) {
      console.log(er);
    },
    beforeUpload(file, type) {
      if (!file.type.includes("image")) {
        this.$ccb.$alert({
          content: "请选择正确的图片格式",
          styleType: "warning",
          title: "格式错误"
        });
      } else {
        return {
          filename: "file",
          uploadData: {
            fileName: new Date().getTime() + file.name
          }
        };
      }
    },
    turnToSuccessPage() {
      if (
        this.formData.appNm === "" ||
        this.formData.appTp == "" ||
        this.formData.appTp === "请选择" ||
        this.formData.appLogoSrc === ""
      ) {
        this.$ccb.$alert({
          content: "请确认必选项是否选择",
          styleType: "warning",
          title: "warning"
        });
      } else {
        if (!this.showWarning && !this.showWarningDesc) {
          this.$axios({
            method: "post",
            url: "/iequip/v1/portal/apps",
            data: {
              appNm: this.formData.appNm,
              appTp: this.formData.appTp.toString(),
              appLogoSrc: this.formData.appLogoSrc,
              appBrf: this.formData.appBrf
            },
            PBreq: "com.ccb.cloud.protobuf.proto.iequip.App",
            PBres: "com.ccb.cloud.protobuf.proto.iequip.RetRslt"
          })
            .then(res => {
              console.log(res);
              // 判断创建状态,是否跳转到创建成功页面
              if (res.data.retRsltDsc === "SUCCESS") {
                this.$router.push({
                  path: "/ProjectManage/createNewProject/success"
                });
              } else if (res.headers.SYS_TX_STATUS === "01") {
                this.$ccb.$alert({
                  content: res.headers.SYS_RESP_DESC,
                  styleType: "warning",
                  title: "warning"
                });
              }
            })
            .catch(err => {
              console.log(err);
            });
        }
      }
    }
  },
  created() {
    this.formData.appTp = this.projectType[0].name;
  }
};
</script>
 
<style lang="scss" scoped>
.steps-box {
  width: 100%;
  background-image: url("../../../assets/images/projectManage/u159.png");
  background-repeat: no-repeat;
  background-size: 100%;
  position: relative;
  > div {
    padding-top: 60px;
    color: #fff;
    text-align: center;
    > span {
      display: inline-block;
      font-size: 42px;
      font-weight: 600;
      margin: 4rem auto;
    }
    > .midTitle {
      margin: 0 60px;
    }
  }
  > .steps {
    color: #000;
    background-color: #fff;
    width: 1200px;
    padding: 60px 40px;
    margin-left: calc(50% - 600px);
    overflow: hidden;
    > .projectInfo {
      width: 800px;
      margin: 0 auto;
      div {
        text-align: left;

        .project {
          text-align: left;
          font-size: 14px;
          margin-right: 8px;
          color: #666;
        }
        b {
          font-weight: normal;
          height: 16px;
          > span:first-child {
            color: #e03434;
            display: inline-block;
            width: 8px;
            margin-right: 3px;
          }
          > span:last-child {
            font-size: 14px;
            color: #999999;
          }
        }
      }
      input {
        font-size: 14px;
        line-height: 24px;
        width: 600px;
        height: 40px;
        color: rgb(78, 56, 56);
        box-sizing: border-box;
        padding-left: 11px;
        margin-right: 20px;
        margin-bottom: 20px;
        border: 1px solid rgb(169, 169, 169);
      }
      #projectType {
        width: 600px;
        height: 40px;
        appearance: none;
        -webkit-appearance: none;
        background: url("../../../assets/images/createNewProject/down.png")
          no-repeat scroll 570px center transparent;
        padding-left: 11px;
        color: #999999;
        margin-bottom: 20px;
        margin-right: 20px;
      }
      #introduce {
        width: 100%;
        height: 120px;
        margin-bottom: 20px;
        > div {
          float: left;
        }
        > .sele span {
          color: #999999;
        }
      }
      .introduce {
        width: 600px !important;
        height: 120px !important;
        resize: none;
        box-sizing: border-box;
        padding: 6px 0 0 11px;
        margin-right: 31px;
      }
      button {
        height: 55px;
        width: 763px;
        outline: none;
        border-radius: 2px;
      }
      .uploading {
        position: relative;
        margin-bottom: 50.3px;
        > .img-back-box {
          p {
            width: 70px;
            text-align: right;
            font-size: 14px;
            margin-right: 8px;
            color: #666;
          }
          > .showImg {
            position: absolute;
            top: 0;
            left: 198px;
            width: 120px;
            height: 106px;
            box-sizing: border-box;
          }
          .img-back {
            position: absolute;
            top: 0;
            left: 78px;
            width: 120px;
            height: 106px;
          }
        }
        > .ccb-form {
          position: absolute;
          width: 120px;
          height: 106px;
          top: 30px;
          left: 78px;
          opacity: 0;
        }
        > b {
          float: right;
          margin-right: 50px;
        }
      }
    }
  }
}
</style>