let middleware = {};

middleware.checkApi = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    req.logout();
    res.send(null);
  }
};

module.exports = middleware;
