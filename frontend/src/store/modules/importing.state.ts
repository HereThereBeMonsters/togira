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
    importSelectedEntries ({ state, rootState, commit, rootGetters }) {
      const config = rootState.configuration;
      const jira = new JiraApiClient(config.jiraTargetHost, config.jiraUsername, config.jiraPassword);
      const toggl = new ToggleApiClient(config.togglApiKey, rootGetters['configuration/togglImportedTagName']);
      const selectedEntries:Array<TimeEntry> = rootGetters['togglEntries/selectedEntries'];

      commit('resetImportedEntryResults');
      commit('resetFailedEntryResults');
      commit('importing', { importing: true });

      const jiraPromises = selectedEntries.map((it:TimeEntry) => importEntryToJira(it, jira, commit));

      return Promise.allSettled(jiraPromises)
        .then(() => {
          console.log('Jira import completed.');
          if (config.togglImportedTag && state.importedEntriesResults.length) {
            console.log('Now adding imported tag in Toggl...');
            const importedTimeEntries = state.importedEntriesResults
              .map((it: ImportEntryResult) => it.timeEntry);
            toggl.addTagToEntries(importedTimeEntries, config.togglImportedTag);
          }
        })
        .finally(() => commit('importing', { importing: false }));
    }
  }
};

export default importingState;

function importEntryToJira (timeEntry:TimeEntry, jira:JiraApiClient, commit: (key:string, payload:any) => any) {
  console.log('Importing time entry to Jira:', timeEntry);

  return jira.addWorkLog(timeEntry)
    .then((result: any) => {
      console.log('Entry imported successfully: ', result);
      commit('addImportedEntryResult', {
        result:
          {
            timeEntry,
            success: true,
            message: 'Imported OK'
          }
      });
    })
    .catch((error: any) => {
      console.log('Import failed:', timeEntry, error);
      commit('addFailedEntryResult', {
        result:
          {
            timeEntry,
            success: false,
            message: error
          }
      });
    });
}
