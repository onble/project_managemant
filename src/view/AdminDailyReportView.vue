<template>
    <div>
        <div id="topBar">
            <el-form
                :model="SearchData"
                :rules="rules"
                ref="dailyForm"
            >
                <el-row>
                    <el-col :span="4">
                        <el-form-item label="员工姓名" prop="employeeId">
                            <el-select
                                placeholder="员工姓名"
                                v-model="SearchData.employeeId"
                                clearable
                            >
                                <el-option
                                    v-for="employee in Employees"
                                    :key="employee.id"
                                    :label="employee.name"
                                    :value="employee.id"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4" class="padding-left">
                        <el-form-item label="项目名称" prop="projectId">
                            <el-select
                                placeholder="项目名称"
                                v-model="SearchData.projectId"
                                clearable
                            >
                                <el-option
                                    v-for="project in Projects"
                                    :key="project.id"
                                    :label="project.name"
                                    :value="project.id"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" class="padding-left">
                        <el-form-item label="时间范围" prop="Time">
                            <el-date-picker
                                v-model="SearchData.Time"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4" class="padding-left">
                        <el-form-item label="工作地点" prop="place">
                            <el-select
                                placeholder="请选择"
                                v-model="SearchData.place"
                                clearable
                            >
                                <el-option
                                    v-for="place in Places"
                                    :key="place.dictKey"
                                    :label="place.dictValue"
                                    :value="place.dictKey"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row type="flex" justify="end">
                    <el-col :span="2">
                        <el-button type="primary" icon="el-icon-download" plain @click="importFile" >导入表格</el-button>
                        <input type="file" ref="fileInput" style="display: none" @change="handleFileChange" accept=".xlsx, .csv"/>
                    </el-col>
                    <el-col :span="2">
                        <el-button type="primary" icon="el-icon-upload2" plain @click="exportFile">导出表格</el-button>
                    </el-col>
                    <el-col :span="2">
                        <el-button type="primary" icon="el-icon-search" @click="searchInfo">查询</el-button>
                    </el-col>
                </el-row>

            </el-form>
        </div>
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
import * as XLSX from "xlsx";
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
            SearchData: {},
            rules: {},
            Employees: [],
            Projects: [],
            Places: [],
            selectData: {},
        };
    },
    created() {
        // 当组件创建后，立即获取数据
        this.fetchProjects();
    },
    mounted() {
        this.fetchEmployees();
        this.fetchProjectsAll();
        this.fetchPlaces();
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

            let data = this.selectData;
            // API URL
            const apiUrl =
                "http://121.40.126.131:80/luoshi-pms/api/pms/daily/report/tasks/dailyReportSelect";

            // 加工请求数据
            const requestData = {
                employeeId: data.employeeId || null, // 如果没有employeeId，设为null
                creatTime: data.startDate,
                endTime: data.endDate,
                projectId: data.projectId,
                place: data.place,
                pageNum: pageNum,
                pageSize: pageSize,
            };

            this.loading = true;
            this.$axios
                .post(apiUrl, requestData)
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
        importFile() {
            // 触发文件选择框的点击事件
            this.$refs.fileInput.click();
        },
        handleFileChange(event) {
            const file = event.target.files[0];
            if (file) {
                // 这里你可以处理文件，例如发送到服务器
                console.log("Selected file:", file.name);
            }
        },
        exportFile() {
            console.log("tableData", this.tableData);

            // 这里你可以生成一个 Blob，然后使用 URL.createObjectURL 创建一个临时的 URL
            // const blob = new Blob(["Sample data for download"], {
            //     type: "text/plain",
            // });
            // const url = window.URL.createObjectURL(blob);

            // // 使用临时 URL 创建一个 a 标签并触发下载
            // const a = document.createElement("a");
            // a.href = url;
            // a.download = "sample.txt"; // 设置下载的文件名
            // document.body.appendChild(a);
            // a.click();
            // document.body.removeChild(a);

            // window.URL.revokeObjectURL(url);

            // 示例数据
            const data = this.tableData;

            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

            // 导出文件
            XLSX.writeFile(wb, "sample.xlsx");
        },
        fetchEmployees() {
            // 请求人员列表

            this.$axios
                .post(
                    "http://121.40.126.131:80/luoshi-pms/api/pms/employee/info/selectEmployeeList",
                    {}
                )
                .then((response) => {
                    this.Employees = response.data.body;
                })
                .catch((error) => {
                    console.error("Error fetching employees:", error);
                });
        },
        fetchProjectsAll() {
            // 请求项目列表

            this.$axios
                .post(
                    "http://121.40.126.131:80/luoshi-pms/api/pms//project/editing/selectProjectList",
                    {}
                )
                .then((response) => {
                    this.Projects = response.data.body;
                })
                .catch((error) => {
                    console.error("Error fetching employees:", error);
                });
        },
        fetchPlaces() {
            // 请求地点列表

            this.$axios
                .post(
                    "http://121.40.126.131:80/luoshi-pms/api/pms//config/basedict/internalList",
                    { code: "dailyreportplace" }
                )
                .then((response) => {
                    this.Places = response.data.body;
                })
                .catch((error) => {
                    console.error("Error fetching employees:", error);
                });
        },
        searchInfo() {
            let data = this.processFormData(this.SearchData);
            console.log("data", data);
            // 管理页码
            this.currentPage = 1;
            this.selectData = data;
            this.sendSearchRequest();
        },
        processFormData(data) {
            // 这里是加工数据的示例，你可以根据需要更改
            const processedData = { ...data };

            // 如果有时间范围，则提取开始和结束日期
            if (data.Time && data.Time.length === 2) {
                processedData.startDate = data.Time[0];
                processedData.endDate = data.Time[1];
                delete processedData.Time; // 从数据中删除 Time

                let formattedDate = "";
                if (
                    processedData.startDate &&
                    processedData.startDate instanceof Date
                ) {
                    formattedDate = this.formatDate(processedData.startDate);
                }
                processedData.startDate = formattedDate;
                if (
                    processedData.endDate &&
                    processedData.endDate instanceof Date
                ) {
                    formattedDate = this.formatDate(processedData.endDate);
                }
                processedData.endDate = formattedDate;
            }

            return processedData;
        },
        formatDate(dateObj) {
            let year = dateObj.getFullYear();
            let month = (dateObj.getMonth() + 1).toString().padStart(2, "0"); // padStart 保证了月份是两位数
            let day = dateObj.getDate().toString().padStart(2, "0"); // 同样，padStart 保证了日期是两位数
            return `${year}-${month}-${day}`;
        },
        sendSearchRequest() {
            let data = this.selectData;
            // API URL
            const apiUrl =
                "http://121.40.126.131:80/luoshi-pms/api/pms/daily/report/tasks/dailyReportSelect";

            // 加工请求数据
            const requestData = {
                employeeId: data.employeeId || null, // 如果没有employeeId，设为null
                creatTime: data.startDate,
                endTime: data.endDate,
                projectId: data.projectId,
                place: data.place,
                pageNum: this.currentPage, // 使用组件的currentPage数据或默认值
                pageSize: this.pageSize, // 使用组件的pageSize数据或默认值
            };
            this.loading = true;

            // 发送请求
            this.$axios
                .post(apiUrl, requestData)
                .then((response) => {
                    // 处理响应数据
                    if (response.data.body) {
                        this.totalInfo = response.data.body.total || 0;
                        this.tableData = response.data.body.content || [];
                        this.$message.success("查询成功！");
                        this.loading = false;
                    }
                })
                .catch((error) => {
                    this.$message.error("查询失败，请稍后重试。");
                });
        },
    },
};
</script>

<style scoped>
#topBar {
    margin: 10px 0;
}
</style>