import { DateTime, Duration } from 'luxon';
import { TogglTimeEntry } from './toggl-api-client';
import { determineStatus, TimeEntryStatus } from '@/toggl-api/time-entry-status';

export default class TimeEntry {
  id: number;
  billable: boolean;
  status: TimeEntryStatus;
  start: DateTime;
  stop: DateTime;
  duration: Duration;
  descriptionRaw: string;
  description: string;
  jiraIssue: string | null;
  selected: boolean = false;
  mergedFrom: Array<number> | null;

  static fromRawToggleEntry (raw: TogglTimeEntry, importedTagName: string): TimeEntry {
    const [description, jiraIssue] = extractJiraIssue(raw.description);
    return new TimeEntry(
      raw.id,
      raw.billable,
      DateTime.fromISO(raw.start),
      DateTime.fromISO(raw.stop),
      Duration.fromMillis(raw.duration * 1000),
      raw.description,
      description,
      jiraIssue,
      determineStatus(raw, jiraIssue, importedTagName)
    );
  }

  constructor (
    id: number,
    billable: boolean,
    start: DateTime,
    stop: DateTime,
    duration: Duration,
    descriptionRaw: string,
    description: string,
    jiraIssue: string | null,
    status: TimeEntryStatus,
    mergedFrom: Array<number> | null = null) {
    this.id = id;
    this.billable = billable;
    this.start = start;
    this.stop = stop;
    this.duration = duration;
    this.descriptionRaw = descriptionRaw;
    this.description = description;
    this.jiraIssue = jiraIssue;
    this.status = status;
    this.mergedFrom = mergedFrom;
  }

  toggleSelected () {
    if (this.selectable) {
      this.selected = !this.selected;
    }
  }

  get day (): string {
    return this.start.toFormat('yyyy-MM-dd ccc');
  }

  get startTime (): string {
    return this.start.toLocaleString(DateTime.TIME_24_SIMPLE);
  }

  get endTime (): string {
    return this.status === TimeEntryStatus.Ongoing
      ? '...'
      : this.stop.toLocaleString(DateTime.TIME_24_SIMPLE);
  }

  get durationFormatted (): string {
    return this.status === TimeEntryStatus.Ongoing
      ? '...'
      : this.duration.toFormat('h:mm');
  }

  get selectable (): boolean {
    return this.status === TimeEntryStatus.Incoming;
  }
}

function extractJiraIssue (descriptionRaw: string): [string, string | null] {
  const descriptionTrimmed = descriptionRaw.trim();
  const matches = descriptionTrimmed.match(/[A-Z]+-[1-9][0-9]*/);
  if (matches && descriptionTrimmed.startsWith(matches[0])) {
    const jiraIssue = matches[0];
    return [
      cleanUpLeadingGarbage(descriptionRaw.substring(jiraIssue.length, descriptionRaw.length)),
      jiraIssue
    ];
  }
  return [descriptionRaw, null];
}

function cleanUpLeadingGarbage (description: string): string {
  description = description.trim();
  while (description.match(/^[ .,:;\-_/\\]+.*$/)) {
    if (description.length === 1) {
      return '';
    }
    description = description.slice(1);
  }
  return capitalize(description);
}

function capitalize (text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
