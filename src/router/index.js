//1.导入vue和router包
import Vue from "vue";
import VueRouter from "vue-router";

//导入需要的组件
import AdminDailyReportView from "../view/AdminDailyReportView";
import ProjectManageView from "../view/ProjectManageView";
import ProjectMemberDailyReportView from "../view/ProjectMemberDailyReportView";
import HomeView from "../view/HomeView";
import LoginView from "../view/LoginView";

//2.调用Vue.use()函数，把 VueRouter 安装为 Vue 的插件
Vue.use(VueRouter);

//3.创建路由的示例对象
const router = new VueRouter({
    routes: [
        //路由重定向
        // { path:'/',redirect:'/Home' },
        //在 routes 数组中，申明路由的匹配规则
        //path 表示要匹配的 hash 地址；component 表示要展示的路由组件
        { path: "/AdminDailyReport", component: AdminDailyReportView },
        { path: "/ProjectManage", component: ProjectManageView },
        {
            path: "/ProjectMemberDailyReport",
            component: ProjectMemberDailyReportView,
        },
        {
            path: "/Home",
            component: HomeView,
        },
        {
            path: "/Login",
            component: LoginView,
        },
    ],
});

//4.向外共享路由示例对象
export default router;
