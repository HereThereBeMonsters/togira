const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const proxyMiddlewareConfig = require('../proxy-config/http-proxy-middleware-config');

const app = express();
const port = 3000;

function jiraCustomRouter (req) {
  // Jira host must be specified as HTTP header in the request
  const jiraHost = req.headers['x-target-jira-host']
  console.debug('Routing to request-specified Jira host: ', jiraHost);
  return jiraHost;
}

function customizeJiraRequest (proxyReq, req, res) {
  // Overwrite User Agent for requests to Jira, because Jira is stricter with browser user agents
  // and POST requests may fail, because of CSRF protection.
  // see: https://confluence.atlassian.com/jirakb/rest-api-calls-with-a-browser-user-agent-header-may-fail-csrf-checks-802591455.html
  proxyReq.setHeader('user-agent', 'Toggl-to-Jira');
}

app.listen(port, () => console.log(`Togira backend listening at http://localhost:${port}`));

// serve the frontend dist directory from the root
app.use('', express.static('../frontend/dist'));

// configure the proxy for the Toggl and Jira APIs
Object.entries(proxyMiddlewareConfig)
  .forEach(([target, config]) => app.use(target, createProxyMiddleware(config)));
