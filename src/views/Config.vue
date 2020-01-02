<template>
  <div class="configuration">
    <h1>Configuration</h1>
    <p>The configuration parameters are stored locally in the browser's local storage.</p>
    <p>Config complete: {{isConfigComplete ? 'OK' : 'Missing values'}}</p>
    <form>
      <h2>Toggl</h2>
      <div>
        <label>Toggl API key:</label>
        <input type="text" placeholder="Enter your Toggl API key" v-model="togglApiKey">
      </div>
      <h2>Jira</h2>
      <div>
        <label>Jira target host:</label>
        <input type="text" placeholder="https://jira.mycompany.com" v-model="jiraTargetHost">
      </div>
      <div>
        <label>Jira username:</label>
        <input type="text" placeholder="Username" v-model="jiraUsername">
      </div>
      <div>
        <label>Jira password:</label>
        <input type="password" v-model="jiraPassword">
      </div>
    </form>
  </div>
</template>

<script>
import store from '@/store';
export default {
  name: 'config',
  components: {},
  computed: {
    isConfigComplete: function () {
      return store.getters['configuration/isComplete'];
    },
    togglApiKey: {
      get: function () {
        return store.state.configuration.togglApiKey;
      },
      set: function (value) {
        store.commit('configuration/togglApiKey', {
          togglApiKey: value
        });
      }
    },
    jiraTargetHost: {
      get: function () {
        return store.state.configuration.jiraTargetHost;
      },
      set: function (value) {
        store.commit('configuration/jiraTargetHost', {
          jiraTargetHost: value
        });
      }
    },
    jiraUsername: {
      get: function () {
        return store.state.configuration.jiraUsername;
      },
      set: function (value) {
        store.commit('configuration/jiraUsername', {
          jiraUsername: value
        });
      }
    },
    jiraPassword: {
      get: function () {
        return store.state.configuration.jiraPassword;
      },
      set: function (value) {
        store.commit('configuration/jiraPassword', {
          jiraPassword: value
        });
      }
    }
  }
};
</script>
