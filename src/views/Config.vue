<template>
  <div class="uk-display-block">
    <h4>CONFIGURATION</h4>

    <div class="uk-alert uk-alert-warning uk-flex">
      <div class="uk-padding-small">
        <span uk-icon="icon: warning; ratio: 2.5"></span>
      </div>
      <p class="uk-margin-remove uk-padding-small">
        For your convenience, the configuration parameters are stored in the browser's local
        storage, including the credentials for Jira and Toggl.
        <br/>
        If you are using a shared computer,
        <strong>make sure to wipe the browser data after use!</strong>
      </p>
    </div>

    <form class="uk-form-stacked">
      <fieldset class="uk-fieldset">

        <legend class="uk-legend">Toggl settings</legend>

        <div class="uk-margin-small-top">
          <label class="uk-form-label" for="togglApiKey">Toggl API key:</label>
          <div class="uk-form-controls">
            <input type="text"
                   id="togglApiKey"
                   placeholder="Enter your Toggl API key"
                   v-model="togglApiKey"
                   class="uk-input"
            >
          </div>
        </div>

        <div class="uk-margin-small-top">
          <label class="uk-form-label" for="togglWorkspaceId">Toggl workspace:</label>
          <div class="uk-form-controls">
            <select id="togglWorkspaceId" v-model="togglWorkspaceId" class="uk-select">
              <option v-for="workspace of togglWorkspaces" v-bind:key="workspace.id" v-bind:value="workspace.id">{{workspace.name}}</option>
            </select>
          </div>
        </div>

        <div class="uk-margin-small-top">
          <label class="uk-form-label" for="togglImportedTagId">Label to add to imported entries (must be created in Toggl first):</label>
          <div class="uk-form-controls">
            <select id="togglImportedTagId" v-model="togglImportedTagId" class="uk-select">
              <option value="">Do not use tag</option>
              <option v-for="tag of togglTags" v-bind:key="tag.id" v-bind:value="tag.id">{{tag.name}}</option>
            </select>
          </div>
        </div>
      </fieldset>

      <fieldset class="uk-fieldset uk-margin-top">

        <legend class="uk-legend">Jira settings</legend>

        <div class="uk-margin-small-top">
          <label class="uk-form-label" for="jiraTargetHost">Target server:</label>
          <div class="uk-form-controls">
            <input type="text"
                   id="jiraTargetHost"
                   placeholder="https://jira.mycompany.com"
                   v-model="jiraTargetHost"
                   class="uk-input">
          </div>
        </div>

        <div class="uk-margin-small-top">
          <label class="uk-form-label" for="jiraUsername">Username:</label>
          <div class="uk-form-controls">
            <input type="text"
                   id="jiraUsername"
                   placeholder="Username"
                   v-model="jiraUsername"
                   class="uk-input">
          </div>
        </div>

        <div class="uk-margin-small-top">
          <label class="uk-form-label" for="jiraPassword">Password:</label>
          <div class="uk-form-controls">
            <input type="password"
                   id="jiraPassword"
                   class="uk-input"
                   v-model="jiraPassword">
          </div>
        </div>

      </fieldset>
    </form>
  </div>
</template>

<script>
import store from '@/store';
export default {
  name: 'config',
  components: {},
  computed: {
    togglApiKey: {
      get: function () {
        return store.state.configuration.togglApiKey;
      },
      set: function (value) {
        store.dispatch('configuration/setTogglApiKey', { togglApiKey: value });
      }
    },
    togglWorkspaces: {
      get: function () {
        return store.state.configuration.togglWorkspaces;
      }
    },
    togglWorkspaceId: {
      get: function () {
        return store.state.configuration.togglWorkspaceId;
      },
      set: function (value) {
        store.dispatch('configuration/setTogglWorkspaceId', {
          togglWorkspaceId: value
        });
      }
    },
    togglTags: {
      get: function () {
        return store.state.configuration.togglTags;
      }
    },
    togglImportedTagId: {
      get: function () {
        return store.state.configuration.togglImportedTagId;
      },
      set: function (value) {
        store.commit('configuration/togglImportedTagId', {
          togglImportedTagId: value
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
