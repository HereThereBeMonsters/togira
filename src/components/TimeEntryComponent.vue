<template>
  <div class="time-entry">
    <div>{{timeEntry.jiraIssue}}</div>
    <div>{{timeEntry.startTime}} - {{timeEntry.endTime}} [{{timeEntry.durationFormatted}}] </div>
    <div>{{timeEntry.description}}</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { TimeEntry } from '@/toggl-api/toggl-api-client';

@Component
export default class TimeEntryComponent extends Vue {
  @Prop() private timeEntry!: TimeEntry;
};
</script>

<style scoped>
.time-entry {
  display: block;
  background-color: antiquewhite;
  padding: 20px;
  margin: 20px;
  max-width: 800px;
  text-align: left;
}
</style>
