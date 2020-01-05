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
      <div>
        {{selectedEntries.length}} of {{entries.length}} entries selected.
        <button v-on:click="selectAll()">Select all</button>
        <button v-on:click="selectAll(false)">Select none</button>
      </div>
      <div>
        <button v-on:click="importSelectedEntries()">Import selected entries to Jira</button>
      </div>
      <time-entry v-for="entry in entries" v-bind:key="entry.id" v-bind:timeEntry="entry"/>
    </div>
  </div>
</template>

<script>

import TimeEntryComponent from '@/components/TimeEntryComponent.vue';

export default {
  name: 'toggl-entries',
  computed: {
    entries: function () {
      return this.$store.state.togglEntries.entries;
    },
    selectedEntries: function () {
      return this.$store.state.togglEntries.entries.filter(entry => entry.selected);
    },
    loading () {
      return this.$store.state.togglEntries.loading;
    }
  },
  methods: {
    loadEntries: function () {
      this.$store.dispatch('togglEntries/loadEntries');
    },
    selectAll: function (value = true) {
      this.entries.forEach(entry => (entry.selected = value));
    },
    importSelectedEntries () {
      this.$store.dispatch('togglEntries/importSelectedEntries');
    }
  },
  components: {
    'time-entry': TimeEntryComponent
  }
};
</script>
