<template>
    <div class="container">
        <succ :title="title" :tooltip="tooltip" :btnText="btnText" />
    </div>
</template>
<script>
import succ from '@/views/changeUserInfo/components/succ'
export default {
    name: 'realNameSucc',
    components: {succ},
    data() {
        return {
            title: '实名认证',
            tooltip: '恭喜您，实名认证申请成功！',
            btnText: '确定'
        }
    }
    
}
</script>
<style lang="scss" scoped>
.container {
    width: 100%;
    height: 100%;
}
</style>


