<template>
    <div>
        <el-row id="topBar">
            
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
                    <el-button type="primary" @click="checkForm(scope.row)"
                        >查看</el-button
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

        <CheckDailyDialog title="查看日报" :DailyFormVisible="DailyFormVisible" @update:DailyFormVisible="DailyFormVisible = $event" :DailyData="DailyData" ></CheckDailyDialog>
    </div>
</template>

<script>
import CheckDailyDialog from "../components/CheckDailyDialog.vue";

export default {
    components: {
        CheckDailyDialog,
    },
    data() {
        return {
            loading: false,
            tableData: [],
            pageSize: 5,
            totalInfo: 0,
            currentPage: 1, // 页码
            DailyFormVisible: false,
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
        checkForm(row) {
            this.DailyData = row;
            this.DailyFormVisible = true;
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