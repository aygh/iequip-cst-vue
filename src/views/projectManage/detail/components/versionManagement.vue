<template>
  <div class="versionManagement">
    <p class="title">版本管理</p>
    <div class="buttons">
      <button @click="newVersion">新建版本</button>
      <button @click="versionCancel">撤销版本审核</button>
      <button @click="versionPublish">版本发布</button>
      <button @click="cVersionPublish">撤销版本发布</button>
    </div>
    <table class="versionInfo">
      <tr class="header">
        <td class="check-box"></td>
        <td>版本号</td>
        <td>版本描述</td>
        <td>版本状态</td>
        <td>操作</td>
      </tr>
      <tr v-for="(item,index) in projectVersionList" :key="index">
        <td class="check-box">
          <input type="checkbox" @click="getVersionNumber(index)" class="checked">
        </td>
        <td class="versionNumber">{{item.version}}</td>
        <td class="verDesc">{{item.verDesc}}</td>
        <td class="versionState">{{item.verSt}}</td>
        <td class="operation" @click="versionPeriod(index)">
          <button>版本生命周期</button>
        </td>
      </tr>
    </table>
    <ccb-pagination
      class="block"
      :pageSizeList="pageSizeList"
      :current.sync="current"
      :total="total"
      :pageSize.sync="pageSize"
    ></ccb-pagination>
    <!-- 新建版本 -->
    <div class="newVersion">
      <ccb-window :show.sync="showNvw" title="新建版本" id="dialog">
        <div class="con">
          <div class="versionNumberBox" style="padding-left:82px">
            <span>版本号：</span>
            <ccb-input
              style="width:300px;height:40px;margin:0 32px 0 8px;"
              placeholder="请输入"
              v-model="newVersionInfo.version"
              :maxlength="10"
              @change="checkLength"
            ></ccb-input>
            <span v-show="!showWarning">*必选项</span>
            <span v-show="showWarning" style="color:red;margin-left:6px;">限定10字符</span>
          </div>
          <div class="versionInfo" style="height:125px;margin-left:40px;">
            <div class="headtitle" style="float:left;">版本描述信息：</div>
            <div class="textareaBox" style="float:left;margin:0 36px 0 10px;">
              <textarea
                placeholder="请输入"
                style="width:300px;height:120px;resize:none;padding-left:12px;padding-top:6px;box-sizing: border-box"
                v-model="newVersionInfo.verDesc"
                @change="checkLength"
              ></textarea>
            </div>
            <div style="margin-left:10px">
              <span v-show="!showWarningDesc">选填项</span>
              <span v-show="showWarningDesc" style="color:red;">限定100字符</span>
            </div>
          </div>
          <div style="height: 50px;">
            <span style="margin:0 10px 0 82px">代码包：</span>
            <ccb-upload
              :url="url"
              :on-success="succ"
              :on-error="err"
              class="my-upload"
              :on-before-upload="file => beforeUpload(file, 'codePackage')"
            ></ccb-upload>
            <span style="margin-left:130px">{{this.newVersionInfo.file}}</span>
          </div>
        </div>
        <div slot="footer" class="footer" style="margin-top:40px;">
          <ccb-button @click="closeWin" class="firstButton">取消</ccb-button>
          <ccb-button @click="confirmNewVersion" class="secondButton">确定</ccb-button>
        </div>
      </ccb-window>
    </div>
    <!-- 撤销版本审核 -->
    <div class="cancelPublish">
      <ccb-window :show.sync="showCv" title="撤销版本审核" id="publishDialog">
        <p style="margin-left:10px;">是否撤销&nbsp;{{this.selectedVerId.verId}}&nbsp;的版本审核？</p>
        <div slot="footer" class="footer">
          <ccb-button @click="closeWin" class="firstButton">取消</ccb-button>
          <ccb-button @click="cancelVersionCheck" class="secondButton">确定</ccb-button>
        </div>
      </ccb-window>
    </div>
    <!-- 版本发布 -->
    <div class="versionPublish">
      <ccb-window :show.sync="showVp" title="版本发布" class="versionPublish">
        <div class="con">
          <div class="versionNumberBox">
            <span style="margin:0 8px 0 57px;">发布日期：</span>
            <el-date-picker
              v-model="versionPublishInfo.pbDate"
              type="date"
              placeholder="选择日期"
              style="width:150px;margin-bottom:10px;"
              size="small"
              :picker-options="pickerOptions"
            ></el-date-picker>
            <el-time-select
              v-model="versionPublishInfo.pbTime"
              :picker-options="{
                    start: `${this.publishTime.hours}:${this.publishTime.minutes}`,
                    step: '00:30',
                    end: '23:30'
                  }"
              placeholder="选择时间"
              style="width:150px;margin-bottom:10px;"
              size="small"
            ></el-time-select>
            <span style="margin-left:21px">*必选项</span>
          </div>
          <div class="versionInfo">
            <span style="margin:0 8px 0 57px;">发布方式：</span>
            <ccb-select
              :options="options"
              style="width:300px;height:40px"
              v-model="versionPublishInfo.pbTp"
              :value="options.value"
              @change="choosepbTp"
            ></ccb-select>
            <span style="margin-left:21px">*必选项</span>
          </div>
          <div>
            <span style="margin:0 8px 0 57px;">发布设备：</span>
            <ccb-select
              :options="deviceOptions"
              style="width:300px;height:40px"
              v-model="versionPublishInfo.pbDevice"
              multi
              :value="deviceOptions.value"
              :key="deviceOptions.value"
              :disabled="this.isdisabled"
            ></ccb-select>
            <span style="margin-left:21px">*必选项</span>
          </div>
        </div>
        <div slot="footer" class="footer" style="margin:40px 0 0 400px;">
          <ccb-button @click="closeWin" class="firstButton">取消</ccb-button>
          <ccb-button @click="confirmVersionPublish" class="secondButton">确定</ccb-button>
        </div>
      </ccb-window>
    </div>
    <!-- 撤销版本发布 -->
    <div class="cVPublish">
      <ccb-window :show.sync="showCvp" title="撤销版本发布" class="cVPublish">
        <div slot="footer" class="footer" style="margin:40px 0 0 400px;">
          <ccb-button @click="closeWin" class="firstButton">取消</ccb-button>
          <ccb-button @click="cancelVersionPublish" class="secondButton">确定</ccb-button>
        </div>
      </ccb-window>
    </div>
    <!-- 版本生命周期弹窗 -->
    <div class="versionPeriod">
      <ccb-window :show.sync="showVpc" title="版本生命周期" class="versionPeriod">
        <div class="con">
          <p>
            <span></span>版本信息描述
          </p>
          <div>
            <dl>
              <dt>版本号</dt>
              <dd>{{this.versionDetail.version}}</dd>
            </dl>
          </div>
          <div>
            <dl>
              <dt>版本描述</dt>
              <dd class="desc" style="max-height:60px;">{{this.versionDetail.verDesc}}</dd>
            </dl>
          </div>
          <div>
            <dl>
              <dt>代码包</dt>
              <dd>
                <span style="cursor:pointer;color:#3f79e5;" @click="downloadCode">下载</span>
              </dd>
            </dl>
          </div>
          <p>
            <span></span>版本生命周期
          </p>
          <div class="bottomLine"></div>

          <table class="aaaas">
            <tr>
              <td>序号</td>
              <td>操作时间</td>
              <td>操作人</td>
              <td>操作类型</td>
              <td style="width:220px;">操作描述</td>
            </tr>
            <div class="tb">
              <tr v-for="(item,index) in versionPeriodData" :key="index" v-cloak>
                <td>{{index + 1}}</td>
                <td>{{item.oprTms}}</td>
                <td>{{item.oprPsnNm}}</td>
                <td>{{item.oprTp}}</td>
                <td style="width:300px;">{{item.oprDesc}}</td>
              </tr>
            </div>
          </table>
        </div>
        <div slot="footer" class="footer">
          <ccb-button @click="closeWin" class="secondButton">关闭</ccb-button>
        </div>
      </ccb-window>
    </div>
  </div>
