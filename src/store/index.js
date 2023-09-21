import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        activeIndex: "/Home",
        loggedInUser: null,
    },
    mutations: {
        SET_ACTIVE_INDEX(state, value) {
            state.activeIndex = value;
        },
        SET_LOGGED_IN_USER(state, user) {
            state.loggedInUser = user;
        },
    },
    actions: {
        setActiveIndex({ commit }, value) {
            commit("SET_ACTIVE_INDEX", value);
        },
    },
});
