const passport = require("passport");
const GitLabStrategy = require("passport-gitlab2").Strategy;
const mongoose = require("mongoose");
const User = mongoose.model("User");
const GITLAB_ID = process.env.GITLAB_ID;
const GITLAB_SECRET = process.env.GITLAB_SECRET;

passport.use(
  new GitLabStrategy(
    {
      clientID: GITLAB_ID,
      clientSecret: GITLAB_SECRET,
      callbackURL: "http://localhost:3000/auth/gitlab/callback",
      baseURL: "https://gitlab.com/",
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      const { id, displayName, username, emails, avatarUrl } = profile;
      const user = {
        gitlabID: id,
        name: displayName,
        username,
        email: emails[0].value,
        avatar: avatarUrl,
      };
      const filter = { username: username };
      const update = {
        name: displayName,
        email: emails[0].value,
        gitlabID: id,
        avatar: avatarUrl,
      };

      const newUser = await User.findOneAndUpdate(filter, update);

      if (newUser) {
        done(null, newUser);
      } else {
        const registerUser = user;
        registerUser.Tests = [];
        registerUser.isAdmin = false;

        const response = new User(registerUser);
        await response.save();
        done(null, response);
      }
    }
  )
);

// SERIALIZE
passport.serializeUser((user, done) => {
  done(null, user);
});

// DESERIALIZE
passport.deserializeUser(async (user, done) => {
  const { isKPITUser, username } = user;
  await User.findOne({ username: username }, function (err, user) {
    if (err) {
      console.log(err);
      user = null;
    }
    // if (!isKPITUser) {
    //   // user = null;
    //   user = {};
    // }
    return done(err, user);
  });
});
