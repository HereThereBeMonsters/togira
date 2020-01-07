<template>
  <div>
    <h2>Toggl entries</h2>

    <div v-if="!entries && !loading">
      <button class="uk-button uk-button-primary" v-on:click="loadEntries">
        Load Toggle entries
      </button>
    </div>

    <div v-if="loading">Loading entries from Toggl...</div>

    <div v-if="entries && !loading">
      {{selectedEntries.length}} of {{entries.length}} entries selected.
      <div class="uk-button-group">
        <button class="uk-button uk-button-default" v-on:click="selectAll()">Select all</button>
        <button class="uk-button uk-button-default" v-on:click="selectAll(false)">Select none</button>
        <button class="uk-button uk-button-primary" v-on:click="loadEntries">
          Refresh
        </button>
      </div>

      <button v-on:click="importSelectedEntries()" class="uk-button uk-button-primary">Import selected entries to Jira</button>

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
      this.$store.dispatch('importing/importSelectedEntries');
      this.$router.push('importing');
    }
  },
  components: {
    'time-entry': TimeEntryComponent
  }
};
</script>
