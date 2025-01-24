const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/public/api',
    createProxyMiddleware({
      target: 'https://public-api.foreflight.com',
      changeOrigin: true,
      pathRewrite: {
        '^/public/api': '/public/api'
      },
      onProxyReq: function(proxyReq) {
        proxyReq.setHeader('x-api-key', 's2NNDar9HUSM5MaOqHllc98OxRbK5mx5tRw1H7LD/ws=');
      }
    })
  );
};
