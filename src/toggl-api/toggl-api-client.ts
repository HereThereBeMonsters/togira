import axios from 'axios';
import TimeEntry from '@/toggl-api/time-entry';

export class ToggleApiClient {
  apiToken: string;

  baseUrl = '/api/toggl';

  constructor (apiToken: string) {
    this.apiToken = apiToken;
  }

  getWorkspaces (): Promise<Array<TogglWorkspace>> {
    return axios.get(`${this.baseUrl}/workspaces`, this.getConfig())
      .then(response => response.data);
  }

  getWorkspaceTags (workspaceId: string): Promise<Array<TogglTag>> {
    return axios.get(`${this.baseUrl}/workspaces/${workspaceId}/tags`, this.getConfig())
      .then(response => response.data);
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

export interface TogglTag {
  id: number,
  name: string
}

export interface TogglWorkspace {
  id: number,
  name: string
}
