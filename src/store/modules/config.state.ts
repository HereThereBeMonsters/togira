const CONFIG_STORAGE_KEY = 'toggl-to-jira.config';

const initialState = {
  togglApiKey: '',
  togglImportedLabel: '',
  jiraTargetHost: '',
  jiraUsername: '',
  jiraPassword: ''
};

const configuration = {
  namespaced: true,
  state: initialState,

  getters: {},

  mutations: {
    togglApiKey (state: any, payload: any) {
      state.togglApiKey = payload.togglApiKey;
      persistConfig(state);
    },
    togglImportedLabel (state: any, payload: any) {
      state.togglImportedLabel = payload.togglImportedLabel;
      persistConfig(state);
    },
    jiraTargetHost (state: any, payload: any) {
      state.jiraTargetHost = payload.jiraTargetHost;
      persistConfig(state);
    },
    jiraUsername (state: any, payload: any) {
      state.jiraUsername = payload.jiraUsername;
      persistConfig(state);
    },
    jiraPassword (state: any, payload: any) {
      state.jiraPassword = payload.jiraPassword;
      persistConfig(state);
    }
  },

  actions: {
    restore ({ commit }: any) {
      restoreConfig(commit);
    }
  }
};

/**
 * Persist config state into local storage.
 * @param configState
 */
function persistConfig (configState: any) {
  const configJson = JSON.stringify(configState);
  localStorage.setItem(CONFIG_STORAGE_KEY, configJson);
}

/**
 * Restore config state from local storage.
 * @param commit
 */
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

/**
 * Extract single config field from object loaded from local storage.
 * @param persistedConfig The persisted config state read from local storage
 * @param commit
 * @param fieldName Name of the field to restore.
 */
function restoreConfigField (persistedConfig: any, commit: any, fieldName: string) {
  const value = persistedConfig[fieldName];
  if (value) {
    console.log(`Restoring config field '${fieldName}' to value: '${value}'`);
    commit(fieldName, { [fieldName]: value });
  }
}

export default configuration;
