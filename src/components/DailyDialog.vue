<template>
    <el-dialog
        :title="title"
        :visible.sync="localDailyFormVisible"
        width="60%"
        @close="clearSelect"
    >
        <div class="block">
            <el-form
                label-position="top"
                :model="localDailyData"
                :rules="rules"
                ref="dailyForm"
            >
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="日期" prop="reportDate">
                            <el-date-picker
                                type="date"
                                placeholder="请选择日期"
                                v-model="localDailyData.reportDate"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" class="padding-left">
                        <el-form-item label="项目名称" prop="projectId">
                            <el-select
                                placeholder="项目名称"
                                @change="handleDailyProjectNameChange"
                                ref="DailyProjectNameComponent"
                                v-model="localDailyData.projectId"
                                filterable
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
                        <el-form-item label="子项目" prop="subProject">
                            <el-input
                                prop="subProject"
                                placeholder="请输入子项目"
                                v-model="localDailyData.subProject"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" class="padding-left">
                        <el-form-item label="工作地点" prop="place">
                            <el-select
                                placeholder="请选择"
                                @change="handleDailyPlaceChange"
                                v-model="localDailyData.place"
                                filterable
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
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="今日内容" prop="reality">
                            <el-input
                                type="textarea"
                                :rows="2"
                                placeholder="请输入今日内容"
                                v-model="localDailyData.reality"
                                maxlength="100"
                            >
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" class="padding-left">
                        <el-form-item label="明日计划" prop="tomorrowPlan">
                            <el-input
                                type="textarea"
                                :rows="2"
                                placeholder="请输入明日计划"
                                v-model="localDailyData.tomorrowPlan"
                                maxlength="100"
                            >
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="计划工时/h" prop="taskTimePlan">
                            <el-input
                                type="number"
                                placeholder="请输入计划工时/h"
                                v-model="localDailyData.taskTimePlan"
                            >
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" class="padding-left">
                        <el-form-item label="正常工作工时/h" prop="regularTime">
                            <el-input
                                type="number"
                                placeholder="正常工作工时/h"
                                v-model="localDailyData.regularTime"
                            >
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" class="padding-left">
                        <el-form-item label="加班工作时长/h" prop="overtime">
                            <el-input
                                type="number"
                                placeholder="加班工作时长/h"
                                v-model="localDailyData.overtime"
                            >
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="localDailyFormVisible = false">取 消</el-button>
            <el-button @click="save" type="primary">保存</el-button>
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
            default: false,
        },
        DailyData: {
            type: Object,
        },
    },
    watch: {
        DailyFormVisible(newVal) {
            this.localDailyFormVisible = newVal;
        },
        localDailyFormVisible(newVal, oldVal) {
            if (newVal === true) {
                this.localDailyData = {
                    ...this.DailyData,
                    reportDate: (() => {
                        return this.DailyData.reportDateStr
                            ? new Date(this.DailyData.reportDateStr)
                            : null;
                    })(), // 使用一个立即执行的匿名函数来设置reportDate
                };
            } else {
            }
            if (newVal !== oldVal) {
                this.$emit("update:DailyFormVisible", newVal);
            }
        },

        // DailyData(newVal) {
        //     this.localDailyData = {
        //         ...this.DailyData,
        //         reportDate: (() => {
        //             return this.DailyData.reportDateStr
        //                 ? new Date(this.DailyData.reportDateStr)
        //                 : null;
        //         })(), // 使用一个立即执行的匿名函数来设置reportDate
        //     }; // 当DailyData变化时更新localDailyData
        // },
    },
    data() {
        return {
            localDailyFormVisible: false,
            localDailyData: {
                ...this.DailyData,
                reportDate: (() => {
                    return this.DailyData.reportDateStr
                        ? new Date(this.DailyData.reportDateStr)
                        : null;
                })(), // 使用一个立即执行的匿名函数来设置reportDate
            }, // 缓存数据表
            Projects: [],
            Places: [],
            rules: {
                reportDate: [
                    {
                        type: "date",
                        required: true,
                    },
                ],
                projectId: [
                    {
                        required: true,
                    },
                ],
                place: [
                    {
                        required: true,
                    },
                ],
                reality: [
                    {
                        required: true,
                    },
                ],
                tomorrowPlan: [
                    {
                        required: true,
                    },
                ],
                taskTimePlan: [
                    {
                        validator: (rule, value, callback) => {
                            if (value === "") {
                                callback(new Error("请输入计划工时"));
                            } else if (isNaN(Number(value))) {
                                callback(new Error("请输入一个数字"));
                            } else {
                                callback();
                            }
                        },
                        required: true,
                    },
                ],
                regularTime: [
                    {
                        validator: (rule, value, callback) => {
                            if (value === "") {
                                callback(new Error("请输入正常工作工时"));
                            } else if (isNaN(Number(value))) {
                                callback(new Error("请输入一个数字"));
                            } else {
                                callback();
                            }
                        },
                        required: true,
                    },
                ],
                overtime: [
                    {
                        validator: (rule, value, callback) => {
                            console.log();
                            if (value === "" || value == undefined) {
                                callback();
                            } else if (isNaN(Number(value))) {
                                callback(new Error("请输入一个数字"));
                            } else {
                                callback();
                            }
                        },
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    methods: {
        clearSelect() {},
        handleDailyProjectNameChange() {},
        handleDailyPlaceChange() {},
        fetchProjects() {
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
        save() {
            // 使用 validate 方法进行表单验证
            this.$refs.dailyForm.validate((valid) => {
                if (valid) {
                    console.log("this.Projects", this.Projects);
                    // 当所有验证规则都通过时，发出 save 事件
                    this.$emit(
                        "save",
                        {
                            ...this.localDailyData,
                            projectId: this.localDailyData.projectId,
                        },
                        () => {}
                    );
                } else {
                    // 当有至少一个验证规则不通过时，显示提示信息
                    this.$message.error(
                        "请确保已填写所有必填项并满足所有验证规则！"
                    );
                    return false;
                }
            });
        },
    },
    mounted() {
        this.fetchProjects();
        this.fetchPlaces();
    },
};
</script>

<style scoped>
.padding-left {
    padding-left: 20px;
}
.el-form-item /deep/ .el-form-item__label {
    padding-bottom: 0px !important; /* 调整为您喜欢的值 */
}
</style>
