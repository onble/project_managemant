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
                        <el-option label="张三" value="shanghai"></el-option>
                        <el-option label="李四" value="beijing"></el-option>
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
                <el-button type="primary" @click="AddFormVisible = false"
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