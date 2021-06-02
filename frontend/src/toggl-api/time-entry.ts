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
    const duration = roundToNearestMinute(Duration.fromMillis(raw.duration * 1000));
    const status = determineStatus(raw, jiraIssue, importedTagName, duration);

    return new TimeEntry(
      raw.id,
      raw.billable,
      DateTime.fromISO(raw.start),
      DateTime.fromISO(raw.stop),
      status === TimeEntryStatus.Ongoing ? Duration.fromMillis(0) : duration,
      raw.description,
      description,
      jiraIssue,
      determineStatus(raw, jiraIssue, importedTagName, duration)
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
    return this.start.toFormat('cccc yyyy.MM.dd');
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
  if (!descriptionRaw) {
    return ['', null];
  }
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

/**
 * Event though the Jira API for work logs accepts durations in seconds, values are then rounded to
 * minutes by omitting the extra seconds: "1h 12m 53s" will be saved as just "1h 12m".
 * So, for fairness (those lost seconds add up!), we round the duration to the nearest minute here:
 * "12m 29s" -> "12m", and "12m 30s" -> "13m".
 * Issues with duration = 0 will then be marked as invalid.
 * @param duration
 */
function roundToNearestMinute (duration: Duration) {
  duration = duration.shiftTo('hours', 'minutes', 'seconds');
  if (duration.seconds < 30) {
    return duration.set({ seconds: 0 });
  } else {
    return duration.set({ minutes: duration.minutes + 1, seconds: 0 });
  }
}
