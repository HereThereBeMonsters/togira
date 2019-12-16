import axios from 'axios';
import { DateTime, Duration } from 'luxon';

export class ToggleApiClient {
  apiToken: string;

  baseUrl = '/api/toggl';

  constructor (apiToken: string) {
    this.apiToken = apiToken;
  }

  getEntries (): Promise<Array<TimeEntry>> {
    return axios.get(`${this.baseUrl}/time_entries`, this.getConfig())
      .then(response => response.data.map((rawEntry: TogglTimeEntry) => new TimeEntry(rawEntry)));
  }

  getConfig () {
    return {
      auth: { username: this.apiToken, password: 'api_token' }
    };
  }
}

export interface TogglTimeEntry {
  id: number;
  uid: number;
  wid: number;
  guid: string;
  billable: boolean;
  start: string;
  stop: string;
  duration: number;
  description: string;
  duronly: boolean;
  at: Date;
}

export class TimeEntry {
  id: number;
  billable: boolean;
  start: DateTime;
  stop: DateTime;
  duration: Duration;
  descriptionRaw: string;
  description: string;
  jiraIssue: string | null;

  constructor (raw: TogglTimeEntry) {
    this.id = raw.id;
    this.billable = raw.billable;
    this.start = DateTime.fromISO(raw.start);
    this.stop = DateTime.fromISO(raw.stop);
    this.duration = Duration.fromMillis(raw.duration * 1000);
    this.descriptionRaw = raw.description;
    [this.description, this.jiraIssue] = extractJiraIssue(this.descriptionRaw);
  }

  get day (): string {
    return this.start.toLocaleString(DateTime.DATE_SHORT);
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
