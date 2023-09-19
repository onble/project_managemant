<template>
    <div>
        <el-row id="topBar">
            <el-button type="primary" @click="writeDaily">填写日报</el-button
            ><el-button type="primary" @click="reload">刷新</el-button>
        </el-row>
        <div class="block">
            <el-table
            v-loading="loading"
            :data="tableData"
            style="width: 100%"
            border
            row-key="serial"
        >
            <el-table-column label="序号" min-width="30" align="center">
                <template slot-scope="scope"> {{ scope.$index + 1 }} </template>
            </el-table-column>
            <el-table-column
                prop="departmentName"
                label="部门"
                min-width="60"
                align="center"
                v-slot:default="scope"
            >
                <span>{{ scope.row.departmentName }}</span>
            </el-table-column>
            <el-table-column
                prop="employeeName"
                label="员工姓名"
                min-width="120"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="reportDateStr"
                label="日报时间"
                min-width="50"
                align="center"
                v-slot:default="scope"
            >
                <span>{{ scope.row.reportDateStr }}</span>
            </el-table-column>
            <el-table-column
                prop="regularTime"
                label="正常工时"
                min-width="40"
                align="center"
                v-slot:default="scope"
            >
                <span>{{ scope.row.regularTime }}</span>
            </el-table-column>
            <el-table-column
                prop="overtime"
                label="加班工时"
                min-width="40"
                align="center"
                v-slot:default="scope"
            >
                <span>{{ scope.row.overtime }}</span>
            </el-table-column>
            <el-table-column
                prop="placeName"
                label="作业地点"
                min-width="80"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="projectName"
                label="项目"
                min-width="120"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="reality"
                label="今日内容"
                min-width="120"
                align="center"
            >
            </el-table-column>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="primary" @click="openEditForm(scope.row)"
                        >编辑</el-button
                    >
                </template></el-table-column
            >
        </el-table>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-sizes="[5, 10, 20, 50]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalInfo"
            align="right"
        >
        </el-pagination>
        </div>

        <DailyDialog title="填写日报" :DailyFormVisible="DailyFormVisible" @update:DailyFormVisible="DailyFormVisible = $event" :DailyData="DailyData" @save="handleSaveOnCreate"></DailyDialog>
        <DailyDialog title="编辑日报" :DailyFormVisible="ChangeDailyFormVisible" @update:DailyFormVisible="ChangeDailyFormVisible = $event" :DailyData="DailyData" @save="handleSaveOnUpdate"></DailyDialog>
    </div>
</template>

<script>
import DailyDialog from "../components/DailyDialog.vue";

