<template>
    <el-dialog
        title="项目成员管理"
        :visible.sync="localManageFormVisible"
        width="60%"
        @close="clearSelect"
    >
        <div id="searchBar">
            <el-row :gutter="10">
                <el-col :span="6">
                    <div class="grid-content">
                        <el-select
                            placeholder="项目成员"
                            v-model="ManagePrincipal"
                            @change="handleManagePrincipalChange"
                            ref="selectComponent"
                            filterable
                            clearable
                        >
                            <el-option
                                v-for="employee in employeesNotInProject"
                                :key="employee.id"
                                :label="employee.name"
                                :value="employee.id"
                            ></el-option>
                        </el-select>
                    </div>
                </el-col>
                <el-col :span="4">
                    <div class="grid-content">
                        <el-button type="primary" @click="addNumber"
                            >添加成员</el-button
                        >
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="block">
            <el-table
                :data="ManageData"
                v-loading="loading"
                style="width: 100%"
                border
                @row-click="handleManageRowClick"
                row-key="serial"
            >
                <el-table-column label="序号" min-width="30" align="center">
                    <template slot-scope="scope">
                        {{ scope.$index + 1 }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="employeeName"
                    label="项目成员"
                    min-width="60"
                    align="center"
                    v-slot:default="scope"
                >
                    <span>{{ scope.row.employeeName }}</span>
                </el-table-column>
                <el-table-column
                    prop="status"
                    label="状态"
                    width="120"
                    align="center"
                >
                    <template slot-scope="scope">
                        {{ statusText(scope.row.status) }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button
                            :type="statusButtonStyle(scope.row.status)"
                            @click="changeStatus(scope.row)"
                            >{{ statusButtonText(scope.row.status) }}</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
        </div>
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
        ManageFormVisible: {
            type: Boolean,
            default: null,
        },
        currentProject: {
            type: Object,
        },
    },
    watch: {
        ManageFormVisible(newVal) {
            this.localManageFormVisible = newVal;
        },
        localManageFormVisible(newVal, oldVal) {
            if (newVal === true) {
                this.ManageData = [];
                this.employeesNotInProject = [];
                this.loading = true;
                this.fetchMembersNotInProject(this.currentProject.serial);
                this.fetchMembersInProject(this.currentProject.serial);
            } else {
                this.ManagePrincipa = "";
            }

            if (newVal !== oldVal) {
                this.$emit("update:ManageFormVisible", newVal);
            }
        },
    },
    data() {
        return {
            employeesNotInProject: [], // 不在项目中的人员列表
            ManageData: [],
            ManagePrincipal: "", // 项目人员管理的被添加人员
            ChooseManagePrincipal: null, // 存储被选中的待添加人员
            loading: true,
            localManageFormVisible: this.ManageFormVisible,
        };
    },
    methods: {
        handleManageRowClick() {},

        handleManagePrincipalChange(employeeId) {
            const selectedEmployee = this.employeesNotInProject.find(
                (employee) => employee.id == employeeId
            );
            if (selectedEmployee) {
                this.ChooseManagePrincipal = selectedEmployee;
            }
            this.ManagePrincipal = employeeId;
        },
        async fetchMembersNotInProject(projectId) {
            try {
                const response = await this.$axios.post(
                    "http://121.40.126.131:80/luoshi-pms/api/pms/project/personnel/projectMembertList",
                    {
                        projectId: projectId,
                    }
                );

                if (response && response.data) {
                    this.employeesNotInProject = response.data.body;
                    //console.log("response", response);
                    return response.data;
                }
            } catch (error) {
                console.error("Error fetching members not in project:", error);
                throw error; // 你可以选择抛出错误以进行进一步处理，或者返回一个默认值
            }
        },
        async fetchMembersInProject(projectId) {
            try {
                const response = await this.$axios.post(
                    "http://121.40.126.131:80/luoshi-pms/api/pms/project/personnel/selectProjectMember",
                    {
                        projectId: projectId,
                    }
                );

                if (response && response.data) {
                    this.ManageData = response.data.body.content;
                    this.loading = false;
                    return response.data;
                }
            } catch (error) {
                console.error("Error fetching members not in project:", error);
                throw error; // 你可以选择抛出错误以进行进一步处理，或者返回一个默认值
            }
        },
        statusText(status) {
            return status === 0 ? "正常" : status === 1 ? "离开" : "未知";
        },
        statusButtonStyle(status) {
            return status === 0 ? "danger" : status === 1 ? "primary" : "";
        },
        statusButtonText(status) {
            return status === 0 ? "离开项目" : status === 1 ? "回归项目" : "";
        },
        addNumber() {
            if (
                this.ManagePrincipal == null ||
                this.ChooseManagePrincipal == null
            ) {
                return;
            } else {
                // 下面在本地添加数据
                this.AddNumberPush();
            }
        },
        clearSelect() {
            this.ManagePrincipal = "";
            this.ChooseManagePrincipal = null;
            this.$nextTick(() => {
                if (
                    this.$refs.selectComponent &&
                    this.$refs.selectComponent.clearSelection
                ) {
                    this.$refs.selectComponent.clearSelection();
                }
            });
        },
        async AddNumberPush() {
            let addItem = {
                employeeId: this.ChooseManagePrincipal.id,
                employeeName: this.ChooseManagePrincipal.name,
                status: 0,
                projectId: this.currentProject.serial,
            };

            // 发送填写好的表单
            let requestData = {
                project_id: addItem.projectId,
                employee_id: addItem.employeeId,
            };

            try {
                const response = await this.$axios.post(
                    "http://121.40.126.131:80/luoshi-pms/api/pms/project/personnel/saveProjectMember",
                    requestData
                );
                if (
                    response.data.body &&
                    response.data.header &&
                    response.data.header.message == "成功"
                ) {
                    // 处理成功的逻辑，例如显示一个通知或提示
                    this.$message.success("成员添加成功！");

                    // 重新加载
                    this.reload();
                } else {
                    // 处理失败的逻辑，例如显示一个错误消息
                    this.$message.error("成员添加失败，请稍后重试。");
                }
            } catch (error) {
                console.error("Error while saving project info:", error);
                this.$message.error("成员添加失败，请检查网络连接。");
            }
        },
        async changeStatus(row) {
            console.log("row", row);
            // 发送填写好的表单
            let status = 0;
            if (row.status == 0) {
                status = 1;
            }
            let requestData = {
                id: row.id,
                status: status,
            };

            try {
                const response = await this.$axios.post(
                    "http://121.40.126.131:80/luoshi-pms/api/pms/project/personnel/updateProjectMember",
                    requestData
                );
                if (
                    response.data.body &&
                    response.data.header &&
                    response.data.header.message == "成功"
                ) {
                    // 处理成功的逻辑，例如显示一个通知或提示
                    this.$message.success("状态更改成功！");

                    // 重新加载
                    this.reload();
                } else {
                    // 处理失败的逻辑，例如显示一个错误消息
                    this.$message.error("状态更改失败，请稍后重试。");
                }
            } catch (error) {
                console.error("Error while saving project info:", error);
                this.$message.error("状态更改失败，请检查网络连接。");
            }
        },
        reload() {
            this.clearSelect();
            this.ManageData = [];
            this.employeesNotInProject = [];
            this.loading = true;
            this.fetchMembersNotInProject(this.currentProject.serial);
            this.fetchMembersInProject(this.currentProject.serial);
        },
    },
};
</script>
<style scoped>
#searchBar {
    margin-bottom: 10px;
}
</style>