/**
 * Common configuration for the http-proxy-middleware.
 * It is used both by the Vue CLI server and the Togira own backend.
 */

// If true, all requests will be logged to the console. Only set to true for debugging
const LOG_REQUESTS = false;

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

// log original request and proxied request info in the format // [GET] [200] "/api" -> "http://www.example.com/api"
function logRequest (proxyRes, req) {
  if(!LOG_REQUESTS) { return; }
  console.log(
    `[${req.method}] [${proxyRes.statusCode}] "${req.path}" -> "${proxyRes.req.protocol}//${proxyRes.req.host}${proxyRes.req.path}"`
  );
}

module.exports = { // http-proxy-middleware reference: https://github.com/chimurai/http-proxy-middleware
  // Toggl API
  '^/api/toggl': {
    target: 'https://api.track.toggl.com',
    ws: true,
    changeOrigin: true,
    pathRewrite: {
      '^/api/toggl': '/api/v8'
    },
    onProxyRes: logRequest,
    logLevel: 'error'
  },
  // Jira API
  '^/api/jira': {
      target: 'http://jira',
      router: jiraCustomRouter, // use Jira host specified in request
      onProxyReq: customizeJiraRequest,
      onProxyRes: logRequest,
      ws: true,
      changeOrigin: true,
      pathRewrite: {
      '^/api/jira': '/rest/api/latest'
    },
    logLevel: 'error'
  }
};

