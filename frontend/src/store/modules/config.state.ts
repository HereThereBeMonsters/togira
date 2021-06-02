import { ToggleApiClient } from '@/toggl-api/toggl-api-client';

const CONFIG_STORAGE_KEY = 'toggl-to-jira.config';

const initialState = {
  togglApiKey: '',
  togglWorkspaces: [],
  togglWorkspaceId: '',
  togglTags: [],
  togglImportedTag: null,
  jiraTargetHost: '',
  jiraUsername: '',
  jiraPassword: ''
};

// @ts-ignore
const configuration = {
  namespaced: true,
  state: initialState,

  getters: {
    togglImportedTagName (state: any) {
      return state.togglImportedTag ? state.togglImportedTag.name : null;
    }
  },

  mutations: {
    togglApiKey (state: any, payload: any) {
      state.togglApiKey = payload.togglApiKey;
      persistConfig(state);
    },
    togglWorkspaces (state: any, payload: any) {
      state.togglWorkspaces = payload.togglWorkspaces;
      persistConfig(state);
    },
    togglWorkspaceId (state: any, payload: any) {
      state.togglWorkspaceId = payload.togglWorkspaceId;
      persistConfig(state);
    },
    togglTags (state: any, payload: any) {
      state.togglTags = payload.togglTags;
      persistConfig(state);
    },
    togglImportedTag (state: any, payload: any) {
      state.togglImportedTag = payload.togglImportedTag;
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
    },
    // @ts-ignore
    setTogglApiKey ({ commit, state, dispatch, rootGetters }, { togglApiKey }) {
      commit('togglApiKey', {
        togglApiKey
      });

      new ToggleApiClient(togglApiKey, rootGetters['configuration/togglImportedTagName'])
        .getWorkspaces()
        .then(workspaces => {
          commit('togglWorkspaces', { togglWorkspaces: workspaces });
          const togglWorkspaceId = workspaces.length > 0 ? workspaces[0].id : null;
          dispatch('setTogglWorkspaceId', { togglWorkspaceId });
        })
        .catch(error => {
          alert(`Error loading workspaces. Toggl API key is probably invalid: ${error}`);
          commit('togglWorkspaces', { togglWorkspaces: [] });
          dispatch('setTogglWorkspaceId', { togglWorkspaceId: null });
        });
    },
    // @ts-ignore
    setTogglWorkspaceId ({ commit, state, rootGetters }, { togglWorkspaceId }) {
      commit('togglWorkspaceId', {
        togglWorkspaceId
      });

      if (togglWorkspaceId) {
        new ToggleApiClient(state.togglApiKey, rootGetters['configuration/togglImportedTagName'])
          .getWorkspaceTags(togglWorkspaceId)
          .then(togglTags => {
            commit('togglTags', { togglTags });
          });
      } else {
        commit('togglTags', { togglTags: [] });
      }
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
    const isSecret = ['togglApiKey', 'jiraPassword'].includes(fieldName);
    console.log(`Restoring config field '${fieldName}' to value: ${isSecret ? '******' : JSON.stringify(value)}`);
    commit(fieldName, { [fieldName]: value });
  }
}

export default configuration;
