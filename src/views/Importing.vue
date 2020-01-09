<template>
  <div class="importing">

    <div v-if="importing">
      <h5>IMPORTING ENTRIES TO JIRA</h5>
      <div class="progress-text">
        <div class="number">{{totalDone}} / {{selectedEntries.length}}</div>
        <div class="percent">{{percentDone}}%</div>
      </div>
      <progress class="uk-progress" v-bind:value="percentDone" max="100"></progress>
    </div>

    <div v-if="!importing">
      <h4>IMPORT RESULTS</h4>
      <div v-if="importedResults.length > 0" class="uk-alert uk-alert-success uk-flex">
        <div class="uk-padding-small">
          <span uk-icon="icon: info; ratio: 2"></span>
        </div>
        <p class="uk-margin-remove uk-padding-small">
          {{importedResults.length}} entries imported successfully.
        </p>
      </div>

      <div v-if="failedResults.length > 0" class="uk-alert uk-alert-danger uk-flex">
        <div class="uk-padding-small">
          <span uk-icon="icon: warning; ratio: 2"></span>
        </div>
        <div class="uk-margin-remove uk-padding-small">
          <p>
            {{failedResults.length}} entries encountered a problem:
          </p>
          <ul>
            <li v-for="result in failedResults" v-bind:key="result.entry.id">
              {{result.entry.jiraIssue}}:
              {{result.message.name}} - {{result.message.message}}
            </li>
          </ul>
        </div>

      </div>
    </div>

  </div>
</template>

<style lang="less">
@import "../global.less";

.importing {
  width: 100%;

  .progress-text {
    .number {

    }
    .percent {
      float: right;
    }
  }

  .uk-progress {
    width: 100%;
  }
}
</style>

<script>

export default {
  name: 'importing',
  computed: {
    importing () {
      return this.$store.state.importing.importing;
    },
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
