<template>
    <div class="login-container">
        <div class="login-box" v-if="!loggedInEmployee">
            <h1 class="login-title">欢迎登录</h1>
            <el-form
                ref="loginForm"
                :model="loginForm"
                :rules="rules"
                label-position="top"
            >
                <el-form-item label="账户" prop="username">
                    <el-select
                        placeholder="登录账户"
                        v-model="loginForm.employeeId"
                        clearable
                        filterable
                        style="width: 100%"
                    >
                        <el-option
                            v-for="employee in Employees"
                            :key="employee.id"
                            :label="employee.name"
                            :value="employee.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="密钥" prop="password">
                    <el-input
                        type="password"
                        v-model="loginForm.password"
                        placeholder="身份证号或admin或123456"
                        show-password
                    ></el-input>
                </el-form-item>
                <el-button type="primary" class="login-btn" @click="handleLogin"
                    >Login</el-button
                >
            </el-form>
        </div>
        <!-- 退出页面 -->
        <div v-else>
            <h1 class="login-title">欢迎，{{ loggedInEmployee.name }}</h1>
            <p>您已成功登录。如需更改用户，请点击下方按钮退出登录。</p>
            <el-button type="danger" class="logout-btn" @click="handleLogout"
                >退出登录</el-button
            >
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            loginForm: {
                employeeId: "",
                password: "",
            },
            rules: {
                employeeId: [
                    {
                        required: true,
                        message: "请选择登录账户",
                        trigger: "change",
                    },
                ],
                password: [
                    {
                        required: true,
                        message: "请输入密钥",
                        trigger: "blur",
                    },
                ],
            },
            Employees: [],
        };
    },
    computed: {
        loggedInEmployee() {
            const employeeData = localStorage.getItem("loggedInEmployee");
            return employeeData ? JSON.parse(employeeData) : null;
        },
    },
    methods: {
        handleLogin() {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    this.checkCredentials();
                } else {
                    console.log("Validation failed!");
                    return false;
                }
            });
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
        checkCredentials() {
            if (this.loginForm.password === "admin") {
                this.$message.success("欢迎管理员登录");
                localStorage.setItem(
                    "loggedInEmployee",
                    JSON.stringify({ employeeId: "", name: "管理员" })
                );
                this.$store.commit("SET_LOGGED_IN_USER", {
                    employeeId: "",
                    name: "管理员",
                });
                this.$store.dispatch("setActiveIndex", "/Home");
                this.$router.push("/Home");
                return;
            }
            // 使用 Array.find 方法找到匹配的 employee 对象
            const matchedEmployee = this.Employees.find(
                (employee) => employee.id === this.loginForm.employeeId
            );
            if (matchedEmployee) {
                if (
                    matchedEmployee.idCard === this.loginForm.password ||
                    this.loginForm.password === "123456"
                ) {
                    this.$message.success("Login successful!");
                    this.$store.commit("SET_LOGGED_IN_USER", matchedEmployee);
                    localStorage.setItem(
                        "loggedInEmployee",
                        JSON.stringify(matchedEmployee)
                    );
                    this.$store.dispatch("setActiveIndex", "/Home");
                    this.$router.push("/Home");
                } else {
                    this.$message.error("Incorrect password!");
                    // TODO: 提示用户密码错误
                }
            } else {
                this.$message.error("User not found!");
                // TODO: 提示用户用户不存在
            }
        },
        handleLogout() {
            localStorage.removeItem("loggedInEmployee");
            this.$store.commit("SET_LOGGED_IN_USER", null);
            if (this.$route.path === "/Login") {
                // 刷新当前路由
                this.$router.go(0);
            } else {
                this.$router.push("/Login");
            }
        },
    },
    mounted() {
        this.fetchEmployees();
    },
};
</script>

<style scoped>
.login-container {
    display: flex;
    height: 100vh;
    justify-content: center;
    align-items: center;
    background-color: #f6f6f6;
}

.login-box {
    width: 400px;
    padding: 40px;
    background-color: #fff;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
}

.login-title {
    text-align: center;
    margin-bottom: 30px;
    color: #333;
}

.login-btn {
    width: 100%;
}

.logout-btn {
    width: 100%;
    margin-top: 20px;
}
</style>
