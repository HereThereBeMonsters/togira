<template>
  <div class="failed-time-entry-import">
    <div class="failed-time-entry-import--icon">
      <span uk-icon="icon: warning; ratio: 0.9"></span>
    </div>
    <div class="failed-time-entry-import--jira-key">
      <a v-bind:href="jiraIssueUrl" target="_blank" class="time-entry--jira-key--link">
        {{timeEntry.jiraIssue}}
      </a>
    </div>
    <div class="failed-time-entry-import--message">
      {{errorMessage}}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import TimeEntry from '@/toggl-api/time-entry';

@Component
export default class FailedTimeEntryImportComponent extends Vue {
  @Prop() private timeEntry!: TimeEntry;

  @Prop() private errorMessage!: String;

  get jiraIssueUrl () {
    return `${this.$store.state.configuration.jiraTargetHost}/browse/${this.timeEntry.jiraIssue}`;
  }
};
</script>

<style scoped lang="less">
@import "../global.less";

.failed-time-entry-import {
  padding: 6px;
  display: flex;

  &:not(last) {
    border-bottom: 1px solid @globcol-grey-lightest;
  }
}

.failed-time-entry-import--icon {
  width: 25px;
  flex-shrink: 0;
}

.failed-time-entry-import--jira-key {
  width: 200px;
  flex-shrink: 0;
}

.failed-time-entry-import--message {
  flex-shrink: 1;
  flex-grow: 1;
  font-size: 0.9em;
}
</style>
