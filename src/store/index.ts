import Vue from 'vue';
import Vuex from 'vuex';
import configuration from '@/store/modules/config';
import togglEntries from '@/store/modules/toggl-entries';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    configuration,
    togglEntries
  }
});
