<template>
    <el-dialog
        :title="title"
        :visible.sync="localDailyFormVisible"
        width="60%"
        @close="clearSelect"
    >
        <div class="block"></div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="localManageFormVisible = false">取 消</el-button>
            <el-button @click="localManageFormVisible = false" type="primary"
                >确 定</el-button
            >
        </div>
    </el-dialog>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: "标题",
        },
        DailyFormVisible: {
            type: Boolean,
            default: null,
        },
    },
    watch: {
        DailyFormVisible(newVal) {
            this.localDailyFormVisible = newVal;
        },
        localDailyFormVisible(newVal, oldVal) {
            if (newVal === true) {
            } else {
            }
            if (newVal !== oldVal) {
                this.$emit("update:DailyFormVisible", newVal);
            }
        },
    },
    data() {
        return {
            localDailyFormVisible: false,
            DailyData: null, // 缓存数据表
        };
    },
    methods: {
        clearSelect() {},
    },
};
</script>

<style>
</style>