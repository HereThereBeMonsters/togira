import { ToggleApiClient } from '@/toggl-api/toggl-api-client';
import TimeEntry from '@/toggl-api/time-entry';
import calendar from '@/utils/calendar';

const initialState = {
  entries: null,
  loading: false,
  filters: Object.getOwnPropertyNames(calendar),
  selectedFilter: 'thisWeek'
};

const togglEntries = {
  namespaced: true,
  state: initialState,

  getters: {
    selectedEntries: (state: any) => {
      return state.entries.filter((entry: TimeEntry) => entry.selected);
    }
  },

  mutations: {
    entries (state: any, payload: any) {
      state.entries = payload.entries;
    },
    loading (state: any, payload: any) {
      state.loading = payload.loading;
    },
    selectedFilter (state: any, payload: any) {
      state.selectedFilter = payload.selectedFilter;
    }
  },

  actions: {
    // @ts-ignore
    loadEntries ({ state, rootState, dispatch, commit, getters, rootGetters }, payload) {
      commit('loading', { loading: true });

      // update selected filter if necessary
      if (payload && payload.selectedFilter) {
        commit('selectedFilter', { selectedFilter: payload.selectedFilter });
      }

      // @ts-ignore
      const dates: [Date, Date] = calendar[state.selectedFilter]();
      const config = rootState.configuration;
      const toggl = new ToggleApiClient(
        config.togglApiKey,
        rootGetters['configuration/togglImportedTagName']
      );
      toggl.getEntries(
        ...dates
      ).then(entries => {
        entries.sort((a, b) => (a.start > b.start) ? -1 : 1);
        commit('entries', { entries });
        commit('loading', { loading: false });
      });
    }
  }
};

export default togglEntries;