export default {
    components: {
        DailyDialog,
    },
    data() {
        return {
            loading: false,
            tableData: [],
            pageSize: 5,
            totalInfo: 0,
            currentPage: 1, // 页码
            DailyFormVisible: false,
            ChangeDailyFormVisible: false,
            DailyData: {},
        };
    },
    created() {
        // 当组件创建后，立即获取数据
        this.fetchProjects();
    },
    methods: {
        handleSizeChange(pageSize) {
            // 一页数据大小改变
            this.pageSize = pageSize;
            this.currentPage = 1;
            this.fetchProjects(0, pageSize);
        },
        handleCurrentChange(new_page) {
            // 具体页数改变
            this.currentPage = new_page;
            this.fetchProjects(new_page);
        },
        fetchProjects(pageNum = 1, pageSize = 5, employeeId = "") {
            if (pageSize == 5) {
                pageSize = this.pageSize;
            }
            if (pageNum == 1) {
                pageNum = this.currentPage;
            }
            const apiUrl =
                "http://121.40.126.131:80/luoshi-pms/api/pms/daily/report/tasks/dailyReportSelect";

            this.loading = true;
            this.$axios
                .post(apiUrl, {
                    employeeId: employeeId,
                    pageNum: pageNum,
                    pageSize: pageSize,
                })
                .then((response) => {
                    if (response.data.body) {
                        this.totalInfo = response.data.body.total || 0;
                        this.tableData = response.data.body.content || [];
                    }
                })
                .catch((error) => {
                    console.error("Error fetching projects:", error);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        openEditForm(row) {
            this.DailyData = row;
            this.ChangeDailyFormVisible = true;
        },
        writeDaily() {
            this.DailyData = {};
            this.DailyFormVisible = true;
        },
        handleSaveOnCreate(inputData, callback) {
            // 检查 inputData.reporterDate 是否存在和有效
            let formattedDate = "";
            if (inputData.reportDate && inputData.reportDate instanceof Date) {
                formattedDate = this.formatDate(inputData.reportDate);
            } else {
                console.warn(
                    "reporterDate is not a valid Date object:",
                    inputData.reporterDate
                );
                // 可能还需要采取其他的错误处理策略
            }

            // 构建请求的数据
            const requestData = {
                employeeId: "1703757328743800833", // TODO:这里写死了是我的，接下来要修改
                status: 0,
                projectId: inputData.projectId,
                reportDateStr: formattedDate,
                place: inputData.place,
                reality: inputData.reality,
                regularTime: inputData.regularTime,
                overtime: inputData.overtime,
                tomorrowPlan: inputData.tomorrowPlan,
                taskTimePlan: inputData.taskTimePlan,
            };

            this.$axios
                .post(
                    "http://121.40.126.131:80/luoshi-pms/api/pms/daily/report/tasks/addDailyReport",
                    requestData
                )
                .then((response) => {
                    if (
                        response.data.body &&
                        response.data.header &&
                        response.data.header.message === "成功"
                    ) {
                        this.$message.success("日报信息保存成功！");
                        // 清空缓存的数据
                        this.form = {
                            serial: "",
                            name: "",
                            principal: "",
                            planStart: new Date(),
                            planEnd: new Date(),
                            trueStart: new Date(),
                            // planStart: null,
                            // planEnd: null,
                            // trueStart: null,
                            trueEnd: "",
                        };
                        this.DailyFormVisible = false;
                        this.reload();
                        if (callback && typeof callback === "function") {
                            callback();
                        }
                    } else {
                        this.$message.error("日报信息保存失败，请稍后重试。");
                    }
                })
                .catch((error) => {
                    console.error("Error while saving project info:", error);
                    this.$message.error("日报信息保存失败，请检查网络连接。");
                });
        },
        handleSaveOnUpdate(inputData, callback) {
            console.log("inputData", inputData);
            // 检查 inputData.reporterDate 是否存在和有效
            let formattedDate = "";
            if (inputData.reportDate && inputData.reportDate instanceof Date) {
                formattedDate = this.formatDate(inputData.reportDate);
            } else {
                console.warn(
                    "reporterDate is not a valid Date object:",
                    inputData.reporterDate
                );
                // 可能还需要采取其他的错误处理策略
            }

            // 构建请求的数据
            const requestData = {
                id: inputData.id,
                employeeId: "1703757328743800833", // TODO:这里写死了是我的，接下来要修改
                status: 0,
                projectId: inputData.projectId,
                reportDateStr: formattedDate,
                place: inputData.place,
                reality: inputData.reality,
                regularTime: inputData.regularTime,
                overtime: inputData.overtime,
                tomorrowPlan: inputData.tomorrowPlan,
                taskTimePlan: inputData.taskTimePlan,
            };

            this.$axios
                .post(
                    "http://121.40.126.131:80/luoshi-pms/api/pms/daily/report/tasks/addDailyReport",
                    requestData
                )
                .then((response) => {
                    if (
                        response.data.body &&
                        response.data.header &&
                        response.data.header.message === "成功"
                    ) {
                        this.$message.success("日报信息修改成功！");
                        // 清空缓存的数据

                        this.ChangeDailyFormVisible = false;
                        this.reload();
                        if (callback && typeof callback === "function") {
                            callback();
                        }
                    } else {
                        this.$message.error("日报信息修改失败，请稍后重试。");
                    }
                })
                .catch((error) => {
                    console.error("Error while saving project info:", error);
                    this.$message.error("日报信息修改失败，请检查网络连接。");
                });
        },
        formatDate(dateObj) {
            let year = dateObj.getFullYear();
            let month = (dateObj.getMonth() + 1).toString().padStart(2, "0"); // padStart 保证了月份是两位数
            let day = dateObj.getDate().toString().padStart(2, "0"); // 同样，padStart 保证了日期是两位数
            return `${year}-${month}-${day}`;
        },
        reload() {
            this.fetchProjects();
        },
    },
};
</script>

<style scoped>
#topBar {
    margin: 10px 0;
}
</style>