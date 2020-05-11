const proxyMiddlewareConfig = require('../proxy-config/http-proxy-middleware-config');

module.exports = {
  devServer: {
    proxy: proxyMiddlewareConfig
  }
};
