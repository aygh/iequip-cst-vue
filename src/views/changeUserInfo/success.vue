<template>
    <div class="container">
        <succ :title="title" :tooltip="tooltip" :btnText="btnText"></succ>
    </div>
</template>

<script>
import succ from './components/succ'
export default {
    components: {succ},
    data() {
        return {
            title: '',
            tooltip: '',
            btnText: ''
        }
    },
    methods: {
        init() {
            const type = this.$route.query.type;
            switch(type) {
                case 'change': 
                    this.title = '修改密码';
                    this.tooltip = '恭喜您，密码修改成功！';
                    this.btnText = '确定';
                    break
                case 'reset': 
                    this.title = '重置密码';
                    this.tooltip = '恭喜您，重置密码成功！';
                    this.btnText = '确定';
                    break
                case 'phone':
                    this.title = '修改手机号';
                    this.tooltip = '恭喜您，修改手机号成功！';
                    this.btnText = '确定';
                    break
                case 'register':
                    this.title = '注册账号';
                    this.tooltip = '恭喜您，注册账号成功！';
                    this.btnText = '确定'
            }
        }
    },
    created() {
        this.init();
    }
}
</script>

<style lang="scss" scoped>
    .container {
        width: 100%;
        display: flex;
        justify-content: center;
    }
</style>
