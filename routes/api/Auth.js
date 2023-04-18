const passport = require("passport");
const mongoose = require("mongoose");

module.exports = (app) => {
  // GitLab O-Auth Athentication
  app.get("/auth/gitlab", passport.authenticate("gitlab"));

  app.get(
    "/auth/gitlab/callback",
    passport.authenticate("gitlab", {
      failureRedirect: "/", //When denied users login they get redirected to HomePage
    }),
    async (req, res) => {
      res.redirect("/");
    }
  );

  app.get("/api/current_user", (req, res) => {
    res.send(req.user);
  });

  //Logout route to redirect to HomePage
  app.get("/auth/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });
};
