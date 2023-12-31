<template>
    <div class="block">
        <el-table
            v-loading="loading"
            :data="tableData"
            style="width: 100%"
            border
            @row-click="handleRowClick"
            row-key="serial"
        >
            <el-table-column label="序号" min-width="30" align="center">
                <template slot-scope="scope"> {{ scope.$index + 1 }} </template>
            </el-table-column>
            <el-table-column
                prop="name"
                label="项目名称"
                min-width="60"
                align="center"
                v-slot:default="scope"
            >
                <span>{{ truncateText(scope.row.name, 100) }}</span>
            </el-table-column>
            <el-table-column
                prop="principal"
                label="项目负责人"
                min-width="60"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="planStart"
                label="计划开始时间"
                width="120"
                align="center"
                v-slot:default="scope"
            >
                <span>{{ formatDate(scope.row.planStart) }}</span>
            </el-table-column>
            <el-table-column
                prop="planEnd"
                label="计划结束时间"
                width="120"
                align="center"
                v-slot:default="scope"
            >
                <span>{{ formatDate(scope.row.planEnd) }}</span>
            </el-table-column>
            <el-table-column
                prop="trueStart"
                label="实际开始时间"
                width="120"
                align="center"
                v-slot:default="scope"
            >
                <span>{{ formatDate(scope.row.trueStart) }}</span>
            </el-table-column>
            <el-table-column
                prop="trueEnd"
                label="实际结束时间"
                width="120"
                align="center"
                v-slot:default="scope"
            >
                <span>{{ formatDate(scope.row.trueEnd) }}</span>
            </el-table-column>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="primary" @click="openEditForm(scope.row)"
                        >编辑</el-button
                    >
                    <el-button type="primary" @click="openManageForm(scope.row)">添加人员</el-button>
                    <el-button
                        type="danger"
                        @click="deleteItem(scope.row)"
                        :disabled="shouldDisableDelete(scope.row.trueStart)"
                        >删除</el-button
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

        <el-dialog title="编辑项目" :visible.sync="ChangeFormVisible">
            <el-form :model="currentRow" :rules="rules" ref="ChangeForm">
                <el-form-item
                    label="项目名称"
                    :label-width="formLabelWidth"
                    prop="name"
                >
                    <el-input
                        v-model="currentRow.name"
                        autocomplete="off"
                        maxlength="100"
                        show-word-limit
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="项目负责人"
                    :label-width="formLabelWidth"
                    prop="principal"
                >
                    <el-select
                        v-model="currentRow.principal"
                        placeholder="项目负责人"
                        @change="handlePrincipalChange"
                        filterable
                        clearable
                    >
                        <el-option v-for="employee in employees" :key="employee.id" :label="employee.name" :value="employee.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="计划开始时间"
                    :label-width="formLabelWidth"
                    prop="planStart"
                >
                    <el-date-picker
                        v-model="currentRow.planStart"
                        type="date"
                        placeholder="选择日期"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item
                    label="计划结束时间"
                    :label-width="formLabelWidth"
                    prop="planEnd"
                >
                    <el-date-picker
                        v-model="currentRow.planEnd"
                        type="date"
                        placeholder="选择日期"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item
                    label="实际开始时间"
                    :label-width="formLabelWidth"
                >
                    <el-date-picker
                        v-model="currentRow.trueStart"
                        type="date"
                        placeholder="选择日期"
                    >
                    </el-date-picker>
                    <div style="color: red; line-height: initial">
                        *若填写则项目不可删除
                    </div>
                </el-form-item>
                <el-form-item
                    label="实际结束时间"
                    :label-width="formLabelWidth"
                >
                    <el-date-picker
                        v-model="currentRow.trueEnd"
                        type="date"
                        placeholder="选择日期"
                    >
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="ChangeFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateData">确 定</el-button>
            </div>
        </el-dialog>

        <ManageDialog :ManageFormVisible="ManageFormVisible" @update:ManageFormVisible="ManageFormVisible = $event" :currentProject="currentRow"></ManageDialog>
    </div>
</template>

