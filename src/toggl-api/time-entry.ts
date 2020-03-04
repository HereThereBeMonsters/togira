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

  constructor (raw: TogglTimeEntry, importedTagName: string) {
    this.id = raw.id;
    this.billable = raw.billable;
    this.start = DateTime.fromISO(raw.start);
    this.stop = DateTime.fromISO(raw.stop);
    this.duration = Duration.fromMillis(raw.duration * 1000);
    this.descriptionRaw = raw.description;
    [this.description, this.jiraIssue] = extractJiraIssue(this.descriptionRaw);
    this.status = determineStatus(raw, this.jiraIssue, importedTagName);
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
