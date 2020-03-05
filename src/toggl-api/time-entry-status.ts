import { TogglTimeEntry } from '@/toggl-api/toggl-api-client';
import { Duration } from 'luxon';

export enum TimeEntryStatus {
  Ongoing,
  Incoming,
  Imported,
  Invalid
}

export function determineStatus (
  raw: TogglTimeEntry,
  jiraIssueId: String | null,
  importedTagName: String,
  duration: Duration): TimeEntryStatus {
  if (!raw.stop) {
    return TimeEntryStatus.Ongoing;
  }

  const durationLessThanOneMinute = duration.shiftTo('minutes').get('minutes') === 0;

  if (!jiraIssueId || durationLessThanOneMinute) {
    return TimeEntryStatus.Invalid;
  }

  if (raw.tags && importedTagName && raw.tags.includes(importedTagName)) {
    return TimeEntryStatus.Imported;
  }

  return TimeEntryStatus.Incoming;
}