</template>

<script>
import { $myDecode } from "@/utils/myAxios";
import { filePath } from "@/config";

export default {
  name: "versionManagement",
  components: {},
  data() {
    return {
      showWarning: false,
      showWarningDesc: false,
      isdisabled: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
        }
      },
      // newVersion
      url: `/upload?savePath=ISVcode/${this.$route.query.id}/`,
      // url: `/upload?savePath=ISVcode/${"00000021"}/`,
      file: {},
      // ccb-pagination
      pageSize: 8,
      total: 0,
      current: 1,
      pageSizeList: [8],
      // ccb-window
      showNvw: false,
      showCv: false,
      showVp: false,
      showCvp: false,
      showVpc: false,
      projectVersionList: [],
      versionPeriodData: [],
      versionDetail: {},
      newVersionInfo: {
        version: "",
        verDesc: "",
        codeSrc: "",
        file: ""
      },
      // 版本号
      verId: {},
      selectedVerId: {},
      // 发布版本信息
      versionPublishInfo: {
        pbDate: "",
        pbTime: "",
        pbTp: "",
        pbDevice: ""
      },
      options: [
        {
          label: "生产发布",
          value: "1"
        },
        {
          label: "灰度发布",
          value: "2"
        }
      ],
      deviceOptions: [{ value: "", label: "全部" }],
      versionPeriodData: [],
      // publishTime
      publishTime: {
        hours: "",
        minutes: ""
      }
    };
  },
  methods: {
    checkLength() {
      if (this.newVersionInfo.version.length > 10) {
        this.showWarning = true;
      } else {
        this.showWarning = false;
      }
      if (this.newVersionInfo.verDesc.length > 100) {
        this.showWarningDesc = true;
      } else {
        this.showWarningDesc = false;
      }
    },
    downloadCode() {
      window.open(
        `/getFile?filePath=${filePath}${this.versionDetail.codeSrc.replace(
          /\\/g,
          "/"
        )}`
      );
    },
    choosepbTp() {
      this.isdisabled = false;
      this.versionPublishInfo.pbDevice = "";
      if (this.versionPublishInfo.pbTp === "1") {
        this.isdisabled = true;
      }
    },
    getTimeStamp(time) {
      return new Date(time).getTime() / 1000;
    },
    // 时间转换
    filterTime(t) {
      let yyyy = new Date(t).getFullYear();
      let mm = new Date(t).getMonth() + 1;
      if (mm < 10) {
        mm = "0" + mm;
      }
      let dd = new Date(t).getDate();
      if (mm == 0) {
        yyyy -= 1;
        mm = 12;
      }
      if (dd < 10) {
        dd = "0" + dd;
      }
      let hh = new Date(t).getHours();
      if (hh < 10) {
        hh = "0" + hh;
      }
      let minutes = new Date(t).getMinutes();
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      let sec = new Date(t).getSeconds();
      if (sec < 10) {
        sec = "0" + sec;
      }
      return `${yyyy}-${mm}-${dd} ${hh}:${minutes}:${sec}`;
    },
    // newVersion
    succ(file) {
      if (file.path.indexOf("zip") > -1) {
        this.newVersionInfo.file = this.file.name;
        this.newVersionInfo.codeSrc = file.path;
        console.log(this.newVersionInfo.codeSrc);
      }
    },
    err(er) {
      console.log(er);
    },
    beforeUpload(file, type) {
      // 上传代码包格式验证
      if (!file.type.includes("zip")) {
        this.$ccb.$alert({
          content: "请选择zip格式的代码包",
          styleType: "warning",
          title: "warning"
        });
      } else {
        this.file = file;
      }
    },
    // buttons
    newVersion() {
      this.newVersionInfo.version = "";
      this.newVersionInfo.codeSrc = "";
      this.newVersionInfo.verDesc = "";
      this.newVersionInfo.file = "";
      this.showWarning = false;
      this.showWarningDesc = false;
      let status = [];
      this.projectVersionList.map(item => {
        status.push(item.verSt);
      });
      if (status.indexOf("待审核") > -1) {
        this.$ccb.$alert({
          content: "一个项目只允许同时有一个待审核的版本",
          styleType: "error",
          title: "error"
        });
      } else {
        this.showNvw = true;
      }
    },
    versionCancel() {
      if (this.selectedVerId.verSt !== "待审核") {
        this.$ccb.$alert({
          content: "请选择待审核版本进行撤销"
        });
      } else {
        this.showCv = true;
      }
    },
    // 版本发布
    versionPublish() {
      this.deviceOptions = [];
      this.versionPublishInfo.pbDate = "";
      this.versionPublishInfo.pbTime = "";
      this.versionPublishInfo.pbTp = "";
      this.versionPublishInfo.pbDevice = "";
      if (this.selectedVerId.verSt === undefined) {
        this.$ccb.$alert({
          content: "请选择可发布版本进行发布",
          styleType: "error",
          title: "error"
        });
      } else {
        if (
          this.selectedVerId.verSt.indexOf("审核通过可发布") === -1 &&
          this.selectedVerId.verSt.indexOf("灰度版本已发布") === -1
        ) {
          this.$ccb.$alert({
            content: "请选择可发布版本进行发布",
            styleType: "error",
            title: "error"
          });
        } else if (
          this.selectedVerId.verSt.indexOf("审核通过可发布") >= 0 ||
          this.selectedVerId.verSt.indexOf("灰度版本已发布") >= 0
        ) {
          this.showVp = true;
          if (this.selectedVerId.verSt.indexOf("灰度版本已发布") >= 0) {
            this.options = [{ label: "生产发布", value: "1" }];
            this.versionPublishInfo.pbTp = "1";
            this.isdisabled = true;
          } else {
            this.options = [
              { label: "生产发布", value: "1" },
              { label: "灰度发布", value: "2" }
            ];
            this.isdisabled = false;
          }
          this.publishTime.hours = new Date().getHours();
          this.publishTime.minutes = new Date().getMinutes();
          if (this.publishTime.minutes + 30 < 60) {
            this.publishTime.hours += 1;
            this.publishTime.minutes = "00";
          } else {
            this.publishTime.hours += 1;
            this.publishTime.minutes = "30";
          }
          this.$axios({
            method: "POST",
            url: "iequip/v1/portal/terms/queryEntity",
            data: { devStatus: "0" },
            PBreq: "com.ccb.cloud.protobuf.proto.iequip.Iequip",
            PBres: "com.ccb.cloud.protobuf.proto.Page"
          })
            .then(resp => {
              resp.data.data.map(item => {
                let result = $myDecode(
                  item.value,
                  "com.ccb.cloud.protobuf.proto.iequip.Iequip"
                );
                this.deviceOptions.push({
                  value: result.devId,
                  label: result.devName
                });
              });
              console.log(this.deviceOptions);
            })
            .catch(err => {
              console.log(err);
            });
        }
      }
    },
    // 确定版本发布
    confirmVersionPublish() {
      let vpi = this.versionPublishInfo;
      let pbT = this.filterTime(this.versionPublishInfo.pbDate);
      let pbTArr = pbT.split("");
      pbTArr[11] = this.versionPublishInfo.pbTime.slice(0, 1);
      pbTArr[12] = this.versionPublishInfo.pbTime.slice(1, 2);
      pbTArr[14] = "3";
      let publishTime = pbTArr.join("");
      let allDevice = [];
      this.deviceOptions.map(item => {
        return allDevice.push(item.value);
      });
      // 判断发布时间是否过期
      if (
        Date.now() + 0.5 * 60 * 60 * 1000 >=
        this.getTimeStamp(publishTime) * 1000
      ) {
        this.$ccb.$alert({
          content: "当前选择的发布时间已过期,请重新选择"
        });
      } else {
        // 判断不为空
        if (vpi.pbDate !== "" && vpi.pbTime !== "" && vpi.pbTp !== "") {
          if (this.versionPublishInfo.pbTp === "1") {
            console.log(allDevice.join());
            this.$axios({
              method: "PATCH",
              url:
                "/iequip/v1/portal/vers/" + this.selectedVerId.verId + "/verSt",
              data: {
                oprTp: "5",
                pubTms: this.getTimeStamp(publishTime) * 1000,
                pubTp: this.versionPublishInfo.pbTp,
                pubEquips: allDevice.join()
              },
              PBreq: "com.ccb.cloud.protobuf.proto.iequip.VerStParam",
              PBres: "com.ccb.cloud.protobuf.proto.iequip.RetRslt"
            })
              .then(res => {
                console.log(res);
                if (res.data.retRsltCd === "true") {
                  this.getVersionList();
                } else {
                  this.$ccb.$alert({
                    content: res.data.retRsltDsc,
                    styleType: "warning",
                    title: "warning"
                  })
                }
                
              })
              .catch(err => {
                console.log(err);
              });
            this.showVp = false;
          } else if (this.versionPublishInfo.pbTp === "2") {
            if (this.versionPublishInfo.pbDevice === "") {
              this.$ccb.$alert({
                content: "请选择发布设备",
                styleType: "warning",
                title: "warning"
              });
            } else {
              this.$axios({
                method: "PATCH",
                url:
                  "/iequip/v1/portal/vers/" +
                  this.selectedVerId.verId +
                  "/verSt",
                data: {
                  oprTp: "6",
                  pubTms: this.getTimeStamp(publishTime) * 1000,
                  pubTp: this.versionPublishInfo.pbTp,
                  pubEquips: this.versionPublishInfo.pbDevice.join()
                },
                PBreq: "com.ccb.cloud.protobuf.proto.iequip.VerStParam",
                PBres: "com.ccb.cloud.protobuf.proto.iequip.RetRslt"
              })
                .then(res => {
                  console.log(res)
                  if (res.data.retRsltCd === "true") {
                    this.projectVersionList.splice(0, 1);
                    this.getVersionList();
                  } else {
                    this.$ccb.$alert({
                      content: res.data.retRsltDsc,
                      styleType: "warning",
                      title: "warning"
                    })
                  }
                  
                })
                .catch(err => {
                  console.log(err);
                });
              this.showVp = false;
            }
          }
        } else {
          this.$ccb.$alert({
            content: "请完善发布信息",
            styleType: "warning",
            title: "warning"
          });
        }
      }
    },
    // 撤销版本发布
    cancelVersionPublish() {
      this.$axios({
        method: "PATCH",
        url: "/iequip/v1/portal/vers/" + this.selectedVerId.verId + "/verSt",
        data: {
          oprTp: "7"
        },
        PBreq: "com.ccb.cloud.protobuf.proto.iequip.VerStParam",
        PBres: "com.ccb.cloud.protobuf.proto.iequip.RetRslt"
      })
        .then(res => {
          console.log(res);
          this.getVersionList();
        })
        .catch(err => {
          console.log(err);
        });
      this.showCvp = false;
    },
    // 版本生命周期数据请求
    versionPeriod(i) {
      this.versionPeriodData = [];
      this.showVpc = true;
      this.verId = this.projectVersionList[i].verId;
      // 获取版本详情信息
      this.$axios({
        method: "GET",
        url: "/iequip/v1/portal/vers/" + this.verId,
        data: {},
        // PBreq: 'com.ccb.cloud.protobuf.proto.iequip.SelectParam',
        PBres: "com.ccb.cloud.protobuf.proto.iequip.AppVer"
      })
        .then(res => {
          console.log("版本生命周期")
          console.log(res)
          this.versionDetail = res.data;
          console.log(this.versionDetail);
        })
        .catch(err => {
          console.log(err);
        });
      // 获取生命周期数据
      console.log(this.verId);
      this.$axios({
        method: "GET",
        url: "/iequip/v1/portal/vers/" + this.verId + "/actions",
        data: {},
        PBreq: "com.ccb.cloud.protobuf.proto.iequip.SelectParam",
        PBres: "com.ccb.cloud.protobuf.proto.Page"
      })
        .then(res => {
          this.versionPeriodData = [];
          res.data.data.map(item => {
            let result = $myDecode(item, "google.protobuf.Any");
            this.versionPeriodData.push(
              $myDecode(
                result.value,
                "com.ccb.cloud.protobuf.proto.iequip.VerAction"
              )
            );
            this.versionPeriodData.map((item, index) => {
              switch (item.oprTp) {
                case "1":
                  this.versionPeriodData[index].oprTp = "提交版本审核";
                  break;
                case "2":
                  this.versionPeriodData[index].oprTp = "撤销提交版本审核";
                  break;
                case "3":
                  this.versionPeriodData[index].oprTp = "版本审核通过";
                  break;
                case "4":
                  this.versionPeriodData[index].oprTp = "版本审核拒绝";
                  break;
                case "5":
                  this.versionPeriodData[index].oprTp = "版本生产发布";
                  break;
                case "6":
                  this.versionPeriodData[index].oprTp = "版本灰度发布";
                  break;
                case "7":
                  this.versionPeriodData[index].oprTp = "撤销版本发布";
                  break;
              }
            });
          });
          // 转换时间戳
          this.versionPeriodData.map(item => {
            return (item.oprTms = this.getCorrectTime(item.oprTms));
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    closeWin() {
      this.showNvw = false;
      this.showCv = false;
      this.showVp = false;
      this.showCvp = false;
      this.showVpc = false;
    },
    // 新建版本
    confirmNewVersion() {
      let appId = this.$route.query.id
      let version = this.newVersionInfo.version;
      let verDesc = this.newVersionInfo.verDesc;
      let codeSrc = this.newVersionInfo.codeSrc;
      if (version !== "" && codeSrc !== "") {
        if (!this.showWarning && !this.showWarningDesc) {
          this.$axios({
            method: "POST",
            url: "/iequip/v1/portal/apps/" + appId + "/vers",
            data: {
              version: version,
              verDesc: verDesc,
              codeSrc: codeSrc
            },
            PBreq: "com.ccb.cloud.protobuf.proto.iequip.AppVer",
            PBres: "com.ccb.cloud.protobuf.proto.iequip.RetRslt"
          })
            .then(res => {
              console.log(res)
              if (res.headers.SYS_TX_STATUS === "00") {
                this.projectVersionList = [];
                this.getVersionList();
              } else {
                this.$ccb.$alert({
                  content: res.headers.SYS_RESP_DESC,
                  styleType: "warning",
                  title: "warning"
                })
              }
            })
            .catch(err => {
              console.log(err);
            });
          this.showNvw = false;
        }
      } else {
        this.$ccb.$alert({
          content: "必选项不能为空",
          styleType: "warning",
          title: "warning"
        });
      }
    },
    // 撤销版本发布
    cVersionPublish() {
      let st = this.selectedVerId.verSt;
      if (st === undefined) {
        this.$ccb.$alert({
          content: "请选择待发布版本进行撤销操作",
          styleType: "error",
          title: "error"
        });
      } else {
        if (
          st.indexOf("待生产版本发布") === -1 &&
          st.indexOf("待灰度版本发布") === -1
        ) {
          this.$ccb.$alert({
            content: "请选择待发布版本进行撤销",
            styleType: "error",
            title: "error"
          });
        } else {
          this.showCvp = true;
        }
      }
    },
    // 获取勾选项版本号
    getVersionNumber(i) {
      let allInput = document.getElementsByClassName("checked");
      let num = allInput.length;
      let otherInput = [];
      for (let k = 0; k < num; k++) {
        if (k !== i) {
          otherInput.push(allInput[k]);
        }
      }
      otherInput.map(item => {
        item.checked = false;
      });
      if (allInput[i].checked === true) {
        this.selectedVerId = {};
        this.selectedVerId = {
          verId: this.projectVersionList[i].verId,
          verSt: this.projectVersionList[i].verSt
        };
      } else if (allInput[i].checked === false) {
        this.selectedVerId = {};
      } else {
        this.selectedVerId = {};
      }
    },
    // 撤销版本审核
    cancelVersionCheck() {
      this.$axios({
        method: "PATCH",
        url: "/iequip/v1/portal/vers/" + this.selectedVerId.verId + "/verSt",
        data: {
          oprTp: "2"
        },
        PBreq: "com.ccb.cloud.protobuf.proto.iequip.VerStParam",
        PBres: "com.ccb.cloud.protobuf.proto.iequip.RetRslt"
      })
        .then(res => {
          if (res.data.retRsltDsc === "SUCCESS") {
            this.projectVersionList.splice(0, 1);
          }
          this.selectedVerId = {};
          this.getVersionList();
        })
        .catch(err => {
          console.log(err);
        });
      this.showCv = false;
    },
    // 版本列表查询服务
    getVersionList() {
      this.projectVersionList = [];
      let appId = this.$route.query.id;
      this.$axios({
        method: "GET",
        url: "/iequip/v1/portal/apps/" + appId + "/vers",
        data: {},
        PBres: "com.ccb.cloud.protobuf.proto.Page"
      })
        .then(res => {
          this.total = res.data.total;
          let result;
          res.data.data.map(item => {
            result = $myDecode(item, "google.protobuf.Any");
            this.projectVersionList = this.projectVersionList.concat(
              $myDecode(
                result.value,
                "com.ccb.cloud.protobuf.proto.iequip.AppVer"
              )
            );
          });
          console.log(this.projectVersionList);
          this.projectVersionList.map(item => {
            switch (item.verSt) {
              case "1":
                item.verSt = "待审核";
                break;
              case "2":
                item.verSt = "审核拒绝";
                break;
              case "3":
                item.verSt = "审核通过可发布";
                break;
              case "4":
                item.verSt = "待生产版本发布";
                break;
              case "5":
                item.verSt = "生产版本发布中";
                break;
              case "6":
                item.verSt = "生产版本已发布";
                break;
              case "7":
                item.verSt = "待灰度版本发布";
                break;
              case "8":
                item.verSt = "灰度版本发布中";
                break;
              case "9":
                item.verSt = "灰度版本已发布";
                break;
              case "10":
                item.verSt = "版本发布失败";
                break;
            }
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    choosePublishTp() {},
    // 时间戳转换为日期
    getCorrectTime(datetimes) {
      let date = new Date(datetimes);
      let Y = date.getFullYear() + "-";
      let M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      let D =
        date.getDate() < 10
          ? "0" + date.getDate() + " "
          : date.getDate() + " ";
      let H =
        date.getHours() < 10
          ? "0" + date.getHours() + ":"
          : date.getHours() + ":";
      let mm =
        date.getMinutes() < 10
          ? "0" + date.getMinutes() + ":"
          : date.getMinutes() + ":";
      let s =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return Y + M + D + H + mm + s;
    }
  },
  created() {
    // 指定项目的版本列表查询服务
    this.getVersionList();
    console.log(this.projectVersionList);
    this.projectVersionList.map(item => {
      console.log(item.verSt);
      if (item.verSt === "2") {
        item.verSt = "123";
      }
    });
  }
};
</script>

<style lang="scss" scoped>
[v-cloak] {
  display: none;
}
.my-upload {
  width: 120px;
  position: absolute;
  left: 157px;
  top: 226px;
}
.versionManagement {
  width: 840px;
  height: 575px;
  margin-bottom: 98px;
  > .title {
    font-size: 20px;
    color: #333333;
    font-weight: 600;
    margin-bottom: 40px;
    text-align: left;
  }
  > .buttons {
    width: 494px;
    height: 36px;
    display: flex;
    > button {
      height: 36px;
      border-radius: 2px;
      margin-right: 10px;
      width: 88px;
      outline: none;
      background-color: #3f79e5;
    }
    > button:nth-child(2) {
      width: 116px;
    }
    > button:nth-child(4) {
      width: 116px;
    }
  }
  > .versionInfo {
    width: 840px;
    // height: 392px;
    box-sizing: border-box;
    border-top: 2px solid #437ce6;
    margin-top: 10px;
    margin-bottom: 40px;
    table-layout: fixed;
    > .header td {
      font-size: 14px;
      color: #333;
      font-weight: 600;
    }
    > tr {
      height: 56px;
      box-sizing: border-box;
      box-shadow: inset 0 -1px 0 0 #e6e6e6;
      > td {
        color: #666;
        font-size: 14px;
        text-align: left;
      }
      > .check-box {
        width: 72px;
        text-align: left;
        padding-left: 20px;
        color: #fff;
      }
      > .versionNumber {
        width: 80px;
      }
      > .verDesc {
        width: 400px;
        padding-right: 10px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      > .versionState {
        width: 100px;
      }
      > .operation button {
        width: 116px;
        height: 36px;
        background-color: #3f79e5;
        border-radius: 2px;
      }
    }
  }
}
.ccb-progressbar {
  display: none;
}
</style>

<style lang="scss">
// 新建版本弹窗
#dialog {
  width: 600px;
  min-height: 392px;
  > .ccb-window-header {
    width: 600px;
    height: 50px;
    background-color: #f5f5f5;
    font-size: 18px;
    color: #222222;
    box-sizing: border-box;
  }
  > .ccb-window.content {
    height: 300px;
    background-color: #000;
    > .con {
      text-align: center;
      > .versionNumberBox {
        height: 40px !important;
        background-color: red;
        .ccb-input {
          width: 300px;
          height: 100%;
          border: 1px solid rgb(169, 169, 169) !important;
          border-radius: none !important;
        }
      }
    }
  }
  > .ccb-window-footer {
    .footer {
      button {
        width: 110px;
        height: 40px;
        border-radius: 4px;
        border-color: #3f79e5;
      }
      .firstButton {
        background-color: #fff;
        color: #3f79e5;
      }
    }
  }
}
// 撤销版本审核弹窗
#publishDialog {
  width: 600px;
  min-height: 200px;
  > .ccb-window-header {
    width: 600px;
    height: 50px;
    background-color: #f5f5f5;
    font-size: 18px;
    color: #222222;
    box-sizing: border-box;
  }
  > .ccb-window-content {
    padding: 0;
  }
  .footer {
    margin-top: 50px;
  }
}
// 版本发布弹窗
.versionPublish {
  width: 600px;
  height: 312px;
  > .ccb-window-header {
    width: 600px;
    height: 50px;
    background-color: #f5f5f5;
    font-size: 18px;
    color: #222222;
    box-sizing: border-box;
  }
}
// 撤销版本发布
.cVPublish {
  > .ccb-window-header {
    width: 600px;
    height: 50px;
    background-color: #f5f5f5;
    font-size: 18px;
    color: #222222;
    box-sizing: border-box;
  }
  > .ccb-window-content {
    padding: 0;
  }
  .footer {
    margin: 0 !important;
  }
}
// 版本生命周期
.versionPeriod {
  width: 900px;
  max-height: 697px;
  > .ccb-window-header {
    width: 900px;
    height: 50px;
    background-color: #f5f5f5;
    font-size: 18px;
    color: #222222;
    box-sizing: border-box;
  }
  > .ccb-window-content {
    > .con {
      > p {
        font-size: 14px;
        color: #2b2e47;
        span {
          border-left: 4px solid #3f79e5;
          margin: 0 4px 0 30px;
        }
      }
      > div {
        height: 40px;
        line-height: 40px;
        .desc {
          width: 500px;
          max-height: 100px !important;
          line-height: 18px;
        }
      }
      .bottomLine {
        width: 821px;
        background: #437ce6;
        height: 2px;
        margin-left: 39px;
        margin-top: 18px;
      }
      table {
        width: 821px;
        margin-left: 39px;
        > tr {
          width:800px;
          box-sizing: border-box;
          height: 56px;
          display: flex;
          justify-content: space-around;
          align-items: center;
          border-bottom: 1px solid #e6e6e6;
        }
        > .tb {
          max-height: 180px;
          overflow-y: scroll;
          tr {
            box-sizing: border-box;
            height: 56px;
            display: flex;
            justify-content: space-around;
            align-items: center;
            border-bottom: 1px solid #e6e6e6;
            > td {
              box-sizing: border-box;
              padding-left: 30px;
            }
          }
        }
      }
    }
    dl {
      display: flex;
      dt {
        font-size: 14px;
        color: #7f8298;
        width: 249px;
        padding-left: 39px;
        box-sizing: border-box;
      }
      dd {
        width: 330px;
      }
    }
  }
}
.ccb-upload-file {
  display: none !important;
}
.is-success {
  display: none;
}
</style>

