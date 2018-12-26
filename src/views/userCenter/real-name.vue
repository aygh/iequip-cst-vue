<template>
  <div class="container">
    <Head></Head>
    <realName-Auth v-if="isShow === 0"></realName-Auth>
    <credentials-upload v-else-if="isShow === 1"></credentials-upload>
    <real-name-succ v-else-if="isShow === 2"></real-name-succ>
  </div>
</template>
<script>
import Head from "@/components/templetes/commons/head/Head2";
import realNameAuth from "./components/realName/real-name-auth";
import credentialsUpload from "./components/realName/credentials-upload";
import realNameSucc from "./components/realName/real-name-succ";

export default {
  name: "realName",
  components: {
    Head,
    realNameAuth,
    credentialsUpload,
    realNameSucc
  },
  data() {
    return {};
  },
  methods: {},
  computed: {
    isShow() {
      return this.$store.state.realName.realNameShowPage;
    }
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit("changeRealNameShowPage", 0);
    next();
  }
};
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
}
</style>


