<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import jwt_decode from "jwt-decode";
export default {
  name: "app",
 
  created() {
    if (localStorage.eleToken) {
      const decode = jwt_decode(localStorage.eleToken);
      this.$store.dispatch("setIsAutnenticated", !this.isEmpty(decode));
      this.$store.dispatch("setUser", decode);
      //console.log(decode.name)
      // this.$socket.emit("conect", decode);
      // this.sockets.subscribe("onlineUsers", data => {
      // console.log(data);
      // });
    }
  },
  methods: {
    isEmpty(value) {
      return (
        value === undefined ||
        value === null ||
        (typeof value === "object" && Object.keys(value).length === 0) ||
        (typeof value === "string" && value.trim().length === 0)
      );
    }
  }
  // beforeDestroy(){
  //   this.$socket.emit("disconnect", "1111");
  // },
  // destroyed(){
  //   this.$socket.emit("disconnect", "1111");
  // }
};
</script>


<style>
html,
body,
#app {
  width: 100%;
  height: 100%;
}
</style>
