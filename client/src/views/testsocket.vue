<template>
  <div>
    <el-button type="success" @click="socketClick()">成功按钮</el-button>
    {{this.$store.state.onLineuser}}
  </div>
</template>
<script>
export default {
  data() {
    return {
      msg: "111"
    };
  },
  methods: {
    socketClick() {
    //   this.$socket.emit("wzsttt", "我是发送过来的魏子森");
    //   this.sockets.subscribe("www", data => {
    //   console.log(data);
    // });
    }
  },
  mounted() {
    // this.$socket.emit("wzsttt", this.msg); //触发socket连接
    // this.sockets.subscribe("www", data => {
    //   console.log(data);
    // });
  }
};
</script>
<style scoped>
</style>