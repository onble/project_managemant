import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        activeIndex: "/Home",
    },
    mutations: {
        SET_ACTIVE_INDEX(state, value) {
            state.activeIndex = value;
        },
    },
    actions: {
        setActiveIndex({ commit }, value) {
            commit("SET_ACTIVE_INDEX", value);
        },
    },
});
