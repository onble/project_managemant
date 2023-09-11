<template>
    <div>
        <el-menu
            :default-active="activeIndex"
            class="el-menu-demo"
            mode="horizontal"
            @select="handleSelect"
        >
            <el-menu-item index="/Home" @click="$router.push('/Home')">
                首页
            </el-menu-item>
            <el-menu-item
                index="/ProjectManage"
                @click="$router.push('/ProjectManage')"
            >
                处理中心
            </el-menu-item>
            <el-submenu index="2">
                <template slot="title">我的工作台</template>
                <el-menu-item
                    index="/AdminDailyReport"
                    @click="$router.push('/AdminDailyReport')"
                >
                    管理员查看日报
                </el-menu-item>
                <el-menu-item
                    index="/ProjectMemberDailyReport"
                    @click="$router.push('/ProjectMemberDailyReport')"
                >
                    项目人员日报
                </el-menu-item>
            </el-submenu>
        </el-menu>
        <div class="line"></div>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    created() {
        this.activeIndex = this.$route.path;
    },
    data() {
        return {
            activeIndex: "1",
            activeIndex2: "1",
        };
    },
    methods: {
        handleSelect(key, keyPath) {
            console.log(key, keyPath);
        },
    },
};
</script>

<style>
</style>