<template>
  <div class="configuration">
    <h1>Configuration</h1>
    <p>The configuration parameters are stored locally in the browser's local storage.</p>
    <p>Config complete: {{isConfigComplete ? 'OK' : 'Missing values'}}</p>
    <form>
      <div>
        <label>Toggl API key:</label>
        <input type="text" placeholder="Enter your Toggl API key" v-model="togglApiKey">
      </div>
      <div>
        <label>Jira base URL:</label>
        <input type="text" placeholder="Enter the URL of the Jira server you want to import to" v-model="jiraBaseUrl">
      </div>

    </form>
  </div>
</template>

<script>
// @ is an alias to /src
import store from '@/store';
export default {
  name: 'config',
  components: {},
  computed: {
    isConfigComplete: function () {
      return store.getters.isConfigComplete;
    },
    togglApiKey: {
      get: function () {
        return store.state.configuration.togglApiKey;
      },
      set: function (value) {
        store.commit('togglApiKey', {
          togglApiKey: value
        });
      }
    },
    jiraBaseUrl: {
      get: function () {
        return store.state.configuration.jiraBaseUrl;
      },
      set: function (value) {
        store.commit('jiraBaseUrl', {
          jiraBaseUrl: value
        });
      }
    }
  }
};
</script>
