// 引入Vue
import Vue from "vue";
// 引入App
import App from "./App.vue";

import router from "./router/index.js"; // 引入路由

import axios from "axios";

// 完整引入
// 引入ElementUI组件库
import ElementUI from "element-ui";
// 引入ElementUI全部样式
import "element-ui/lib/theme-chalk/index.css";
import store from "./store/index";

// 按需引入
//import { Button, Row, DatePicker } from "element-ui";

Vue.prototype.$axios = axios;

// 关闭Vue的生产提示
Vue.config.productionTip = false;
// 应用ElementUI
Vue.use(ElementUI);

// Vue.component(Button.name, Button);
// Vue.component(Row.name, Row);
// Vue.component(DatePicker.name, DatePicker);

// 创建vm
new Vue({
    el: "#app",
    render: (h) => h(App),
    router: router, // 注册路由
    store, // 使用vuex
});
