import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    form2: localStorage.getItem("form"),
  },
  mutations: {
    setForm2(state, form2) {
      state.form2 = form2;
      localStorage.setItem("form", form2);
    },
  },
  actions: {},
  modules: {},
});
