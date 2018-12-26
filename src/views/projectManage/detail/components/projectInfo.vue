<template>
  <div class="projectInfo">
    <div class="projectInfo-box">
      <p class="title">项目信息</p>
      <div class="pInfo" v-for="item in project" :key="item.appId">
        <dl>
          <dt>项目名称</dt>
          <dd v-show="showProjectInfo">{{item.appNm}}</dd>
          <input type="text" v-model="formData.appNm" v-show="!showProjectInfo">
        </dl>
        <dl>
          <dt>项目ID</dt>
          <dd>{{item.appId}}</dd>
        </dl>
        <dl>
          <dt>项目类型</dt>
          <dd v-show="showProjectInfo">{{item.appTp | pt}}</dd>
          <select id="projectType" v-show="!showProjectInfo" v-model="formData.appTp">
            <option
              v-for="(item,index) in projectType"
              :key="index"
              :value="item.value"
            >{{item.name}}</option>
          </select>
        </dl>
        <dl>
          <dt>项目状态</dt>
          <dd>{{item.appSt | projectSt}}</dd>
        </dl>
        <dl>
          <dt>项目简介</dt>
          <dd v-show="showProjectInfo">{{item.appBrf}}</dd>
          <textarea v-model="formData.appBrf" v-show="!showProjectInfo"></textarea>
        </dl>
        <div class="uploading">
          <div class="img-back-box">
            <p>LOGO</p>
            <img class="img-back" :src="imgBackUrl" alt v-show="imgUrlConfig.projectLogo">
            <img v-show="!imgUrlConfig.showImg" class="showImg" :src="imgUrlConfig.modifyLogo" alt>
          </div>
          <ccb-form class="wrap" label>
            <ccb-upload
              :url="url"
              :on-success="succ"
              :on-error="err"
              :on-before-upload="beforeUpload"
            ></ccb-upload>
          </ccb-form>
        </div>
        <div class="modifyProject">
          <ccb-button @click="changeProjectInfo(item)" v-show="showModifyButton">修改项目</ccb-button>
          <ccb-button v-show="!showModifyButton" @click="confirmModify(item)">确认修改</ccb-button>
          <ccb-button v-show="!showModifyButton" @click="cancelModify">取消修改</ccb-button>
          <ccb-button @click="deleteProject(item.appId)" v-show="showModifyButton">删除项目</ccb-button>
        </div>
      </div>
    </div>
  </div>
</template>
 
<script>
import { filePath } from "@/config";

