<template>
    <div>
        <SearchBar></SearchBar>
        <ItemList></ItemList>
    </div>
</template>

<script>
import ItemList from "../components/ItemList.vue";
// import RouterBar from "../components/RouterBar.vue";
import SearchBar from "../components/SearchBar.vue";
export default {
    components: { ItemList, SearchBar },
};
</script>

<style>
</style>