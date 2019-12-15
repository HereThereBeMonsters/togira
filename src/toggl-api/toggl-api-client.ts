import axios from 'axios';
import store from '@/store';

export class ToggleApiClient {
  apiToken: string;

  baseUrl = '/api/toggl';

  constructor (apiToken: string) {
    this.apiToken = apiToken;
  }

  getEntries (): Promise<Array<TogglTimeEntry>> {
    return axios.get(`${this.baseUrl}/time_entries`, this.getConfig())
      .then(response => response.data);
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
  start: Date;
  stop: Date;
  duration: number;
  description: string;
  duronly: boolean;
  at: Date;
}
