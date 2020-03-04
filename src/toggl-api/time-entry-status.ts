import { TogglTimeEntry } from '@/toggl-api/toggl-api-client';

export enum TimeEntryStatus {
  Ongoing,
  Incoming,
  Imported,
  Invalid
}

export function determineStatus (raw: TogglTimeEntry, jiraIssueId: String | null, importedTagName: String): TimeEntryStatus {
  if (!raw.stop) {
    return TimeEntryStatus.Ongoing;
  }

  if (!jiraIssueId) {
    return TimeEntryStatus.Invalid;
  }

  if (raw.tags && importedTagName && raw.tags.includes(importedTagName)) {
    return TimeEntryStatus.Imported;
  }

  return TimeEntryStatus.Incoming;
}
