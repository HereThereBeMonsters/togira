import Vue from 'vue';
import Vuex from 'vuex';
import configuration from '@/store/modules/config.state';
import togglEntries from '@/store/modules/toggl-entries.state';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    configuration,
    togglEntries: togglEntries
  }
});