export default {
  name: "projectInfo",
  data() {
    return {
      project: [],
      url: `/upload?savePath=ISVcode/${sessionStorage.userId}/`,
      file: "",
      imgBackUrl: require("@/assets/images/projectManage/u214.png"),
      imgUrlConfig: {
        projectLogo: "",
        showImg: "",
        modifyLogo: ""
      },
      showProjectInfo: true,
      showModifyButton: true,
      projectType: [
        {
          name: "请选择",
          value: "0"
        },
        {
          name: "报刊杂志",
          value: "1"
        },
        {
          name: "餐饮",
          value: "2"
        },
        {
          name: "社交",
          value: "3"
        },
        {
          name: "摄影",
          value: "4"
        }
      ],
      formData: {
        appNm: "",
        appTp: "",
        appLogoSrc: "",
        appBrf: ""
      }
    };
  },
  filters: {
    pt (type) { 
      switch (type) {
        case "1":
          return "报刊杂志";
          break;
        case "2":
          return "餐饮";
          break;
        case "3":
          return "社交";
          break;
        case "4":
          return "摄影";
          break;
      }
    },
    projectSt (status) {
      switch (status) {
        case "1":
          return "正常";
          break;
        case "2":
          return "冻结";
          break;
      }
    }
  },
  methods: {
    succ(file) {
      console.log(file);
      if (file.BK_STATUS === "00") {
        (this.imgUrlConfig.modifyLogo = `/getFile?filePath=${filePath}/${file.path.replace(
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
        console.log(type);
        this[type] = true;
        return false;
      }
      return {
        filename: "file",
        uploadData: {
          fileName: new Date().getTime() + file.name
        }
      };
    },
    changeProjectInfo() {
      this.formData.appNm = this.project[0].appNm;
      this.formData.appTp = this.project[0].appTp;
      this.formData.appBrf = this.project[0].appBrf;
      this.formData.appLogoSrc = this.project[0].appLogoSrc;
      this.imgUrlConfig.projectLogo = !this.imgUrlConfig.projectLogo;
      this.showProjectInfo = !this.showProjectInfo;
      this.showModifyButton = !this.showModifyButton;
    },
    // 确认修改项目
    confirmModify(item) {
      this.$axios({
        method: "PATCH",
        url: "/iequip/v1/portal/apps/" + item.appId,
        data: {
          appNm: this.formData.appNm,
          appTp: this.formData.appTp,
          appLogoSrc: this.formData.appLogoSrc,
          appBrf: this.formData.appBrf
        },
        PBreq: "com.ccb.cloud.protobuf.proto.iequip.App",
        PBres: "com.ccb.cloud.protobuf.proto.iequip.RetRslt"
      })
        .then(res => {
          console.log(res);
          if (res.data.retRsltDsc === "SUCCESS") {
            this.project[0].appNm = this.formData.appNm
            this.project[0].appTp = this.formData.appTp
            this.project[0].appBrf = this.formData.appBrf
            this.project[0].appLogoSrc = this.formData.appLogoSrc
            this.showProjectInfo = !this.showProjectInfo;
            this.showModifyButton = !this.showModifyButton;
            this.imgUrlConfig.projectLogo = !this.imgUrlConfig.projectLogo;
          } else {
            let err = res.data.retRsltDsc;
            this.$ccb.$alert({
              content: err,
              styleType: "warning",
              title: "错误信息"
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 取消修改项目
    cancelModify() {
      this.imgUrlConfig.projectLogo = !this.imgUrlConfig.projectLogo;
      this.showProjectInfo = !this.showProjectInfo;
      this.showModifyButton = !this.showModifyButton;
    },
    // 删除项目
    deleteProject(appId) {
      let _this = this;
      this.$ccb.$alert({
        content: "确认是否删除项目？",
        styleType: "warning",
        type: "confirm",
        title: "warning",
        onOk() {
          this.$axios({
            method: "DELETE",
            url: "/iequip/v1/portal/apps/" + appId,
            data: {},
            PBreq: "com.ccb.cloud.protobuf.proto.iequip.App",
            PBres: "com.ccb.cloud.protobuf.proto.iequip.RetRslt"
          })
            .then(res => {
              console.log(res);
              if (res.data.retRsltDsc === "SUCCESS") {
                _this.$router.push({
                  path: "/ProjectManage"
                });
              } else {
                alert("删除失败");
              }
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    },
    // 请求项目详情信息
    getDetailInfo () {
      this.project = []
    let appId = this.$route.query.id
    this.$axios({
      method: 'GET',
      url: '/iequip/v1/portal/apps/'+ appId,
      data: {},
      // PBreq: 'com.ccb.cloud.protobuf.proto.iequip.App',
      PBres: 'com.ccb.cloud.protobuf.proto.iequip.App'
    }).then(res => {
      this.project.push(res.data)
      console.log(this.project)
      this.imgUrlConfig.modifyLogo = `/getFile?filePath=${filePath}${this.project[0].appLogoSrc.replace(
          /\\/g,
          "/"
        )}`
    }).catch(err => {
        console.log(err);
    })
    }
  },
  created() {
    this.getDetailInfo()
  }
};
</script>
 
<style lang="scss" scoped>
.projectInfo {
  > .projectInfo-box {
    margin-bottom: 50px;
    > .title {
      font-size: 20px;
      color: #333333;
      font-weight: 600;
      text-align: left;
    }
    > .pInfo {
      dl {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
        font-size: 14px;
        position: relative;
        height: 30px;
        dt {
          width: 56px;
          margin-left: 14px;
          text-align: left;
          margin-right: 170px;
          color: #333;
        }
        dd {
          width: 530px;
          text-align: left;
          color: #666;
          padding-left: 10px;
        }
        input {
          width: 200px;
          height: 30px;
          text-align: left;
          padding-left: 10px;
          position: absolute;
          left: 240px;
          top: -6px;
          margin-left: 48px;
          box-sizing: border-box;
        }
        select {
          width: 200px;
          height: 30px;
          text-align: left;
          padding-left: 10px;
          position: absolute;
          left: 240px;
          top: -6px;
          margin-left: 48px;
        }
        > .inputBox {
          text-align: left;
          position: absolute;
          left: 240px;
          > .modify {
            height: 30px;
            width: 200px;
            border-radius: 2px;
            padding-left: 5px;
          }
        }
        > textarea {
          resize: none;
          width: 520px;
          height: 40px;
          position: absolute;
          left: 240px;
          top: -6px;
          margin-left: 48px;
        }
      }
      > .logo {
        height: 70px;
      }
    }
  }
  > .versionInfo {
    height: 182px;
    margin-bottom: 169px;
    > .title {
      font-size: 20px;
      color: #333333;
      font-weight: 600;
      text-align: left;
    }
    > .info dl {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
      font-size: 14px;
      dt {
        width: 56px;
        margin-left: 14px;
        text-align: left;
        margin-right: 170px;
        color: #333;
      }
      dd {
        width: 530px;
        text-align: left;
        color: #666;
      }
    }
    > .info dl:last-child {
      dd {
        color: #2f6de4;
        cursor: pointer;
      }
    }
  }
  > .modifyProject {
    margin: 0 auto 20px;
  }
  .uploading {
    position: relative;
    display: flex;
    height: 160px;
    > .img-back-box {
      display: flex;
      > p {
        margin-left: 28px;
        color: #333;
        margin-block-start: 0;
        margin-block-end: 0;
      }
      > img {
        width: 150px;
        height: 150px;
      }
      > .showImg {
        position: absolute;
        left: 290px;
      }
      > .img-back {
        position: absolute;
        left: 440px;
      }
    }
    .ccb-form {
      position: absolute;
      left: 454px;
      top: 50px;
      opacity: 0;
    }
  }
}
</style>