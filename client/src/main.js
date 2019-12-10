import Vue from 'vue'
import App from './App.vue'
import axios from './http'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router'
import store from './store'
import moment from 'moment'
import VueSocketio from 'vue-socket.io';
// import socketio from 'socket.io-client';
Vue.use(new VueSocketio({

        debug: false,
  
        connection: 'http://10.1.6.14:3001/'
  
  //       vuex: {       // 不需要用到vuex这个可以不加
  
  //             store,
  
  //             actionPrefix: 'SOCKET_',
  
  //             mutationPrefix: 'SOCKET_'
  
  //       }
  
  }))
  



Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.prototype.$axios = axios;

Vue.prototype.$moment = moment;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
