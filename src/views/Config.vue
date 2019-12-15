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
    jiraBaseUrl: {
      get: function () {
        return store.state.configuration.jiraBaseUrl;
      },
      set: function (value) {
        store.commit('configuration/jiraBaseUrl', {
          jiraBaseUrl: value
        });
      }
    }
  }
};
</script>
