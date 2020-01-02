<template>
  <div class="time-entry" v-bind:class="{ selected: timeEntry.selected }">
    <div>
      <input type="checkbox" v-model="timeEntry.selected">
      {{timeEntry.jiraIssue}}
    </div>
    <div>{{timeEntry.day}} : {{timeEntry.startTime}} - {{timeEntry.endTime}} [{{timeEntry.durationFormatted}}] </div>
    <div>{{timeEntry.description}}</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import TimeEntry from '@/toggl-api/time-entry';

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
.time-entry.selected{
  background-color: aquamarine;
}
</style>