<script>
import ManageDialog from "./ManageDialog.vue";
export default {
    components: { ManageDialog },
    props: {
        searchValue: {
            type: String,
            default: "",
        },
    },
    watch: {
        searchValue(newVal) {
            // 当 searchValue 改变时，执行 API 请求
            // console.log(
            //     "this.currentPage, this.pageSize, newVal",
            //     this.currentPage,
            //     this.pageSize,
            //     newVal
            // );
            this.currentPage = 0;
            this.fetchProjects(this.currentPage, this.pageSize, newVal);
        },
    },
    data() {
        return {
            currentPage: 1,
            pageSize: 5, // 页面大小
            loading: true,
            // tableData: [
            //     {
            //         serial: "1",
            //         name: "测试",
            //         principal: "张三",
            //         planStart: "2023-09-02",
            //         planEnd: "2023-09-02",
            //         trueStart: "2023-09-03",
            //         trueEnd: "2023-09-04",
            //     },
            //     {
            //         serial: "2",
            //         name: "测试1",
            //         principal: "张三",
            //         planStart: "2023-09-02",
            //         planEnd: "2023-09-02",
            //         trueStart: "2023-09-03",
            //         trueEnd: "2023-09-04",
            //     },
            //     {
            //         serial: "3",
            //         name: "前端vue",
            //         principal: "李昊波",
            //         planStart: "2023-09-02",
            //         planEnd: "2023-09-02",
            //         trueStart: "2023-11-03",
            //         trueEnd: "2023-11-04",
            //     },
            //     {
            //         serial: "4",
            //         name: "springboot",
            //         principal: "李昊波",
            //         planStart: "2023-09-02",
            //         planEnd: "2023-09-02",
            //         trueStart: "2023-11-13",
            //         trueEnd: "2023-11-14",
            //     },
            // ],
            tableData: [],
            employees: [], // 人员列表
            totalInfo: 0, // 总共的信息条数
            ChangeFormVisible: false,
            ManageFormVisible: false, // 项目管理的窗口是否显示
            currentRow: {
                serial: "",
                name: "",
                principal: "",
                planStart: "",
                planEnd: "",
                trueStart: "",
                trueEnd: "",
                principal_id: "",
            }, // 存储被选中用于编辑的行
            // form: {
            //     serial: "",
            //     name: "",
            //     principal: "",
            //     planStart: "",
            //     planEnd: "",
            //     trueStart: "",
            //     trueEnd: "",
            //     principal_id: "",
            // },
            formLabelWidth: "120px",
            rules: {
                name: [
                    {
                        required: true,
                        message: "请输入项目名称",
                        trigger: "blur",
                    },
                ],
                principal: [
                    {
                        required: true,
                    },
                ],
                planStart: [
                    {
                        type: "date",
                        required: true,
                        message: "请选择时间",
                        trigger: "change",
                    },
                ],
                planEnd: [
                    {
                        type: "date",
                        required: true,
                        message: "请选择时间",
                        trigger: "change",
                    },
                ],
            },
        };
    },
    created() {
        // 当组件创建后，立即获取数据
        this.fetchProjects();
    },
    mounted() {
        this.fetchEmployees();
    },
    methods: {
        deleteItem(row) {
            this.currentRow = row;

            this.$confirm(
                `此操作将永久删除《${this.currentRow.name}》, 是否继续?`,
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            )
                .then(() => {
                    // 执行删除操作，比如从 tableData 中删除一个元素
                    let index = -1;
                    for (let i = 0; i < this.tableData.length; i++) {
                        if (
                            String(this.tableData[i].serial) ===
                            String(this.currentRow.serial)
                        ) {
                            index = i;
                            break;
                        }
                    }

                    if (index !== -1) {
                        this.tableData.splice(index, 1);
                    }

                    this.$message({
                        type: "success",
                        message: `删除成功!`,
                    });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除",
                    });
                });
        },
        handleRowClick(row) {
            this.currentRow = { ...row }; // 深拷贝选中的行
        },
        openEditForm(row) {
            this.currentRow = { ...row }; // 深拷贝选中的行
            this.ChangeFormVisible = true;
        },
        openManageForm(row) {
            this.currentRow = { ...row }; // 深拷贝选中的行
            this.ManageFormVisible = true;
        },
        updateData() {
            // 使用 findIndex 来查找索引
            const index = this.tableData.findIndex(
                (item) => String(item.serial) === String(this.currentRow.serial)
            );

            if (index !== -1) {
                this.$refs.ChangeForm.validate((valid) => {
                    if (valid) {
                        // 构建请求的数据
                        const requestData = {
                            id: this.currentRow.serial,
                            name: this.currentRow.name,
                            employee_id: this.currentRow.principal_id,
                            plan_start_date: this.currentRow.planStart,
                            plan_end_date: this.currentRow.planEnd,
                            reality_start_date: this.currentRow.trueStart,
                            reality_end_date: this.currentRow.trueEnd,
                        };

                        this.$axios
                            .post(
                                "http://121.40.126.131:80/luoshi-pms/api/pms/project/editing/saveProjectInfo",
                                requestData
                            )
                            .then((response) => {
                                if (
                                    response.data.body &&
                                    response.data.header &&
                                    response.data.header.message === "成功"
                                ) {
                                    this.$message.success("项目信息编辑成功！");
                                    this.tableData.splice(
                                        index,
                                        1,
                                        this.currentRow
                                    );
                                    this.ChangeFormVisible = false;
                                } else {
                                    this.$message.error(
                                        "项目信息编辑失败，请稍后重试。"
                                    );
                                }
                            })
                            .catch((error) => {
                                console.error(
                                    "Error while saving project info:",
                                    error
                                );
                                this.$message.error(
                                    "项目信息编辑失败，请检查网络连接。"
                                );
                            });
                    } else {
                        this.$message.error(
                            "请确保已填写所有必填项并满足所有验证规则!"
                        );
                    }
                });
            } else {
                this.ChangeFormVisible = false;
            }
        },
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
        truncateText(text, maxLength) {
            if (text.length <= maxLength) {
                return text;
            }
            return text.substring(0, maxLength) + "...";
        },
        shouldDisableDelete(trueStartDate) {
            //console.log("trueStartDate", trueStartDate);
            return !(trueStartDate === null);
        },
        fetchProjects(pageNum = 1, pageSize = 5, name = "") {
            if (name == "") {
                name = this.searchValue;
            }
            if (pageSize == 5) {
                pageSize = this.pageSize;
            }
            if (pageNum == 1) {
                pageNum = this.pageNum;
            }
            const apiUrl =
                "http://121.40.126.131:80/luoshi-pms/api/pms//project/editing/queryProjectPage";

            this.loading = true;
            this.$axios
                .post(apiUrl, {
                    name: name,
                    pageNum: pageNum,
                    pageSize: pageSize,
                })
                .then((response) => {
                    // console.log(response.data);
                    // console.log(response.data.body.content);
                    //projects = response.data; // 假设 API 返回的数据是一个数组，你可能需要根据实际的数据结构进行调整
                    if (response.data.body) {
                        this.tableData = this.mapDataArray(
                            response.data.body.content
                        );
                        this.totalInfo = response.data.body.total || 0;
                    }
                })
                .catch((error) => {
                    console.error("Error fetching projects:", error);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        mapDataArray(apiDataArray) {
            return apiDataArray.map((apiData) => ({
                serial: apiData.id || "",
                name: apiData.name || "",
                principal: apiData.employeeName || "",
                planStart: apiData.planStartDate
                    ? new Date(apiData.planStartDate.split(" ")[0])
                    : null, // 取日期部分
                planEnd: apiData.planEndDate
                    ? new Date(apiData.planEndDate.split(" ")[0])
                    : null, // 取日期部分
                trueStart: apiData.realityStartDate
                    ? new Date(apiData.realityStartDate.split(" ")[0])
                    : null, // 取日期部分
                trueEnd: apiData.realityEndDate
                    ? new Date(apiData.realityEndDate.split(" ")[0])
                    : null, // 取日期部分
                principal_id: apiData.employeeId || "",
            }));
        },
        formatDate(date) {
            if (date) {
                let year = date.getFullYear();
                let month = (1 + date.getMonth()).toString().padStart(2, "0");
                let day = date.getDate().toString().padStart(2, "0");
                return year + "-" + month + "-" + day; // 这将返回 "YYYY-MM-DD" 格式
            }
            return "";
        },
        fetchEmployees() {
            // 请求人员列表
            this.$axios
                .post(
                    "http://121.40.126.131:80/luoshi-pms/api/pms/employee/info/selectEmployeeList",
                    {}
                )
                .then((response) => {
                    this.employees = response.data.body;
                })
                .catch((error) => {
                    console.error("Error fetching employees:", error);
                });
        },
        handlePrincipalChange(newPrincipalName) {
            // 监听项目负责人改变

            const selectedEmployee = this.employees.find(
                (employee) => employee.name === newPrincipalName
            );
            if (selectedEmployee) {
                this.currentRow.principal_id = selectedEmployee.id;
            }
        },
    },
};
</script>
<style scoped>
.margin10-0 {
    margin: 10px 0;
}
</style>