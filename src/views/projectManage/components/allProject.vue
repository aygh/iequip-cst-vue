<template>
  <div class="allProject">
    <div class="product-lists">
      <router-link
        v-for="(item,index) in projectInfo"
        :key="index"
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
              <img v-else src="@/assets/images/projectManage/project1.png" alt="无logo">
            </dt>
            <dd>
              <p class="title">{{item.appNm}}</p>
              <p class="desc">{{item.appBrf}}</p>
            </dd>
          </dl>
        </keep-alive>
      </router-link>
      <dl class="creatNewProject" @click="creatNewProject">
        <dt>
          <img src="@/assets/images/projectManage/u214.png" alt>
        </dt>
        <dd class="cnp">创建新项目</dd>
      </dl>
    </div>
    <div class="pagination">
      <ccb-pagination
        :pageSizeList="paginationConfic.pageSizeList"
        :current.sync="paginationConfic.current"
        :total="paginationConfic.total"
        :pageSize.sync="paginationConfic.pageSize"
        @page-size-change="handleSizeChange"
        @click-prev="handleClickPrev"
        @click-next="handleClickNext"
        @current-change="handleCurrentChange"
      ></ccb-pagination>
    </div>
  </div>
</template>

<script>
import { filePath } from "@/config";
import { $myDecode } from "@/utils/myAxios";

export default {
  name: "allProject",
  components: {},
  props: [
    'ptype'
  ],
  data() {
    return {
      logoSrc: `/getFile?filePath=${filePath}`,
      path: {
        path: "/ProjectManage/detail",
        name: "pmDetail"
      },
      addProject: {
        src: require("@/assets/images/projectManage/u214.png"),
        title: "创建新项目"
      },
      projectInfo: [],
      paginationConfic: {
        pageSize: 5,
        total: 0,
        current: 1,
        pageSizeList: [5, 10]
      },
      projectTp: ""
    };
  },
  methods: {
    turnToDetail(index) {
      this.$router.push({
        name: "pmDetail",
        params: {
          projectId: index
        }
      });
    },
    creatNewProject() {
      // 判断账号是否通过实名认证
      this.$router.push({
        path: "/ProjectManage/createNewProject"
      });
    },
    // pagination
    handleSizeChange(v) {
      this.paginationConfic.pageSize = v
      this.paginationConfic.current = 1
      this.getList()
      // chrome
      document.body.scrollTop = 0
      // firefox
      document.documentElement.scrollTop = 0
      // safari
      window.pageYOffset = 0
    },
    handleCurrentChange(v) {
      this.paginationConfic.current = v;
      this.getList()
      // chrome
      document.body.scrollTop = 0
      // firefox
      document.documentElement.scrollTop = 0
      // safari
      window.pageYOffset = 0
    },
    handleClickPrev(v) {
      this.paginationConfic.current -= 1;
      this.getList()
    },
    handleClickNext(v) {
      this.paginationConfic.current += 1;
      this.getList()
    },
    // getList
    getList() {
      this.$axios({
        method: "POST",
        url: "/iequip/v1/portal/apps/queryEntity",
        data: {
          insId: "0002",
          start: this.paginationConfic.current,
          maxRows: this.paginationConfic.pageSize
        },
        PBreq: "com.ccb.cloud.protobuf.proto.iequip.App",
        PBres: "com.ccb.cloud.protobuf.proto.Page"
      })
        .then(resp => {
          console.log(resp)
          this.projectInfo = []
          this.paginationConfic.total = resp.data.total;
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
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  // 请求项目数据
  created() {
    this.getList()
  }
};
</script>

<style lang="scss">
.allProject {
  width: calc(100% - 230px);
  padding-left: 70px;
  margin: 0;
  padding: 0 !important;
  position: relative;
}
.product-lists {
  margin-bottom: 80px;
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
    margin-right: 0;
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
  > .creatNewProject {
    width: 262px;
    height: 265px;
    float: left;
    cursor: pointer;
    border: 1px dashed #ccc;
    > dt img {
      width: 100px;
      height: 100px;
      margin-top: 50px;
    }
    > .cnp {
      margin-top: 28px;
      font-size: 14px;
      color: #666;
      text-align: center;
      margin-inline-start: 0;
    }
  }
}
.pagination {
  position: absolute;
  bottom: 30px;
  left: 0;
  right: 0;
}
</style>
