Toggl API docs: https://github.com/toggl/toggl_api_docs

Max number of entries for GET request is 1000, should be more than enough for 1 week worth of entries!

Configuration needed:
- Toggl API token
- [Advanced] Filter by client / project (only consider one client / one or more projects)
- [Advanced] Tag to use to mark logged entries

How to keep track of already logged entries?
- Use billable flag to mark issues that have been logged?
- Add tag in description like '[JIRA-logged]'?
- Keep list of logged entries ID's in local storage?
- Use tag!

How to detect Jira issue for entry?

Should be at start of entry description, enclosed in square brakets: "[CADENZA-12345] Do something"

JIRA

Config
- URL of JIRA instance (cloud vs server?)
- API token

API Doc:
https://docs.atlassian.com/software/jira/docs/api/REST/8.4.3/#api/2/issue-addWorklog

Use case / Design:

First use:
- Show configuration page
- Configuration is saved to local storage
- Go to home page

Import:
- Go to import page
- Specify date range
- Submit
- Get all entries for the given timespan from Toggl
- Display in a list / table
    - Entry start and end time, duration, Jira issue (as link), description, status (already imported or not)
- Detect JIRA issue (show warning if not set...)
- Detect if already logged (show status in list)
- Allow to select/unselect those that will be logged in JIRA
- Start importation
- For each entry:
    - Check that JIRA issue exists
    - Add time log entry to issue in JIRA
    - Add logged label to entry in Toggl
- Show result (X entries logged to JIRA, ...)    
- Refresh list

Pages: 
- Home (with link to config and to start import)
- Config
- Start Import: form, set parameters and submit
- Entries list: show all entries
- Import result/summary


