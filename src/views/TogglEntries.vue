<template>
  <div>
    <div>
      <h1>Toggl entries</h1>
      <p>Click the button to load your Toggl entries</p>
      <button v-on:click="loadEntries">Load Toggle entries</button>
    </div>
    <div>
      <ul>
        <li v-for="entry in entries" v-bind:key="entry.id">{{entry.description}}</li>
      </ul>
    </div>
  </div>
</template>

<script>

export default {
  name: 'toggl-entries',
  computed: {
    entries: function () {
      return this.$store.state.togglEntries.entries;
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
