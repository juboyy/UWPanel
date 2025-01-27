const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://public-api.foreflight.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/public/api'
      },
      onProxyReq: (proxyReq) => {
        proxyReq.setHeader('ff-api-key', 's2NNDar9HUSM5MaOqHllc98OxRbK5mx5tRw1H7LD/ws=');
      },
      onProxyRes: (proxyRes) => {
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
        proxyRes.headers['Access-Control-Allow-Headers'] = 'ff-api-key, Content-Type';
      }
    })
  );
};
