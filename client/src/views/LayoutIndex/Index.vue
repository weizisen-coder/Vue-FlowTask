<template>
  <div class="index">
    <HeadNav></HeadNav>
    <LeftMenu></LeftMenu>
    <div class="rightContainer">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import HeadNav from "../../components/Layout/HeadNav";
import LeftMenu from "../../components/Layout/LeftMenu";

export default {
  name: "index",
  data(){
    return{
      userNmber: 0 //在线人数
    }
  },
  components: {
    HeadNav,
    LeftMenu
  },
  mounted() {
    // console.log("我是index.vue的生命周期");
    // this.$socket.emit("connect", 1);
    this.$socket.emit("users",this.$store.state.user.name)
  },
  sockets: {
    connect() {     
        console.log('连接成功')     
    },
    users(data) {
      // console.log(data);     
      this.$store.state.onLineuser = data;
    }
  }
};
</script>
<style scoped>
.index {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.rightContainer {
  position: relative;
  top: 0;
  left: 180px;
  width: calc(100% - 180px);
  height: calc(100% - 71px);
  overflow: auto;
}
</style>

