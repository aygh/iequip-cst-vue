<template>
  <div class="projectDetail">
    <Head></Head>
    <div class="detail-box">
      <div>
        <span>领先</span>
        <span class="midTitle">稳定</span>
        <span>安全</span>
      </div>
      <div class="detail-content">
        <div class="list-box">
          <h2><span @click="back">项目管理</span>&nbsp;>&nbsp;项目详情</h2>
          <h3>Project details</h3>
          <ul>
            <li
              v-for="(item,index) in listTab"
              :key="index"
              v-bind:class="['tab-button',{active:active[index]}]"
              @click="changeTab(index)"
            >
              <span></span>
              {{item}}
            </li>
          </ul>
        </div>
        <div class="con-detail" v-bind:is="ac" :project="project"></div>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import Head from "@/components/templetes/commons/head/Head2";
import Footer from "@/components/templetes/commons/foot/Footer";
import projectInfo from "@/views/projectManage/detail/components/projectInfo";
import versionManagement from "@/views/projectManage/detail/components/versionManagement";

export default {
  name: "pmDetail",
  components: {
    Head,
    Footer,
    tab0: projectInfo,
    tab1: versionManagement
  },
  data() {
    return {
      project: [],
      ac: "tab0",
      active: [true, false],
      listTab: ["项目信息", "版本管理"]
    };
  },
  methods: {
    back () {
      this.$router.push({
        path: '/ProjectManage'
      })
    },
    changeTab(x) {
      for (let i = 0; i < this.active.length; i++) {
        this.active[i] = false;
        this.active[x] = true;
        this.ac = "tab" + x;
      }
      this.$set(this.active, 2, 0);
    }
  },
  created() {
    let item = this.$route.params.item;
    this.$set(this.project, 0, item);
    console.log(this.project);
  }
};
</script>

<style lang="scss" scoped>
.detail-box {
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
      font-size: 48px;
      font-weight: 600;
      margin-bottom: 50px;
    }
    > .midTitle {
      margin: 0 60px;
    }
  }
  > .detail-content {
    color: #000;
    background-color: #fff;
    width: 1200px;
    padding-top: 60px;
    padding-left: 40px;
    margin-left: calc(50% - 600px);
    overflow: hidden;
    border-radius: 5px;
    > .list-box {
      width: 190px;
      float: left;
      margin-bottom: 60px;
      > h2 {
        font-weight: 600;
        text-align: left;
        font-size: 20px;
        color: #333;
        span {
          cursor: pointer;
        }
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
    > .con-detail {
      float: left;
      margin-left: 70px;
      margin-top: 32px;
    }
  }
}
</style>
