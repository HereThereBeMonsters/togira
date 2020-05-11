import TimeEntry from '@/toggl-api/time-entry';
import JiraApiClient from '@/jira-api/jira-api-client';
import { ToggleApiClient } from '@/toggl-api/toggl-api-client';

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
      const toggl = new ToggleApiClient(config.togglApiKey, rootGetters['configuration/togglImportedTagName']);
      const selectedEntries = rootGetters['togglEntries/selectedEntries'];

      commit('resetImportedEntryResults');
      commit('resetFailedEntryResults');
      commit('importing', { importing: true });

      const promises = selectedEntries
        .map((entry:TimeEntry) => {
          console.log('Importing time entry to Jira:', entry);

          return jira.addWorkLog(entry)
            .then((result: any) => {
              if (config.togglImportedTag) {
                console.log('imported to Jira successfully, now adding imported tag in Toggl');
                toggl.addTagToEntry(entry, config.togglImportedTag);
              }
            })
            .then((result: any) => {
              console.log('Entry imported successfully.');
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
            });
        });

      return Promise.all(promises)
        .finally(() => commit('importing', { importing: false }));
    }
  }
};

export default importingState;
