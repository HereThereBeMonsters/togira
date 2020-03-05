# Togira

## What it is

Togira is a web-based tool that allows to interactively import Toggl time entries into Jira as Jira issue work logs.

It is meant for people who have to log their time in Jira, but prefer to use Toggl in their day to dat work, because of the better usability.

This project is an opportunity for me to learn new technologies (in this case Vue.js and VueX) while solving an actual problem I had. 

## Features

Quick summary of what Togira has to offer:

- Web based, run the server locally and access via your browser
- Configure your Toggl account
- Configure a Jira server and account
- Load time entries from Toggl
- Detect Jira issue IDs in the description of the entries
- Select entries to import
- Add the entries in Jira as work logs on their respective issue
- View a log of the import operation (especially see which imports might have failed)
- Entries with on the same day and with the same description are grouped as merged as a singe work log in Jira
- Optionally, mark entries in Toggl as already imported. These entries will then be recognized by Togira as imported and will not be imported twice.



## Roadmap / ideas

The program works quite well as it is, I have some ideas to improve it, that I will perhaps try to implement depending on available free time (no guarantees!):
- Generate a Docker image, so it's easier to run
- Add a filter to specify the period for which to show the Toggl entries (e.g. today, yesterday, last week, etc.)
- Handle paging / lazy-loading of entries
- Investigate the conversion to an Electron app

## How to use
### Requirements

The app is based on Vue.js and Vue CLI. For now, it relies on the vue CLI dev server. So you will need a recent version of Node.js installed, and little bit of command line magic to make it work.

Evergreen browsers should all work fine, but I develop and test only in Chrome (and derivatives) and sometimes in Firefox. 

### Project setup
Clone this repository.

Open a command line, cd into the repository, and execute:

```
npm install
```

### Start server

Run the follwing command:
```
npm run serve
```

You can now access the app on http://localhost:8080/
