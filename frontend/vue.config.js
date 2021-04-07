const proxyMiddlewareConfig = require('../proxy-config/http-proxy-middleware-config');

module.exports = {
  devServer: {
    proxy: proxyMiddlewareConfig
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          math: 'always' // needed with less >4 and UIKit
        }
      }
    }
  }
};
