<template>
    <div class="container">
        <p>项目信息</p>
        <ul v-if="infoList[0]">
            <li class="list-item" v-for="(item, index) in infoList" :key="index" @click="toProjectInfo(item.appId)">
                <img :src="`/getFile?filePath=${item.appLogoSrc}`">
                <span class="list-pro-name">{{ item.appNm }}</span>
                <span :title="item.appBrf" class="list-pro-brf">{{ item.appBrf }}</span>
            </li>
        </ul>
        <ul v-else>
            <li class="no-pro">
                <span>暂无项目信息</span>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    name: 'projectInfo',
    props: ['infoList'],
    methods: {
        toProjectInfo(appId) {
            this.$router.push({path: '/ProjectManage/detail', query: {id:appId}})
        }
    }
}
</script>
<style lang="scss" scoped>
.container {
    width: 100%;
    font-weight: 500;
    font-style: normal;
    color: #000000;
    padding-left: 40px;
    p {
        font-size: 20px;
        font-family: MicrosoftYaHei-Bold;
        color: #333333;
        margin-bottom: 20px;
    }
    ul {
        width: 100%;
        li {
            display: inline-block;
            width: 33.33%;
            height: 284px;
            overflow: hidden;
            padding: 0 20px;
            font-size: 0;
            margin-bottom: 20px;
            box-sizing: border-box;
            img {
                width: 100%;
                height: 186px;
                margin-bottom: 20px;
            }
            span {
                display: block;
                font-size: 14px;
                margin: 10px;
                color: #999;
            }
            .list-pro-name {
                text-align: center;
                font-weight: 600;
                color: #000000;
            }
            .list-pro-brf {
                text-indent: 2rem;
                overflow:hidden; 
                text-overflow:ellipsis;
                display:-webkit-box; 
                -webkit-box-orient:vertical;
                -webkit-line-clamp:2; 
            }
        }

        .list-item {
            cursor: pointer;
            &:hover {
                box-shadow: 0px 0px 10px #ccc;
                border-radius: 2px;
            }
        }
    }
    .no-pro {
        text-align: center;
        line-height: 50px;
        width: 100%;
        color: #333;
    }
}
</style>


