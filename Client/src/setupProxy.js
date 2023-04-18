const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
    app.use(
    createProxyMiddleware("/auth/gitlab", { target: "http://localhost:9000" })
  );
  app.use(
    createProxyMiddleware("/auth/logout", { target: "http://localhost:9000" })
  );
};
