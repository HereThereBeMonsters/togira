const CONFIG_STORAGE_KEY = 'toggl-to-jira.config';

const initialState = {
  togglApiKey: ''
};

const configuration = {
  namespaced: true,
  state: initialState,

  getters: {
    isComplete (state: any) {
      return !!(state.togglApiKey);
    }
  },

  mutations: {
    togglApiKey (state: any, payload: any) {
      state.togglApiKey = payload.togglApiKey;
      persistConfig(state);
    }
  },

  actions: {
    restore ({ commit }: any) {
      restoreConfig(commit);
    }
  }
};

function persistConfig (configState: any) {
  const configJson = JSON.stringify(configState);
  localStorage.setItem(CONFIG_STORAGE_KEY, configJson);
}

function restoreConfig (commit: any) {
  let persistedConfigJson = localStorage.getItem(CONFIG_STORAGE_KEY);
  if (persistedConfigJson) {
    console.log('Restoring config from local storage...');
    const persistedConfig = JSON.parse(persistedConfigJson);
    for (const propertyName of Object.keys(initialState)) {
      restoreConfigField(persistedConfig, commit, propertyName);
    }
  }
}

function restoreConfigField (persistedConfig: any, commit: any, fieldName: string) {
  const value = persistedConfig[fieldName];
  if (value) {
    console.log(`Restoring config field '${fieldName}' to value: '${value}'`);
    commit(fieldName, { [fieldName]: value });
  }
}

export default configuration;
