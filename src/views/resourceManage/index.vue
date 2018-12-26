<template>
  <div class="resourceManage">
    <Head></Head>
    <div class="manage-box fixed-box">
      <div>
        <span>领先</span>
        <span class="midTitle">安全</span>
        <span>稳定</span>
      </div>
      <div class="resourceManage-box">
        <div class="headLine"></div>
        <p class="title">设备管理</p>
        <div class="searchBox">
          <span>开始时间：</span>
          <ccb-date v-model="searchData.beginTms"></ccb-date>
          <span>结束时间：</span>
          <ccb-date v-model="searchData.endTms"></ccb-date>
          <span>设备编号：</span>
          <ccb-input placeholder="请输入设备编号" v-model="searchData.devId"></ccb-input>
          <span>Mac地址：</span>
          <ccb-input placeholder="请输入Mac名称" v-model="searchData.devMac"></ccb-input>
          <span>设备状态：</span>
          <ccb-select :options="options" placeholder="全部" v-model="searchData.devStatus"></ccb-select>
          <ccb-button size="mini" @click="getDevice">查询</ccb-button>
        </div>
        <table class="deviceInfo">
          <tr>
            <td v-for="(item,index) in headTitle" :key="index">{{item}}</td>
          </tr>
          <tr v-for="(item,index) in deviceList" :key="index">
            <td>{{item.devName}}</td>
            <td>{{item.devId}}</td>
            <td>{{item.lclCrtTms}}</td>
            <td>{{item.devMac}}</td>
            <td>{{item.devStatus}}</td>
            <td>
              <button style="margin-right:10px;" @click="showDeviceDetail(item.devId)">查看设备详情</button>
              <button @click="turnToResourceDetail(item.devId)">查看设备项目</button>
            </td>
          </tr>
        </table>
        <ccb-pagination
          class="block"
          :pageSizeList="pageSizeList"
          :current.sync="current"
          :total="total"
          :pageSize.sync="pageSize"
          @page-size-change="handleSizeChange"
          @click-prev="handleClickPrev"
          @click-next="handleClickNext"
          @current-change="handleCurrentChange"
        ></ccb-pagination>
      </div>
    </div>
    <Footer></Footer>
    <!-- 设备详情弹窗 -->
    <div class="deviceDetail">
      <ccb-window :show.sync="showDd" title="设备详情" class="deviceDetail">
        <p>
          <span></span>Detail
        </p>
        <div class="infoBox">
          <div v-for="item in deviceDetail" :key="item.devId">
            <dl>
              <dt>设备编号</dt>
              <dd>{{item.devId}}</dd>
            </dl>
            <dl>
              <dt>设备名称</dt>
              <dd>{{item.devName}}</dd>
            </dl>
            <dl>
              <dt>注册时间</dt>
              <dd>{{item.lclCrtTms}}</dd>
            </dl>
            <dl>
              <dt>MAC地址</dt>
              <dd>{{item.devMac}}</dd>
            </dl>
            <dl>
              <dt>设备状态</dt>
              <dd>{{item.devStatus}}</dd>
            </dl>
          </div>
        </div>
        <div></div>
        <div slot="footer" class="footer" style="margin:40px 0 0 400px;">
          <ccb-button @click="closeWin" class="firstButton">关闭</ccb-button>
        </div>
      </ccb-window>
    </div>
  </div>
</template>

<script>
import Head from "@/components/templetes/commons/head/Head2";
import Footer from "@/components/templetes/commons/foot/Footer";
import { $myDecode } from "@/utils/myAxios";

