<template>
    <div class="container">
        <p>{{ title }}</p>
        <ul v-if="infoList[0].listInfo">
            <li v-for="(item, index) in infoList" :key="index">
                <span class="list-name">{{ item.listName }}</span>
                <span :style="{color: item.listInfo === '未实名认证' ? '#FF9F01' : '#666'}" class="list-info">{{
                    item.listInfo }}</span>
                <span @click="editInfo(item)" class="list-handle">{{ item.handle }}</span>

            </li>
        </ul>
        <ul v-else>
            <li class="no-rel">
                <span>暂无{{title}}</span>
            </li>
        </ul>
    </div>
</template>
<script>
    export default {
        name: 'userInfo',
        props: ['title', 'infoList', 'realNameShow'],
        data() {
            return {

            }
        },
        methods: {
            editInfo(info) {
                switch (info.listName) {
                    case '密码':
                        this.$router.push({
                            path: '/changePwd'
                        });
                        break
                    case '认证信息':
                        this.$router.push({
                            path: '/userCenter/realName'
                        });
                        break
                    case '注册手机号':
                        sessionStorage.setItem('user', JSON.stringify(info.listInfo));
                        this.$router.push({
                            path: '/changeAcctPhone',
                            query: {
                                type: 1
                            }
                        });
                        break
                    case '管理员手机号码':
                        this.$router.push({
                            path: '/changeAcctPhone',
                            query: {
                                type: 2
                            }
                        });
                        break
                    case '经办人手机号':
                        this.$router.push({
                            path: '/changeAcctPhone',
                            query: {
                                type: 3
                            }
                        });
                        break
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
        font-weight: 500;
        font-style: normal;
        color: #000000;
        box-sizing: border-box;
        padding-left: 40px;

        p {
            font-family: MicrosoftYaHei-Bold;
            font-size: 20px;
            color: #333333;
            letter-spacing: 0;
            margin-bottom: 20px;
        }

        ul {
            width: 100%;
        }

        li {
            position: relative;
            width: 100%;
            height: 50px;

            span {
                position: absolute;
                top: 0;
                left: 40px;
                font-size: 14px;
                color: #666;
            }

            .list-name {
                color: #333;
            }

            .list-info {
                left: 260px;
            }

            .list-handle {
                left: 480px;
                color: #3366FF;
                cursor: pointer;
            }
        }

        .no-rel {
            span {
                text-align: center;
                line-height: 50px;
                width: 100%;
                color: #999;
            }
        }
    }
</style>