<template>
  <div>
    <h1>Importing entries to Jira...</h1>
    <div>
      {{totalDone}} / {{selectedEntries.length}} {{percentDone}}%
    </div>
    <ul>
      <li>Success: {{importedResults.length}}</li>
      <li>Failed: {{failedResults.length}}</li>
    </ul>
  </div>
</template>

<script>

export default {
  name: 'importing',
  computed: {
    selectedEntries () {
      return this.$store.getters['togglEntries/selectedEntries'];
    },
    importedResults () {
      return this.$store.state.importing.importedEntriesResults;
    },
    failedResults () {
      return this.$store.state.importing.failedEntriesResults;
    },
    totalDone () {
      return this.importedResults.length + this.failedResults.length;
    },
    percentDone () {
      return (this.totalDone / this.selectedEntries.length) * 100;
    }
  },
  methods: {},
  components: {}
};
</script>
