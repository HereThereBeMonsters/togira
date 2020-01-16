import { DateTime, Duration } from 'luxon';
import { TogglTimeEntry } from './toggl-api-client';

export default class TimeEntry {
  id: number;
  billable: boolean;
  start: DateTime;
  stop: DateTime;
  duration: Duration;
  descriptionRaw: string;
  description: string;
  jiraIssue: string | null;
  selected: boolean = false;

  constructor (raw: TogglTimeEntry) {
    this.id = raw.id;
    this.billable = raw.billable;
    this.start = DateTime.fromISO(raw.start);
    this.stop = DateTime.fromISO(raw.stop);
    this.duration = Duration.fromMillis(raw.duration * 1000);
    this.descriptionRaw = raw.description;
    [this.description, this.jiraIssue] = extractJiraIssue(this.descriptionRaw);
  }

  toggleSelected () {
    this.selected = !this.selected;
  }

  get day (): string {
    return this.start.toFormat('cccc dd.MM.yyyy');
  }

  get startTime (): string {
    return this.start.toLocaleString(DateTime.TIME_24_SIMPLE);
  }

  get endTime (): string {
    return this.stop.toLocaleString(DateTime.TIME_24_SIMPLE);
  }

  get durationFormatted (): string {
    return this.duration.toFormat('h:mm');
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
