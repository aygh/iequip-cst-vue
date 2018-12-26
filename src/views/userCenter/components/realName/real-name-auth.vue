<template>
    <div class="container fixed-box">
        <div class="content">
            <ccb-form :model="formData" ref="form" class="form-wrap" :layout="'vertical'">
                <p class="title">实名认证</p>
                <ccb-form-item class="input-wrap" label="">
                    <span class="my-label">申请人身份：</span>
                    <span class="my-label-right"><i>*</i>&nbsp;必选项</span>
                  <ccb-select @change="selectType" class="r-n-select" v-model="formData.acctTp"  :options="options"></ccb-select>
                </ccb-form-item>
                <ccb-form-item class="input-wrap" label=""  :rules="rules.entNm" field="entNm">
                    <span class="my-label">企业名称：</span>
                    <span class="my-label-right"><i>*</i>&nbsp;必填项</span>
                  <input class="my-input" v-model="formData.entNm"  type="text">
                </ccb-form-item>
                <ccb-form-item class="input-wrap" label="" :rules="rules.sbjNm" field="sbjNm">
                    <span class="my-label">企业法定代表人：</span>
                    <span class="my-label-right"><i>&nbsp;</i>&nbsp;选填项</span>
                  <input class="my-input" type="text" v-model="formData.sbjNm">
                </ccb-form-item>
                <ccb-form-item v-if="formData.acctTp === '1'" class="input-wrap" label="" :rules="rules.authenPhone" field="authenPhone">
                    <span class="my-label">法定代表人手机号：</span>
                    <span class="my-label-right"><i>*</i>&nbsp;必填项</span>
                  <input class="my-input" v-model="formData.authenPhone" type="text">
                    <span v-show="authenPhoneErrShow" class="err-tooltip">请填写正确的手机号</span>
                </ccb-form-item>
                <ccb-form-item class="input-wrap" label="" :rules="rules.sbjCrdtNo" field="sbjCrdtNo">
                    <span class="my-label">企业法定代表人身份证号：</span>
                    <span class="my-label-right"><i>*</i>&nbsp;必填项</span>
                  <input class="my-input" v-model="formData.sbjCrdtNo" type="text">
                  <span v-show="sbjCrdtNoErrShow" class="err-tooltip">请填写正确的身份证号</span>
                </ccb-form-item>
                <ccb-form-item v-if="formData.acctTp === '2'" class="input-wrap" label="" :rules="rules.rspbpsnNm" field="rspbpsnNm">
                    <span class="my-label">经办人：</span>
                    <span class="my-label-right"><i>*</i>&nbsp;必填项</span>
                  <input class="my-input" v-model="formData.rspbpsnNm"  type="text">
                </ccb-form-item>
                <ccb-form-item v-if="formData.acctTp === '2'" class="input-wrap" label="" :rules="rules.authenPhone" field="authenPhone">
                    <span class="my-label">经办人手机号：</span>
                    <span class="my-label-right"><i>*</i>&nbsp;必填项</span>
                  <input class="my-input" v-model="formData.authenPhone" type="text">
                  <span v-show="authenPhoneErrShow" class="err-tooltip">请填写正确的手机号</span>
                </ccb-form-item>
                <!-- <ccb-form-item  v-if="formData.acctTp === '2'" class="input-wrap" label="经办人手机号" >
                  <ccb-input :cssStyle="cssConfig.inputStyles" v-model="formData.rspbpsnCrdtNo"></ccb-input>
                </ccb-form-item> -->
                <ccb-form-item  v-if="formData.acctTp === '2'" class="input-wrap" label="" :rules="rules.rspbpsnCrdtNo" field="rspbpsnCrdtNo">
                    <span class="my-label">经办人身份证号：</span>
                    <span class="my-label-right"><i>*</i>&nbsp;必填项</span>
                  <input class="my-input" v-model="formData.rspbpsnCrdtNo" type="text">
                  <span v-show="rspbpsnCrdtNoErrShow" class="err-tooltip">请填写正确的身份证号</span>
                </ccb-form-item>
                <ccb-form-item class="input-wrap" label="" :rules="rules.unnSocCrCd" field="unnSocCrCd">
                    <span class="my-label">统一社会信用代码：</span>
                    <span class="my-label-right"><i>*</i>&nbsp;必填项</span>
                  <input class="my-input" v-model="formData.unnSocCrCd" type="text">
                </ccb-form-item>
                <!-- <ccb-form-item class="input-wrap " label="" >
                    <div class="date-wrap">
                        <ccb-date :displayFormat="'yyyy-MM-dd'" v-model="formData.startTime" ></ccb-date>
                        <ccb-date :displayFormat="'yyyy-MM-dd'" :valueFormat="'yyyy-MM-dd'" v-model="formData.endTime"></ccb-date>
                    </div>
                </ccb-form-item> -->
                <button class="confirm-btn" type="button" @click="next">确定</button>
                <button class="confirm-btn" type="button" @click="back">返回</button>
            </ccb-form>
        </div>
    </div>
