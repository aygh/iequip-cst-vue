<template>
    <div class="rmDetail">
        <Head></Head>
        <div class="rmDetail-box">
            <div class="search-box">
                <span>领先</span><span class="midTitle">安全</span><span>稳定</span>
            </div>
            <div class="deviceInfo">
              <div class="headLine"></div>
              <p class="title">设备{{devId}}&nbsp;项目详情</p>
              <div class="projects allProject">
                <p><span></span>全部项目</p>
                <div>
                    <dl
                    v-for="(item,index) in allProject"
                    :key="index"
                    @click="addToSelected(index)"
                  >
                    <dt><img :src="logoSrc + `${item.appLogoSrc.replace(/\\/g, '/')}`" alt=" "></dt>
                    <dd>
                      <p class="title">{{item.appNm}}{{item.appId}}</p>
                      <p class="introduce">{{item.appBrf}}</p>
                    </dd>
                  </dl>
                </div>
              </div>
              <div class="projects selectedProject">
                <p><span></span>已选项目<b>可拖动项目进行排序</b></p>
                <div>
                <draggable :options = "{animation:500,group:selectedProject}" @update="datadragEnd">
                  <transition-group>
                      <dl
                      v-for="(item,index) in selectedProject"
                      :key="item.appId"
                      @click="removeFromList(index)"
                    >
                      <dt><img :src="logoSrc + `${item.appLogoSrc.replace(/\\/g, '/')}`" alt=" "></dt>
                      <dd>
                        <p class="title">{{item.appNm}}&nbsp;{{item.appId}}</p>
                        <p class="introduce">{{item.appBrf}}</p>
                      </dd>
                    </dl>
                  </transition-group>
                </draggable>
                </div>
                <ccb-button @click="toDetailPage" style="float: right;margin-top:20px;margin-right:10px;">返回</ccb-button>
                <ccb-button
                  @click="submitSelectedProject"
                  style="margin-top:20px;float: right;margin-right: 10px;"
                >提交</ccb-button>
                
              </div>
            </div>
        </div>
        <Footer></Footer>
    </div>
</template>

<script>
import Head from "@/components/templetes/commons/head/Head2";
import Footer from "@/components/templetes/commons/foot/Footer";
import draggable from "vuedraggable";
import { $myDecode } from "@/utils/myAxios";
import { filePath } from '@/config';

