<template>
    <div class="container my-upload-box">
        <div class="content">
            <ccb-form :model="formData" ref="form" class="form-wrap">
                <p class="title">证件上传</p>
                <ccb-form-item class="wrap" label="" :rules="rules.entCrdtSrc" field="entCrdtSrc">
                    <span class="my-label">企业证件上传：</span>
                    <div :class=" succShow.ent ? 'img-box' : 'img-box img-box-not-show'">
                        <div v-if="succShow.ent" class="img-back-box">
                            <img class="img-back" :src="imgBackUrl" alt="">
                            <p>企业证件</p>
                            <img v-show="imgUrlConfig.entCrdtSrc" class="showImg" :src="imgUrlConfig.entCrdtSrc" alt="">
                        </div>
                        <ccb-upload :url="url" :on-before-upload="file => beforeUpload(file, 'entShow')" :on-success="entCrdtSrcSucc" :on-error="err"
                            class="my-upload"></ccb-upload>
                    </div>
                </ccb-form-item>
                <ccb-form-item class="wrap" label="" :rules="rules.authenFrontSrc" field="authenFrontSrc">
                    <span class="my-label">经办人身份证正面照片上传：</span>
                    <div :class=" succShow.front ? 'img-box' : 'img-box img-box-not-show'">
                        <div v-if="succShow.front" class="img-back-box">
                            <img class="img-back" :src="imgBackUrl" alt="">
                            <p>身份证正面</p>
                            <img v-show="imgUrlConfig.authenFrontSrc" class="showImg" :src="imgUrlConfig.authenFrontSrc"
                                alt="">
                        </div>
                        <ccb-upload :url="url" :on-before-upload="file => beforeUpload(file, 'frontShow')" :on-success="authenFrontSrcSucc" :on-error="err" class="my-upload"></ccb-upload>
                    </div>
                </ccb-form-item>
                <ccb-form-item class="wrap " label="" :rules="rules.authenBackSrc" field="authenBackSrc">
                    <span class="my-label">经办人身份证反面照片上传：</span>
                    <div :class=" succShow.back ? 'img-box' : 'img-box img-box-not-show'">
                        <div v-if="succShow.back" class="img-back-box">
                            <img class="img-back" :src="imgBackUrl" alt="">
                            <p>身份证反面</p>
                            <img v-show="imgUrlConfig.authenBackSrc" class="showImg" :src="imgUrlConfig.authenBackSrc"
                                alt="">
                        </div>
                        <ccb-upload :url="url" :on-before-upload="file => beforeUpload(file, 'backShow')" :on-success="authenBackSrcSucc" :on-error="err" class="my-upload"></ccb-upload>
                    </div>
                </ccb-form-item>
                <ccb-form-item class="wrap" label="" :rules="rules.authenHandSrc" field="authenHandSrc">
                    <span class="my-label">经办人手持身份证照片上传：</span>
                    <div :class=" succShow.hand ? 'img-box' : 'img-box img-box-not-show'">
                        <div v-if="succShow.hand" class="img-back-box">
                            <img class="img-back" :src="imgBackUrl" alt="">
                            <p>手持身份证</p>
                            <img v-show="imgUrlConfig.authenHandSrc" class="showImg" :src="imgUrlConfig.authenHandSrc"
                                alt="">
                        </div>
                        <ccb-upload :url="url" :on-before-upload="file => beforeUpload(file, 'handShow')" :on-success="authenHandSrcSucc" :on-error="err" class="my-upload"></ccb-upload>
                    </div>
                </ccb-form-item>
                <button type="button" class="confirm-btn" @click="upload">确定</button>
            </ccb-form>
        </div>
        <!-- <button type="button " @click="download"> 下载</button> -->
    </div>
</template>
<script>
    import {
        realNameApi
    } from '@/api'
    import {
        mapState
    } from 'vuex'
    import {
        filePath
    } from '@/config'
