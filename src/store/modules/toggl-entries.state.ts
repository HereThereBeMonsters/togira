import { ToggleApiClient } from '@/toggl-api/toggl-api-client';
import JiraApiClient from '@/jira-api/jira-api-client';
import TimeEntry from '@/toggl-api/time-entry';
import { AxiosError, AxiosResponse } from 'axios';

const initialState = {
  entries: null,
  loading: false
};

const togglEntries = {
  namespaced: true,
  state: initialState,

  getters: {
    selectedEntries: (state: any) => {
      return state.entries.filter((entry:TimeEntry) => entry.selected);
    }
  },

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
      commit('loading', { loading: true });
      const config = rootState.configuration;
      const toggl = new ToggleApiClient(config.togglApiKey);
      toggl.getEntries().then(entries => {
        entries.sort((a, b) => (a.start > b.start) ? -1 : 1);
        commit('entries', { entries });
        commit('loading', { loading: false });
      });
    }

    /*
    // @ts-ignore
    importSelectedEntries ({ rootState, dispatch, commit, getters, rootGetters }) {
      const config = rootState.configuration;

      const jira = new JiraApiClient(config.jiraTargetHost, config.jiraUsername, config.jiraPassword);

      const selectedEntries = getters.selectedEntries;

      jira.addWorkLogs(selectedEntries);
    }
     */
  }
};

export default togglEntries;
