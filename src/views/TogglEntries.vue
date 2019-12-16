<template>
  <div>
    <div>
      <h1>Toggl entries</h1>
      <button v-on:click="loadEntries">
        {{entries ? 'Refresh entries' : 'Load Toggle entries'}}
      </button>
    </div>
    <div v-if="loading">Loading entries from Toggl...</div>
    <div v-if="entries && !loading">
      <table border="1">
        <thead>
        <tr>
          <td>Day</td>
          <td>Time</td>
          <td>Duration</td>
          <td>Jira issue</td>
          <td>Description</td>
        </tr>
        </thead>
        <tbody>
        <tr v-for="entry in entries" v-bind:key="entry.id">
          <td>
            {{entry.day}}
          </td>
          <td>
            {{entry.startTime}} - {{entry.endTime}}
          </td>
          <td>
            {{entry.durationFormatted}}
          </td>
          <td>
            {{entry.jiraIssue}}
          </td>
          <td>
            {{entry.description}}
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>

export default {
  name: 'toggl-entries',
  computed: {
    entries: function () {
      return this.$store.state.togglEntries.entries;
    },
    loading () {
      return this.$store.state.togglEntries.loading;
    }
  },
  methods: {
    loadEntries: function () {
      this.$store.dispatch('togglEntries/loadEntries');
    }
  },
  components: {}
};
</script>
