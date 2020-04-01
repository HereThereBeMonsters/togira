import axios, { AxiosRequestConfig } from 'axios';
import TimeEntry from '@/toggl-api/time-entry';
import { Duration } from 'luxon';

export class ToggleApiClient {
  apiToken: string;
  importedTagName: string;

  baseUrl = '/api/toggl';

  constructor (apiToken: string, importedTagName: string) {
    this.apiToken = apiToken;
    this.importedTagName = importedTagName;
  }

  getWorkspaces (): Promise<Array<TogglWorkspace>> {
    return axios.get(`${this.baseUrl}/workspaces`, this.getConfig())
      .then(response => response.data);
  }

  getWorkspaceTags (workspaceId: string): Promise<Array<TogglTag>> {
    return axios.get(`${this.baseUrl}/workspaces/${workspaceId}/tags`, this.getConfig())
      .then(response => response.data);
  }

  getEntries (startDate:Date, endDate:Date): Promise<Array<TimeEntry>> {
    const url = encodeURI(
      `${this.baseUrl}/time_entries?start_date=${startDate.toISOString()}&end_date=${endDate.toISOString()}`
    );

    return axios.get(url, this.getConfig())
      .then(response => {
        const entries: Array<TimeEntry> = response.data
          .map((rawEntry: TogglTimeEntry) => TimeEntry.fromRawToggleEntry(rawEntry, this.importedTagName));
        return mergeEntriesWithSameDayDescriptionStatus(entries);
      });
  }

  addTagToEntry (entry: TimeEntry, tag: TogglTag) : Promise<TimeEntry> {
    // the tag must be added to all merged entries in Toggl
    const idsParam = entry.mergedFrom ? entry.mergedFrom.join(',') : entry.id;

    return axios.put(
      `${this.baseUrl}/time_entries/${idsParam}`,
      {
        time_entry: {
          tags: [tag.name],
          tag_action: 'add'
        }
      },
      this.getConfig()
    )
      .then(response => TimeEntry.fromRawToggleEntry(response.data.data, this.importedTagName));
  }

  getConfig (): AxiosRequestConfig {
    return {
      auth: { username: this.apiToken, password: 'api_token' }
    };
  }
}

export interface TogglTimeEntry {
  id: number;
  uid: number | null;
  wid: number | null;
  guid: string | null;
  billable: boolean;
  start: string;
  stop: string;
  duration: number;
  description: string;
  duronly: boolean;
  at: Date;
  tags: Array<String>;
}

export interface TogglTag {
  id: number,
  name: string
}

export interface TogglWorkspace {
  id: number,
  name: string
}

function mergeEntriesWithSameDayDescriptionStatus (entries: Array<TimeEntry>): Array<TimeEntry> {
  // group entries by day, description and status fields
  const entriesMap: { [key: string]: Array<TimeEntry> } = entries
    .reduce(
      (map: any, entry) => {
        const key = `${entry.day}:${entry.descriptionRaw}:${entry.status}`;
        const mapEntry = map[key];
        if (typeof mapEntry === 'undefined') {
          map[key] = [entry];
        } else {
          mapEntry.push(entry);
        }
        return map;
      },
      {}
    );

  return Object.values(entriesMap)
    .map((group: Array<TimeEntry>) => {
      if (group.length === 1) {
        return group[0];
      }
      return mergeEntries(group);
    });
}

function mergeEntries (entries: Array<TimeEntry>) {
  const ids = entries.map(entry => entry.id);
  const totalDuration = entries.reduce((previous: Duration, entry: TimeEntry) => previous.plus(entry.duration), Duration.fromMillis(0));
  const first = entries[0];
  const last = entries[entries.length - 1];
  return new TimeEntry(
    first.id,
    first.billable,
    first.start,
    last.stop,
    totalDuration,
    first.descriptionRaw,
    first.description,
    first.jiraIssue,
    first.status,
    ids
  );
}
