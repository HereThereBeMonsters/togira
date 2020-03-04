import { TogglTimeEntry } from '@/toggl-api/toggl-api-client';

export enum TimeEntryStatus {
  Ongoing,
  Incoming,
  Imported
}

export function determineStatus (raw: TogglTimeEntry, importedTagName: String): TimeEntryStatus {
  if (!raw.stop) {
    return TimeEntryStatus.Ongoing;
  }

  if (raw.tags && importedTagName && raw.tags.includes(importedTagName)) {
    return TimeEntryStatus.Imported;
  }

  return TimeEntryStatus.Incoming;
}
