import { ToggleApiClient } from '@/toggl-api/toggl-api-client';

const initialState = {
  entries: [],
  loading: false
};

const togglEntries = {
  namespaced: true,
  state: initialState,

  getters: {},

  mutations: {
    entries (state: any, payload: any) {
      state.entries = payload.entries;
    },
    loading (state: any, payload: any) {
      state.loading = payload.loading;
    }
  },

  actions: {
    // @ts-ignore
    loadEntries ({ rootState, dispatch, commit, getters, rootGetters }) {
      const config = rootState.configuration;
      const toggl = new ToggleApiClient(config.togglApiKey);
      toggl.getEntries().then(entries => {
        commit('entries', { entries });
      });
    }
  }
};

export default togglEntries;
