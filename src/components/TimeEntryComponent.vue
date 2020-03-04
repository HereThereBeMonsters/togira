<template>
  <div class="time-entry"
       v-bind:class="{selected: timeEntry.selected, unselectable: !timeEntry.selectable}"
       v-on:click="onClick"
  >
    <div class="time-entry--status">
      <span v-if="timeEntry.status === 0" uk-icon="icon: clock; ratio: 0.9" title="Ongoing"></span>
      <span v-if="timeEntry.status === 1" uk-icon="icon: cloud-download; ratio: 0.9" title="Incoming"></span>
      <span v-if="timeEntry.status === 2" uk-icon="icon: check; ratio: 0.9" title="Imported to Jira"></span>
      <span v-if="timeEntry.status === 3" uk-icon="icon: warning; ratio: 0.9" title="Invalid"></span>
    </div>
    <div class="time-entry--jira-key">
      <a v-bind:href="jiraIssueUrl" target="_blank" class="time-entry--jira-key--link">
        {{timeEntry.jiraIssue}}
      </a>
    </div>
    <div class="time-entry--duration">
      {{timeEntry.durationFormatted}}
    </div>
    <div class="time-entry--times">
      <span uk-icon="icon: clock; ratio: 0.7"></span>
      {{timeEntry.startTime}} ↦ {{timeEntry.endTime}}
    </div>
    <div class="time-entry--description">
      {{timeEntry.description}}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import TimeEntry from '@/toggl-api/time-entry';

@Component
export default class TimeEntryComponent extends Vue {
  @Prop() private timeEntry!: TimeEntry;

  onClick (event:any) {
    // if click is on Jira issue link, do not react
    if (event.target.className && event.target.className.toLowerCase() === 'time-entry--jira-key--link') {
      return false;
    }
    this.timeEntry.toggleSelected();
  }

  get jiraIssueUrl () {
    return `${this.$store.state.configuration.jiraTargetHost}/browse/${this.timeEntry.jiraIssue}`;
  }
};
</script>

<style scoped lang="less">
@import "../global.less";

.time-entry {
  padding: 6px;
  border-left: 3px solid transparent;
  display: flex;
  cursor: pointer;

  &:hover {
    background-color: @globcol-green-light;
  }

  &.selected {
    border-left-color: @globcol-green;
    background-color: @globcol-green-lightest;
  }

  &.unselectable {
    color: @globcol-grey-light;
    cursor: default;
    &:hover {
      background-color: white;
    }
    & a {
      color: @globcol-grey-light;
    }
  }

  &:not(last) {
    border-bottom: 1px solid @globcol-grey-lightest;
  }
}

.time-entry--status {
  width: 25px;
  flex-shrink: 0;
}

.time-entry--jira-key {
  width: 200px;
  flex-shrink: 0;
}

.time-entry--duration {
  width: 55px;
  font-weight: bold;
  flex-shrink: 0;
}

.time-entry--times {
  width: 140px;
  flex-shrink: 0;
  font-size: 0.9em;
}

.time-entry--description {
  flex-shrink: 1;
  flex-grow: 1;
  font-size: 0.9em;
}

</style>