export default {
  name: "resourceManage",
  components: {
    Head,
    Footer
  },
  data() {
    return {
      searchData: {
        beginTms: "",
        endTms: "",
        devId: "",
        devMac: "",
        devStatus: ""
      },
      options: [
        {
          label: "全部",
          value: ""
        },
        {
          label: "正常",
          value: "0"
        },
        {
          label: "停用",
          value: "1"
        }
      ],
      showDd: false,
      pageSize: 8,
      total: 0,
      current: 1,
      pageSizeList: [8],
      headTitle: [
        "设备名称",
        "设备编号",
        "注册时间",
        "MAC地址",
        "设备状态",
        "操作"
      ],
      deviceList: [],
      deviceDetail: [],
      path: {
        path: "/ResourceManage/detail",
        name: "rmDetail"
      }
    };
  },
  methods: {
    // 跳转到设备项目详情页面
    turnToResourceDetail(id) {
      this.$router.push({
        name: this.path.name,
        params: {
          devId: id
        }
      });
      sessionStorage.setItem('devId',JSON.stringify(id))
    },
    // 设备详情弹窗数据请求
    showDeviceDetail(devId) {
      this.deviceDetail = [];
      this.showDd = true;
      this.$axios({
        method: "get",
        url: "iequip/v1/portal/terms/" + devId,
        data: {},
        // PBreq: 'com.ccb.cloud.protobuf.proto.iequip.Iequip',
        PBres: "com.ccb.cloud.protobuf.proto.iequip.Iequip"
      })
        .then(resp => {
          resp.data.lclCrtTms = this.getDate(resp.data.lclCrtTms);
          this.deviceDetail = this.deviceDetail.concat(resp.data);
          this.deviceDetail.map(item => {
            if (item.devStatus === "0") {
              item.devStatus = "正常";
            } else {
              item.devStatus = "停用";
            }
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    closeWin() {
      this.showDd = false;
    },
    // pagination方法
    handleSizeChange(v) {
      console.log("size change", v);
      // chrome
      document.body.scrollTop = 0
      // firefox
      document.documentElement.scrollTop = 0
      // safari
      window.pageYOffset = 0
    },
    handleCurrentChange(v) {
      this.current = v;
      this.getDevice();
      // chrome
      document.body.scrollTop = 0
      // firefox
      document.documentElement.scrollTop = 0
      // safari
      window.pageYOffset = 0
    },
    // 前一页
    handleClickPrev(v) {
      if (this.current > 1) {
        this.current -= 1;
        this.getDevice();
      } else {
        this.current = 1;
      }
    },
    // 后一页
    handleClickNext(v) {
      this.current += 1;
      this.getDevice();
    },
    // 查询设备列表
    getDevice() {
      let params = { pageSize: this.pageSize, pageIndex: this.current };
      Object.assign(params, this.searchData);
      if (params.endTms <= params.beginTms && params.endTms !== "") {
        this.$ccb.$alert({
          content: "请选择正确的结束时间",
          styleType: "error",
          title: "error"
        });
        return;
      } else {
        params.beginTms =
          params.beginTms.slice(0, 4) +
          "-" +
          params.beginTms.slice(4, 6) +
          "-" +
          params.beginTms.slice(6, 8);
        params.endTms =
          params.endTms.slice(0, 4) +
          "-" +
          params.endTms.slice(4, 6) +
          "-" +
          params.endTms.slice(6, 8);
        if (params.beginTms === "--") {
          params.beginTms = "";
        }
        if (params.endTms === "--") {
          params.endTms = "";
        }
        this.$axios({
          method: "POST",
          url: "iequip/v1/portal/terms/queryEntity",
          data: params,
          PBreq: "com.ccb.cloud.protobuf.proto.iequip.Iequip",
          PBres: "com.ccb.cloud.protobuf.proto.Page"
        })
          .then(resp => {
            console.log(resp);
            this.deviceList = [];
            this.total = resp.data.total;
            resp.data.data.map(item => {
              let result = $myDecode(
                item.value,
                "com.ccb.cloud.protobuf.proto.iequip.Iequip"
              );
              result.lclCrtTms = this.getDate(result.lclCrtTms);
              if (result.devStatus === "0") {
                result.devStatus = "正常";
              } else {
                result.devStatus = "停用";
              }
              this.deviceList = this.deviceList.concat(result);
            });
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    // 时间戳转换
    getDate(time) {
      return new Date(parseInt(time))
        .toLocaleString()
        .replace(/:\d{1,2}$/, " ");
    }
  },
  // 查询设备列表
  created() {
    this.getDevice();
  }
};
</script>

<style lang="scss" scoped>
.resourceManage {
  > .manage-box {
    width: 100%;
    background-image: url("../../assets/images/product/u72.png");
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
    > .resourceManage-box {
      color: #000;
      background-color: #fff;
      width: 1200px;
      padding-top: 0;
      margin-left: calc(50% - 600px);
      overflow: hidden;
      > .headLine {
        width: 72px;
        height: 6px;
        margin: 80px auto 16px;
        background: #306fe4;
      }
      > .title {
        font-size: 32px;
        color: #000000;
        letter-spacing: 1.14px;
        text-align: center;
        font-weight: bold;
        margin-bottom: 50px;
      }
      > .searchBox {
        width: 1080px;
        margin: 0 auto;
        text-align: left;
        span {
          margin-left: 5px;
        }
        .ccb-date {
          width: 120px;
          margin-bottom: 10px;
        }
        .ccb-input-div {
          width: 150px;
        }
        .ccb-select {
          width: 76px;
        }
        button {
          margin-left: 5px;
        }
      }
      > .deviceInfo {
        width: 1080px;
        margin: 0 auto;
        > tr {
          height: 56px;
          box-shadow: inset 0 -1px 0 0 #e6e6e6;
          box-sizing: border-box;
          > td {
            text-align: center;
            > button {
              width: 88px;
              height: 36px;
              background-color: #3f79e5;
              border-radius: 2px;
            }
          }
        }
      }
    }
    .block {
      margin: 60px auto 65px;
    }
  }
}
</style>

<style lang="scss">
.deviceDetail {
  width: 600px;
  //min-height: 300px;
  > .ccb-window-header {
    width: 600px;
    height: 50px;
    background-color: #f5f5f5;
    font-size: 18px;
    color: #222222;
    box-sizing: border-box;
  }
  > .ccb-window-content {
    > p {
      font-size: 14px;
      color: #2b2e47;
      span {
        border-left: 4px solid #3f79e5;
        margin: 0 4px 0 10px;
      }
    }
    dl {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      font-size: 14px;
      dt {
        width: 120px;
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
  }
}
</style>


