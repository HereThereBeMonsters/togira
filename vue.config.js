module.exports = {
  devServer: {
    proxy: {
      '^/api/toggl': {
        target: 'https://www.toggl.com',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api/toggl': '/api/v8'
        },
        logLevel: 'debug'
      }
    }
  }
};
