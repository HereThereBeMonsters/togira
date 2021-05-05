const proxyMiddlewareConfig = require('../proxy-config/http-proxy-middleware-config');

module.exports = {
  devServer: {
    proxy: proxyMiddlewareConfig
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          math: 'always' // needed with Less v4+ and UIKit
        }
      }
    }
  }
};
