<template>
    <div class="home-container">
        <!-- 数字卡片区 -->
        <el-row :gutter="20">
            <el-col :span="6">
                <el-card class="stat-card">
                    <div slot="header" class="stat-header">
                        <i class="el-icon-s-data"></i> 活跃项目数
                    </div>
                    <div class="stat-number">128</div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card class="stat-card">
                    <div slot="header" class="stat-header">
                        <i class="el-icon-tickets"></i> 待处理任务
                    </div>
                    <div class="stat-number">64</div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card class="stat-card">
                    <div slot="header" class="stat-header">
                        <i class="el-icon-check"></i> 已完成任务
                    </div>
                    <div class="stat-number">256</div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card class="stat-card">
                    <div slot="header" class="stat-header">
                        <i class="el-icon-user"></i> 团队成员
                    </div>
                    <div class="stat-number">32</div>
                </el-card>
            </el-col>
        </el-row>

        <!-- ECharts图表区 -->
        <el-row :gutter="20" style="margin-top: 20px">
            <!-- 图表1: 项目进度 -->
            <el-col :span="8">
                <div class="chart-box">
                    <div id="progress-chart" ref="progressChart"></div>
                </div>
            </el-col>

            <!-- 图表2: 任务状态分布 -->
            <el-col :span="8">
                <div class="chart-box">
                    <div id="task-status-chart" ref="taskStatusChart"></div>
                </div>
            </el-col>

            <!-- 图表3: 团队成员任务分配 -->
            <el-col :span="8">
                <div class="chart-box">
                    <div id="team-tasks-chart" ref="teamTasksChart"></div>
                </div>
            </el-col>
        </el-row>

        <!-- 图表4: 每月项目启动数 -->
        <el-row :gutter="20" style="margin-top: 20px">
            <el-col :span="12">
                <div class="chart-box">
                    <div
                        id="monthly-projects-chart"
                        ref="monthlyProjectsChart"
                    ></div>
                </div>
            </el-col>

            <!-- 图表5: 团队成员活动统计 -->
            <el-col :span="12">
                <div class="chart-box">
                    <div id="team-activity-chart" ref="teamActivityChart"></div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import * as echarts from "echarts";

export default {
    name: "HomeView",
    data() {
        return {
            // Placeholder data for the charts
            progressData: {
                legendData: ["完成", "进行中", "未开始"],
                seriesData: [
                    { value: 320, name: "完成" },
                    { value: 240, name: "进行中" },
                    { value: 150, name: "未开始" },
                ],
            },
            taskStatusData: {
                legendData: ["未开始", "进行中", "已完成", "已挂起"],
                seriesData: [
                    { value: 335, name: "未开始" },
                    { value: 310, name: "进行中" },
                    { value: 234, name: "已完成" },
                    { value: 135, name: "已挂起" },
                ],
            },
            // ... Other chart data ...
        };
    },
    mounted() {
        this.createProgressChart();
        this.createTaskStatusChart();
        this.createradarChart();
        this.creapieChart();
        this.creabarChart();
        // ... Initialize other charts ...
    },
    methods: {
        createProgressChart() {
            const chart = echarts.init(this.$refs.progressChart);
            const options = {
                title: {
                    text: "项目进度",
                    left: "center",
                },
                tooltip: {
                    trigger: "item",
                },
                legend: {
                    orient: "vertical",
                    left: "left",
                    data: this.progressData.legendData,
                },
                series: [
                    {
                        name: "进度",
                        type: "pie",
                        radius: "50%",
                        data: this.progressData.seriesData,
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: "rgba(0, 0, 0, 0.5)",
                            },
                        },
                    },
                ],
            };
            chart.setOption(options);
        },
        createTaskStatusChart() {
            const chart = echarts.init(this.$refs.taskStatusChart);
            const options = {
                title: {
                    text: "任务状态分布",
                    left: "center",
                },
                tooltip: {
                    trigger: "item",
                },
                legend: {
                    orient: "vertical",
                    left: "left",
                    data: this.taskStatusData.legendData,
                },
                series: [
                    {
                        name: "状态",
                        type: "pie",
                        radius: "50%",
                        data: this.taskStatusData.seriesData,
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: "rgba(0, 0, 0, 0.5)",
                            },
                        },
                    },
                ],
            };
            chart.setOption(options);
        },
        // ... Other chart creation methods ...
        createradarChart() {
            const chart = echarts.init(this.$refs.teamActivityChart);
            const options = {
                title: {
                    text: "项目关键指标评估",
                },
                tooltip: {},
                radar: {
                    indicator: [
                        { name: "进度", max: 100 },
                        { name: "预算", max: 100 },
                        { name: "团队合作", max: 100 },
                        { name: "风险", max: 100 },
                        { name: "满意度", max: 100 },
                    ],
                },
                series: [
                    {
                        name: "项目评估",
                        type: "radar",
                        data: [
                            {
                                value: [90, 80, 70, 60, 50],
                                name: "项目A",
                            },
                            {
                                value: [70, 90, 60, 85, 80],
                                name: "项目B",
                            },
                        ],
                    },
                ],
            };
            chart.setOption(options);
        },
        creapieChart() {
            const chart = echarts.init(this.$refs.monthlyProjectsChart);
            const options = {
                // 折线图 - 每月项目启动数

                title: {
                    text: "每月项目启动数",
                },
                tooltip: {
                    trigger: "axis",
                },
                legend: {
                    data: ["项目启动数"],
                    textStyle: {
                        color: "#42A5F5",
                    },
                },
                grid: {
                    left: "3%",
                    right: "4%",
                    bottom: "3%",
                    containLabel: true,
                },
                xAxis: {
                    type: "category",
                    boundaryGap: false,
                    data: ["1月", "2月", "3月", "4月", "5月", "6月", "7月"],
                    axisLabel: {
                        color: "#42A5F5",
                    },
                    axisLine: {
                        lineStyle: {
                            color: "#42A5F5",
                        },
                    },
                },
                yAxis: {
                    type: "value",
                    axisLabel: {
                        color: "#42A5F5",
                    },
                    axisLine: {
                        lineStyle: {
                            color: "#42A5F5",
                        },
                    },
                },
                series: [
                    {
                        name: "项目启动数",
                        type: "line",
                        stack: "总量",
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(
                                0,
                                0,
                                0,
                                1,
                                [
                                    {
                                        offset: 0,
                                        color: "#42A5F5",
                                    },
                                    {
                                        offset: 1,
                                        color: "#ffffff",
                                    },
                                ]
                            ),
                        },
                        emphasis: {
                            focus: "series",
                        },
                        data: [120, 132, 101, 134, 90, 230, 210],
                        smooth: true,
                        itemStyle: {
                            color: "#42A5F5",
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowOffsetY: 10,
                            shadowColor: "rgba(66, 165, 245, 0.7)",
                        },
                    },
                ],
            };
            chart.setOption(options);
        },
        creabarChart() {
            const chart = echarts.init(this.$refs.teamTasksChart);
            const options = {
                title: {
                    text: "项目任务完成情况",
                },
                tooltip: {},
                xAxis: {
                    data: ["项目A", "项目B", "项目C", "项目D"],
                },
                yAxis: {},
                series: [
                    {
                        name: "任务数量",
                        type: "bar",
                        data: [50, 200, 334, 390],
                    },
                ],
            };
            chart.setOption(options);
        },
    },
};
</script>