import { setTimeout } from 'timers';
    export default {
        name: "credentialsUpload",
        data() {
            return {
                formData: {
                    entCrdtSrc: '',
                    authenFrontSrc: '',
                    authenBackSrc: '',
                    authenHandSrc: ''
                },
                rules: {
                    entCrdtSrc: [{
                        type: 'string',
                        required: true,
                        message: '企业证件照片不能为空'
                    }],
                    authenFrontSrc: [{
                        type: 'string',
                        required: true,
                        message: '身份证正面照片不能为空'
                    }],
                    authenBackSrc: [{
                        type: 'string',
                        required: true,
                        message: '身份证反面照片不能为空'
                    }],
                    authenHandSrc: [{
                        type: 'string',
                        required: true,
                        message: '手持身份证照片不能为空'
                    }],
                },
                url: `/upload?savePath=realnm/${sessionStorage.userId}/`,
                file: '',
                imgBackUrl: require('@/assets/images/userCenter/create.png'),
                imgUrlConfig: {
                    entCrdtSrc: '',
                    authenFrontSrc: '',
                    authenBackSrc: '',
                    authenHandSrc: '',
                },
                backText: '身份证反面照片不能为空',
                succShow: { //上传成功后才显示
                    ent: false,
                    front: false,
                    back: false,
                    hand: false
                }
            };
        },
        methods: {
            beforeUpload(file, type) {
                this.$refs['form'].clearValidate()
                if(!file.type.includes('image')) {
                    console.log(type);
                    this.$ccb.$alert({
                        styleType: "error",
                        title: "提示",
                        content: '请上传图片'
                    });
                    return false
                }
                return {
                    filename: 'file',
                    uploadData: {
                        fileName: new Date().getTime() + file.name
                    }
                }
            },
            entCrdtSrcSucc(file) {
                console.log(file);
                if (file.BK_STATUS === '00') {
                    this.imgUrlConfig.entCrdtSrc =
                        `/getFile?filePath=${filePath}${file.path.replace(/\\/g, '/')}`
                    this.formData.entCrdtSrc = file.path
                    setTimeout(() => {
                        this.succShow.ent = true
                    }, 0)
                }
            },

            authenFrontSrcSucc(file) {
                console.log(file);
                if (file.BK_STATUS === '00') {
                    this.imgUrlConfig.authenFrontSrc =
                        `/getFile?filePath=${filePath}${file.path.replace(/\\/g, '/')}`
                    this.formData.authenFrontSrc = file.path
                    setTimeout(() => {
                        this.succShow.front = true
                    }, 0)
                }
            },

            authenBackSrcSucc(file) {
                console.log(file);
                if (file.BK_STATUS === '00') {
                    this.imgUrlConfig.authenBackSrc =
                        `/getFile?filePath=${filePath}${file.path.replace(/\\/g, '/')}`
                    this.formData.authenBackSrc = file.path
                    setTimeout(() => {
                        this.succShow.back = true
                    }, 0)
                }
            },

            authenHandSrcSucc(file) {
                console.log(file);
                if (file.BK_STATUS === '00') {
                    this.imgUrlConfig.authenHandSrc =
                        `/getFile?filePath=${filePath}${file.path.replace(/\\/g, '/')}`
                    this.formData.authenHandSrc = file.path
                    setTimeout(() => {
                        this.succShow.hand = true
                    }, 0)
                }
            },

            err(err) {
                console.log(err);
                this.$ccb.$alert({
                    styleType: 'error',
                    title: '提示',
                    content: err
                })
            },

            //确定提交
            upload() {
                const self = this;
                this.$refs['form'].validateForm((valid) => {
                    if (!valid) return
                    let data = {};
                    Object.assign(data, this.realName);
                    Object.assign(data, this.formData);
                    this.$axios({
                        method: 'post',
                        url: realNameApi.realNmAudits,
                        data,
                        PBreq: 'com.ccb.cloud.protobuf.proto.iequip.AcctRlnm',
                    }).then(res => {
                        console.log(res);
                        if(res.headers.SYS_TX_STATUS != '00') {
                            return this.$ccb.$alert({
                                styleType: "error",
                                title: "error",
                                content: res.headers.SYS_RESP_DESC
                            });
                        }
                        this.$store.commit('changeRealNameShowPage', 2);
                    }).catch(err => {
                        console.log(err);
                        this.$ccb.$alert({
                            styleType: 'error',
                            title: '提示',
                            content: err
                        })
                    })
                })

            },

        },
        computed: {
            typeName() {
                return this.$store.state.realName.adtType === '2' ? '经办人' : '企业法定代表人'
            },
            ...mapState({
                realName: state => state.realName.realNameInfo
            })
        }
    };
</script>
<style lang="scss" scoped>
    .container {
        display: flex;
        justify-content: center;
        width: 100%;
        // height: 100%;
        background-color: #F8F8F8;

        .content {
            width: 80%;
            background-color: #fff;
            margin: 0 auto;
            padding-top: 80px;
        }

        .title {
            font-family: MicrosoftYaHei-Bold;
            font-size: 18px;
            color: #333333;
            text-align: center;
            line-height: 24px;
            margin-bottom: 50px;
        }

        .wrap {
            position: relative;
            width: 422px;
            margin: 0 auto 30px;

            .my-label {
                position: absolute;
                width: 190px;
                right: 330px;
                top: 0;
                text-align: right;
                color: #666666;
            }

            .img-box {
                position: relative;
                width: 200px;
                height: 180px;
                // border: 1px dashed #E6E6E6;
                // border-radius: 2px; 
                cursor: pointer;




            }

            .img-box-not-show {
                height: 40px;
            }

                            .img-back-box {
                    position: absolute;
                    left: 130px;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    border: 1px dashed #ccc;
                    border-radius: 5px;

                    .img-back {
                        display: block;
                        width: 100px;
                        height: 100px;
                        margin: 10px auto 0;
                    }

                    p {
                        color: #666666;
                        letter-spacing: 0;
                        text-align: center;
                    }

                    .showImg {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: 100%;
                    }

                    .back-show {
                        color: #f5222d;
                        position: absolute;
                        left: 0px;
                        bottom: -35px;
                    }
                }
        }

        .confirm-btn {
            width: 100%;
            height: 55px;
        }

        .my-upload {
            position: absolute;
            top: 0;
            left: 0;
        }
    }
</style>
<style lang="scss">
    .my-upload-box {
        .is-success {
            display: block !important;
        }
    }
    .my-upload {
        .ccb-upload-choose {
            width: 100%;
            height: 100%;

            .ccb-upload-filebutton {
                width: 100%;
                height: 100%;
            }
        }

        .ccb-upload-filelist {
            display: none;
        }
    }

    .img-box {
        .ccb-button-default {
            background-color: #fff;
            color: #333;
        }
    }

    .img-box-not-show {
        .ccb-button-default {
            background-color: #fff;
            color: #333;
        }
    }
</style>