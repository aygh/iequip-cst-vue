<template>
  <div class="projectManage">
    <Head></Head>
    <div class="manage-box fixed-box">
      <div>
        <span>领先</span>
        <span class="midTitle">安全</span>
        <span>稳定</span>
      </div>
      <div class="pm">
        <div class="list-box">
          <h2>项目管理</h2>
          <h3>Project management</h3>
          <ul>
            <li
              v-for="(item,index) in listTab"
              :key="index"
              v-bind:class="['tab-button',{active:active[index]}]"
              @click="changeTab(item,index)"
            >
              <span></span>
              {{item}}
            </li>
          </ul>
        </div>
        <div class="con-detail" v-bind:is="ac" :listTab="info"></div>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import Head from "@/components/templetes/commons/head/Head2";
import Footer from "@/components/templetes/commons/foot/Footer";
import allProject from "@/views/projectManage/components/allProject";
import classOne from "@/views/projectManage/components/classOne";
import classTwo from "@/views/projectManage/components/classTwo";
import classThree from "@/views/projectManage/components/classThree";
import classFour from "@/views/projectManage/components/classFour";
import other from "@/views/projectManage/components/other";
import { $myDecode } from "@/utils/myAxios";
import { setTimeout } from "timers";

export default {
  name: "projectManage",
  components: {
    Head,
    Footer,
    tab0: allProject,
    tab1: classOne,
    tab2: classTwo,
    tab3: classThree,
    tab4: classFour
  },
  data() {
    return {
      index: "",
      type: "",
      allprojectInfo: [],
      projectTp: [],
      haveProject: true,
      ac: "tab0",
      active: [true, false, false, false, false],
      listTab: ["全部项目"],
      info: [
      ]
    };
  },
  methods: {
    changeTab(item,x) {
      if (this.info.length > 1) {
        this.info.pop()
      }
      for (let i = 0; i < this.active.length; i++) {
        this.active[i] = false;
        this.active[x] = true;
        this.ac = "tab" + x;
      }
      this.$set(this.active, 5, 0);
      if (this.info.indexOf(this.listTab) === -1) {
        this.info.push(this.listTab)
      }
      this.info.push(x)
    },
    getallList() {
      this.$axios({
        method: "POST",
        url: "/iequip/v1/portal/apps/queryEntity",
        data: {
          insId: "0002",
        },
        PBreq: "com.ccb.cloud.protobuf.proto.iequip.App",
        PBres: "com.ccb.cloud.protobuf.proto.Page"
      })
        .then(resp => {
          this.allprojectInfo = []
          let result;
          resp.data.data.map(item => {
            result = $myDecode(item, "google.protobuf.Any");
            let resultValue = $myDecode(
              result.value,
              "com.ccb.cloud.protobuf.proto.iequip.App"
            );
            // 类型转换
            if (resultValue.appTp === "1") {
              resultValue.appTp = "报刊杂志"
            } else if (resultValue.appTp === "2") {
              resultValue.appTp = "餐饮"
            } else if (resultValue.appTp === "3") {
              resultValue.appTp = "社交"
            } else if (resultValue.appTp === "4") {
              resultValue.appTp = "摄影"
            }
            this.allprojectInfo = this.allprojectInfo.concat(resultValue);
          });
          this.projectTp = []
          this.allprojectInfo.map(item => {
            if (this.projectTp.indexOf(item.appTp) === -1) {
              this.projectTp.push(item.appTp)
            }
          })
           console.log(this.allprojectInfo)
         this.projectTp.map(item => {
           if (this.listTab.indexOf(item) === -1) {
             this.listTab.push(item)
           }
         })
          console.log(this.allprojectInfo);
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  created () {
    this.getallList()
  }
};
</script>

<style lang="scss" scoped>
.manage-box {
  width: 100%;
  background-image: url("../../assets/images/projectManage/u159.png");
  background-repeat: no-repeat;
  background-size: 100%;
  position: relative;
  > div {
    padding-top: 60px;
    color: #fff;
    text-align: center;
    > span {
      display: inline-block;
      font-size: 48px;
      font-weight: 600;
      margin-bottom: 50px;
    }
    > .midTitle {
      margin: 0 60px;
    }
  }
  > .pm {
    color: #000;
    background-color: #fff;
    width: 1200px;
    padding-top: 60px;
    //padding-left: 40px;
    //margin-left: calc(50% - 600px);
    margin: 0 auto;
    overflow: hidden;
    > .list-box {
      width: 190px;
      float: left;
      margin-bottom: 60px;
      margin-left: 40px;
      > h2 {
        font-weight: 600;
        text-align: left;
        font-size: 20px;
        color: #333;
      }
      > h3 {
        font-weight: normal;
        font-size: 16px;
        text-align: left;
        color: #999;
        margin-top: 6px;
      }
      ul {
        margin-top: 21px;
        li {
          height: 40px;
          line-height: 40px;
          font-size: 14px;
          cursor: pointer;
          border-bottom: 1px solid #e3e3e3;
          display: flex;
          justify-content: left;
          color: #666666;
          align-items: center;
          span {
            border-left: 4px solid #fff;
            height: 16px;
            display: inline-block;
            margin-right: 16px;
          }
        }
        li.active {
          color: #3f79e5;
          span {
            border-left: 4px solid #3f79e5;
          }
        }
      }
    }
  }
}
</style>