export default {
  name: "rmDetail",
  components: {
    Head,
    Footer,
    draggable
  },
  data() {
    return {
      logoSrc: `/getFile?filePath=${filePath}`,
      allProject: [],
      selectedProject: [],
      startArr: [],
      endArr: [],
      count: 0,
      devId: "",
      appList: []
    };
  },
  methods: {
    toDetailPage () {
      this.$router.push({
        path: '/ResourceManage'
      })
    },
    addToSelected(index) {
      let selectedAllId = [];
      for (let i = 0; i < this.selectedProject.length; i++) {
        selectedAllId = selectedAllId.concat(this.selectedProject[i].appId);
      }
      if (selectedAllId.indexOf(this.allProject[index].appId) === -1) {
        this.selectedProject = this.selectedProject.concat(
          this.allProject[index]
        );
      }
    },
    removeFromList(index) {
      this.selectedProject.splice(index, 1);
    },
    datadragEnd(evt) {
      evt.preventDefault();
      this.selectedProject.splice(evt.newIndex,0,this.selectedProject[evt.oldIndex])
      this.selectedProject.splice(evt.oldIndex + 1,1)
     
      console.log(this.selectedProject)
    },
    // 提交已选项目
    submitSelectedProject() {
      this.appList = []
      this.selectedProject.map(item => {
        this.appList.push(item)
      })
      if (this.appList.length === 1) {
        this.appList[0]["daDispNo"] = "1"
        console.log(this.appList)
        
      } else if (this.appList.length === 0) {
        this.appList = [{daDispNo: "",appId: ""}]
      } else {
         this.selectedProject.map((item,index) => {
          item.daDispNo = index + 1
        })
      }
      console.log(this.appList)
      this.$axios({
        method: "PUT",
        url: '/iequip/v1/portal/terms/' + this.devId + '/apps',
        data:{
          appList: this.appList
        },
        PBreq: "com.ccb.cloud.protobuf.proto.iequip.IequipAppList",
        PBres: "com.ccb.cloud.protobuf.proto.ProtoResponse"
      })
        .then(resp => {
          console.log(resp)
          if (resp.headers.SYS_TX_STATUS === "00") {
            this.$ccb.$alert({content: "编排项目成功",styleType: 'success',title: 'success',width: "200px"})
          } else {
            this.$ccb.$alert({content: `${resp.headers.SYS_RESP_DESC}`,styleType: 'warning'})
          }
        })
        .catch(err => {
          console.log(err);
        })
    }
  },
  created() {
    this.devId = JSON.parse(sessionStorage.getItem('devId'));
    // 设备可选项目查询
    this.$axios({
      method: "get",
      url: '/iequip/v1/portal/terms/' + this.devId +'/apps',
      data:{},
      PBres: "com.ccb.cloud.protobuf.proto.Page"
    }).then(resp => {
        resp.data.data.map(item => {
          this.allProject.push(($myDecode(item.value,'com.ccb.cloud.protobuf.proto.iequip.App')))
        })
      }).catch(err => {
        console.log(err);
      });
    // 已选项目查询
    this.$axios({
      method: "get",
      url: '/iequip/v1/portal/terms/'+ this.devId +'/selectedApps',
      data:{},
      PBres: "com.ccb.cloud.protobuf.proto.Page"
    }).then(resp => {
        resp.data.data.map(item => {
          this.selectedProject.push(($myDecode(item.value,'com.ccb.cloud.protobuf.proto.iequip.App')))
        })
      }).catch(err => {
        console.log(err);
      })
  }
}
</script>

<style lang="scss" scoped>
.rmDetail-box {
  width: 100%;
  background-image: url("../../../assets/images/product/u72.png");
  background-repeat: no-repeat;
  background-size: 100%;
  position: relative;
  margin-bottom: 52px;
  > .search-box {
    padding-top: 60px;
    color: #fff;
    text-align: center;
    > span {
      display: inline-block;
      font-size: 48px;
      font-weight: 600;
      margin-bottom: 50px;
      margin-top: 50px;
    }
    > .midTitle {
      margin: 0 60px;
    }
    > p {
      height: 40px;
      margin: 0px auto 60px;
    }
  }
  > .deviceInfo {
    color: #000;
    background-color: #fff;
    width: 1200px;
    margin-left: calc(50% - 600px);
    overflow: hidden;
    > .headLine {
      width: 72px;
      height: 6px;
      background-color: #3f79e5;
      margin: 80px auto 0;
    }
    > .title {
      font-family: 600;
      font-size: 32px;
      color: #000000;
      text-align: center;
      margin-top: 16px;
      margin-bottom: 80px;
    }
    > .projects {
      width: 600px;
      float: left;
      box-sizing: border-box;
      display: inherit;
      > div {
        height: 386px;
        max-height: 400px;
        overflow-y: scroll; 
      }
      dl {
        height: 80px;
        margin-left: 44px;
        margin-bottom: 10px;
        cursor: pointer;
        position: relative;
        dt {
          float: left;
          border: 1px solid #ccc;
          box-sizing: border-box;
          width: 150px;
          height: 80px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        dd {
          float: left;
          width: 262px;
          margin-left: 10px;
          position: absolute;
          left: 150px;
          > .title {
            margin-top: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-align: left;
          }
          > .introduce {
            margin-top: 10px;
          }
        }
      }
      > p {
        font-size: 14px;
        color: #3f79e5;
        font-weight: 600;
        margin-bottom: 10px;
        padding-left: 44px;
        > span {
          border-left: 4px solid #3f79e5;
          margin-right: 6px;
        }
        > b {
          font-weight: normal;
          color: #999;
          font-size: 12px;
          margin-left: 6px;
        }
      }
    }
  }
}
</style>