<style scoped>
.home-container {
    padding: 20px;
}

.stat-card {
    text-align: center;
}

.stat-header {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
}

.stat-header i {
    margin-right: 10px;
}

.stat-number {
    font-size: 24px;
    color: #333;
    margin-top: 20px;
}

.chart-box {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

#progress-chart,
#task-status-chart,
#team-tasks-chart,
#monthly-projects-chart,
#team-activity-chart {
    width: 100%;
    height: 300px;
}

/* 原始样式 */
.home-container {
    padding: 20px;
}

.stat-card {
    text-align: center;
    position: relative; /* 添加relative定位，以便在其中放置阴影/光晕效果 */
    overflow: hidden; /* 防止子元素超出容器边界 */
}

.stat-header {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
}

.stat-header i {
    margin-right: 10px;
}

.stat-number {
    font-size: 24px;
    color: #fff; /* 修改为白色以适应新的背景颜色 */
    margin-top: 20px;
    z-index: 2; /* 确保数字始终在阴影之上 */
    position: relative;
}

/* 新增的样式 */
/* 修复的样式 */
.el-row > .el-col:nth-child(1) .stat-card {
    background-color: #f56c6c; /* 红色 */
    box-shadow: 0 4px 14px 0 rgba(245, 108, 108, 0.39);
}

.el-row > .el-col:nth-child(2) .stat-card {
    background-color: #e6a23c; /* 黄色 */
    box-shadow: 0 4px 14px 0 rgba(230, 162, 60, 0.39);
}

.el-row > .el-col:nth-child(3) .stat-card {
    background-color: #67c23a; /* 绿色 */
    box-shadow: 0 4px 14px 0 rgba(103, 194, 58, 0.39);
}

.el-row > .el-col:nth-child(4) .stat-card {
    background-color: #409eff; /* 蓝色 */
    box-shadow: 0 4px 14px 0 rgba(64, 158, 255, 0.39);
}

/* 添加一个阴影/光晕效果在每个卡片的底部 */
.stat-card::before {
    content: "";
    position: absolute;
    bottom: -30px;
    left: 50%;
    width: 60%;
    padding-bottom: 20%;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 100%;
    transform: translateX(-50%) scale(0.8);
    z-index: 1;
}
</style>
