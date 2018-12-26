<template>
    <div class="container">
        <Head></Head>
        <router-view></router-view>
    </div>
</template>

<script>
import Head from "@/components/templetes/commons/head/Head2";
export default {
    components: {Head},
}
</script>

<style lang="scss" scoped>
    .container {
        width: 100%;
        height: 100%;
    }
</style>
