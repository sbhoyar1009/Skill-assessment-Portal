require("dotenv").config();
const axios = require("axios").default;
const Token = process.env.GITLAB_REGISTRATION_TOKEN;
const authToken = process.env.AUTH_TOKEN;
const express = require("express");
const router = express.Router();
const GitlabUser = require("../../models/GitlabUser");
const NewGitlabUser = require("../../models/NewGitlabUser");
const SkillTestUser = require("../../models/SkillTestUser");
const NAB1_user = require("../../models/NAB1_user");
const Prefix = require("../../models/Prefix");

const User = require("../../models/User");

const getSuffixNumber = (username) => {
  let suffix = "";
  for (let i = username.length - 1; i >= 0; i--) {
    if (!isNaN(parseInt(username[i]))) {
      suffix = username[i] + suffix;
    } else {
      return parseInt(suffix);
    }
  }
};

/*
This is for NAB1_user
 1. First check if the token is valid. If not, return 401 Unauthorized.
2. If the token is valid, check if the user is already registered. If yes, return the user details
from database.
3. If the user is not registered, register the user on gitlab and add the user to database. */

router.post("/gitlab/register-nab1/:prefix", async (req, res) => {
  //First check the token
  if (req.headers.authorization !== "Bearer " + authToken) {
    res.status(401).send({ Message: "Unauthorized access" });
  } else {
    const prefix = req.params.prefix.trim();
    const user = req.body;

    const newUser = new NAB1_user({
      name: user.name,
      email: user.email.toLowerCase(),
    });

    const existingUser = await NAB1_user.findOne({
      email: user.email.toLowerCase(),
    });

    // If user is already registered, send details from database
    if (existingUser) {
      res.send(existingUser);
    } else {
      let givenFirstName = user.name.split(" ")[0].toLowerCase();
      let arrlen = user.name.split(" ").length;
      let givenLastName = user.name.split(" ")[arrlen - 1].toLowerCase();

      // Check for other users with same firstname
      const existingName = await NAB1_user.find({
        name: { $regex: givenFirstName, $options: "i" },
      }).sort({ _id: -1 });

      // let firstname = existingName.name.split(" ")[0];

      // Get the max suffix that was used recently in username
      let maxSuffix = 1;
      for (let i = 0; i < existingName.length; i++) {
        if (getSuffixNumber(existingName[i].username) > maxSuffix) {
          maxSuffix = getSuffixNumber(existingName[i].username);
        }
      }

      // If there exists a user with same name, increment suffix or else use "1"
      if (existingName.length > 0) {
        newUser.username =
          prefix + givenFirstName + givenLastName[0] + String(maxSuffix + 1);
      } else {
        newUser.username =
          prefix + givenFirstName + givenLastName[0] + String(maxSuffix);
      }

      let data = newUser;
      // Below is the actual api to register a user on gitlab
      axios({
        method: "post",
        url: "https://ecode-gitlab.kpit.com/api/v4/users",
        withCredentials: true,
        crossdomain: true,
        headers: { Authorization: "Bearer " + Token },
        data: {
          email: data.email.toLowerCase(),
          username: data.username,
          reset_password: "true",
          name: data.name,
        },
      }) //If user is successfully registered, add user to database and return response
        .then((response) => {
          let { id, avatar_url, created_at } = response.data;

          newUser.gitlabID = id;
          newUser.avatar = avatar_url;
          newUser.created_at = created_at;
          newUser.prefix = prefix;

          newUser
            .save()
            .then((response) => {
              res.send(response);
            })
            .catch((err) => {
              // Error while saving user to database
              res.status(409).send({ msg: "Username already exists" });
            });
        }) // Below code executes when a user is registered but not present in database
        .catch(async (err) => {
          axios({
            method: "get",
            url: `https://ecode-gitlab.kpit.com/api/v4/users?search=${data.email}`,
            withCredentials: true,
            crossdomain: true,
            headers: { Authorization: "Bearer " + Token },
          })
            .then((response) => {
              let { id, username, avatar_url, created_at } = response.data[0];
              let user = {
                username,
                created_at,
                avatar: avatar_url,
                gitlabID: id,
                name: data.name,
                email: data.email,
              };

              let newUser = new NAB1_user(user);

              newUser
                .save()
                .then((user) => {
                  res.send(user);
                })
                .catch((err) => {
                  res.send(err);
                });
            })
            .catch((err) => {
              res.send(err);
            });
        });
    }
  }
});

//Delete Accounts of NAB1
router.post("/gitlab/delete-accounts/nab1_", async (req, res) => {
  let users = req.body.users;
  let deleted_Accounts = [];
  if (req.headers.authorization !== "Bearer " + authToken) {
    res.status(401).send({ Message: "Unauthorized access" });
  } else {
    for (let i = 0; i < users.length; i++) {
      try {
        let deletedUser = await axios({
          method: "delete",
          url: `https://ecode-gitlab.kpit.com/api/v4/users/${users[i].gitlabID}`,
          withCredentials: true,
          crossdomain: true,
          headers: { Authorization: "Bearer " + Token },
        });

        if (deletedUser.statusCode === 204) {
          NAB1_user.deleteOne(
            { gitlabID: users[i].gitlabID },
            (err, deleted) => {
              if (err) {
                console.log("error in removing user from database : ", err);
              } else {
                deleted_Accounts.push(users[i]);
              }
            }
          );
          console.log(users[i]);
        } else {
          NAB1_user.deleteOne(
            { gitlabID: users[i].gitlabID },
            (err, deleted) => {
              if (err) {
                console.log("error in removing user from database : ", err);
              } else {
                deleted_Accounts.push(users[i]);
              }
            }
          );
          console.log(users[i]);
        }
      } catch {
        let temp_user = await NAB1_user.findOne({
          gitlabID: users[i].gitlabID,
        });
        if (temp_user) {
          NAB1_user.deleteOne(
            { gitlabID: users[i].gitlabID },
            (err, deleted) => {
              if (err) {
                console.log("error in removing user from database : ", err);
              } else {
                deleted_Accounts.push(users[i]);
              }
            }
          );
          console.log(users[i]);
        }
      }
    }
  }

  res.send(deleted_Accounts);
});

module.exports = router;
