<template>
    <div id="root">
        <el-row :gutter="10">
            <el-col :span="4">
                <div class="grid-content">
                    <el-input v-model="input" placeholder="项目名称" clearable>
                    </el-input>
                </div>
            </el-col>
            <el-col :span="4">
                <div class="grid-content">
                    <el-button type="primary" @click="AddFormVisible = true"
                        >新增</el-button
                    >
                    <el-button type="primary" @click="onSearch">查询</el-button>
                </div>
            </el-col>
        </el-row>

        <el-dialog title="新增项目" :visible.sync="AddFormVisible">
            <el-form :model="form" :rules="rules">
                <el-form-item
                    label="项目名称"
                    :label-width="formLabelWidth"
                    prop="name"
                >
                    <el-input
                        v-model="form.name"
                        autocomplete="off"
                        prop="planStart"
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
                        v-model="form.principal"
                        placeholder="项目负责人"
                    >
                        <el-option
                            v-for="employee in employees"
                            :key="employee.id"
                            :label="employee.name"
                            :value="employee.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="计划开始时间"
                    :label-width="formLabelWidth"
                    prop="planStart"
                >
                    <el-date-picker
                        v-model="form.planStart"
                        type="date"
                        placeholder="选择日期"
                        :disabled-date="disablePlanStartDate"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item
                    label="计划结束时间"
                    :label-width="formLabelWidth"
                    prop="planEnd"
                >
                    <el-date-picker
                        v-model="form.planEnd"
                        type="date"
                        placeholder="选择日期"
                        :disabled-date="disablePlanEndDate"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item
                    label="实际开始时间"
                    :label-width="formLabelWidth"
                >
                    <el-tooltip
                        content="若填写则项目不可删除"
                        placement="top"
                        effect="dark"
                    >
                        <el-date-picker
                            v-model="form.trueStart"
                            type="date"
                            placeholder="选择日期"
                            :disabled-date="disableTrueStartDate"
                        >
                        </el-date-picker
                    ></el-tooltip>
                    <div style="color: red; line-height: initial">
                        *若填写则项目不可删除
                    </div>
                </el-form-item>
                <el-form-item
                    label="实际结束时间"
                    :label-width="formLabelWidth"
                >
                    <el-date-picker
                        v-model="form.trueEnd"
                        type="date"
                        placeholder="选择日期"
                        :disabled-date="disableTrueEndDate"
                    >
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="AddFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveProjectInfo"
                    >确 定</el-button
                >
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            input: "",
            AddFormVisible: false,
            form: {
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
            },
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
            employees: [], // 人员列表
        };
    },
    methods: {
        disablePlanStartDate(date) {
            if (this.form.planEnd) {
                return date.getTime() >= this.form.planEnd.getTime();
            }
            return false; // 如果没有选择结束日期，不禁用任何日期
        },
        disablePlanEndDate(date) {
            if (this.form.planStart) {
                return date.getTime() <= this.form.planStart.getTime();
            }
            return false; // 如果没有选择开始日期，不禁用任何日期
        },
        disableTrueStartDate(date) {
            if (this.form.trueEnd) {
                return date.getTime() >= this.form.trueEnd.getTime();
            }
            return false; // 如果没有选择结束日期，不禁用任何日期
        },
        disableTrueEndDate(date) {
            if (this.form.trueStart) {
                return date.getTime() <= this.form.trueStart.getTime();
            }
            return false; // 如果没有选择开始日期，不禁用任何日期
        },
        onSearch() {
            this.$emit("search", this.input);
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
        async saveProjectInfo() {
            // 发送填写好的表单

            // 构建请求的数据
            const requestData = {
                id: this.form.id, // 从 form 数据中获取
                name: this.form.name,
                employee_id: this.form.principal,
                plan_start_date: this.form.planStart,
                plan_end_date: this.form.planEnd,
                reality_start_date: this.form.trueStart,
                reality_end_date: this.form.trueEnd,
            };

            try {
                const response = await this.$axios.post(
                    "http://121.40.126.131:80/luoshi-pms/api/pms/project/editing/saveProjectInfo",
                    requestData
                );

                console.log("response", response);
                if (
                    response.data.body &&
                    response.data.header &&
                    response.data.header.message == "成功"
                ) {
                    // 处理成功的逻辑，例如显示一个通知或提示
                    this.$message.success("项目信息保存成功！");
                    this.AddFormVisible = false;
                } else {
                    // 处理失败的逻辑，例如显示一个错误消息
                    this.$message.error("项目信息保存失败，请稍后重试。");
                }
            } catch (error) {
                console.error("Error while saving project info:", error);
                this.$message.error("项目信息保存失败，请检查网络连接。");
            }
        },
    },
    mounted() {
        this.fetchEmployees();
    },
};
</script>

<style scoped>
.margin-left10 {
    margin-left: 10px;
}
#root {
    margin: 10px 0;
}
</style>