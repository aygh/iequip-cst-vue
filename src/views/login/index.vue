<template>
    <div style="width: 100%; height: 100%;">
        <login-header></login-header>
        <router-view/>
    </div>
</template>
<script>
import loginHeader from '@/components/templetes/commons/login/login-header'
export default {
    components: {
        loginHeader
    }
}
</script>
<style lang="sass" scoped>

</style>

