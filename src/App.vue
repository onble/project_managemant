<template>
    <div>
        <ContentPage></ContentPage>
    </div>
</template>

<script>
import ContentPage from "./components/ContentPage.vue";
export default {
    name: "App",
    components: { ContentPage },
    mounted() {
        this.login_check();
    },
    methods: {
        login_check() {
            let loggedInEmployee = localStorage.getItem("loggedInEmployee");
            if (loggedInEmployee) {
                loggedInEmployee = JSON.parse(loggedInEmployee);
            } else {
                loggedInEmployee = null;
            }
            this.$store.commit("SET_LOGGED_IN_USER", loggedInEmployee);
        },
    },
};
</script>

<style>
</style>