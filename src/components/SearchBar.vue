<template>
    <div>
        <el-row :gutter="10">
            <el-col :span="4">
                <div class="grid-content">
                    <el-input v-model="input" placeholder="项目名称">
                    </el-input>
                </div>
            </el-col>
            <el-col :span="4">
                <div class="grid-content">
                    <el-button type="primary" @click="AddFormVisible = true"
                        >新增</el-button
                    >
                    <el-button type="primary">查询</el-button>
                </div>
            </el-col>
        </el-row>

        <el-dialog title="新增项目" :visible.sync="AddFormVisible">
            <el-form :model="form" :rules="rules">
                <el-form-item label="项目名称" :label-width="formLabelWidth">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="项目负责人" :label-width="formLabelWidth">
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
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item
                    label="实际开始时间"
                    :label-width="formLabelWidth"
                >
                    <el-date-picker
                        v-model="form.trueStart"
                        type="date"
                        placeholder="选择日期"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item
                    label="实际结束时间"
                    :label-width="formLabelWidth"
                >
                    <el-date-picker
                        v-model="form.trueEnd"
                        type="date"
                        placeholder="选择日期"
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
                planStart: "",
                planEnd: "",
                trueStart: "",
                trueEnd: "",
            },
            formLabelWidth: "120px",
            rules: {
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
};
</script>

<style>
.margin-left10 {
    margin-left: 10px;
}
</style>