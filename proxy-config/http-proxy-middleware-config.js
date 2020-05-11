/**
 * Common configuration for the http-proxy-middleware.
 * It is used both by the Vue CLI server and the Togira own backend.
 */

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
  proxyReq.setHeader('user-agent', 'TogiraApp');
}

module.exports = { // http-proxy-middleware reference: https://github.com/chimurai/http-proxy-middleware
  // Toggl
  '^/api/toggl': {
    target: 'https://www.toggl.com',
      ws: true,
      changeOrigin: true,
      pathRewrite: {
      '^/api/toggl': '/api/v8'
    },
    logLevel: 'error'
  },
  // Jira
  '^/api/jira': {
    target: 'http://jira',
      router: jiraCustomRouter, // use Jira host specified in request
      onProxyReq: customizeJiraRequest,
      ws: true,
      changeOrigin: true,
      pathRewrite: {
      '^/api/jira': '/rest/api/latest'
    },
    logLevel: 'error'
  }
};
