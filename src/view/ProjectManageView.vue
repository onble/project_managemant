<template>
    <div>
        <SearchBar @search="handleSearch"></SearchBar>
        <ItemList :searchValue="searchValue"></ItemList>
    </div>
</template>

<script>
import ItemList from "../components/ItemList.vue";
// import RouterBar from "../components/RouterBar.vue";
import SearchBar from "../components/SearchBar.vue";
export default {
    components: { ItemList, SearchBar },
    data() {
        return {
            searchValue: "", // 模糊查询的项目名称
        };
    },
    methods: {
        handleSearch(value) {
            this.searchValue = value;
        },
    },
};
</script>

<style>
</style>