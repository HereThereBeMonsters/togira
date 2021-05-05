import TimeEntryComponent from "*.vue"
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
        </div>
      </div>

      <div>
        <failed-time-entry-import v-for="result in failedResults"
                                  v-bind:key="result.entry.id"
                                  v-bind:timeEntry="result.entry"
                                  v-bind:errorMessage="result.message.message"/>
      </div>

      <div class="uk-margin-top">

        <button class="uk-button uk-button-primary" v-on:click="goToEntries()">
          <span uk-icon="icon: arrow-left"></span>
          Back to Toggl entries
        </button>

        <button class="uk-button uk-button-primary uk-margin-left" v-on:click="retryFailed()">
          <span uk-icon="icon: refresh"></span>
          Retry failed entries
        </button>

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

import FailedTimeEntryImportComponent from '@/components/FailedTimeEntryImportComponent.vue';

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
      // The adding of tags in Toggl is done separately as a single request, so we consider Jira import to be 95%
      return Math.round((this.totalDone / this.selectedEntries.length) * 95);
    }
  },
  methods: {
    goToEntries () {
      this.$store.dispatch('togglEntries/loadEntries');
      this.$router.push('toggl-entries');
    },

    retryFailed () {
      this.importedResults.forEach(result => (result.entry.selected = false));
      this.failedResults.forEach(result => (result.entry.selected = true));
      this.$store.dispatch('importing/importSelectedEntries');
    }
  },
  components: {
    'failed-time-entry-import': FailedTimeEntryImportComponent
  }
};
</script>
