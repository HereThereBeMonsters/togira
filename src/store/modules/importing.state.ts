import TimeEntry from '@/toggl-api/time-entry';
import JiraApiClient from '@/jira-api/jira-api-client';

const initialState = {
  importedEntriesResults: [],
  failedEntriesResults: [],
  importing: false
};

interface ImportEntryResult {
  timeEntry : TimeEntry,
  sucess: boolean,
  message: string
}

const importingState = {
  namespaced: true,
  state: initialState,

  getters: {

  },

  mutations: {
    addImportedEntryResult (state: any, payload: any) {
      state.importedEntriesResults.push(payload.result);
    },
    addFailedEntryResult (state: any, payload: any) {
      state.failedEntriesResults.push(payload.result);
    },
    resetImportedEntryResults (state: any) {
      state.importedEntriesResults = [];
    },
    resetFailedEntryResults (state: any) {
      state.failedEntriesResults = [];
    },
    importing (state: any, payload: any) {
      state.importing = payload.importing;
    }
  },

  actions: {
    // @ts-ignore
    importSelectedEntries ({ rootState, dispatch, commit, getters, rootGetters }) {
      const config = rootState.configuration;
      const jira = new JiraApiClient(config.jiraTargetHost, config.jiraUsername, config.jiraPassword);
      const selectedEntries = rootGetters['togglEntries/selectedEntries'];

      commit('resetImportedEntryResults');
      commit('resetFailedEntryResults');
      commit('importing', { importing: true });

      const promises = selectedEntries
        .map((entry:TimeEntry) => {
          return jira.addWorkLog(entry)
            .then((result: any) => {
              console.log('Imported successfully:', entry);
              commit('addImportedEntryResult', {
                result:
                  {
                    entry,
                    success: true,
                    message: 'Imported OK'
                  }
              });
            })
            .catch((error: any) => {
              console.log('Import failed:', entry, error);
              commit('addFailedEntryResult', {
                result:
                  {
                    entry,
                    success: false,
                    message: error
                  }
              });
            })
            .finally(() => commit('importing', { importing: false }));
        });

      return Promise.all(promises);
    }
  }
};

export default importingState;
