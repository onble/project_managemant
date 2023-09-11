<template>
    <div>
        <el-container>
            <el-header><SearchBar></SearchBar></el-header>
            <el-main><ItemList></ItemList></el-main>
        </el-container>
    </div>
</template>

<script>
import SearchBar from "./components/SearchBar.vue";
import ItemList from "./components/ItemList.vue";
export default {
    name: "App",
    components: { SearchBar, ItemList },
};
</script>

<style>
</style>