</template>
<script>
import { realNameApi } from '@/api'
export default {
    name: 'realNameAuth',
    data() {
        return {
            formData: {
                acctTp: '2',
                entNm: '',
                sbjNm: '',
                authenPhone: '',
                sbjCrdtNo: '',
                rspbpsnNm: '',
                rspbpsnCrdtNo: '',
                unnSocCrCd: ''
            },
            options: [
                {
                    label: '法定代表人',
                    value: '1'
                },
                {
                    label: '经办人',
                    value: '2'
                }
            ],
            rules: {
                entNm: [{type: 'string', required: true, message: '企业名称不能为空'}],
                sbjNm: [{type: 'string', required: false, message: '企业法定代表人不能为空'}],
                authenPhone: [{type: 'string', required: true, message: '企业法定代表人手机号不能为空'}],
                sbjCrdtNo: [{type: 'string', required: true, message: '企业法定代表人身份证号不能为空'}],
                rspbpsnNm: [{type: 'string', required: true, message: '经办人不能为空'}],
                rspbpsnCrdtNo: [{type: 'string', required: true, message: '经办人身份证号不能为空'}],
                unnSocCrCd: [{type: 'string', required: true, message: '统一社会信用代码不能为空'}]
            },
            cssConfig: {
                inputStyles: {
                    width: '380px',
                    height: '50px',
                },
            },
            authenPhoneErrShow: false,
            rspbpsnCrdtNoErrShow: false,
            sbjCrdtNoErrShow: false
        }
    },
    methods: {
        //返回
        back(){
            this.$router.push({path:'/UserCenter'})
        },

        //选择申请人身份
        selectType() {
            this.authenPhoneErrShow = false
            this.rspbpsnCrdtNoErrShow = false
            this.sbjCrdtNoErrShow = false
            for(let k in this.formData) {
                if(k != 'acctTp') {
                    this.formData[k] = ''
                }
            }
            this.$refs['form'].clearValidate();
            this.$store.commit('changeAdtType', this.formData.acctTp);
        },

        //确定，下一页
        next() {
            this.authenPhoneErrShow = false
            this.rspbpsnCrdtNoErrShow = false
            this.sbjCrdtNoErrShow = false
            this.$refs['form'].validateForm(valid => {
                if(!valid) return
                let flag = true
                if(!this.validatePhone(this.formData.authenPhone)) {
                    this.authenPhoneErrShow = true
                    flag = false
                }
                if(this.formData.acctTp == '2') {
                    if(!this.validateIdCard(this.formData.rspbpsnCrdtNo)) {
                        this.rspbpsnCrdtNoErrShow = true
                        flag = false
                    }
                }
                if(!this.validateIdCard(this.formData.sbjCrdtNo)) {
                    this.sbjCrdtNoErrShow = true
                    flag = false
                }
                if(!flag) return
                let data = {};
                for(let k in this.formData) {
                    data[k] = this.formData[k];
                }
                data.acctTp = data.acctTp === '1' ? '法定代表人' : '经办人';
                this.$store.commit('changeRealNameInfo', data);
                this.$store.commit('changeRealNameShowPage', 1)
            })
        },

        //手机号校验
        validatePhone(p) {
            const reg = /^[1][3,4,5,7,8][0-9]{9}$/
            if(reg.test(p)) {
                return true
            }else {
                return false
            }
        },

        //身份证号校验
        validateIdCard(p) {
            const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
            if(reg.test(p)) {
                return true
            }else {
                return false
            }
        }
    },
    created() {
    }
}
</script>
<style lang="scss" scoped>
.container {
    width: 100%;
    // height: 100%;
    .content { 
        width: 100%;
        height: calc(100% - 60px);
    }
    .form-wrap {
        width: 763px;
        height:100%;
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
            .my-label {
                position: absolute;
                width: 180px;
                right: 616px;
                top: 0;
                text-align: right;
                color: #666666;
            }
            .my-label-right {
                position: absolute;
                right: -78px;
                top: 0;
                width: 60px;
                color:#999999;
                i {
                    color: #E03434;
                }
            }
            .my-input {
                width: 600px;
                height: 40px;
                padding-left: 10px;
            }
            .my-vericode-input {
                width: 422px;
            }
            .send-code-btn {
                position: absolute;
                right: -200px;
                top: 0;
                width: 158px;
                height: 40px;
                color: #ccc;
                background: #F5F6FA;
                border: 1px solid #E6E6E6;
                border-radius: 2px;
            }
            .err-tooltip {
                position: absolute;
                left: 0;
                bottom: -30px;
                color: #f5222d;
                font-size: 14px;
            }
        }
        .confirm-btn {
            width: 40%;
            height: 45px;
            margin:10px 20px;
        }
    }
}
</style>
<style lang="scss">
    .r-n-select {
        .ccb-input {
            width: 610px;
            height: 40px !important;
        }
    }
</style>



