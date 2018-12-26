<template>
  <div class="allProject">
    <div class="product-list" v-if="hasProject">
      <router-link
        v-for="item in projectInfo"
        :key="item.appNm"
        :to="{path:path.path, query:{id:item.appId}}"
      >
        <keep-alive>
          <dl class="project-list">
            <dt>
              <img
                v-if="item.appLogoSrc"
                :src="logoSrc + `${item.appLogoSrc.replace(/\\/g, '/')}`"
                alt="logo"
              >
              <img v-else src="@/assets/images/projectManage/project1.png" alt="logo">
            </dt>
            <dd>
              <p class="title">{{item.appNm}}</p>
              <p class="desc">{{item.appBrf}}</p>
            </dd>
          </dl>
        </keep-alive>
      </router-link>
    </div>
    <div v-else style="color: #666;">暂无项目</div>
  </div>
</template>

<script>
import { $myDecode } from "@/utils/myAxios";
import { filePath } from "@/config";

export default {
  name: "classOne",
  props: ['listTab'],
  data() {
    return {
      logoSrc: `/getFile?filePath=${filePath}`,
      hasProject: true,
      projectInfo: [],
      path: {
        path: "/ProjectManage/detail",
        name: "pmDetail"
      }
    };
  },
  created() {
    let tp = this.listTab[0][this.listTab[1]]
    switch (tp) {
      case "报刊杂志":
        tp = "1";
        break;
      case "餐饮":
        tp = "2";
        break;
      case "社交":
        tp = "3";
        break;
      case "摄影":
        tp = "4";
        break;
    }
    this.$axios({
      method: "POST",
      url: "/iequip/v1/portal/apps/queryEntity",
      data: {
        appTp: tp
      },
      PBreq: "com.ccb.cloud.protobuf.proto.iequip.App",
      PBres: "com.ccb.cloud.protobuf.proto.Page"
    })
      .then(resp => {
        console.log(resp)
        let result;
        resp.data.data.map(item => {
          result = $myDecode(item, "google.protobuf.Any");
          let resultValue = $myDecode(
            result.value,
            "com.ccb.cloud.protobuf.proto.iequip.App"
          );
          if (resultValue.appSt === "1") {
            resultValue.appSt = "正常";
          } else {
            resultValue.appSt = "冻结";
          }
          this.projectInfo = this.projectInfo.concat(resultValue);
        });
        console.log(this.projectInfo);
        if (this.projectInfo.length > 0) {
          this.hasProject = true;
        } else {
          this.hasProject = false;
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
};
</script>

<style lang="scss">
.allProject {
  display: flex;
  align-items: center;
  padding-left: 70px;
}
.product-list {
  margin-bottom: 60px;
  padding-left: 60px;
  > a {
    width: 262px;
    height: 265px;
    display: inline-block;
    margin-right: 30px;
    float: left;
  }
  .project-list:hover {
    box-shadow: 0 0 20px rgba(199, 237, 204, 0.8);
  }
  .project-list {
    width: 262px;
    height: 265px;
    cursor: pointer;
    color: #000;
    box-sizing: border-box;
    > dt {
      width: 262px;
      height: 148px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    > dd {
      margin-inline-start: 0;
      .title {
        font-size: 14px;
        color: #000;
      }
      .desc {
        margin-top: 6px;
        width: 262px;
        height: 38px;
        font-size: 14px;
        color: #999;
        text-align: center;
        margin-block-start: 0;
        margin-block-end: 0;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
