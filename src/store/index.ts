import Vue from 'vue';
import Vuex from 'vuex';

const CONFIG_STORAGE_KEY = 'toggl-jira-importer.config';

Vue.use(Vuex);

const initialState = {
  togglApiKey: '',
  jiraBaseUrl: ''
};

const configModule = {
  state: initialState,

  getters: {
    isConfigComplete (state: any) {
      return !!(state.togglApiKey &&
        state.jiraBaseUrl);
    }
  },

  mutations: {
    togglApiKey (state: any, payload: any) {
      state.togglApiKey = payload.togglApiKey;
      persistConfig(state);
    },
    jiraBaseUrl (state: any, payload: any) {
      state.jiraBaseUrl = payload.jiraBaseUrl;
      persistConfig(state);
    }
  },

  actions: {
    restoreConfig ({ commit }: any) {
      restoreConfig(commit);
    }
  }
};

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    configuration: configModule
  }
});

function persistConfig (configState: any) {
  const configJson = JSON.stringify(configState);
  localStorage.setItem(CONFIG_STORAGE_KEY, configJson);
}

function restoreConfig (commit: any) {
  let persistedConfigJson = localStorage.getItem(CONFIG_STORAGE_KEY);
  if (persistedConfigJson) {
    console.log('restoring config from local storage...');
    const persistedConfig = JSON.parse(persistedConfigJson);
    for (const propertyName of Object.keys(initialState)) {
      restoreConfigField(persistedConfig, commit, propertyName);
    }
  }
}

function restoreConfigField (persistedConfig: any, commit: any, fieldName: string) {
  const value = persistedConfig[fieldName];
  if (value) {
    console.log(`restoring config field '${fieldName}' to value: '${value}'`);
    commit(fieldName, { [fieldName]: value });
  }
}
