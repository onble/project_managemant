<template>
    <div class="block">
        <el-table
            :data="tableData"
            style="width: 100%"
            border
            @row-click="handleRowClick"
        >
            <el-table-column prop="serial" label="序号" width="60">
            </el-table-column>
            <el-table-column prop="name" label="项目名称" width="120">
            </el-table-column>
            <el-table-column prop="principal" label="项目负责人" width="120">
            </el-table-column>
            <el-table-column prop="planStart" label="计划开始时间" width="120">
            </el-table-column>
            <el-table-column prop="planEnd" label="计划结束时间" width="120">
            </el-table-column>
            <el-table-column prop="trueStart" label="实际开始时间" width="120">
            </el-table-column>
            <el-table-column prop="trueEnd" label="实际结束时间" width="120">
            </el-table-column>
            <el-table-column label="操作">
                <el-button type="primary" @click="openEditForm">编辑</el-button>

                <el-button type="primary">添加人员</el-button>
                <el-button type="danger" @click="deleteItem">删除</el-button>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5, 10, 20]"
            :page-size="100"
            layout="total, sizes, prev, pager, next, jumper"
            :total="2"
        >
        </el-pagination>

        <el-dialog title="编辑项目" :visible.sync="ChangeFormVisible">
            <el-form :model="currentRow" :rules="rules">
                <el-form-item label="项目名称" :label-width="formLabelWidth">
                    <el-input
                        v-model="currentRow.name"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="项目负责人" :label-width="formLabelWidth">
                    <el-select
                        v-model="currentRow.principal"
                        placeholder="项目负责人"
                    >
                        <el-option label="张三" value="张三"></el-option>
                        <el-option label="李四" value="李四"></el-option>
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
    </div>
</template>

<script>
function toLocalDateString(date) {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().split("T")[0];
}
export default {
    data() {
        return {
            currentPage: 0,
            tableData: [
                {
                    serial: "1",
                    name: "测试",
                    principal: "张三",
                    planStart: "2023-09-02",
                    planEnd: "2023-09-02",
                    trueStart: "2023-09-03",
                    trueEnd: "2023-09-04",
                },
                {
                    serial: "2",
                    name: "测试1",
                    principal: "张三",
                    planStart: "2023-09-02",
                    planEnd: "2023-09-02",
                    trueStart: "2023-09-03",
                    trueEnd: "2023-09-04",
                },
            ],
            ChangeFormVisible: false,
            currentRow: {
                serial: "",
                name: "",
                principal: "",
                planStart: "",
                planEnd: "",
                trueStart: "",
                trueEnd: "",
            }, // 存储被选中用于编辑的行
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
    methods: {
        deleteItem() {
            this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
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
                        message: "删除成功!",
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
        openEditForm() {
            this.ChangeFormVisible = true;
        },
        updateData() {
            // 先对 currentRow 进行深拷贝，以避免直接修改响应式数据
            const updatedRow = this.currentRow;

            // 将 Date 对象转换为字符串
            if (updatedRow.trueStart instanceof Date) {
                updatedRow.trueStart = toLocalDateString(updatedRow.trueStart);
            }
            if (updatedRow.trueEnd instanceof Date) {
                updatedRow.trueEnd = toLocalDateString(updatedRow.trueEnd);
            }
            if (updatedRow.planStart instanceof Date) {
                updatedRow.planStart = toLocalDateString(updatedRow.planStart);
            }
            if (updatedRow.planEnd instanceof Date) {
                updatedRow.planEnd = toLocalDateString(updatedRow.planEnd);
            }
            // 使用手动循环来查找索引
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
                this.tableData.splice(index, 1, this.currentRow);
            }
            this.ChangeFormVisible = false;
        },
        handleSizeChange() {},
        handleCurrentChange() {},
    },
};
</script>
<style>
</style>