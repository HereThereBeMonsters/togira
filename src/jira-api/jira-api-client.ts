import axios, { AxiosError, AxiosResponse } from 'axios';
import TimeEntry from '@/toggl-api/time-entry';

export default class JiraApiClient {
  host: string;
  basicAuthToken: string;
  basePath = 'api/jira';

  constructor (
    host: string,
    username: string,
    password: string
  ) {
    this.host = host;
    this.basicAuthToken = toBasicAuthToken(username, password);
  }

  getJiraIssue (issueKey: string): any {
    return axios.get(`${this.basePath}/issue/${issueKey}`, {
      headers: this.createHeaders()
    });
  }

  addWorkLogs (entries: Array<TimeEntry>): Promise<any> {
    const promises = entries
      .map((entry:TimeEntry) => {
        this
          .getJiraIssue(entry.jiraIssue!)
          .then((response: AxiosResponse) => {
            console.log(`get jira issue ${entry.jiraIssue} OK`, response);
            return entry;
          })
          .catch((error:AxiosError) => {
            if (error.response) {
              if (error.response.status === 404) {
                return `Jira issue ${entry.jiraIssue} does not exist (HTTP 404).`;
              }
            }
            console.log(`error getting jira issue ${entry.jiraIssue}`, error);
            return `Unexpected error: ${error.message}`;
          })
          .then((entryOrError: any) => {
            if (typeof entryOrError === 'string') {
              return entryOrError;
            }

            const entry = <TimeEntry> entryOrError;

            this.addWorkLog(entry.jiraIssue!, {
              comment: entry.description,
              started: removeColumnFromTimezoneOffset(entry.start.toISO()),
              timeSpentSeconds: entry.duration.as('seconds')
            });
          });
      });

    return axios.all(promises);
  }

  /**
   * See: https://docs.atlassian.com/software/jira/docs/api/REST/8.6.0/#api/2/issue-addWorklog
   * @param issueKey
   * @param workLog
   */
  addWorkLog (issueKey: string, workLog: JiraWorkLog): any {
    return axios({
      method: 'post',
      url: `${this.basePath}/issue/${issueKey}/worklog`,
      data: workLog,
      headers: this.createHeaders()
    });
  }

  createHeaders () {
    return {
      'Authorization': this.basicAuthToken,
      'X-Target-Jira-Host': this.host
    };
  }
}

function toBasicAuthToken (username: string, password: string): string {
  return 'Basic ' + btoa(`${username}:${password}`);
}

interface JiraWorkLog {
  comment: string;
  started: string; // ISO formatted datetime
  timeSpentSeconds: number;
}

/**
 * Hack: Luxon uses column (:) separator inside the timezone offset, which is part of the standard, e.g:
 * Jira returns an error when the column is included. So we remove it.
 * @param date
 */
function removeColumnFromTimezoneOffset (date: string): string {
  const index = date.lastIndexOf(':');
  return date.slice(0, index) + date.slice(index + 1);
}
