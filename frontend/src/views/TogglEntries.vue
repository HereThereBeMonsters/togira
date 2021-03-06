<template>
  <div>
    <h4>TIME LOGS FROM TOGGL</h4>

    <div v-if="!entries && !loading">
      <button class="uk-button uk-button-primary" v-on:click="loadEntries">
        Load Toggle entries
      </button>
    </div>

    <div id="loading-indicator" v-if="loading">
      <div uk-spinner></div>
      <span class="uk-margin-left">
        Loading entries from Toggl...
      </span>
    </div>

    <div v-if="entries && !loading">
      <form class="uk-margin-top uk-form-horizontal">
        <div>
          <label class="uk-form-label" title="A maximum of 1000 entries can be loaded from Toggl at once.">Show entries for:</label>
          <div class="uk-form-controls">
            <select v-model="selectedFilter" class="uk-select">
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="thisWeek">This week</option>
              <option value="lastWeek">Last week</option>
              <option value="thisMonth">This month</option>
              <option value="lastMonth">Last month</option>
              <option value="last7Days">The last 7 days</option>
              <option value="last30Days">The last 30 days</option>
              <option value="last90Days">The last 90 days</option>
            </select>
          </div>
        </div>
      </form>
      <div class="uk-margin-top">
        <button class="uk-button uk-button-default uk-button-small"
                v-on:click="loadEntries"
                title="Refresh">
          <span uk-icon="icon: refresh"></span>
        </button>
        <button class="uk-button uk-button-default uk-button-small"
                v-on:click="selectAll()"
                title="Select all">
          <span uk-icon="icon: check"></span>
        </button>
        <button class="uk-button uk-button-default uk-button-small"
                v-on:click="selectAll(false)"
                title="Unselect all">
          <span uk-icon="icon: close"></span>
        </button>
        <span class="uk-margin-left">
          {{selectedEntries.length}} of {{entries.length}} entries selected.
        </span>
        <button v-on:click="importSelectedEntries()" class="import-jira-button uk-button uk-button-primary">
          <span uk-icon="icon: cloud-upload"></span>
          <span class="uk-margin-left">Import selected entries to Jira</span>
        </button>
      </div>

      <details>
        <summary>
          <h5>Summary of Toggl entries</h5>
        </summary>
        <table class="uk-table uk-table-divider">
          <tr><td>Total duration in all valid entries: </td><td>{{summary.totalValidEntriesDuration}}</td></tr>
          <tr><td>Total duration in all already imported entries: </td><td>{{summary.totalImportedEntriesDuration}}</td></tr>
          <tr><td>Total duration in all selectable entries: </td><td>{{summary.totalSelectableEntriesDuration}}</td></tr>
          <tr><td>Total duration in all selected entries: </td><td>{{summary.totalSelectedEntriesDuration}}</td></tr>
        </table>
      </details>

      <div v-for="day in days" v-bind:key="day" >
        <div class="day-time-entries uk-margin-medium-top">
          <div class="day-time-entries--header" v-on:click="toggleSelectEntriesForDay(day)">
            <span uk-icon="icon: calendar; ratio: 0.7"></span>
            <span class="day-time-entries--header--day">
              {{day}}
            </span>
            <span class="day-time-entries--header--total-duration">
              {{getTotalDurationForDay(day)}}
            </span>
          </div>
          <time-entry v-for="entry in getEntriesForDay(day)" v-bind:key="entry.id" v-bind:timeEntry="entry"/>
        </div>
      </div>

      <!-- TODO: extract component to avoid repeating? -->
      <div class="uk-margin-top" v-if="entries.length > 16">
        <button class="uk-button uk-button-default uk-button-small"
                v-on:click="loadEntries"
                title="Refresh">
          <span uk-icon="icon: refresh"></span>
        </button>
        <button class="uk-button uk-button-default uk-button-small"
                v-on:click="selectAll()"
                title="Select all">
          <span uk-icon="icon: check"></span>
        </button>
        <button class="uk-button uk-button-default uk-button-small"
                v-on:click="selectAll(false)"
                title="Unselect all">
          <span uk-icon="icon: close"></span>
        </button>
        <span class="uk-margin-left">
          {{selectedEntries.length}} of {{entries.length}} entries selected.
        </span>
        <button v-on:click="importSelectedEntries()" class="import-jira-button uk-button uk-button-primary">
          <span uk-icon="icon: cloud-upload"></span>
          <span class="uk-margin-left">Import selected entries to Jira</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="less">
  @import "../global.less";

  .import-jira-button {
    float: right;
  }

  .day-time-entries {
    .day-time-entries--header {
      font-weight: bold;
      border-bottom: 1px solid @globcol-grey-lighter;
      cursor: pointer;
      padding: 6px;
      padding-left: 9px;

      &:hover {
        background-color: @globcol-green-light;
      }

      .day-time-entries--header--day {
        margin-left: 6px;
      }
      .day-time-entries--header--total-duration {
        float: right;
      }
    }
  }
</style>

<script>

import TimeEntryComponent from '@/components/TimeEntryComponent.vue';
import { TimeEntryStatus } from '@/toggl-api/time-entry-status';

export default {
  name: 'toggl-entries',
  computed: {
    entries () {
      return this.$store.state.togglEntries.entries;
    },
    days () {
      const allDays = this.$store.state.togglEntries.entries
        .map(entry => entry.day);

      return [...new Set(allDays)];
    },
    selectedEntries () {
      return this.$store.state.togglEntries.entries.filter(entry => entry.selected);
    },
    loading () {
      return this.$store.state.togglEntries.loading;
    },
    selectedFilter: {
      get () {
        return this.$store.state.togglEntries.selectedFilter;
      },
      set (value) {
        this.$store.dispatch(
          'togglEntries/loadEntries',
          {
            selectedFilter: value
          });
      }
    },
    summary () {
      return {
        totalValidEntriesDuration: calculateTotalDuration(this.entries.filter(it => it.status !== TimeEntryStatus.Invalid)),
        totalSelectedEntriesDuration: calculateTotalDuration(this.selectedEntries),
        totalSelectableEntriesDuration: calculateTotalDuration(this.entries.filter(it => it.selectable)),
        totalImportedEntriesDuration: calculateTotalDuration(this.entries.filter(it => it.status === TimeEntryStatus.Imported))
      };
    }
  },
  methods: {
    loadEntries: function () {
      this.$store.dispatch('togglEntries/loadEntries');
    },
    selectAll: function (value = true) {
      this.entries.forEach(entry => {
        if (entry.selectable) {
          entry.selected = value;
        }
      });
    },
    importSelectedEntries () {
      this.$store.dispatch('importing/importSelectedEntries');
      this.$router.push('importing');
    },
    getEntriesForDay (day) {
      return this.entries.filter(entry => entry.day === day);
    },
    getTotalDurationForDay (day) {
      return calculateTotalDuration(this.entries.filter(entry => entry.day === day));
    },
    toggleSelectEntriesForDay (day) {
      const selectableDayEntries = this.entries.filter(entry => entry.day === day && entry.selectable);
      const allSelected = !selectableDayEntries.some(it => !it.selected);
      selectableDayEntries.forEach(it => (it.selected = !allSelected));
    }
  },
  components: {
    'time-entry': TimeEntryComponent
  }
};

function calculateTotalDuration (timeEntries) {
  if (!timeEntries || !timeEntries.length) {
    return '0:00';
  }
  return timeEntries
    .reduce((total, entry) => entry.duration.plus(total), 0)
    .toFormat('h:mm');
}
</script>
