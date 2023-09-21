<template>
    <div>
        <el-menu
            :default-active="activeIndex"
            class="el-menu-demo"
            mode="horizontal"
            @select="handleSelect"
        >
            <el-menu-item index="/Home" @click="navigateTo('/Home')">
                首页
            </el-menu-item>
            <el-menu-item
                index="/ProjectManage"
                @click="navigateTo('/ProjectManage')"
            >
                项目管理
            </el-menu-item>
            <el-submenu index="2">
                <template slot="title">我的工作台</template>
                <el-menu-item
                    index="/AdminDailyReport"
                    @click="navigateTo('/AdminDailyReport')"
                >
                    管理员查看日报
                </el-menu-item>
                <el-menu-item
                    index="/ProjectMemberDailyReport"
                    @click="navigateTo('/ProjectMemberDailyReport')"
                >
                    项目人员日报
                </el-menu-item>
            </el-submenu>
            <el-menu-item index="/Login" @click="navigateTo('/Login')">
                登录
            </el-menu-item>
        </el-menu>
        <div class="line"></div>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    computed: {
        activeIndex: {
            get() {
                return this.$store.state.activeIndex;
            },
            set(value) {
                this.$store.dispatch("setActiveIndex", value);
            },
        },
    },
    data() {
        return {
            activeIndex2: "1",
        };
    },
    created() {
        if (this.$route.path == "/") {
            this.$router.push("/Home");
        }
        this.activeIndex = this.$route.path;
    },
    methods: {
        handleSelect(key, keyPath) {
            // console.log(key, keyPath);
        },
        navigateTo(route) {
            if (this.$route.path !== route) {
                this.$router.push(route);
            }
        },
    },
};
</script>

<style>
</style>